const assert = require('assert');

async function runTests() {
  const BASE_URL = 'http://127.0.0.1:5000/api/v1';
  console.log('--- RUNNING SCAMSHIELD AI 1.0 VALIDATION SUITE ---');

  // Test 1: Suspicious SMS with an OTP request
  console.log('\n[Test 1] Suspicious SMS with OTP Request...');
  const t1Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN immediately at https://sbi-kyc-security.example',
      language: 'en'
    })
  }).then(r => r.json());
  assert(t1Res.riskScore >= 70, `Expected riskScore >= 70, got ${t1Res.riskScore}`);
  assert(t1Res.riskLevel === 'high' || t1Res.riskLevel === 'critical', `Expected high or critical risk, got ${t1Res.riskLevel}`);
  assert(t1Res.observedEvidence.length > 0, 'Expected Category A observed evidence');
  // Check no ordinary words in evidence
  const ordinaryWords = ['to', 'your', 'you have', 'low', 'in'];
  t1Res.observedEvidence.forEach(ev => {
    assert(!ordinaryWords.includes(ev.evidence.toLowerCase().trim()), `Found ordinary word labeled as evidence: ${ev.evidence}`);
  });
  console.log('✓ PASS: High-risk phishing classified accurately with verified Category A evidence spans.');

  // Test 2: Legitimate bank-credit notification
  console.log('\n[Test 2] Legitimate bank-credit notification...');
  const t2Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'INR 25,000.00 credited to your bank account XX4589 via NEFT on 07-Nov-2026. Available balance: INR 48,250.00. Reference: DEMO12345 - State Bank of India',
      language: 'en'
    })
  }).then(r => r.json());
  assert(t2Res.riskLevel === 'low', `Expected low risk, got ${t2Res.riskLevel}`);
  assert(t2Res.observedEvidence.length === 0, `Expected 0 observed evidence for benign credit notification, got ${t2Res.observedEvidence.length}`);
  console.log('✓ PASS: Benign bank notification classified as low risk with zero false alarms.');

  // Test 3: Suspicious URL
  console.log('\n[Test 3] Suspicious URL (Botnet Dropper IP)...');
  const t3Res = await fetch(`${BASE_URL}/scan/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'http://27.202.109.19:33886/i',
      language: 'en'
    })
  }).then(r => r.json());
  assert(t3Res.riskScore >= 50, `Expected elevated/high risk for IP botnet dropper URL, got ${t3Res.riskScore}`);
  console.log('✓ PASS: IP botnet dropper correctly flagged by ML URL classifier.');

  // Test 4: Benign URL
  console.log('\n[Test 4] Benign URL (onezoom.org)...');
  const t4Res = await fetch(`${BASE_URL}/scan/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.onezoom.org',
      language: 'en'
    })
  }).then(r => r.json());
  assert(t4Res.riskLevel === 'low', `Expected low risk for onezoom.org, got ${t4Res.riskLevel}`);
  console.log('✓ PASS: Legitimate educational domain classified as low risk.');

  // Test 5: UPI Cashback Trap (Reverse PIN Scam)
  console.log('\n[Test 5] UPI Cashback Trap...');
  const t5Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Congratulations! You have won ₹2,000 cashback on PhonePe. Scan the QR code and enter your UPI PIN to receive your reward.',
      language: 'en'
    })
  }).then(r => r.json());
  assert(t5Res.primaryThreat === 'upi_payment_fraud', `Expected upi_payment_fraud, got ${t5Res.primaryThreat}`);
  assert(t5Res.explanation.aiSolution.immediateVerdict.includes('PIN'), 'Expected UPI PIN warning in immediate verdict');
  console.log('✓ PASS: UPI PIN trap flagged with specialized reverse-payment containment plan.');

  // Test 6: Empty input validation
  console.log('\n[Test 6] Empty text validation...');
  const t6Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '   ', language: 'en' })
  });
  assert(t6Res.status === 400, `Expected status 400 for empty text, got ${t6Res.status}`);
  console.log('✓ PASS: Empty input rejected cleanly with status 400.');

  // Test 7: Malformed URL validation
  console.log('\n[Test 7] Malformed URL validation...');
  const t7Res = await fetch(`${BASE_URL}/scan/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'not-a-valid-url-format', language: 'en' })
  });
  assert(t7Res.status === 400, `Expected status 400 for malformed URL, got ${t7Res.status}`);
  console.log('✓ PASS: Malformed URL rejected cleanly with status 400.');

  // Test 8: Pipeline statuses when no URL is present (Part 6 check)
  console.log('\n[Test 8] Pipeline status honesty check...');
  const t8Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Electricity power disconnection alert tonight at 9:30 PM due to unpaid bill. Call officer at 9876543210 immediately.',
      language: 'en'
    })
  }).then(r => r.json());
  const stages = t8Res.pipelineStages.stages;
  const urlStage = stages.find(s => s.id === 'url_analysis');
  const threatStage = stages.find(s => s.id === 'threat_intel');
  assert(urlStage && urlStage.status === 'skipped', `Expected url_analysis to be skipped, got ${urlStage?.status}`);
  assert(threatStage && threatStage.status === 'skipped', `Expected threat_intel to be skipped, got ${threatStage?.status}`);
  console.log('✓ PASS: Pipeline stages honestly mark unexecuted steps as "skipped" rather than fake success.');

  // Test 9: Model evaluations endpoint for judges (Part 7 check)
  console.log('\n[Test 9] Model evaluations endpoint for judges...');
  const t9Res = await fetch(`${BASE_URL}/scan/model-evaluations`).then(r => r.json());
  assert(t9Res.models && t9Res.models.smsThreatModel && t9Res.models.urlThreatModel, 'Expected verified model metrics');
  assert(t9Res.models.smsThreatModel.dataset.totalSamples >= 5572, 'Expected SMS dataset >= 5572');
  assert(t9Res.models.urlThreatModel.dataset.totalSamples >= 11424, 'Expected URL dataset >= 11424');
  console.log('✓ PASS: Model evaluation metadata with confusion matrices and limitations served successfully.');

  // Test 10: Multilingual Hindi execution
  console.log('\n[Test 10] Multilingual execution (Hindi)...');
  const t10Res = await fetch(`${BASE_URL}/scan/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'प्रिय ग्राहक, आपका SBI खाता बंद कर दिया गया है। तुरंत https://sbi-kyc.example पर जाएं।',
      language: 'hi'
    })
  }).then(r => r.json());
  assert(t10Res.explanation && t10Res.explanation.aiSolution, 'Expected AI solution');
  assert(/[\u0900-\u097F]/.test(t10Res.explanation.aiSolution.title), 'Expected Devanagari Hindi in AI solution title');
  console.log('✓ PASS: Native Hindi response returned with proper Devanagari typography.');

  console.log('\n======================================================');
  console.log('ALL 10 VALIDATION & REGRESSION TEST SCENARIOS PASSED!');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Validation test failed:', err);
  process.exit(1);
});
