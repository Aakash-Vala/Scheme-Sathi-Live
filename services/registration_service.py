"""
Scheme Registration Service for Scheme Sathi (SIH PS 26092).
Manages statutory loan applications, pre-submission confirmation validations,
persistent application registry, and Channel Partner allocation under MoSJE & NSFDC norms.
"""

import json
import os
import random
import time
from datetime import datetime
from typing import Dict, Any, List, Optional


class SchemeRegistrationService:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.schemes_path = os.path.join(self.base_dir, "data", "government_schemes.json")
        self.partners_path = os.path.join(self.base_dir, "data", "channel_partners.json")
        self.registry_path = os.path.join(self.base_dir, "data", "registered_applications.json")
        
        # Connect to MongoDB if available
        from services.db import db_service
        self.db_service = db_service

        try:
            if self.db_service.check_connection() and self.db_service.schemes is not None:
                self.schemes = list(self.db_service.schemes.find({}, {"_id": 0}))
            else:
                self.schemes = []
        except Exception:
            self.schemes = []

        if not self.schemes:
            with open(self.schemes_path, "r", encoding="utf-8") as f:
                self.schemes = json.load(f)

        self.scheme_by_id = {}
        for s in self.schemes:
            s_id = s.get("id")
            if s_id:
                self.scheme_by_id[s_id] = s
                short_id = s_id.replace("nsfdc_", "").replace("_sc", "")
                self.scheme_by_id[short_id] = s
            s_code = s.get("code")
            if s_code:
                self.scheme_by_id[s_code] = s
                self.scheme_by_id[s_code.lower()] = s
                self.scheme_by_id[s_code.lower().replace("-", "_")] = s

        try:
            if self.db_service.check_connection() and self.db_service.partners is not None:
                self.partners = list(self.db_service.partners.find({}, {"_id": 0}))
            else:
                self.partners = []
        except Exception:
            self.partners = []

        if not self.partners:
            with open(self.partners_path, "r", encoding="utf-8") as f:
                self.partners = json.load(f)

        # Initialize registry file if not present
        if not os.path.exists(self.registry_path):
            with open(self.registry_path, "w", encoding="utf-8") as f:
                json.dump([], f, indent=2)

    def _load_registry(self) -> List[Dict[str, Any]]:
        if self.db_service.check_connection() and self.db_service.applications is not None:
            try:
                apps = list(self.db_service.applications.find({}, {"_id": 0}))
                if apps:
                    return apps
            except Exception:
                pass
        if not os.path.exists(self.registry_path):
            return []
        try:
            with open(self.registry_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _save_registry(self, registry: List[Dict[str, Any]]):
        if self.db_service.check_connection() and self.db_service.applications is not None:
            try:
                for a in registry:
                    ref_id = a.get("registration_id")
                    if ref_id:
                        self.db_service.applications.update_one({"registration_id": ref_id}, {"$set": a}, upsert=True)
            except Exception:
                pass
        with open(self.registry_path, "w", encoding="utf-8") as f:
            json.dump(registry, f, indent=2, ensure_ascii=False)

    def register_applicant(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates statutory criteria, verifies user pre-submission confirmation,
        allocates an authorized Channel Partner, and commits registration to persistent storage.
        """
        # 1. Gate: Pre-submission confirmation check
        if not data.get("confirmed_by_user", False):
            raise ValueError("Registration aborted: Applicant must review and confirm all details before submission.")

        scheme_id = data.get("scheme_id")
        scheme = self.scheme_by_id.get(scheme_id)
        if not scheme:
            raise ValueError(f"Statutory scheme with ID '{scheme_id}' was not found.")

        # 2. Statutory Affirmative Action & Eligibility Validation
        caste = data.get("caste_category", "SC")
        income = float(data.get("annual_income", 0))
        gender = data.get("gender", "Female")

        # Caste check: NSFDC concessional loans are earmarked for SC & Safai Karamchari families
        if caste not in ["SC", "Safai Karamchari / Dependent", "Scheduled Caste (SC)"]:
            if scheme_id not in ["standup", "vcf_sc"]: # Standup allows ST/Women, VCF-SC requires SC promoter
                raise ValueError(f"Scheme '{scheme['name']}' requires Scheduled Caste (SC) or Safai Karamchari certification.")

        # Gender check: e.g. Mahila Samriddhi Yojana (MSY) is strictly for women
        if scheme.get("gender_preference") == "female_only" and gender not in ["Female", "female"]:
            raise ValueError(f"Scheme '{scheme['name']}' is statutory earmarked exclusively for female entrepreneurs.")

        # Income check
        income_limit = scheme.get("income_limit_annual")
        if income_limit and income > income_limit:
            raise ValueError(f"Annual income of ₹{income:,.0f} exceeds statutory ceiling of ₹{income_limit:,.0f} for '{scheme['name']}'.")

        # 3. Financial parameters calculation
        project_cost = float(data.get("project_cost", scheme["max_project_cost"]))
        financing_pct = scheme.get("financing_percentage", 90.0) / 100.0
        max_loan = scheme.get("max_loan_amount", project_cost)
        
        loan_amount = min(project_cost * financing_pct, max_loan)
        requested_loan = float(data.get("requested_loan") or loan_amount)
        final_loan = min(requested_loan, max_loan)
        margin_money = max(0.0, project_cost - final_loan)

        # 4. Channel Partner allocation
        assigned_partner = None
        req_partner_id = data.get("assigned_partner_id")
        if req_partner_id:
            assigned_partner = next((p for p in self.partners if p["id"] == req_partner_id), None)

        if not assigned_partner:
            # Match by state or lowest NPA partner in scheme category
            applicant_state = data.get("state", "Delhi").lower()
            state_partners = [p for p in self.partners if applicant_state in p.get("state", "").lower()]
            candidate_pool = state_partners if state_partners else self.partners
            # Filter low NPA (< 5.0%) and active quota
            viable_pool = [p for p in candidate_pool if p.get("npa_ratio_pct", 10.0) < 5.0 and p.get("allocated_funds_cr", 0) > p.get("disbursed_funds_cr", 0)]
            assigned_partner = viable_pool[0] if viable_pool else candidate_pool[0]

        # 5. Generate Official Registration Reference ID
        reg_number = random.randint(100000, 999999)
        ref_id = f"MoSJE-NSFDC-2026-{reg_number}"
        submission_timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # 6. Document Checklist
        docs = scheme.get("required_documents", [
            "SC Caste Certificate", "Family Income Certificate", "Aadhaar Card",
            "Bank Passbook", "Project Quotation"
        ])
        checklist = []
        for d in docs:
            authority = "Revenue Dept / SDM / Tehsildar" if "Certificate" in d else ("UIDAI / Bank" if "Aadhaar" in d or "Passbook" in d else "Merchant / CA")
            checklist.append({
                "document_name": d,
                "issuing_authority": authority,
                "status": "Required for Physical Verification"
            })

        # 7. Record structure
        registration_record = {
            "registration_id": ref_id,
            "applicant_user_id": data.get("applicant_user_id"),
            "submission_timestamp": submission_timestamp,
            "status": "PROVISIONALLY_APPROVED_ROUTED_TO_CHANNEL_PARTNER",
            "status_label_en": "Provisionally Approved • Routed to Channel Partner",
            "status_label_hi": "अनंतिम स्वीकृत • चैनल पार्टनर को प्रेषित",
            "applicant": {
                "name": data.get("applicant_name", "").strip(),
                "phone": data.get("phone_number", "").strip(),
                "email": data.get("email", ""),
                "aadhaar_last_four": str(data.get("aadhaar_last_four", "XXXX"))[-4:],
                "caste_category": caste,
                "caste_cert_number": data.get("caste_cert_number", f"REV/SC/{random.randint(10000,99999)}"),
                "annual_income": income,
                "income_cert_authority": data.get("income_cert_authority", "Tehsildar / SDM"),
                "gender": gender,
                "state": data.get("state", "Delhi"),
                "district": data.get("district", "New Delhi")
            },
            "scheme": {
                "id": scheme["id"],
                "name": scheme["name"],
                "name_hi": scheme.get("name_hi", scheme["name"]),
                "category": scheme["category"],
                "ministry": scheme["ministry"],
                "implementing_agency": scheme["implementing_agency"]
            },
            "financial_summary": {
                "project_cost": project_cost,
                "concessional_loan_amount": final_loan,
                "promoter_margin_money": margin_money,
                "interest_rate_beneficiary_pct": scheme["interest_rate_beneficiary_pct"],
                "commercial_bank_rate_pct": scheme.get("commercial_bank_rate_pct", 12.0),
                "annual_interest_savings_pct": round(scheme.get("commercial_bank_rate_pct", 12.0) - scheme["interest_rate_beneficiary_pct"], 2),
                "tenure_years": scheme["max_tenure_years"],
                "moratorium_months": scheme["moratorium_months"],
                "repayment_frequency": scheme.get("repayment_frequency", "Quarterly")
            },
            "allocated_channel_partner": {
                "id": assigned_partner["id"],
                "name": assigned_partner["name"],
                "partner_type": assigned_partner.get("type", "SCA"),
                "branch_name": assigned_partner.get("city", assigned_partner.get("state", "District Branch")),
                "address": assigned_partner.get("address", ""),
                "phone": assigned_partner.get("phone", ""),
                "email": assigned_partner.get("email", ""),
                "npa_ratio_pct": assigned_partner.get("npa_ratio_pct", 2.5)
            },
            "document_checklist": checklist,
            "next_steps_en": f"Visit {assigned_partner['name']} within 15 working days with your Reference Slip and original documents for physical KYC verification.",
            "next_steps_hi": f"15 कार्य दिवसों के भीतर अपनी संदर्भ पर्ची और मूल दस्तावेजों के साथ भौतिक सत्यापन हेतु {assigned_partner['name']} में संपर्क करें।"
        }

        # 8. Commit to persistent registry
        registry = self._load_registry()
        registry.insert(0, registration_record)
        self._save_registry(registry)

        return {
            "status": "success",
            "message": "Scheme registration successfully confirmed and dispatched.",
            "registration": registration_record
        }

    def get_registration_by_id(self, reg_id: str) -> Optional[Dict[str, Any]]:
        registry = self._load_registry()
        for r in registry:
            if r.get("registration_id") == reg_id:
                return r
        return None

    def list_all_registrations(self) -> List[Dict[str, Any]]:
        return self._load_registry()


# Singleton
_registration_service = None

def get_registration_service() -> SchemeRegistrationService:
    global _registration_service
    if _registration_service is None:
        _registration_service = SchemeRegistrationService()
    return _registration_service
