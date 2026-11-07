"""
Unit and integration tests for ScamShield AI SMS Threat Classifier.
Tests preprocessing, feature extraction, ML prediction, and API schemas using unittest.
"""

import unittest
import os
import sys

# Ensure ml-service is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from app.sms_extractor import clean_sms_text, extract_sms_signals, format_indicative_token
from app.inference import sms_classifier_service

class TestSmsClassifier(unittest.TestCase):

    def setUp(self):
        self.assertTrue(sms_classifier_service.is_ready(), "SMS Classifier Service should be loaded and ready.")

    def test_clean_sms_text(self):
        raw = "WINNER! You won £900. Call 09061701461 or txt 87121 to http://scam.example"
        cleaned = clean_sms_text(raw)
        self.assertIn("__url__", cleaned)
        self.assertIn("__premium_phone__", cleaned)
        self.assertIn("__shortcode__", cleaned)
        self.assertIn("__currency__", cleaned)

    def test_extract_sms_signals_premium_number(self):
        msg = "Call 09061701461 immediately to claim your reward code."
        signals = extract_sms_signals(msg)
        types = [s["type"] for s in signals]
        self.assertIn("sms_premium_rate_number", types)
        premium_sig = next(s for s in signals if s["type"] == "sms_premium_rate_number")
        self.assertEqual(premium_sig["evidence"], "09061701461")

    def test_predict_lottery_spam_sms(self):
        msg = "Free entry in 2 a wkly comp to win FA Cup final tkts 21st May. Text FA to 87121 to receive entry question (std txt rate)"
        res = sms_classifier_service.predict(msg)
        self.assertTrue(res["is_scam"])
        self.assertGreaterEqual(res["scam_probability"], 0.70)
        self.assertIn(res["risk_level"], ["elevated", "high"])
        self.assertGreater(len(res["indicative_tokens"]), 0)

    def test_predict_urgent_bank_suspension(self):
        msg = "Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN immediately at http://sbi-kyc.example"
        res = sms_classifier_service.predict(msg)
        self.assertTrue(res["is_scam"])
        self.assertGreaterEqual(res["scam_probability"], 0.75)
        self.assertEqual(res["risk_level"], "high")

    def test_predict_upi_reverse_trap(self):
        msg = "Badhai ho! Aapko mila hai PhonePe 5,000 rupaye cashback. Claim karne ke liye QR scan karein aur apna UPI PIN dalein."
        res = sms_classifier_service.predict(msg)
        self.assertTrue(res["is_scam"])
        self.assertGreaterEqual(res["scam_probability"], 0.70)

    def test_predict_legitimate_personal_sms(self):
        msg = "Hi Rahul, are we still meeting for the study group discussion tomorrow at the college library around 4 PM?"
        res = sms_classifier_service.predict(msg)
        self.assertFalse(res["is_scam"])
        self.assertLess(res["scam_probability"], 0.20)
        self.assertEqual(res["risk_level"], "low")

    def test_predict_legitimate_otp_notification(self):
        msg = "492018 is your OTP for transaction of Rs 1,299 at Swiggy using HDFC Bank Card ending 9012. Do not disclose to anyone. Bank never calls for OTP."
        res = sms_classifier_service.predict(msg)
        self.assertFalse(res["is_scam"])
        self.assertLess(res["scam_probability"], 0.50)

    def test_sms_metrics_metadata(self):
        metrics = sms_classifier_service.metrics
        self.assertIn("accuracy", metrics.get("metrics", {}))
        self.assertIn("roc_auc", metrics.get("metrics", {}))
        self.assertGreaterEqual(metrics["metrics"]["accuracy"], 0.95)
        self.assertGreaterEqual(metrics["metrics"]["roc_auc"], 0.98)
        self.assertGreaterEqual(metrics.get("dataset_size", 0), 5500)

if __name__ == "__main__":
    unittest.main()
