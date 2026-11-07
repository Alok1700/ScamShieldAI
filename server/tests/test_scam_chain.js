/**
 * Direct Verification of Scam Kill-Chain Reconstruction Engine.
 */
const { buildScamChain } = require('../src/services/ai/scamChainService');

console.log("==================================================");
console.log(" TESTING SCAM KILL-CHAIN RECONSTRUCTION ENGINE ");
console.log("==================================================");

// Case 1: Banking KYC Phishing (URL entry vector)
const case1 = buildScamChain(
  [
    { type: 'brand_impersonation', evidence: 'State Bank of India', explanation: 'Impersonates official banking institution' },
    { type: 'urgency_account_suspension', evidence: 'suspended within 30 mins', explanation: 'Artificial urgency' },
    { type: 'kyc_pan_credential_demand', evidence: 'submit PAN and OTP', explanation: 'Demands personal credentials' }
  ],
  ['http://sbi-kyc-security.example']
);
console.log("\n[CASE 1: Banking KYC Phishing]");
case1.forEach(s => console.log(`  ${s.stage} [${s.status.toUpperCase()}]: ${s.detail}`));

// Case 2: Premium-Rate Lottery SMS (Telephony callback vector)
const case2 = buildScamChain(
  [
    { type: 'sms_premium_rate_number', evidence: '09061701461', description: 'Identified premium-rate callback line' },
    { type: 'sms_monetary_lure', evidence: '£900', description: 'Financial reward lure' },
    { type: 'sms_urgency_trigger', evidence: 'valid 12 hours', description: 'Time pressure' }
  ],
  []
);
console.log("\n[CASE 2: Premium-Rate Lottery SMS]");
case2.forEach(s => console.log(`  ${s.stage} [${s.status.toUpperCase()}]: ${s.detail}`));

// Case 3: UPI QR Cashback Reverse-Payment Trap
const case3 = buildScamChain(
  [
    { type: 'upi_pin_receive_trap', evidence: 'enter UPI PIN to receive cashback', explanation: 'Reverse payment misconception' }
  ],
  [],
  { payeeVpa: 'cashback-rewards@okaxis', payeeName: 'Prize Distributor', amount: '5000' }
);
console.log("\n[CASE 3: UPI QR Reverse-Payment Trap]");
case3.forEach(s => console.log(`  ${s.stage} [${s.status.toUpperCase()}]: ${s.detail}`));

// Case 4: Benign Legitimate Message
const case4 = buildScamChain([], []);
console.log("\n[CASE 4: Benign Legitimate Message]");
case4.forEach(s => console.log(`  ${s.stage} [${s.status.toUpperCase()}]: ${s.detail}`));
