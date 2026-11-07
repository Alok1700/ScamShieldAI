import urllib.request
import json

def test_scan(text, lang):
    req = urllib.request.Request(
        'http://localhost:5000/api/v1/scan/text',
        data=json.dumps({'text': text, 'language': lang}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode())
        print(f"\n=== Lang: {lang} | Threat: {d['primaryThreat']} | Risk: {d['riskScore']} ===")
        print("Summary:", d['summary'])

test_scan(
    'Badhai ho! Aapko mila hai PhonePe 5,000 rupaye cashback. Claim karne ke liye QR scan karein aur apna UPI PIN dalein.',
    'hi'
)

test_scan(
    'Aapka SBI account block ho gaya hai. Turant KYC update karein nahi to account band ho jayega: http://sbi-kyc.example',
    'en'
)
