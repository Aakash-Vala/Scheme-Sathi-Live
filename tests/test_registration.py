"""
Unit and integration tests for Scheme Sathi Statutory Scheme Registration.
Verifies pre-submission confirmation gate, affirmative action eligibility checks,
income ceiling enforcement, channel partner allocation, and registration tracking.
"""

import unittest
from fastapi.testclient import TestClient
from app import app
from services.registration_service import get_registration_service


class TestSchemeRegistration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.service = get_registration_service()

    def test_rejection_without_user_confirmation(self):
        """Must reject registration if confirmed_by_user is False (mandatory confirmation gate)."""
        payload = {
            "scheme_id": "nsfdc_msy",
            "applicant_name": "Pooja Rani",
            "phone_number": "9876543210",
            "email": "pooja@example.com",
            "aadhaar_last_four": "8842",
            "caste_category": "SC",
            "caste_cert_number": "DL/SC/12345",
            "annual_income": 150000,
            "gender": "Female",
            "state": "Delhi",
            "district": "Central Delhi",
            "project_cost": 120000,
            "confirmed_by_user": False  # Gate: Not confirmed
        }
        res = self.client.post("/api/register-scheme", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("confirm", res.json()["detail"].lower())

    def test_successful_registration_with_confirmation(self):
        """Successfully registers applicant when confirmed_by_user is True."""
        payload = {
            "scheme_id": "nsfdc_msy",
            "applicant_name": "Pooja Rani",
            "phone_number": "9876543210",
            "email": "pooja@example.com",
            "aadhaar_last_four": "8842",
            "caste_category": "SC",
            "caste_cert_number": "DL/SC/12345",
            "annual_income": 150000,
            "gender": "Female",
            "state": "Delhi",
            "district": "Central Delhi",
            "project_cost": 120000,
            "confirmed_by_user": True  # Confirmed!
        }
        res = self.client.post("/api/register-scheme", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")

        reg = data["registration"]
        self.assertTrue(reg["registration_id"].startswith("MoSJE-NSFDC-2026-"))
        self.assertEqual(reg["applicant"]["name"], "Pooja Rani")
        self.assertEqual(reg["scheme"]["id"], "nsfdc_msy")
        self.assertEqual(reg["financial_summary"]["interest_rate_beneficiary_pct"], 4.0)
        self.assertIsNotNone(reg["allocated_channel_partner"])
        self.assertIn("name", reg["allocated_channel_partner"])
        self.assertTrue(len(reg["document_checklist"]) > 0)

        # Verify tracking by reference ID
        ref_id = reg["registration_id"]
        track_res = self.client.get(f"/api/registrations/{ref_id}")
        self.assertEqual(track_res.status_code, 200)
        track_data = track_res.json()
        self.assertEqual(track_data["status"], "success")
        self.assertEqual(track_data["registration"]["registration_id"], ref_id)

    def test_rejection_income_exceeds_statutory_limit(self):
        """Rejects registration when annual income exceeds statutory ceiling (e.g. > 3,00,000 for MSY)."""
        payload = {
            "scheme_id": "nsfdc_msy",
            "applicant_name": "Sunita Devi",
            "phone_number": "9876543211",
            "email": "sunita@example.com",
            "aadhaar_last_four": "1122",
            "caste_category": "SC",
            "caste_cert_number": "DL/SC/54321",
            "annual_income": 450000,  # Exceeds 3,00,000 limit
            "gender": "Female",
            "state": "Delhi",
            "district": "North Delhi",
            "project_cost": 100000,
            "confirmed_by_user": True
        }
        res = self.client.post("/api/register-scheme", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("exceeds statutory ceiling", res.json()["detail"].lower())

    def test_rejection_gender_ineligible(self):
        """Rejects male applicant for female-only scheme like Mahila Samriddhi Yojana."""
        payload = {
            "scheme_id": "nsfdc_msy",
            "applicant_name": "Ramesh Kumar",
            "phone_number": "9876543212",
            "email": "ramesh@example.com",
            "aadhaar_last_four": "3344",
            "caste_category": "SC",
            "caste_cert_number": "DL/SC/99887",
            "annual_income": 120000,
            "gender": "Male",  # Ineligible for female-only scheme
            "state": "Delhi",
            "district": "South Delhi",
            "project_cost": 100000,
            "confirmed_by_user": True
        }
        res = self.client.post("/api/register-scheme", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("female", res.json()["detail"].lower())

    def test_rejection_caste_ineligible(self):
        """Rejects non-SC / non-safai applicant for NSFDC scheme."""
        payload = {
            "scheme_id": "nsfdc_term_loan",
            "applicant_name": "Anil Sharma",
            "phone_number": "9876543213",
            "email": "anil@example.com",
            "aadhaar_last_four": "5566",
            "caste_category": "General",  # Ineligible
            "caste_cert_number": "N/A",
            "annual_income": 200000,
            "gender": "Male",
            "state": "Delhi",
            "district": "East Delhi",
            "project_cost": 500000,
            "confirmed_by_user": True
        }
        res = self.client.post("/api/register-scheme", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("requires scheduled caste", res.json()["detail"].lower())

    def test_not_found_registration_tracking(self):
        """Returns 404 for invalid registration reference ID."""
        res = self.client.get("/api/registrations/INVALID-ID-99999")
        self.assertEqual(res.status_code, 404)

    def test_list_all_registrations(self):
        """Returns list of all registrations."""
        res = self.client.get("/api/registrations")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIsInstance(data["registrations"], list)


if __name__ == "__main__":
    unittest.main()
