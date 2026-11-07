# ScamShield AI — Threat Model & Security Architecture

## 1. Threat Landscape & Assumptions
ScamShield AI operates in an untrusted input environment: users paste adversarial messages, submit malicious phishing links, upload deceptive screenshots, and scan unknown QR codes.

| Asset | Threat Agent | Threat Vector | Mitigation Strategy |
|---|---|---|---|
| Backend API Servers | Malicious Actors | Server-Side Request Forgery (SSRF) via user links | **Zero Outbound HTTP Requests**: User URLs are evaluated strictly lexically and structurally. The server never resolves or opens untrusted domains. |
| Server Memory & Disk | Attackers | Malicious Image Uploads / Zip Bombs | File size capped at 10MB; memory-only storage (`multer.memoryStorage`); processed with sandboxed libraries (`tesseract.js`, `jimp`); zero disk persistence. |
| AI / LLM Reasoning | Attackers | Prompt Injection / Jailbreaks | User submissions are treated strictly as UNTRUSTED DATA with strict schema enforcement; generative AI is never granted tool execution or permission to execute code. |
| API Availability | Botnets / Scrapers | Denial of Service (DoS) / Resource Exhaustion | Express Rate Limiting (100 req / 15 min window); payload size limits (2MB JSON, 10MB multipart); strict timeouts on all microservice queries. |
| User Privacy | Third-party interceptors | Credential or OTP Leakage | In-memory processing; sensitive parameters (`password`, `otp`, `pin`, `pan`) redacted from logs; zero-knowledge defaults (no persistent scan history without explicit user consent). |

---

## 2. Defensive Controls Implemented

1. **Helmet Security Headers**:
   - `Content-Security-Policy`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security: max-age=31536000`
2. **SSRF Neutralization**:
   - Outbound network requests to user-provided URLs are architecturally disabled.
   - Domain analysis is performed using RFC-compliant URL parsing and deterministic character inspection.
3. **Punycode & Homograph Detection**:
   - Hostnames containing `xn--` or non-Latin Unicode characters are flagged immediately as potential visual brand impersonation.
4. **Prompt Injection Defense**:
   - Explanations are generated through a strict JSON schema contract. User content cannot override the instruction set or access backend secrets.
