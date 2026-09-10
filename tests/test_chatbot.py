"""
Unit and integration tests for Scheme Sathi Chatbot Advisory Service.
Verifies scheme inquiries, statutory FAQ retrieval, language routing, and API endpoints.
"""

import unittest
from fastapi.testclient import TestClient
from app import app
from services.chatbot_service import get_chatbot_service


class TestChatbotService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.chatbot = get_chatbot_service()

    def test_msy_interest_rate_query(self):
        res = self.chatbot.answer_query("What is the interest rate for Mahila Samriddhi Yojana?")
        self.assertIn("4.0%", res["reply"])
        self.assertTrue(len(res["suggested_actions"]) > 0)
        self.assertIn("nsfdc_msy", res["related_schemes"])

    def test_document_requirements_query(self):
        res = self.chatbot.answer_query("What documents are required to apply for loan?")
        self.assertIn("Caste Certificate", res["reply"])
        self.assertIn("Income Certificate", res["reply"])

    def test_hindi_query(self):
        res = self.chatbot.answer_query("वार्षिक आय की सीमा क्या है?", preferred_lang="hi")
        self.assertEqual(res["language"], "hi")
        self.assertIn("3,00,000", res["reply"])

    def test_channel_partner_query(self):
        res = self.chatbot.answer_query("Can I apply directly on NSFDC website or do I need a channel partner?")
        self.assertIn("Channel Finance System", res["reply"])
        self.assertIn("State Channelizing Agencies", res["reply"])

    def test_api_chat_endpoint_english(self):
        response = self.client.post("/api/chat", json={
            "message": "Tell me about education loan scheme",
            "language": "en"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("reply", data)
        self.assertTrue(len(data["reply"]) > 20)

    def test_api_chat_endpoint_hindi(self):
        response = self.client.post("/api/chat", json={
            "message": "महिला समृद्धि योजना",
            "language": "hi"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("reply", data)

    def test_api_chat_suggestions(self):
        response = self.client.get("/api/chat/suggestions?lang=en")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data["suggestions"]) >= 3)

    def test_api_transcribe_endpoint(self):
        import io, wave, struct
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as wf:
            wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(16000)
            wf.writeframes(struct.pack('<' + 'h'*8000, *([0]*8000)))
        buf.seek(0)
        
        response = self.client.post(
            "/api/transcribe?language=en",
            files={"file": ("audio.wav", buf.read(), "audio/wav")}
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)


if __name__ == "__main__":
    unittest.main()
