"""
FastAPI Microservice for ScamShield AI Multimodal Threat & Phishing Classifiers.
Supports Text Phishing Classification, SMS Fraud ML Classification (5,572 samples), URL Threat ML Classification, & QR Code Payload Threat ML Classification (10,000 samples).
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    PredictRequest, PredictResponse, 
    PredictSmsRequest, PredictSmsResponse,
    PredictUrlRequest, PredictUrlResponse,
    PredictQrRequest, PredictQrResponse,
    HealthResponse, MetricsResponse, SmsMetricsResponse, UrlMetricsResponse, QrMetricsResponse
)
from .inference import classifier_service, sms_classifier_service, url_classifier_service, qr_classifier_service

app = FastAPI(
    title="ScamShield AI - ML Classifier Service",
    description="Inference API for text phishing, SMS scam (5,572 records), URL threat (11,424 records), and QR threat classification (10,000 records)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse)
def health():
    all_ready = (
        classifier_service.is_ready() and 
        sms_classifier_service.is_ready() and 
        url_classifier_service.is_ready() and
        qr_classifier_service.is_ready()
    )
    return {
        "status": "healthy" if all_ready else "degraded",
        "model_loaded": classifier_service.is_ready(),
        "sms_model_loaded": sms_classifier_service.is_ready(),
        "url_model_loaded": url_classifier_service.is_ready(),
        "qr_model_loaded": qr_classifier_service.is_ready(),
        "version": qr_classifier_service.metrics.get("version", "1.0.0")
    }

@app.get("/ready")
def ready():
    if not (
        classifier_service.is_ready() and 
        sms_classifier_service.is_ready() and 
        url_classifier_service.is_ready() and
        qr_classifier_service.is_ready()
    ):
        raise HTTPException(status_code=503, detail="ML Models not loaded or ready")
    return {"status": "ready"}

@app.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    if not classifier_service.metrics:
        raise HTTPException(status_code=404, detail="Text classifier metrics not available")
    return classifier_service.metrics

@app.get("/metrics/sms", response_model=SmsMetricsResponse)
def get_sms_metrics():
    if not sms_classifier_service.metrics:
        raise HTTPException(status_code=404, detail="SMS classifier metrics not available")
    return sms_classifier_service.metrics

@app.get("/metrics/url", response_model=UrlMetricsResponse)
def get_url_metrics():
    if not url_classifier_service.metrics:
        raise HTTPException(status_code=404, detail="URL classifier metrics not available")
    return url_classifier_service.metrics

@app.get("/metrics/qr", response_model=QrMetricsResponse)
def get_qr_metrics():
    if not qr_classifier_service.metrics:
        raise HTTPException(status_code=404, detail="QR classifier metrics not available")
    return qr_classifier_service.metrics

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if not classifier_service.is_ready():
        raise HTTPException(status_code=503, detail="Text model service not available")
    try:
        result = classifier_service.predict(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text inference error: {str(e)}")

@app.post("/predict-sms", response_model=PredictSmsResponse)
def predict_sms(request: PredictSmsRequest):
    if not sms_classifier_service.is_ready():
        raise HTTPException(status_code=503, detail="SMS model service not available")
    try:
        result = sms_classifier_service.predict(request.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SMS inference error: {str(e)}")

@app.post("/predict-url", response_model=PredictUrlResponse)
def predict_url(request: PredictUrlRequest):
    if not url_classifier_service.is_ready():
        raise HTTPException(status_code=503, detail="URL model service not available")
    try:
        result = url_classifier_service.predict(request.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL inference error: {str(e)}")

@app.post("/predict-qr", response_model=PredictQrResponse)
def predict_qr(request: PredictQrRequest):
    if not qr_classifier_service.is_ready():
        raise HTTPException(status_code=503, detail="QR model service not available")
    try:
        result = qr_classifier_service.predict(request.payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"QR inference error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ml-service.app.main:app", host="127.0.0.1", port=8000, reload=True)
