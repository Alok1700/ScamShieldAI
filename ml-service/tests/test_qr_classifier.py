import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.inference import qr_classifier_service
from app.url_extractor import extract_url_features, analyze_feature_anomalies

class TestQrClassifier(unittest.TestCase):
    def test_qr_model_loaded(self):
        self.assertTrue(qr_classifier_service.is_ready())
        self.assertIsNotNone(qr_classifier_service.model)
        self.assertIn("accuracy", qr_classifier_service.metrics.get("metrics", {}))
        self.assertGreater(qr_classifier_service.metrics["metrics"]["accuracy"], 0.98)

    def test_predict_benign_qr_urls(self):
        benign_samples = [
            "https://www.aboutaberdeen.com",
            "https://www.tuxfamily.org",
            "https://www.transportcycle.com",
            "https://www.ebbsfleetunited.co.uk",
            "https://www.trichstop.com"
        ]
        for url in benign_samples:
            res = qr_classifier_service.predict(url)
            self.assertFalse(res["is_malicious"], f"Expected benign for {url}, got malicious with prob {res['scam_probability']}")
            self.assertLess(res["scam_probability"], 0.40)
            self.assertIn(res["risk_level"], ("low", "caution"))

    def test_predict_malicious_qr_urls(self):
        malicious_samples = [
            "http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe",
            "http://117.235.107.94:37668/bin.sh",
            "http://222.141.138.234:56620/Mozi.m",
            "http://217.28.220.132/tools/payload.exe",
            "http://218.159.12.167/rondo.x86_64"
        ]
        for url in malicious_samples:
            res = qr_classifier_service.predict(url)
            self.assertTrue(res["is_malicious"], f"Expected malicious for {url}, got benign with prob {res['scam_probability']}")
            self.assertGreaterEqual(res["scam_probability"], 0.70)
            self.assertIn(res["risk_level"], ("elevated", "high"))
            self.assertGreater(len(res["quishing_indicators"]), 0)

if __name__ == '__main__':
    unittest.main()
