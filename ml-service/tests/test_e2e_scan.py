import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:5000/api/v1/scan/text',
    data=json.dumps({
        'text': 'WINNER!! As a valued network customer you have been selected to receivea £900 prize reward! To claim call 09061701461. Claim code KL341. Valid 12 hours only.',
        'language': 'en'
    }).encode(),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print('=== ScamShield AI Scan Result ===')
        print('Status:', data.get('status'))
        print('Risk Level:', data.get('riskLevel'), f"({data.get('riskScore')}/100)")
        print('Primary Threat:', data.get('primaryThreat'))
        print('Summary:', data.get('summary'))
        print('\n--- ML Insights ---')
        ml = data.get('mlInsights') or {}
        print('Model Version:', ml.get('modelVersion'))
        print('Dataset Size:', ml.get('datasetSize'))
        print('Scam Probability:', ml.get('scamProbability'))
        print('Indicative Tokens:', ml.get('indicativeTokens'))
        print('SMS Signals:', ml.get('smsSignals'))
        print('\n--- Detected Evidence Signals ---')
        for sig in data.get('detectedSignals', []):
            print(f"[{sig.get('severity', '').upper()}] {sig.get('type')}: {sig.get('evidence')} -> {sig.get('explanation')}")
        print('\n--- Recommendations ---')
        for r in data.get('recommendations', []):
            print('-', r)
except Exception as e:
    print('Error:', e)
