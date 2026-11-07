import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.inference import ScamClassifierService

def test_model_loading_and_prediction():
    service = ScamClassifierService()
    assert service.is_ready() is True

    # Test scam prediction
    scam_text = "Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example"
    scam_result = service.predict(scam_text)
    assert scam_result["is_scam"] is True
    assert scam_result["scam_probability"] > 0.5
    assert scam_result["risk_level"] in ["elevated", "high"]
    assert len(scam_result["indicative_tokens"]) > 0

    # Test benign prediction
    benign_text = "Your Swiggy order has been picked up by the delivery partner and is on the way."
    benign_result = service.predict(benign_text)
    assert benign_result["is_scam"] is False
    assert benign_result["scam_probability"] < 0.5
    assert benign_result["risk_level"] in ["low", "caution"]

if __name__ == "__main__":
    test_model_loading_and_prediction()
    print("All ML tests passed!")
