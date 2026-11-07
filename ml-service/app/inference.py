import os
import time
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

from .url_extractor import extract_url_features, analyze_feature_anomalies
from .sms_extractor import clean_sms_text, extract_sms_signals, format_indicative_token

class SmsClassifierService:
    """
    Dedicated classifier for SMS messages and mobile communications.
    Trained on 5,572 real SMS records + regional high-impact cyber fraud vectors.
    Evaluates word n-grams, subword character n-grams, premium numbers, shortcodes, and currency lures.
    """
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, "sms_classifier.joblib")
        self.vec_path = os.path.join(models_dir, "sms_vectorizer.joblib")
        self.metrics_path = os.path.join(models_dir, "sms_metrics.json")
        
        self.model = None
        self.vectorizer = None
        self.metrics = {}
        self.feature_names = None
        self.coefs = None
        
        self.load()

    def load(self):
        if os.path.exists(self.model_path) and os.path.exists(self.vec_path):
            self.model = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vec_path)
            
            # Extract combined feature names from FeatureUnion
            w_vec = self.vectorizer.transformer_list[0][1]
            c_vec = self.vectorizer.transformer_list[1][1]
            w_feats = [f"word::{w}" for w in w_vec.get_feature_names_out()]
            c_feats = [f"char::{c}" for c in c_vec.get_feature_names_out()]
            self.feature_names = np.array(w_feats + c_feats)
            self.coefs = self.model.coef_[0]
            print(f"[ML Service] SMS threat classifier loaded from {self.models_dir}")
        else:
            print(f"[ML Service] Warning: SMS model not found at {self.models_dir}")

        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None and self.vectorizer is not None

    def predict(self, raw_text: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("SMS ML model is not loaded")

        start = time.time()
        raw = str(raw_text or "")
        cleaned = clean_sms_text(raw)
        vec = self.vectorizer.transform([cleaned])

        prob = float(self.model.predict_proba(vec)[0][1])
        is_scam = bool(prob >= 0.50)
        
        confidence = float(round(abs(prob - 0.5) * 2.0, 4))

        if prob >= 0.75:
            risk_level = "high"
        elif prob >= 0.50:
            risk_level = "elevated"
        elif prob >= 0.35:
            risk_level = "caution"
        else:
            risk_level = "low"

        # Extract active statistical feature contributions from FeatureUnion (signed)
        indicative_tokens: List[Dict[str, Any]] = []
        cx = vec.tocoo()
        seen_labels = set()
        
        for idx in cx.col:
            weight = float(round(self.coefs[idx], 4))
            # Include statistically impactful tokens (both positive scam cues and negative legitimate cues)
            if abs(weight) >= 0.18:
                raw_name = self.feature_names[idx]
                formatted = format_indicative_token(raw_name)
                if formatted and formatted not in seen_labels:
                    seen_labels.add(formatted)
                    direction = "scam" if weight > 0 else "legitimate"
                    indicative_tokens.append({
                        "feature": formatted,
                        "weight": weight,
                        "signed_weight": f"+{weight:.2f}" if weight > 0 else f"{weight:.2f}",
                        "direction": direction,
                        "category": "statistical_signal",
                        "explanation": f"Statistical model feature ({direction} weight: {abs(weight):.2f}). Contributes to ML classification probability."
                    })

        # Sort indicative tokens by absolute importance (descending)
        indicative_tokens.sort(key=lambda x: abs(x["weight"]), reverse=True)

        # Extract deterministic SMS signals (phone numbers, shortcodes, currency lures)
        sms_signals = extract_sms_signals(raw)

        latency_ms = round((time.time() - start) * 1000, 2)

        return {
            "is_scam": is_scam,
            "scam_probability": round(prob, 4),
            "confidence": confidence,
            "risk_level": risk_level,
            "indicative_tokens": indicative_tokens[:8],
            "sms_signals": sms_signals,
            "latency_ms": latency_ms,
            "model_version": self.metrics.get("version", "1.0.0")
        }


class ScamClassifierService:
    """General text and message phishing classifier."""
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, "scam_classifier.joblib")
        self.vec_path = os.path.join(models_dir, "vectorizer.joblib")
        self.metrics_path = os.path.join(models_dir, "metrics.json")
        
        self.model = None
        self.vectorizer = None
        self.metrics = {}
        self.feature_names = None
        self.coefs = None
        
        self.load()

    def load(self):
        if os.path.exists(self.model_path) and os.path.exists(self.vec_path):
            self.model = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vec_path)
            
            # Check if FeatureUnion or standard vectorizer
            if hasattr(self.vectorizer, "transformer_list"):
                w_vec = self.vectorizer.transformer_list[0][1]
                c_vec = self.vectorizer.transformer_list[1][1]
                w_feats = [f"word::{w}" for w in w_vec.get_feature_names_out()]
                c_feats = [f"char::{c}" for c in c_vec.get_feature_names_out()]
                self.feature_names = np.array(w_feats + c_feats)
            else:
                self.feature_names = np.array(self.vectorizer.get_feature_names_out())
                
            self.coefs = self.model.coef_[0]
            print(f"[ML Service] General text scam model loaded from {self.models_dir}")
        else:
            print(f"[ML Service] Warning: Text models not found at {self.models_dir}")

        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None and self.vectorizer is not None

    def preprocess(self, text: str) -> str:
        return clean_sms_text(text)

    def predict(self, raw_text: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("ML model is not loaded")

        start = time.time()
        processed = self.preprocess(raw_text)
        vec = self.vectorizer.transform([processed])

        prob = float(self.model.predict_proba(vec)[0][1])
        is_scam = bool(prob >= 0.50)
        confidence = float(round(abs(prob - 0.5) * 2.0, 4))

        if prob >= 0.75:
            risk_level = "high"
        elif prob >= 0.50:
            risk_level = "elevated"
        elif prob >= 0.35:
            risk_level = "caution"
        else:
            risk_level = "low"

        indicative_tokens: List[Dict[str, Any]] = []
        cx = vec.tocoo()
        seen = set()
        for idx in cx.col:
            weight = float(round(self.coefs[idx], 4))
            if weight > 0.15:
                raw_name = self.feature_names[idx]
                formatted = format_indicative_token(raw_name)
                if formatted and formatted not in seen:
                    seen.add(formatted)
                    indicative_tokens.append({
                        "feature": formatted,
                        "weight": weight
                    })

        indicative_tokens.sort(key=lambda x: x["weight"], reverse=True)
        latency_ms = round((time.time() - start) * 1000, 2)

        return {
            "is_scam": is_scam,
            "scam_probability": round(prob, 4),
            "confidence": confidence,
            "risk_level": risk_level,
            "indicative_tokens": indicative_tokens[:8],
            "latency_ms": latency_ms,
            "model_version": self.metrics.get("version", "1.0.0")
        }


class UrlClassifierService:
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, "url_classifier.joblib")
        self.metrics_path = os.path.join(models_dir, "url_metrics.json")
        
        self.model = None
        self.metrics = {}
        self.feature_cols = [
            'url_length', 'has_ip_address', 'dot_count', 'https_flag', 'url_entropy',
            'token_count', 'subdomain_count', 'query_param_count', 'tld_length',
            'path_length', 'has_hyphen_in_domain', 'number_of_digits', 'tld_popularity',
            'suspicious_file_extension', 'domain_name_length', 'percentage_numeric_chars'
        ]
        
        self.load()

    def load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print(f"[ML Service] URL threat classifier loaded from {self.model_path}")
        else:
            print(f"[ML Service] Warning: URL model not found at {self.model_path}")

        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None

    def predict(self, raw_url: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("URL ML model is not loaded")

        start = time.time()
        features = extract_url_features(raw_url)
        df_feats = pd.DataFrame([features])[self.feature_cols]

        prob = float(self.model.predict_proba(df_feats)[0][1])
        is_malicious = bool(prob >= 0.50)
        confidence = float(round(abs(prob - 0.5) * 2.0, 4))

        if prob >= 0.75:
            risk_level = "high"
        elif prob >= 0.50:
            risk_level = "elevated"
        elif prob >= 0.30:
            risk_level = "caution"
        else:
            risk_level = "low"

        anomalies = analyze_feature_anomalies(features)
        latency_ms = round((time.time() - start) * 1000, 2)

        return {
            "url": raw_url,
            "is_malicious": is_malicious,
            "scam_probability": round(prob, 4),
            "confidence": confidence,
            "risk_level": risk_level,
            "features": features,
            "anomalies": anomalies,
            "latency_ms": latency_ms,
            "model_version": self.metrics.get("version", "1.0.0")
        }


class QrClassifierService:
    """
    Dedicated classifier for QR code payload threats & Quishing attacks.
    Trained on 10,000 real-world QR code payloads (5,000 malicious binaries/phishing + 5,000 legitimate domains).
    Detects quishing (QR phishing), command-and-control IP droppers, Mozi botnets, and malicious binary payloads.
    """
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, "qr_classifier.joblib")
        self.metrics_path = os.path.join(models_dir, "qr_metrics.json")
        
        self.model = None
        self.metrics = {}
        self.feature_cols = [
            'url_length', 'has_ip_address', 'dot_count', 'https_flag', 'url_entropy',
            'token_count', 'subdomain_count', 'query_param_count', 'tld_length',
            'path_length', 'has_hyphen_in_domain', 'number_of_digits', 'tld_popularity',
            'suspicious_file_extension', 'domain_name_length', 'percentage_numeric_chars'
        ]
        
        self.load()

    def load(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print(f"[ML Service] QR threat classifier loaded from {self.model_path}")
        else:
            print(f"[ML Service] Warning: QR model not found at {self.model_path}")

        if os.path.exists(self.metrics_path):
            with open(self.metrics_path, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)

    def is_ready(self) -> bool:
        return self.model is not None

    def predict(self, raw_payload: str) -> Dict[str, Any]:
        if not self.is_ready():
            raise RuntimeError("QR ML model is not loaded")

        start = time.time()
        payload = str(raw_payload or "").strip()
        payload_type = "url"
        quishing_indicators: List[str] = []

        if payload.startswith("upi://pay"):
            payload_type = "upi_payment"
            quishing_indicators.append("QR encodes an automated UPI payment transfer intent.")
        elif payload.startswith(("http://", "https://", "www.")):
            payload_type = "url"
        else:
            payload_type = "text_payload"

        features = extract_url_features(payload)
        df_feats = pd.DataFrame([features])[self.feature_cols]

        prob = float(self.model.predict_proba(df_feats)[0][1])
        is_malicious = bool(prob >= 0.50)
        confidence = float(round(abs(prob - 0.5) * 2.0, 4))

        if prob >= 0.75:
            risk_level = "high"
        elif prob >= 0.50:
            risk_level = "elevated"
        elif prob >= 0.30:
            risk_level = "caution"
        else:
            risk_level = "low"

        anomalies = analyze_feature_anomalies(features)

        # Additional quishing specific indicators
        if features.get('has_ip_address'):
            quishing_indicators.append("QR payload routes to a raw IP address, bypassing standard domain reputation checks.")
        if features.get('suspicious_file_extension'):
            quishing_indicators.append("QR payload points directly to an executable binary, script, or botnet dropper.")
        if features.get('https_flag') == 0:
            quishing_indicators.append("Unencrypted connection (HTTP); susceptible to interception and credential theft.")
        if features.get('url_entropy', 0) > 4.2:
            quishing_indicators.append("High Shannon entropy in QR target link, indicating heavy obfuscation or random token tracking.")

        latency_ms = round((time.time() - start) * 1000, 2)

        return {
            "payload": payload,
            "is_malicious": is_malicious,
            "scam_probability": round(prob, 4),
            "confidence": confidence,
            "risk_level": risk_level,
            "payload_type": payload_type,
            "features": features,
            "anomalies": anomalies,
            "quishing_indicators": quishing_indicators,
            "latency_ms": latency_ms,
            "model_version": self.metrics.get("version", "1.0.0")
        }


classifier_service = ScamClassifierService()
sms_classifier_service = SmsClassifierService()
url_classifier_service = UrlClassifierService()
qr_classifier_service = QrClassifierService()
