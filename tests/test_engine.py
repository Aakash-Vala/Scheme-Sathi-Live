"""
Comprehensive Unit & Integration Test Suite for Scheme Sathi AI Platform.
Verifies AI Recommender, ML Approval Predictor, Financial Calculator, and Partner Locator.
"""

import unittest
from fastapi.testclient import TestClient

from app import app
from ml_engine.recommender import get_recommender
from ml_engine.approval_model import ApprovalPredictor
from services.calculator_service import FinancialCalculatorService
from services.locator_service import get_locator

class TestSchemeSathiPlatform(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.recommender = get_recommender()
        cls.approval_predictor = ApprovalPredictor.get_instance()
        cls.locator = get_locator()

    def test_01_schemes_dataset_integrity(self):
        """Test that authentic government schemes are loaded with all required fields."""
        schemes = self.recommender.schemes
        self.assertGreaterEqual(len(schemes), 8)
        
        required_keys = [
            "id", "name", "category", "ministry", "interest_rate_beneficiary_pct",
            "max_project_cost", "max_loan_amount", "moratorium_months", "eligible_activities"
        ]
        for s in schemes:
            for k in required_keys:
                self.assertIn(k, s, f"Scheme {s.get('id')} missing key {k}")
            self.assertGreater(s["interest_rate_beneficiary_pct"], 0.0)
            self.assertGreater(s["max_project_cost"], 0.0)

    def test_02_deterministic_eligibility(self):
        """Test that disqualification triggers correctly for out-of-bounds criteria."""
        # Non-SC applicant trying to get NSFDC micro-credit
        applicant_general = {
            "caste_category": "General",
            "annual_income": 150000,
            "gender": "Male",
            "project_cost": 100000,
            "project_description": "tea stall"
        }
        res = self.recommender.recommend(applicant_general)
        for s in res["recommended_schemes"]:
            # Only Stand-Up India or general allowed
            self.assertNotEqual(s["id"], "nsfdc_mcf", "General caste should not be eligible for NSFDC MCF")

    def test_03_nlp_semantic_intent_matching(self):
        """Test NLP matches domain descriptions to corresponding schemes."""
        # Test 1: E-rickshaw / green mobility
        res_green = self.recommender.recommend({
            "caste_category": "SC",
            "annual_income": 200000,
            "gender": "Male",
            "project_cost": 250000,
            "project_description": "buying an electric e-rickshaw battery vehicle for ferrying passengers"
        })
        self.assertEqual(res_green["recommended_schemes"][0]["id"], "nsfdc_gbs")

        # Test 2: Women boutique
        res_women = self.recommender.recommend({
            "caste_category": "SC",
            "annual_income": 180000,
            "gender": "Female",
            "project_cost": 120000,
            "project_description": "starting a women clothing boutique and tailoring shop with embroidery"
        })
        self.assertEqual(res_women["recommended_schemes"][0]["id"], "nsfdc_msy")

        # Test 3: Higher education
        res_edu = self.recommender.recommend({
            "caste_category": "SC",
            "annual_income": 250000,
            "gender": "Male",
            "project_cost": 1500000,
            "project_description": "pursuing btech computer science engineering degree tuition and hostel"
        })
        self.assertEqual(res_edu["recommended_schemes"][0]["id"], "nsfdc_els")

    def test_04_ml_approval_predictor(self):
        """Test ML approval model probability and risk tier outputs."""
        strong_applicant = {
            "gender": "Female",
            "caste_category": "SC",
            "scheme_category": "micro_finance",
            "education_level": "Secondary (10th)",
            "age": 30,
            "annual_income": 220000,
            "project_cost": 100000,
            "requested_loan": 90000,
            "promoter_contrib_pct": 10.0,
            "has_vocational_training": 1,
            "experience_years": 3,
            "has_clean_credit": 1,
            "has_valid_caste_cert": 1,
            "has_valid_income_cert": 1
        }
        pred = self.approval_predictor.predict(strong_applicant)
        self.assertGreater(pred["approval_probability_pct"], 70.0)
        self.assertEqual(pred["risk_badge"], "success")
        self.assertGreater(len(pred["positive_factors"]), 0)

    def test_05_financial_calculator_logic(self):
        """Test standard EMI formula, moratorium interest, and savings."""
        calc = FinancialCalculatorService.calculate_emi(
            loan_amount=100000,
            interest_rate_pct=6.5,
            tenure_years=3.0,
            moratorium_months=3,
            commercial_rate_pct=12.0
        )
        self.assertGreater(calc["monthly_emi"], 0.0)
        self.assertGreater(calc["commercial_monthly_emi"], calc["monthly_emi"])
        self.assertGreater(calc["total_interest_saved"], 0.0)
        self.assertEqual(calc["moratorium_months"], 3)
        self.assertEqual(calc["effective_repayment_months"], 33)
        self.assertGreater(len(calc["yearly_schedule"]), 0)

    def test_06_geo_spatial_locator_and_npa_filter(self):
        """Test nearest partner finding, Haversine distance, and NPA filtering."""
        # Query near New Delhi (28.6139, 77.2090)
        res = self.locator.find_nearest_partners(
            user_lat=28.6139,
            user_lon=77.2090,
            filter_high_npa=True,
            filter_exhausted_funds=True
        )
        self.assertGreater(res["total_found"], 0)
        # Verify distance is sorted ascending
        distances = [p["distance_km"] for p in res["partners"]]
        self.assertEqual(distances, sorted(distances))
        
        # Verify no filtered partner has NPA > 5.0
        for p in res["partners"]:
            self.assertLessEqual(p["npa_ratio_pct"], 5.0)
            self.assertTrue(p["is_fund_available"])

    def test_07_fastapi_endpoints(self):
        """Test REST API responses."""
        # 1. Health check
        resp_health = self.client.get("/api/health")
        self.assertEqual(resp_health.status_code, 200)
        self.assertEqual(resp_health.json()["status"], "healthy")

        # 2. Recommendation API
        resp_rec = self.client.post("/api/recommend", json={
            "caste_category": "SC",
            "annual_income": 180000,
            "gender": "Female",
            "age": 28,
            "education_level": "Secondary (10th)",
            "project_category": "micro_finance",
            "project_cost": 110000,
            "project_description": "tailoring and garment boutique"
        })
        self.assertEqual(resp_rec.status_code, 200)
        data = resp_rec.json()
        self.assertEqual(data["status"], "success")
        self.assertGreater(data["eligible_count"], 0)

        # 3. Calculate API
        resp_calc = self.client.post("/api/calculate-emi", json={
            "loan_amount": 100000,
            "interest_rate_pct": 6.5,
            "tenure_years": 3,
            "moratorium_months": 3
        })
        self.assertEqual(resp_calc.status_code, 200)
        self.assertIn("monthly_emi", resp_calc.json())

        # 4. Multi-page web routes
        for path in ["/", "/recommender", "/calculator", "/locator"]:
            page_resp = self.client.get(path)
            self.assertEqual(page_resp.status_code, 200, f"Failed for path {path}")

if __name__ == "__main__":
    unittest.main()
