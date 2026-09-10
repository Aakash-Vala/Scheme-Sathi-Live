"""
Hybrid AI Scheme Recommendation Engine.
Combines:
1. Deterministic Statutory Rule Filtering (MoSJE / NSFDC guidelines)
2. Semantic NLP Intent Matching (TF-IDF + Cosine Similarity on Project Description)
3. Multi-Attribute Utility Scoring
4. Supervised ML Approval Probability Integration
5. Explainable AI (XAI) Output Generation
"""

import json
import os
import re
from typing import List, Dict, Any
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ml_engine.approval_model import ApprovalPredictor
from ml_engine.explainer import generate_explanation

SCHEMES_FILE = "data/government_schemes.json"

class SchemeRecommender:
    def __init__(self, schemes_path: str = SCHEMES_FILE):
        self.schemes_path = schemes_path
        self.schemes = self._load_schemes()
        self.approval_predictor = ApprovalPredictor.get_instance()
        self._init_nlp_engine()
        
    def _load_schemes(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.schemes_path):
            raise FileNotFoundError(f"Schemes dataset not found at {self.schemes_path}")
        with open(self.schemes_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _init_nlp_engine(self):
        """Builds NLP search vectors across all official government schemes."""
        self.scheme_corpus = []
        for s in self.schemes:
            # Combine all descriptive text, keywords, and activities
            activities = " ".join(s.get("eligible_activities", []))
            text = f"{s.get('name', '')} {s.get('category', '')} {s.get('description_en', '')} {activities} {s.get('target_beneficiary', '')}"
            self.scheme_corpus.append(text)
            
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            stop_words="english",
            max_features=1500,
            token_pattern=r"(?u)\b\w+\b"
        )
        self.scheme_tfidf = self.vectorizer.fit_transform(self.scheme_corpus)

    def _check_deterministic_eligibility(self, scheme: Dict[str, Any], applicant: Dict[str, Any]) -> (bool, List[str]):
        """
        Applies hard statutory constraints from MoSJE / NSFDC.
        Returns (is_eligible, disqualification_reasons).
        """
        reasons = []
        caste = applicant.get("caste_category", "SC")
        annual_income = float(applicant.get("annual_income", 150000))
        gender = applicant.get("gender", "Female")
        project_cost = float(applicant.get("project_cost", 100000))
        
        # 1. Caste Criteria
        target_beneficiary = scheme.get("target_beneficiary", "").lower()
        if "safai karamchari" in target_beneficiary:
            if caste not in ["Safai Karamchari / Dependent", "SC"]:
                reasons.append("Requires applicant to be a Safai Karamchari, manual scavenger, or dependent.")
        elif scheme["id"] != "standup_india_sc":
            # NSFDC requires SC category
            if caste not in ["SC", "Safai Karamchari / Dependent"]:
                reasons.append("NSFDC concessional lending requires applicant to belong to the Scheduled Caste (SC) community.")
        else:
            # Stand-up India accepts SC, ST, or Women
            if caste not in ["SC", "ST"] and gender != "Female":
                reasons.append("Stand-Up India requires applicant to be SC, ST, or Female entrepreneur.")

        # 2. Income Limit Criteria
        income_cap = scheme.get("income_limit_annual")
        if income_cap is not None:
            if annual_income > income_cap:
                reasons.append(f"Annual family income (₹{annual_income:,.0f}) exceeds the scheme's statutory ceiling of ₹{income_cap:,.0f}.")

        # 3. Gender Requirement
        gender_pref = scheme.get("gender_preference", "all")
        if gender_pref == "female_only" and gender != "Female":
            reasons.append("This scheme is exclusively reserved for women entrepreneurs (Mahila Samriddhi).")

        # 4. Project Cost Cap
        max_cost = scheme.get("max_project_cost")
        min_cost = scheme.get("min_project_cost", 0)
        
        # Allow slight leniency (15% margin) for ranking near matches
        if project_cost > max_cost * 1.25:
            reasons.append(f"Estimated project cost (₹{project_cost:,.0f}) exceeds the scheme's maximum funding ceiling of ₹{max_cost:,.0f}.")
            
        is_eligible = len(reasons) == 0
        return is_eligible, reasons

    def _compute_semantic_fit(self, query_text: str) -> np.ndarray:
        """Computes cosine similarity between applicant's free-text project description and schemes."""
        if not query_text or len(query_text.strip()) == 0:
            return np.ones(len(self.schemes)) * 0.5
            
        cleaned_query = re.sub(r"[^\w\s]", " ", query_text.lower())
        query_vec = self.vectorizer.transform([cleaned_query])
        sims = cosine_similarity(query_vec, self.scheme_tfidf)[0]
        
        # Boost specific keywords matching domain keywords
        boosts = {
            "nsfdc_gbs": ["rickshaw", "e-rickshaw", "electric", "solar", "battery", "ev", "eco", "waste", "recycling", "green"],
            "nsfdc_els": ["btech", "engineering", "medical", "mbbs", "college", "degree", "mba", "university", "study", "education", "course"],
            "nsfdc_suy": ["sanitation", "sewer", "drain", "cleaning", "septic", "tank", "garbage", "waste", "toilet"],
            "nsfdc_msy": ["boutique", "parlor", "beauty", "tailor", "stitching", "embroidery", "cosmetics", "women", "pickle", "spices"],
            "nsfdc_mcf": ["tea", "kirana", "shop", "stall", "goat", "dairy", "poultry", "vegetable", "fruit", "vendor", "barber"],
            "nsfdc_lvy": ["bakery", "hardware", "xerox", "workshop", "stationery", "fabrication", "cottage", "garment"],
            "standup_india_sc": ["factory", "manufacturing", "greenfield", "plant", "hotel", "trading", "hospital"],
            "vcf_sc": ["tech", "startup", "software", "ai", "platform", "fintech", "biotech", "robotics"]
        }
        
        query_words = set(cleaned_query.split())
        for idx, scheme in enumerate(self.schemes):
            s_id = scheme["id"]
            if s_id in boosts:
                overlap = query_words.intersection(set(boosts[s_id]))
                if overlap:
                    sims[idx] += 0.25 * len(overlap)
                    
        # Normalize to [0, 1]
        sims = np.clip(sims, 0.05, 1.0)
        return sims

    def recommend(self, applicant: Dict[str, Any]) -> Dict[str, Any]:
        """
        Primary AI Recommendation API.
        Takes applicant profile and returns:
        - Eligible recommended schemes (ranked with scores and explanations)
        - Near matches / Alternative schemes with corrective guidance
        - Overall profile assessment
        """
        project_cost = float(applicant.get("project_cost", 100000))
        project_description = applicant.get("project_description", "")
        project_category = applicant.get("project_category", "")
        gender = applicant.get("gender", "Female")
        caste = applicant.get("caste_category", "SC")
        
        # Combine text for NLP semantic intent matching
        search_prompt = f"{project_description} {project_category}"
        semantic_scores = self._compute_semantic_fit(search_prompt)
        
        eligible_schemes = []
        near_match_schemes = []
        
        for idx, scheme in enumerate(self.schemes):
            is_eligible, disqualification_reasons = self._check_deterministic_eligibility(scheme, applicant)
            sem_score = float(semantic_scores[idx])
            
            # Financial Sweet Spot Score
            min_c = scheme.get("min_project_cost", 0)
            max_c = scheme.get("max_project_cost", 1000000)
            if min_c <= project_cost <= max_c:
                financial_score = 1.0
            elif project_cost < min_c:
                financial_score = max(0.2, 1.0 - (min_c - project_cost) / min_c)
            else:
                financial_score = max(0.1, 1.0 - (project_cost - max_c) / max_c)
                
            # Interest Rate Concessional Score (lower is better, 4% is perfect)
            rate = scheme.get("interest_rate_beneficiary_pct", 8.0)
            rate_score = max(0.0, (12.0 - rate) / 8.0)
            
            # Demographic Preference Score
            demo_score = 0.5
            if scheme.get("gender_preference") == "female_only" and gender == "Female":
                demo_score = 1.0
            elif scheme.get("id") == "nsfdc_gbs" and "rickshaw" in search_prompt.lower():
                demo_score = 1.0
            elif scheme.get("category") == "education" and applicant.get("education_level") in ["Graduate", "Higher Secondary (12th)"]:
                demo_score = 0.9
                
            # Composite Multi-Attribute Utility Match Score (0 - 100)
            raw_match = (
                0.40 * sem_score +
                0.30 * financial_score +
                0.15 * rate_score +
                0.15 * demo_score
            ) * 100.0
            
            match_score = round(float(np.clip(raw_match, 20.0, 99.0)), 1)
            
            # Predict ML Approval Probability using Supervised Classifier
            applicant_for_ml = applicant.copy()
            applicant_for_ml["scheme_category"] = scheme.get("category", "micro_finance")
            applicant_for_ml["interest_rate_pct"] = scheme.get("interest_rate_beneficiary_pct", 6.5)
            applicant_for_ml["tenure_months"] = int(scheme.get("max_tenure_years", 3) * 12)
            
            # Limit requested loan to scheme maximum financing
            max_scheme_loan = scheme.get("max_loan_amount", project_cost * 0.90)
            fin_pct = scheme.get("financing_percentage", 90.0) / 100.0
            eligible_loan = min(project_cost * fin_pct, max_scheme_loan)
            applicant_for_ml["requested_loan"] = eligible_loan
            
            approval_result = self.approval_predictor.predict(applicant_for_ml)
            
            # Generate XAI Plain-Language Justification
            explanation = generate_explanation(scheme, applicant_for_ml, match_score, approval_result)
            
            scheme_result = {
                **scheme,
                "calculated_eligible_loan": round(eligible_loan, 0),
                "calculated_promoter_margin": round(project_cost - eligible_loan, 0),
                "match_score_pct": match_score,
                "semantic_similarity_pct": round(sem_score * 100, 1),
                "approval_probability_pct": approval_result["approval_probability_pct"],
                "risk_tier": approval_result["risk_tier"],
                "risk_badge": approval_result["risk_badge"],
                "projected_monthly_emi": approval_result["projected_monthly_emi"],
                "positive_factors": approval_result["positive_factors"],
                "improvements": approval_result["improvements"],
                "explanation": explanation
            }
            
            if is_eligible:
                eligible_schemes.append(scheme_result)
            else:
                scheme_result["disqualification_reasons"] = disqualification_reasons
                near_match_schemes.append(scheme_result)
                
        # Rank eligible schemes by match_score descending, with approval probability as tie-breaker
        eligible_schemes.sort(
            key=lambda x: (x["match_score_pct"] * 0.6 + x["approval_probability_pct"] * 0.4),
            reverse=True
        )
        
        # Rank near matches
        near_match_schemes.sort(key=lambda x: x["match_score_pct"], reverse=True)
        
        # Summary assessment
        top_scheme = eligible_schemes[0] if eligible_schemes else None
        
        return {
            "status": "success",
            "total_schemes_evaluated": len(self.schemes),
            "eligible_count": len(eligible_schemes),
            "recommended_schemes": eligible_schemes,
            "alternative_or_near_matches": near_match_schemes[:3],
            "top_recommendation": top_scheme["name"] if top_scheme else "No direct match",
            "applicant_summary": {
                "caste_category": caste,
                "annual_income": applicant.get("annual_income"),
                "gender": gender,
                "project_cost": project_cost,
                "project_description": project_description
            }
        }

# Global singleton helper
_recommender_instance = None

def get_recommender() -> SchemeRecommender:
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = SchemeRecommender()
    return _recommender_instance
