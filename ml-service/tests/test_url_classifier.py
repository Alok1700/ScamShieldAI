import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.inference import url_classifier_service
from app.url_extractor import extract_url_features, analyze_feature_anomalies

class TestUrlClassifier(unittest.TestCase):
    def test_url_model_loaded(self):
        self.assertTrue(url_classifier_service.is_ready())
        self.assertIsNotNone(url_classifier_service.model)

    def test_extract_url_features(self):
        feats = extract_url_features("https://www.google.com")
        self.assertEqual(feats["url_length"], len("https://www.google.com"))
        self.assertEqual(feats["has_ip_address"], 0)
        self.assertEqual(feats["https_flag"], 1)
        self.assertEqual(feats["tld_popularity"], 1)
        self.assertEqual(feats["suspicious_file_extension"], 0)

    def test_extract_malicious_ip_features(self):
        feats = extract_url_features("http://27.202.109.19:33886/i")
        self.assertEqual(feats["has_ip_address"], 1)
        self.assertEqual(feats["https_flag"], 0)
        self.assertEqual(feats["suspicious_file_extension"], 1)
        self.assertGreater(feats["percentage_numeric_chars"], 30.0)

    def test_predict_benign_urls(self):
        benign_samples = [
            "https://www.google.com",
            "https://www.wikipedia.org",
            "https://www.onezoom.org",
            "https://www.cloudcoentertainment.com",
            "https://www.sehh.es"
        ]
        for url in benign_samples:
            res = url_classifier_service.predict(url)
            self.assertFalse(res["is_malicious"], f"Expected benign for {url}, got malicious with prob {res['scam_probability']}")
            self.assertLess(res["scam_probability"], 0.40)
            self.assertIn(res["risk_level"], ("low", "caution"))

    def test_predict_malicious_urls(self):
        malicious_samples = [
            "http://27.202.109.19:33886/i",
            "http://185.82.202.195/sparc",
            "http://dedify.de/bins/custom.arm5",
            "https://playd.healthnlife.pk/prog/66f6fb069f739_sgsfdgsda.exe",
            "http://107.175.73.38/ransomware.exe"
        ]
        for url in malicious_samples:
            res = url_classifier_service.predict(url)
            self.assertTrue(res["is_malicious"], f"Expected malicious for {url}, got benign with prob {res['scam_probability']}")
            self.assertGreaterEqual(res["scam_probability"], 0.70)
            self.assertIn(res["risk_level"], ("elevated", "high"))
            self.assertGreater(len(res["anomalies"]), 0)

if __name__ == '__main__':
    unittest.main()
