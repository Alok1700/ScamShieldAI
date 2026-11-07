"""
End-to-End Live System Diagnostic for ScamShield AI.
Inspects:
1. ML Microservice (FastAPI on port 8000)
2. Express Backend API (Node.js on port 5000)
3. Both Trained AI Models (SMS 5,572 records & URL 11,424 records)
4. AI Multilingual Reasoning & Helpline 1930 Integration
"""

import urllib.request
import json
import time
import sys

def test_endpoint(url, desc, payload=None):
    t0 = time.time()
    try:
        data_bytes = json.dumps(payload).encode() if payload else None
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={'Content-Type': 'application/json'} if payload else {}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            status = resp.status
            body = json.loads(resp.read().decode())
            ms = round((time.time() - t0) * 1000, 1)
            return True, status, ms, body
    except Exception as e:
        ms = round((time.time() - t0) * 1000, 1)
        return False, str(e), ms, None

print("=" * 70)
print(" SCAMSHIELD AI: COMPREHENSIVE LIVE SYSTEM DIAGNOSTIC ")
print("=" * 70)

# --- 1. ML Microservice Checks (Port 8000) ---
print("\n[TIER 1] FastAPI Machine Learning Microservice (http://127.0.0.1:8000)")
ml_tests = [
    ("/health", None, "Health Check & Model Availability"),
    ("/ready", None, "Readiness Probe"),
    ("/metrics/sms", None, "SMS Model Metrics (5,572 samples)"),
    ("/metrics/url", None, "URL Model Metrics (11,424 samples)"),
    ("/predict-sms", {"message": "WINNER!! Selected for £900 prize. Call 09061701461 claim code KL341."}, "SMS Phishing Classifier"),
    ("/predict-url", {"url": "http://192.168.1.1/sbi-kyc-update.exe"}, "URL Threat Classifier"),
    ("/predict", {"text": "Dear customer your SBI account is suspended. Submit OTP immediately."}, "General Text Classifier")
]

ml_passed = 0
for ep, payload, desc in ml_tests:
    url = f"http://127.0.0.1:8000{ep}"
    ok, st, ms, body = test_endpoint(url, desc, payload)
    tag = "PASS" if ok else "FAIL"
    if ok:
        ml_passed += 1
        extra = ""
        if "predict-sms" in ep and body:
            extra = f"-> Scam Prob: {body.get('scam_probability', 0)*100:.1f}%, Tokens: {len(body.get('indicative_tokens', []))}"
        elif "predict-url" in ep and body:
            extra = f"-> Threat Prob: {body.get('scam_probability', 0)*100:.1f}%, Anomalies: {len(body.get('anomalies', []))}"
        elif "metrics" in ep and body:
            acc = body.get('metrics', {}).get('accuracy') or body.get('metrics', {}).get('precision')
            extra = f"-> Dataset: {body.get('dataset_size', 0)} samples, Score: {acc*100:.1f}%"
        print(f"  [{tag}] {desc:<36} | {ms:>5.1f}ms {extra}")
    else:
        print(f"  [{tag}] {desc:<36} | {ms:>5.1f}ms | Error: {st}")

# --- 2. Backend Express API Checks (Port 5000) ---
print("\n[TIER 2] Express Backend Security API (http://localhost:5000)")
api_tests = [
    ("/api/v1/health", None, "Backend Core Health Probe"),
    ("/api/v1/ready", None, "Backend Readiness Probe"),
    ("/api/v1/scan/text", {
        "text": "WINNER!! As a valued customer claim £900 prize. Call 09061701461. Valid 12 hours only.",
        "language": "en"
    }, "Scan Text (SMS Premium Scam)"),
    ("/api/v1/scan/text", {
        "text": "Badhai ho! Aapko mila hai PhonePe 5,000 rupaye cashback. Claim karne ke liye QR scan karein aur apna UPI PIN dalein.",
        "language": "hi"
    }, "Scan Text (Hindi UPI PIN Trap)"),
    ("/api/v1/scan/text", {
        "text": "Salary of INR 65,000.00 credited to your HDFC Bank A/c ending 4821 on 01-Nov-2026 by ACH. Total balance: INR 72,120.00.",
        "language": "en"
    }, "Scan Text (Legitimate Bank Alert)"),
    ("/api/v1/scan/url", {
        "url": "http://192.168.1.1/banking-login.exe"
    }, "Scan URL (Direct IP & Payload Ext)"),
    ("/api/v1/assistant/explain", {
        "question": "How do I report financial fraud in India with Helpline 1930?"
    }, "AI Assistant (Helpline 1930 Query)")
]

api_passed = 0
for ep, payload, desc in api_tests:
    url = f"http://localhost:5000{ep}"
    ok, st, ms, body = test_endpoint(url, desc, payload)
    tag = "PASS" if ok else "FAIL"
    if ok:
        api_passed += 1
        extra = ""
        if "scan" in ep and body:
            risk = body.get("riskLevel", "")
            score = body.get("riskScore", 0)
            threat = body.get("primaryThreat", "")
            extra = f"-> Level: {risk.upper()} ({score}/100), Threat: {threat}"
        elif "assistant" in ep and body:
            extra = f"-> Sources: {', '.join(body.get('sources', []))[:35]}"
        print(f"  [{tag}] {desc:<36} | {ms:>5.1f}ms {extra}")
    else:
        print(f"  [{tag}] {desc:<36} | {ms:>5.1f}ms | Error: {st}")

print("\n" + "=" * 70)
print(f" SUMMARY: ML Microservice: {ml_passed}/{len(ml_tests)} PASS | Backend API: {api_passed}/{len(api_tests)} PASS")
print("=" * 70)
