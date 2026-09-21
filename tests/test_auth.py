"""
Unit and integration tests for Beneficiary Sign Up, Data Storage, Login, and Session Linking.
Tests secure PBKDF2 password hashing, JWT session verification, profile retrieval, and application linking.
"""

import unittest
import json
import os
from fastapi.testclient import TestClient
from app import app
from services.auth_service import get_auth_service


class TestAuthService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.auth_service = get_auth_service()
        # Reset users datastore for test isolation
        with open(cls.auth_service.users_file, "w", encoding="utf-8") as f:
            json.dump([], f)
        from services.db import db_service
        if db_service.check_connection() and db_service.users is not None:
            db_service.users.delete_many({"phone_number": {"$in": ["9811223344", "9871122334", "9812345678", "9998887776", "9876543210", "9899887766", "9812993344", "9876500000"]}})

    def tearDown(self):
        # Clear test accounts after tests
        with open(self.auth_service.users_file, "w", encoding="utf-8") as f:
            json.dump([], f)
        from services.db import db_service
        if db_service.check_connection() and db_service.users is not None:
            db_service.users.delete_many({"phone_number": {"$in": ["9811223344", "9871122334", "9812345678", "9998887776", "9876543210", "9899887766", "9812993344", "9876500000"]}})

    def test_signup_success(self):
        payload = {
            "full_name": "Ravi Kumar",
            "phone_number": "9811223344",
            "password": "SecurePassword123",
            "email": "ravi@example.com",
            "caste_category": "SC",
            "caste_cert_number": "DL/REV/2026/883",
            "annual_income": 175000,
            "gender": "Male",
            "state": "Delhi",
            "district": "Central Delhi",
            "aadhaar_last_four": "9876"
        }
        res = self.client.post("/api/auth/signup", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("token", data)
        self.assertIn("user", data)
        user = data["user"]
        self.assertTrue(user["user_id"].startswith("USR-2026-"))
        self.assertEqual(user["full_name"], "Ravi Kumar")
        self.assertEqual(user["phone_number"], "9811223344")
        # Ensure password hash is NEVER leaked in response
        self.assertNotIn("password", user)
        self.assertNotIn("password_hash", user)
        self.assertNotIn("salt", user)

        # Verify secure persistence in users.json
        with open(self.auth_service.users_file, "r", encoding="utf-8") as f:
            stored = json.load(f)
        self.assertTrue(any(u.get("phone_number") == "9811223344" for u in stored))
        saved_user = next(u for u in stored if u.get("phone_number") == "9811223344")
        self.assertNotEqual(saved_user.get("password_hash"), "SecurePassword123")
        self.assertTrue(len(saved_user.get("password_hash", "")) > 40)
        self.assertTrue(len(saved_user.get("salt", "")) > 10)

    def test_signup_duplicate_phone(self):
        payload = {
            "full_name": "Ravi Kumar",
            "phone_number": "9811223344",
            "password": "SecurePassword123"
        }
        res1 = self.client.post("/api/auth/signup", json=payload)
        self.assertEqual(res1.status_code, 200)

        # Second signup with same phone
        res2 = self.client.post("/api/auth/signup", json=payload)
        self.assertEqual(res2.status_code, 400)
        self.assertIn("already registered", res2.json()["detail"].lower())

    def test_signup_invalid_phone_or_password(self):
        # Invalid phone format
        res_phone = self.client.post("/api/auth/signup", json={
            "full_name": "Sunita",
            "phone_number": "12345",
            "password": "Password123"
        })
        self.assertEqual(res_phone.status_code, 400)

        # Short password
        res_pwd = self.client.post("/api/auth/signup", json={
            "full_name": "Sunita",
            "phone_number": "9876543219",
            "password": "123"
        })
        self.assertEqual(res_pwd.status_code, 422)  # Pydantic min_length validation

    def test_login_success(self):
        # Sign up user first
        self.client.post("/api/auth/signup", json={
            "full_name": "Kavita Devi",
            "phone_number": "9871122334",
            "password": "KavitaPassword789",
            "caste_category": "Safai Karamchari / Dependent",
            "annual_income": 120000
        })

        # Login with mobile number
        login_res = self.client.post("/api/auth/login", json={
            "identifier": "9871122334",
            "password": "KavitaPassword789"
        })
        self.assertEqual(login_res.status_code, 200)
        data = login_res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("token", data)
        self.assertEqual(data["user"]["full_name"], "Kavita Devi")

    def test_login_invalid_password(self):
        self.client.post("/api/auth/signup", json={
            "full_name": "Kavita Devi",
            "phone_number": "9871122334",
            "password": "CorrectPassword"
        })

        login_res = self.client.post("/api/auth/login", json={
            "identifier": "9871122334",
            "password": "WrongPassword"
        })
        self.assertEqual(login_res.status_code, 401)
        self.assertIn("incorrect", login_res.json()["detail"].lower())

    def test_auth_me_profile(self):
        signup_res = self.client.post("/api/auth/signup", json={
            "full_name": "Anand Mohan",
            "phone_number": "9899887766",
            "password": "AnandPassword1",
            "caste_category": "SC",
            "annual_income": 190000
        })
        token = signup_res.json()["token"]

        # Call /api/auth/me with Bearer token
        me_res = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["user"]["full_name"], "Anand Mohan")

        # Call /api/auth/me without token -> 401
        unauth_res = self.client.get("/api/auth/me")
        self.assertEqual(unauth_res.status_code, 401)

    def test_scheme_registration_linked_to_authenticated_user(self):
        signup_res = self.client.post("/api/auth/signup", json={
            "full_name": "Pooja Bharti",
            "phone_number": "9812345678",
            "password": "PoojaPassword1",
            "caste_category": "SC",
            "annual_income": 160000,
            "gender": "Female",
            "aadhaar_last_four": "4455"
        })
        token = signup_res.json()["token"]
        user_id = signup_res.json()["user"]["user_id"]

        # Submit scheme registration with Authorization header
        reg_payload = {
            "scheme_id": "nsfdc_msy",
            "applicant_name": "Pooja Bharti",
            "phone_number": "9812345678",
            "email": "pooja@example.gov.in",
            "aadhaar_last_four": "4455",
            "caste_category": "SC",
            "annual_income": 160000,
            "gender": "Female",
            "state": "Delhi",
            "district": "North Delhi",
            "project_cost": 120000,
            "confirmed_by_user": True
        }
        reg_res = self.client.post("/api/register-scheme", json=reg_payload, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(reg_res.status_code, 200)
        reg_data = reg_res.json()["registration"]
        self.assertEqual(reg_data["applicant_user_id"], user_id)

        # Retrieve user applications
        my_apps_res = self.client.get("/api/auth/my-applications", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(my_apps_res.status_code, 200)
        apps = my_apps_res.json()["applications"]
        self.assertTrue(len(apps) >= 1)
        self.assertEqual(apps[0]["registration_id"], reg_data["registration_id"])

    def test_recommendation_authenticated_beneficiary(self):
        signup_res = self.client.post("/api/auth/signup", json={
            "full_name": "Sanjay Das",
            "phone_number": "9812993344",
            "password": "Password123",
            "caste_category": "SC"
        })
        token = signup_res.json()["token"]
        user_id = signup_res.json()["user"]["user_id"]

        rec_res = self.client.post("/api/recommend", json={
            "caste_category": "SC",
            "annual_income": 180000,
            "gender": "Male",
            "age": 28,
            "education_level": "graduate",
            "project_category": "micro_finance",
            "project_cost": 120000,
            "project_description": "General grocery store"
        }, headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(rec_res.status_code, 200)
        rec_data = rec_res.json()
        self.assertIn("authenticated_beneficiary", rec_data)
        self.assertEqual(rec_data["authenticated_beneficiary"]["user_id"], user_id)
        self.assertEqual(rec_data["authenticated_beneficiary"]["full_name"], "Sanjay Das")

    def test_aadhaar_send_otp_success(self):
        # Test pre-seeded Aadhaar 123456789012 (Aakash Kumar, phone 9876543210)
        res = self.client.post("/api/auth/aadhaar/send-otp", json={"aadhaar_number": "1234 5678 9012"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["aadhaar_masked"], "XXXX-XXXX-9012")
        self.assertEqual(data["phone_masked"], "+91 98******10")
        self.assertIn("otp_demo", data)
        self.assertEqual(len(data["otp_demo"]), 6)

    def test_aadhaar_send_otp_invalid_aadhaar(self):
        # Less than 12 digits
        res = self.client.post("/api/auth/aadhaar/send-otp", json={"aadhaar_number": "1234567890"})
        self.assertEqual(res.status_code, 400)
        self.assertIn("12", res.json()["detail"])

    def test_aadhaar_verify_otp_invalid(self):
        # Request OTP first
        self.client.post("/api/auth/aadhaar/send-otp", json={"aadhaar_number": "998877665544"})
        # Attempt verify with invalid OTP
        res = self.client.post("/api/auth/aadhaar/verify-otp", json={
            "aadhaar_number": "998877665544",
            "otp": "000000"
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("invalid", res.json()["detail"].lower())

    def test_aadhaar_verify_otp_success_creates_user_and_persists_details(self):
        # 1. Send OTP for 998877665544 (Sunita Devi, Safai Karamchari)
        send_res = self.client.post("/api/auth/aadhaar/send-otp", json={"aadhaar_number": "998877665544"})
        self.assertEqual(send_res.status_code, 200)
        otp = send_res.json()["otp_demo"]

        # 2. Verify OTP
        verify_res = self.client.post("/api/auth/aadhaar/verify-otp", json={
            "aadhaar_number": "998877665544",
            "otp": otp
        })
        self.assertEqual(verify_res.status_code, 200)
        v_data = verify_res.json()
        self.assertEqual(v_data["status"], "success")
        self.assertIn("token", v_data)
        self.assertIn("user", v_data)

        user = v_data["user"]
        self.assertEqual(user["full_name"], "Sunita Devi")
        self.assertEqual(user["aadhaar_number"], "998877665544")
        self.assertEqual(user["aadhaar_last_four"], "5544")
        self.assertTrue(user["aadhaar_verified"])
        self.assertEqual(user["caste_category"], "Safai Karamchari / Dependent")

        # 3. Assert persisted directly in users.json database
        with open(self.auth_service.users_file, "r", encoding="utf-8") as f:
            stored_users = json.load(f)
        matched = [u for u in stored_users if u.get("aadhaar_number") == "998877665544"]
        self.assertEqual(len(matched), 1)
        self.assertEqual(matched[0]["full_name"], "Sunita Devi")
        self.assertEqual(matched[0]["auth_provider"], "aadhaar_otp")

        # 4. Assert token works on /api/auth/me
        token = v_data["token"]
        me_res = self.client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["user"]["full_name"], "Sunita Devi")

    def test_get_linked_mobile_success(self):
        # 1. Query pre-seeded Aadhaar 123456789012
        res = self.client.get("/api/auth/aadhaar/linked-mobile?aadhaar_number=1234 5678 9012")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["phone_number"], "9876543210")
        self.assertEqual(data["linked_phone"], "9876543210")
        self.assertEqual(data["full_name"], "Aakash Kumar")
        self.assertEqual(data["aadhaar_number"], "123456789012")
        self.assertEqual(data["phone_masked"], "+91 98******10")

    def test_lookup_linked_mobile_post(self):
        # 2. Test POST /api/auth/aadhaar/lookup endpoint
        res = self.client.post("/api/auth/aadhaar/lookup", json={"aadhaar_number": "998877665544"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["phone_number"], "9811223344")
        self.assertEqual(data["full_name"], "Sunita Devi")

    def test_send_otp_contains_actual_phone(self):
        # 3. Test that send-otp response returns unmasked actual phone
        res = self.client.post("/api/auth/aadhaar/send-otp", json={"aadhaar_number": "123456789012"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["phone_number"], "9876543210")
        self.assertEqual(data["linked_phone"], "9876543210")

    def test_get_linked_mobile_invalid_aadhaar(self):
        # 4. Invalid Aadhaar (not 12 digits) returns 400
        res = self.client.get("/api/auth/aadhaar/linked-mobile?aadhaar_number=1234")
        self.assertEqual(res.status_code, 400)
        self.assertIn("12", res.json()["detail"])

    def test_get_linked_mobile_dynamic_generation(self):
        # 5. Non-seeded 12-digit Aadhaar returns deterministic actual 10-digit mobile
        res = self.client.get("/api/auth/aadhaar/linked-mobile?aadhaar_number=888877776666")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["phone_number"], "9877776666")
        self.assertEqual(len(data["phone_number"]), 10)


if __name__ == "__main__":
    unittest.main()


