# ScamShield AI — REST API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## 1. POST /scan/text
Scans raw text messages from SMS, WhatsApp, Telegram, or Email.

### Request Body
```json
{
  "text": "Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN immediately at https://sbi-kyc-security.example",
  "consentToSave": false,
  "language": "en"
}
```

### Response (200 OK)
```json
{
  "scanId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "status": "completed",
  "scanType": "text",
  "riskScore": 85,
  "riskLevel": "high",
  "assessmentType": "hybrid_ml_heuristic",
  "primaryThreat": "banking_credential_phishing",
  "summary": "The submitted message contains high-risk indicators of banking phishing.",
  "detectedSignals": [
    {
      "type": "urgency_account_suspension",
      "severity": "high",
      "evidence": "account is temporarily suspended",
      "explanation": "The message pressures the recipient to act immediately.",
      "source": "text_rule"
    },
    {
      "type": "otp_harvesting",
      "severity": "high",
      "evidence": "Submit OTP",
      "explanation": "Directly solicits an OTP code.",
      "source": "text_rule"
    }
  ],
  "recommendations": [
    "Do not share your OTP or PAN.",
    "Open your official bank app directly."
  ],
  "scamChain": [
    { "stage": "1. Impersonation", "status": "observed", "detail": "Simulates SBI" },
    { "stage": "2. Urgency & Psychological Pressure", "status": "observed", "detail": "Account suspended threat" },
    { "stage": "3. Vector / Redirection", "status": "observed", "detail": "Observed link: https://sbi-kyc-security.example" },
    { "stage": "4. Credential / Payment Solicitation", "status": "observed", "detail": "Submit OTP demand" },
    { "stage": "5. Account Compromise / Financial Loss", "status": "potential_outcome", "detail": "High risk account takeover" }
  ],
  "modelVersion": "1.0.0",
  "processingTimeMs": 42
}
```

---

## 2. POST /scan/url
Performs zero-fetch lexical and structural inspection on user-submitted links.

### Request Body
```json
{
  "url": "https://sbi-kyc-verification.top/login",
  "consentToSave": false,
  "language": "en"
}
```

---

## 3. POST /scan/image
Multipart upload for screenshot OCR inspection.
- Form Field `image`: Binary file (PNG, JPG, WebP, max 10MB)
- Form Field `manualText`: Optional manual text correction
- Form Field `language`: `en`, `hi`

---

## 4. POST /scan/qr
Multipart upload for QR code decoding, UPI protocol analysis, and QR Threat ML Classification (trained on 10,000 real-world QR payloads with 99.7% accuracy).
- Form Field `qrImage`: Binary image containing QR code.
- Form Field `language`: `en`, `hi`

### ML Microservice QR Endpoints (Port 8000)
- **POST `/predict-qr`**: Direct inference on decoded QR payload or URL.
  ```json
  { "payload": "http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe" }
  ```
  Returns:
  ```json
  {
    "payload": "http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe",
    "is_malicious": true,
    "scam_probability": 0.9975,
    "confidence": 0.9951,
    "risk_level": "high",
    "payload_type": "url",
    "quishing_indicators": ["QR payload points directly to an executable binary, script, or botnet dropper."],
    "anomalies": [...],
    "latency_ms": 0.22,
    "model_version": "1.0.0"
  }
  ```
- **GET `/metrics/qr`**: Model evaluation metadata, 10,000 records benchmark, accuracy (99.65%), precision (99.50%), recall (99.80%), ROC-AUC (0.9999), and confusion matrix.

---

## 5. POST /assistant/explain
Contextual AI assistant queries.

### Request Body
```json
{
  "question": "What should I do if I already shared my OTP?",
  "scanResult": { "primaryThreat": "banking_credential_phishing" },
  "language": "en"
}
```

---

## 6. GET /health & GET /ready
Readiness and dependency probes.
```json
{
  "status": "ready",
  "dependencies": {
    "rulesEngine": true,
    "urlAnalyzer": true,
    "mlService": true,
    "ocrEngine": true,
    "qrDecoder": true
  }
}
```
