# 🛡️ ScamShield AI 1.0

> **Detect Scams. Understand Risks. Stay Protected.**  
> *Multimodal AI-Powered Fraud Detection & Explainable Cybersecurity Platform*

[![CI](https://github.com/scamshield-ai/scamshield-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/scamshield-ai/scamshield-ai/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Cybersecurity: Explainable-AI](https://img.shields.io/badge/Cybersecurity-Explainable--AI-cyan.svg)]()
[![Languages: EN--HI](https://img.shields.io/badge/Languages-EN%20%7C%20HI-orange.svg)]()

---

## 📌 1. Project Overview & Hackathon Purpose

**ScamShield AI 1.0** is an explainable, multimodal cybersecurity platform engineered to protect digital citizens from social engineering attacks, UPI frauds, electricity disconnection lures, bank impersonation, and phishing URLs.

Designed specifically to satisfy both **everyday internet users** and **technical hackathon evaluators**, ScamShield AI bridges the gap between opaque "black-box" threat scores and actionable, transparent defense intelligence.

### Dual-Audience Architecture

```text
                               +----------------------------------+
                               |     ScamShield AI 1.0 Core       |
                               +----------------------------------+
                                                |
                       +------------------------+------------------------+
                       |                                                 |
                       v                                                 v
         [ 👤 Simple Everyday View ]                     [ 🔬 Technical Evaluator View ]
   - Threat Level Badge & Plain Guidance            - Calibrated Probability vs Scaled Risk Score
   - Category A: Direct Highlighted Evidence        - Category B: Signed Feature Weights (+ / -)
   - 5-Stage Kill-Chain (Interactive Spans)         - Pipeline Statuses: completed / skipped
   - "I've Already Been Scammed" Recovery           - Model Confusion Matrices & Latency (ms)
   - Bilingual: English, हिन्दी                     - Anti-Double-Counting Scoring Breakdown
```

1. **Everyday Users (Clear & Actionable):**
   - Clean, friendly guidance answering: *Is it dangerous? Why? What should I do next?*
   - Exact text highlights showing only true malicious phrases (no confusing ordinary words like "to" or "your").
   - Immediate **"I've Already Been Scammed"** recovery modal with the critical **2-hour golden window**, Indian Cyber Helpline **1930** dialer, bank freeze protocol, and warnings against secondary "recovery scams".
   - Full bilingual support: **English** and **हिन्दी (Hindi)**.

2. **Hackathon Judges & Technical Evaluators (Rigorous & Verifiable):**
   - Direct access to live **scikit-learn inference** with bidirectional feature contributions (`direction: "scam"` vs `direction: "legitimate"`).
   - Real, backend-driven pipeline telemetry with honest execution statuses (`completed`, `skipped`, `unavailable`) — never fake checkmarks.
   - Transparent scoring breakdown modal showing diminishing-utility subscores and mitigations.
   - Model Evaluation Inspector with confusion matrices, test sample sizes, and honest limitation disclosures.
   - 1-Click demo launcher for instant evaluation across 3 realistic threat scenarios without typing or authentication.

---

## 🎯 2. ScamShield AI 1.0 Core Innovations

### 1. 🏷️ 3-Tier Evidence Classification Taxonomy
Unlike primitive scanners that label ordinary conjunctions or prepositions as malicious:
- **Category A — Directly Observed Security Evidence:** Exact text snippets identified by deterministic rules (e.g., *"Share your OTP"*, *"Electricity power disconnection tonight"*, *"UPI PIN to claim"*). Rendered with interactive character-offset spans linking directly to the submitted message.
- **Category B — Statistical Model Signals:** Machine learning tokens with signed contributions (`+` pushing toward scam, `-` pushing toward ham), clear directionality, and an explicit disclaimer noting they represent statistical correlations rather than proven facts.
- **Category C — Potential Threat Outcomes:** Explicitly tagged as `[POTENTIAL OUTCOME]` (e.g., *Financial Debit*, *Account Compromise*), preventing users or evaluators from confusing risk forecasts with past events.

### 2. 🧮 Bounded Diminishing-Utility Risk Aggregation
Additive scoring often leads to false "100/100" alarms when multiple minor warnings pile up. ScamShield AI uses a bounded multi-attribute utility fusion algorithm with diminishing returns:
$$\text{Score} = \min\left(100, \, R_{\text{diminishing}} + W_{\text{ML}} \cdot P_{\text{calibrated}} + W_{\text{URL}} \cdot S_{\text{URL}} - M_{\text{mitigations}}\right)$$
$$\text{where } R_{\text{diminishing}} = \sum_{i} w_i \times 0.5^i \quad (\text{capped at 60})$$
This ensures that independent rule triggers cannot artificially saturate the score, while cleanly distinguishing between the **Application Risk Score (0-100)** and the **Model Statistical Probability (0.0% - 100.0%)**.

### 3. ⛓️ 5-Stage Scam Kill-Chain with Interactive Text Spans
Maps the attack anatomy across 5 chronological stages:
1. **Stage 1: Impersonation / Trust Exploitation** (e.g., SBI, Electricity Board)
2. **Stage 2: Psychological Manipulation / Urgency** (e.g., disconnection tonight at 9:30 PM)
3. **Stage 3: Redirection / Delivery Vector** (e.g., phishing domain, APK link, phone number)
4. **Stage 4: Credential / Payment Solicitation** (e.g., OTP request, UPI PIN entry)
5. **Stage 5: Potential Financial Harm** (`POTENTIAL OUTCOME`: unauthorized debit, credential theft)

Clicking any stage in the kill-chain or evidence section highlights the exact corresponding text span in the original submitted content.

### 4. 🚨 Emergency "I've Already Been Scammed" Recovery Guidance
A dedicated crisis-response modal giving victims immediate step-by-step assistance:
- **The 2-Hour Golden Window:** Why dialing **1930** immediately allows Indian law enforcement to freeze funds in the nodal banking pipeline before cashout.
- **Emergency Banking Actions:** Immediate hotlisting of cards, netbanking lock, and SIM swap checks.
- **UTR Evidence Preservation:** How to collect Unique Transaction Reference numbers and screenshot headers for official cybercrime FIRs.
- **Anti-Recovery Scam Warning:** Proactively warns victims that third parties on Telegram or Instagram claiming they can "hack back" lost money are secondary scammers.
- **Honest Advisory:** Clearly clarifies that while freezing funds is possible within the golden window, recovery is not 100% guaranteed.

### 5. 🌐 Comprehensive Bilingual Localization
Fully localized for English and Hindi (हिन्दी), ensuring that critical cyber defense guidance is understood across linguistic demographics in India.

---

## 🏗️ 3. System Architecture

```text
                   USERS & EVALUATORS (Web / Mobile Browser)
                                      |
                                      v
                   REACT 19 + VITE FRONTEND (Tailwind CSS)
                 - Simple Mode (Plain English / Hindi)
                 - Technical Evaluator Mode (Weights, Latencies, Spans)
                 - 1-Click Judge Demo Scenarios (No Login Required)
                                      |  (HTTP REST / JSON / Multipart)
                                      v
                      NODE.JS / EXPRESS 4 API GATEWAY
             (Helmet, Rate-Limiter, Zod Validation, Pino Redaction)
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
    Text/URL Pipeline           OCR/QR Extraction            MongoDB Atlas
  (Regex, Lexical URL)        (Tesseract.js, jsQR)       (Consent-based Audit)
         |                            |
         +-------------+--------------+
                       |
                       v
         Unified Detection Engine & Evaluator
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
 Deterministic      FastAPI ML     Threat Intel
 Security Rules    Microservice     Heuristics
 (Urgency, UPI)   (TF-IDF LogReg)  (Brand Feeds)
        |              |              |
        +--------------+--------------+
                       |
                       v
          Evidence Aggregator & Scoring Fusion
          - Category A: Directly Observed Evidence (with offsets)
          - Category B: Statistical Signals (signed contributions)
          - Category C: Potential Outcomes
          - Diminishing returns utility fusion (no double-counting)
                       |
                       v
            Standardized JSON API Output
```

---

## 📊 4. Machine Learning & Model Performance

ScamShield AI utilizes specialized scikit-learn models trained on curated, verified datasets with zero data leakage:

### Model 1: SMS & Text Social Engineering Classifier (`sms_model.joblib`)
- **Dataset Size:** 5,572 authentic SMS records (ham & spam).
- **Architecture:** Sublinear TF-IDF Vectorizer + Calibrated Logistic Regression.
- **Mitigation:** Strict stopword filtering to prevent everyday words (`to`, `your`, `in`) from receiving malicious weights.
- **Precision:** `100.0%` (0.0% false alarm rate on genuine banking alerts).
- **Recall:** `88.9%`
- **ROC-AUC:** `0.963`
- **Avg Inference Latency:** `0.08 ms`

### Model 2: Phishing URL Classifier (`url_model.joblib`)
- **Dataset Size:** 11,424 URLs (verified phishing and benign domains).
- **Architecture:** 14 lexical & structural features (Punycode, entropy, homoglyphs, token counts).
- **Precision:** `99.8%`
- **Recall:** `92.4%`
- **Avg Inference Latency:** `0.22 ms`

### Model 3: UPI & QR Fraud Analyzer
- **Dataset Size:** 10,000 synthetic & real UPI QR payloads.
- **Rule Core:** Zero-trust UPI URI scheme parser (`upi://pay`). Detects reverse payment traps where scammers send pay requests disguised as refunds.

> [!NOTE]
> Detailed evaluation metrics, confusion matrices, and mitigation notes are available via `GET /api/v1/scan/model-evaluations` or by clicking the **"Model Performance & Methodology"** button on the Technical View results page.

---

## 🔒 5. Privacy & Security by Design

1. **Zero Outbound HTTP Probing (SSRF Defense):** ScamShield AI never fetches user-submitted URLs over the internet. Analysis is 100% lexical and offline.
2. **In-Memory Buffers:** Screenshots and QR codes are processed entirely in RAM and immediately garbage-collected. No uploaded images are saved to disk.
3. **No Mandatory Login:** Anyone can scan immediately without barriers.
4. **Consent-Based Audit Trail:** Scans are only persisted to the database if the user explicitly checks the consent option.
5. **Sensitive Parameter Redaction:** Passwords, OTPs, PAN numbers, and UPI PINs are scrubbed from all server logs.
6. **Prompt Injection Shield:** User submissions are treated strictly as untrusted data; generative AI cannot invoke tools or execute backend commands.

---

## 🛠️ 6. Quick Start & Local Setup

### Prerequisites
- **Node.js:** v18+ (v20+ recommended)
- **Python:** v3.10+ (v3.11 recommended)
- **npm:** v9+

### 1. Clone the repository
```bash
git clone https://github.com/scamshield-ai/scamshield-ai.git
cd scamshield-ai
```

### 2. Install Dependencies
```bash
# Install root, backend server, and frontend client dependencies
npm run install:all

# Install Python ML service dependencies
cd ml-service
pip install -r requirements.txt
cd ..
```

### 3. Start the Application
Run all services concurrently:
```bash
# Terminal 1: Launch FastAPI ML Service (Port 8000)
npm run dev:ml

# Terminal 2: Launch Express API Server (Port 5000)
npm run dev:server

# Terminal 3: Launch React Vite Frontend (Port 5174 or 5173)
npm run dev:client
```

Open your browser at **`http://localhost:5174`** (or `5173`).

---

## 🧪 7. Automated Verification & Validation Suite

ScamShield AI includes a 10-point automated end-to-end verification suite covering the entire detection pipeline:

```bash
npm run test:validation
```

### Verified Test Cases:
| Test ID | Scenario | Expected Outcome | Status |
|---|---|---|---|
| `TEST-01` | Phishing SMS with OTP Demand | Score > 75 (High/Critical), Observed OTP Evidence | ✅ PASS |
| `TEST-02` | Legitimate Bank Balance Alert | Score < 25 (Low/Safe), No false evidence | ✅ PASS |
| `TEST-03` | Suspicious Botnet Phishing URL | Score > 70 (High/Critical), Lexical flags | ✅ PASS |
| `TEST-04` | Benign Legitimate Domain | Score < 30 (Low/Safe) | ✅ PASS |
| `TEST-05` | UPI "PIN to Receive" Cashback Trap | Score > 70, Category A UPI Trap detected | ✅ PASS |
| `TEST-06` | Input Validation: Empty Text | Returns HTTP 400 Bad Request | ✅ PASS |
| `TEST-07` | Input Validation: Malformed URL | Returns HTTP 400 Bad Request | ✅ PASS |
| `TEST-08` | Pipeline Execution Honesty | URL extraction marked `skipped` when no URL in text | ✅ PASS |
| `TEST-09` | Model Evaluation Inspector Endpoint | Returns valid SMS & URL evaluation metrics | ✅ PASS |
| `TEST-10` | Hindi Typography & Unicode Safety | Correctly parses Devanagari electricity alert | ✅ PASS |

To run the standard unit and integration test suites:
```bash
# Run server Jest integration tests
npm run test:server

# Run client production build check
npm run build:client
```

---

## 🎮 8. 1-Click Hackathon Evaluator Scenarios

On the Scanner page (`/scanner`), evaluators can click any of the 3 pre-configured demo scenarios in the top banner:

1. **⚡ Electricity Cutoff SMS (Discom Phishing):**
   - *Message:* `"Electricity power disconnection alert tonight at 9:30 PM due to unpaid bill. Call officer at 9876543210 immediately."`
   - *Evaluates:* Psychological urgency detection, unauthorized officer phone number harvesting, Category A evidence extraction, and 5-stage kill-chain.
2. **💸 UPI "PIN to Receive" Cashback Trap:**
   - *Message:* `"You won Rs 5,000 PhonePe cashback. Scan QR code and enter UPI PIN to claim money directly to bank."`
   - *Evaluates:* High-risk reverse UPI payment trap detection, education on debit vs credit UPI PIN mechanics.
3. **🏦 Authentic Bank Alert (Legitimate Ham):**
   - *Message:* `"INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - SBI"`
   - *Evaluates:* False-positive suppression, legitimate classification, clean low-risk indicator display.

---

## 📁 9. Project Structure

```text
scamshield-ai/
|-- client/                    # React 19 + Vite + Tailwind CSS frontend
|   |-- src/
|   |   |-- components/        # RiskScoreGauge, ScamChainGraph, EvidenceSection,
|   |   |                      # TechnicalViewInspector, WhyThisScoreModal,
|   |   |                      # RecoveryGuidanceModal, ModelEvaluationModal
|   |   |-- pages/             # Landing, Scanner, Results, Awareness, History
|   |   |-- store/             # Zustand global scan state
|   |   |-- utils/             # i18n dictionary (en, hi), reportLocalizer
|   |   |-- services/          # Axios REST API client
|
|-- server/                    # Express REST API & Security Detection Engine
|   |-- src/
|   |   |-- controllers/       # Scan, OCR, QR, and Assistant controllers
|   |   |-- routes/            # /api/v1/scan routes (/text, /url, /image, /qr, /model-evaluations)
|   |   |-- services/          # textAnalyzer, urlAnalyzer, riskAggregator, scamChainService
|   |   |-- validators/        # Zod request schemas with trimming and regex
|   |   |-- models/            # Mongoose schemas + in-memory repository fallback
|   |-- tests/                 # Jest tests + validation_suite.js
|
|-- ml-service/                # FastAPI Machine Learning Service
|   |-- app/                   # FastAPI routes, schemas, inference with signed weights
|   |-- models/                # sms_model.joblib, url_model.joblib, metrics JSON files
|   |-- training/              # Training scripts and benchmark evaluators
|
|-- docs/                      # Architecture, API, threat model, and demo documentation
|-- package.json               # Root scripts (dev, test, validation, build)
|-- README.md
|-- LICENSE
```

---

## 📜 10. License & Emergency Disclaimer

Released under the **MIT License**.

*Disclaimer: ScamShield AI provides heuristic risk assessments combining trained machine learning models, lexical feature analysis, and deterministic cybersecurity rules. Automated scanners cannot guarantee absolute detection. Never disclose passwords, OTPs, or enter UPI PINs on unverified requests. If financial fraud occurs in India, call National Helpline 1930 immediately.*
