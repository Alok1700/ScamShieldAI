from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="The message or extracted content to classify")

class TopFeature(BaseModel):
    feature: str
    weight: float

class PredictResponse(BaseModel):
    is_scam: bool
    scam_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    indicative_tokens: List[TopFeature] = []
    latency_ms: float
    model_version: str

# SMS Classifier Schemas
class PredictSmsRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="The suspicious SMS text message to inspect")

class SmsSignal(BaseModel):
    type: str
    evidence: str
    description: str
    severity: str

class PredictSmsResponse(BaseModel):
    is_scam: bool
    scam_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    indicative_tokens: List[TopFeature] = []
    sms_signals: List[SmsSignal] = []
    latency_ms: float
    model_version: str

class PredictUrlRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2000, description="The suspicious URL to classify")

class UrlAnomaly(BaseModel):
    feature: str
    value: Union[str, int, float]
    importance: float
    description: str

class PredictUrlResponse(BaseModel):
    url: str
    is_malicious: bool
    scam_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    features: Dict[str, Any]
    anomalies: List[UrlAnomaly] = []
    latency_ms: float
    model_version: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    sms_model_loaded: bool = False
    url_model_loaded: bool = False
    qr_model_loaded: bool = False
    version: str

class PredictQrRequest(BaseModel):
    payload: str = Field(..., min_length=1, max_length=4000, description="The decoded QR code payload or URL to classify")

class PredictQrResponse(BaseModel):
    payload: str
    is_malicious: bool
    scam_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_level: str
    payload_type: str = "url"
    features: Dict[str, Any]
    anomalies: List[UrlAnomaly] = []
    quishing_indicators: List[str] = []
    latency_ms: float
    model_version: str

class QrMetricsResponse(BaseModel):
    model_name: str
    version: str
    dataset_name: str
    trained_at: str
    dataset_size: int
    train_samples: int
    test_samples: int
    features: List[str]
    feature_importances: Dict[str, float]
    metrics: Dict[str, Any]
    thresholds: Dict[str, float]
    limitations: List[str]

class MetricsResponse(BaseModel):
    model_name: str
    version: str
    trained_at: str
    dataset_size: int
    metrics: Dict[str, Any]
    limitations: List[str]

class SmsMetricsResponse(BaseModel):
    model_name: str
    version: str
    dataset_name: str
    trained_at: str
    dataset_size: int
    train_samples: int
    test_samples: int
    metrics: Dict[str, Any]
    top_scam_features: List[TopFeature] = []
    top_benign_features: List[TopFeature] = []
    limitations: List[str]

class UrlMetricsResponse(BaseModel):
    model_name: str
    version: str
    dataset_name: str
    trained_at: str
    dataset_size: int
    train_samples: int
    test_samples: int
    features: List[str]
    feature_importances: Dict[str, float]
    metrics: Dict[str, Any]
    thresholds: Dict[str, float]
    limitations: List[str]
