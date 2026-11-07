# ScamShield AI — Product Demonstration Script

This script is structured for live product walkthroughs and evaluations.

---

## Scenario 1: Banking KYC Phishing Message
**Input:**
```text
Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example
```
**Demonstration Steps:**
1. Open ScamShield AI Landing Page (`http://localhost:5173`).
2. Click the preset card: **Banking KYC Phishing**.
3. Point out the Threat Intelligence Pipeline animation progressing through content extraction, URL parsing, rules, and ML inference.
4. On the Results Page, highlight:
   - **Risk Score:** 85/100 (High Risk)
   - **Observable Evidence:** Urgency suspension threat, direct OTP demand, unverified domain simulating State Bank of India.
   - **Scam Kill-Chain:** Impersonation (Observed) -> Urgency (Observed) -> Link Vector (Observed) -> OTP Demand (Observed) -> Account Takeover (Potential).
   - **Action Steps:** Immediate recommendation to contact bank via verified channels and dial 1930 if compromised.

---

## Scenario 2: Electricity Bill Disconnection SMS
**Input:**
```text
Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210. Thank you.
```
**Demonstration Steps:**
1. Paste message into Message Scanner.
2. Hit **Analyze for Threats**.
3. Highlight that ScamShield AI flags the specific discom disconnection threat pattern, explaining that discoms never issue urgent cutoff SMS with personal contact numbers.

---

## Scenario 3: UPI "PIN to Receive Cashback" Fraud
**Input:**
```text
You have received a payment of Rs 10,000 from PayTM Cashback. Scan this QR code and enter your UPI PIN to claim your refund directly into your bank.
```
**Demonstration Steps:**
1. Run scan on the UPI message.
2. Highlight the prominent **UPI PIN Warning**: Explain that typing a UPI PIN is strictly for debiting funds, never receiving funds.

---

## Scenario 4: Legitimate Bank Notification (Low Risk Validation)
**Input:**
```text
Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India
```
**Demonstration Steps:**
1. Paste the authentic credit alert into Message Scanner.
2. Note the **Low Risk** assessment (Score < 30/100).
3. Demonstrate that ScamShield AI avoids false alarms and alarm fatigue while responsibly disclosing that no automated scanner can guarantee 100% safety.

---

## Scenario 5: Multilingual Support (Hindi)
**Demonstration Steps:**
1. Open the floating **AI Security Assistant** drawer.
2. Toggle language to **हिन्दी (Hindi)**.
3. Ask: *"Kya UPI PIN daalne se cashback milta hai?"*
4. Show the instant, clear Hindi explanation that UPI PIN is only for sending money, accompanied by India's National Helpline 1930.
