# ScamShield AI — System Architecture Document

## 1. High-Level Architecture Overview

ScamShield AI utilizes a hybrid multimodal defense architecture designed to detect, explain, and mitigate digital fraud threats before victims suffer financial or identity loss.

```text
                  USERS (Web / Mobile Browser)
                               |
                               v
               REACT 19 + VITE FRONTEND (Tailwind CSS)
                               |  (HTTP REST / JSON / Multipart)
                               v
                  NODE.JS / EXPRESS 4 API GATEWAY
         (Helmet, Rate-Limiter, Zod Validation, Pino Redaction)
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
    Text/URL Pipeline     OCR/QR Extraction      MongoDB Atlas
  (Regex, Lexical URL)   (Tesseract.js, jsQR)    (Consent-based)
        |                      |
        +----------+-----------+
                   |
                   v
         Unified Detection Engine
                   |
    +--------------+--------------+
    |              |              |
    v              v              v
Deterministic   FastAPI ML     Threat Intel
Security Rules  Microservice   Heuristics
(Urgency, UPI)  (TF-IDF LogReg) (Brand Feeds)
    |              |              |
    +--------------+--------------+
                   |
                   v
          Evidence Aggregator
                   |
                   v
     Scam Kill-Chain Reconstruction
    (Observed vs Potential Outcomes)
                   |
                   v
     Multilingual Explainable AI
    (English, Hindi)
                   |
                   v
        Standardized JSON Report
```

---

## 2. Six-Layer Hybrid Detection Pipeline

1. **Layer 1: Multimodal Extraction**
   - **Text & Messages**: Normalizes Unicode, removes zero-width characters, isolates embedded URLs.
   - **Screenshots (OCR)**: Processes in-memory buffers with Tesseract.js. No raw images written to disk.
   - **QR Codes**: Decodes image bitmaps via `jsQR` and `jimp`. Parses UPI payment URIs (`upi://pay`).

2. **Layer 2: Deterministic Cybersecurity Rules**
   - Direct matching against verified fraud indicators:
     - Urgent account freeze threats ("within 30 mins", "power cut at 9:30 PM").
     - Credential & identity harvesting (OTP, Netbanking passwords, PAN, Aadhaar).
     - UPI Reverse Payment Traps (Crucial rule: entering UPI PIN debits funds, never receives funds).
     - Telegram task schemes, fake lottery draws, and digital arrest threats.
   - Lexical URL inspection: Punycode IDNs (`xn--`), IP hosts, high-risk TLDs, deceptive `@` userinfo tricks, excessive subdomains.

3. **Layer 3: Trained Machine Learning Classifier**
   - Scikit-learn TF-IDF + Calibrated Logistic Regression trained on mobile scam and transactional notification datasets.
   - Measures social engineering semantic cues and outputs calibrated scam probability and feature attribution tokens.

4. **Layer 4: Threat Intelligence & Brand Spoofing**
   - Compares hostnames against official domains for major institutions (SBI, HDFC, ICICI, Axis, PNB, Paytm, PhonePe, Google, Netflix, Amazon, India Post, Income Tax).
   - Flags unverified domains imitating protected brands.

5. **Layer 5: Scam Kill-Chain Reconstruction**
   - Reconstructs the 5-stage attack timeline:
     - Stage 1: Impersonation
     - Stage 2: Urgency / Fear
     - Stage 3: Suspicious Delivery Vector
     - Stage 4: Credential / Payment Solicitation
     - Stage 5: Potential Loss / Compromise
   - Strict rule: Only flags steps with verified evidence as **OBSERVED**; flags downstream outcomes as **POTENTIAL**.

6. **Layer 6: Multilingual AI Explanation**
   - Generates answers to 3 core questions: *What appears suspicious?*, *Why might it be dangerous?*, and *What should the user do?*
   - Supports English and Hindi (हिन्दी).
   - Directly links to the Indian Cybercrime Coordination Centre (I4C) Helpline **1930** and portal `https://cybercrime.gov.in/`.

---

## 3. Privacy & Zero-Knowledge Guarantees

- **No Server-Side Outbound Fetching (SSRF Prevention)**: ScamShield AI never fetches user-submitted URLs over the internet. Analysis is 100% lexical and structural.
- **In-Memory Buffers**: Screenshots and QR codes are held strictly in RAM memory during extraction.
- **Opt-In Storage**: Scans are never persisted to MongoDB unless the user checks `consentToSave: true`.
- **Sensitive Parameter Redaction**: Pino loggers redact `password`, `otp`, `pin`, `mpin`, and tokens from logs.
