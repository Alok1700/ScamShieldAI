import urllib.request
import json

def test_api_chain(text, desc):
    req = urllib.request.Request(
        'http://localhost:5000/api/v1/scan/text',
        data=json.dumps({'text': text, 'language': 'en'}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        chain = data.get('scamChain', [])
        print(f"\n=== {desc} ({len(chain)} Stages) ===")
        for s in chain:
            print(f"  {s['stage']} [{s['status'].upper()}]: {s['detail']}")

test_api_chain(
    'WINNER!! As a valued customer you have been selected to receive £900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.',
    'Test 1: Premium Rate Telephone Scam'
)

test_api_chain(
    'Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN immediately at http://sbi-kyc-security.example',
    'Test 2: Banking Phishing with URL'
)

test_api_chain(
    'Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India',
    'Test 3: Legitimate Bank Notification'
)
