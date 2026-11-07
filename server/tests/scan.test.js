const request = require('supertest');
const app = require('../src/app');

describe('ScamShield AI - Security API Integration Tests', () => {

  describe('GET /api/v1/health & /api/v1/ready', () => {
    it('returns healthy status and version', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('healthy');
      expect(res.body.version).toBeDefined();
    });

    it('returns readiness report with module availability', async () => {
      const res = await request(app).get('/api/v1/ready');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('ready');
      expect(res.body.dependencies.rulesEngine).toBe(true);
    });
  });

  describe('POST /api/v1/scan/text', () => {
    it('accurately detects high-risk banking impersonation and OTP harvesting', async () => {
      const sample = {
        text: 'Dear customer, your SBI account is temporarily suspended. Submit OTP and PAN information immediately at https://sbi-kyc-security.example',
        language: 'en'
      };

      const res = await request(app)
        .post('/api/v1/scan/text')
        .send(sample);

      expect(res.statusCode).toEqual(200);
      expect(res.body.riskLevel).toBe('high');
      expect(res.body.riskScore).toBeGreaterThanOrEqual(75);
      expect(res.body.primaryThreat).toMatch(/phishing|impersonation/);
      expect(res.body.detectedSignals.length).toBeGreaterThan(0);
      expect(res.body.recommendations.length).toBeGreaterThan(0);
      expect(res.body.scamChain.length).toEqual(5);
    });

    it('returns low risk on benign legitimate transactional message', async () => {
      const benignSample = {
        text: 'Dear Customer, INR 5,000.00 credited to your A/C XX1234 on 05-Nov-2026 by NEFT. Available balance is INR 28,450.50. - State Bank of India',
        language: 'en'
      };

      const res = await request(app)
        .post('/api/v1/scan/text')
        .send(benignSample);

      expect(res.statusCode).toEqual(200);
      expect(res.body.riskLevel).toBe('low');
      expect(res.body.riskScore).toBeLessThan(35);
    });

    it('identifies UPI PIN trap ("Enter PIN to receive cashback")', async () => {
      const upiSample = {
        text: 'Congratulations! You won Rs 5000 cashback. Scan QR and enter your UPI PIN to claim reward directly into your bank.',
        language: 'en'
      };

      const res = await request(app)
        .post('/api/v1/scan/text')
        .send(upiSample);

      expect(res.statusCode).toEqual(200);
      expect(res.body.riskScore).toBeGreaterThanOrEqual(50);
      expect(res.body.primaryThreat).toEqual('upi_payment_fraud');
      const upiSignal = res.body.detectedSignals.find(s => s.type === 'upi_pin_receive_trap');
      expect(upiSignal).toBeDefined();
    });

    it('rejects empty text with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/scan/text')
        .send({ text: '' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual('Validation failed');
    });
  });

  describe('POST /api/v1/scan/url', () => {
    it('flags brand spoofing with non-official domain', async () => {
      const res = await request(app)
        .post('/api/v1/scan/url')
        .send({ url: 'http://sbi-kyc-verification.top/login' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.riskScore).toBeGreaterThanOrEqual(60);
      const brandSig = res.body.detectedSignals.find(s => s.type === 'brand_impersonation');
      expect(brandSig).toBeDefined();
    });

    it('detects Punycode lookalike domain', async () => {
      const res = await request(app)
        .post('/api/v1/scan/url')
        .send({ url: 'https://xn--appl-43d.com/login' });

      expect(res.statusCode).toEqual(200);
      const punySig = res.body.detectedSignals.find(s => s.type === 'punycode_domain');
      expect(punySig).toBeDefined();
    });

    it('detects IP-address hostname in URL', async () => {
      const res = await request(app)
        .post('/api/v1/scan/url')
        .send({ url: 'http://192.168.1.100/admin-login' });

      expect(res.statusCode).toEqual(200);
      const ipSig = res.body.detectedSignals.find(s => s.type === 'ip_address_host');
      expect(ipSig).toBeDefined();
    });

    it('handles malformed URLs gracefully without crashing', async () => {
      const res = await request(app)
        .post('/api/v1/scan/url')
        .send({ url: 'http://::invalid::url' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.detectedSignals.some(s => s.type === 'malformed_url')).toBe(true);
    });
  });

  describe('QR Payload & Quishing ML Classifier', () => {
    const { aggregateScan } = require('../src/services/scanning/riskAggregator');

    it('accurately classifies malicious QR payload with trained QR ML classifier', async () => {
      const res = await aggregateScan({
        scanType: 'qr',
        text: 'http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe',
        directUrl: 'http://malw.esalesin.com/yuop/66cf5fb9ac3ce_xin.exe',
        language: 'en'
      });

      expect(res.status).toEqual('completed');
      expect(res.scanType).toEqual('qr');
      expect(res.riskLevel).toMatch(/high|elevated/);
      expect(res.riskScore).toBeGreaterThanOrEqual(60);
      expect(res.detectedSignals.some(s => s.type.includes('qr') || s.type.includes('url') || s.type.includes('malware'))).toBe(true);
      expect(res.explanation.summary).toBeDefined();
    });

    it('evaluates benign QR URL payload accurately', async () => {
      const res = await aggregateScan({
        scanType: 'qr',
        text: 'https://www.aboutaberdeen.com',
        directUrl: 'https://www.aboutaberdeen.com',
        language: 'en'
      });

      expect(res.status).toEqual('completed');
      expect(res.scanType).toEqual('qr');
      expect(res.riskLevel).toMatch(/low|caution/);
      expect(res.riskScore).toBeLessThan(40);
    });
  });

  describe('Scan History & Feedback API', () => {
    it('saves scan when consentToSave is true and retrieves it', async () => {
      const scanRes = await request(app)
        .post('/api/v1/scan/text')
        .send({
          text: 'Electricity power disconnection alert tonight at 9:30 PM call 9876543210',
          consentToSave: true
        });

      expect(scanRes.statusCode).toEqual(200);
      const scanId = scanRes.body.scanId;

      // Fetch scan by ID
      const getRes = await request(app).get(`/api/v1/scan/${scanId}`);
      expect(getRes.statusCode).toEqual(200);
      expect(getRes.body.scanId).toEqual(scanId);

      // Submit feedback
      const fbRes = await request(app)
        .post(`/api/v1/scan/${scanId}/feedback`)
        .send({ feedbackType: 'accurate', comment: 'Correctly identified power scam' });
      expect(fbRes.statusCode).toEqual(201);

      // Delete scan
      const delRes = await request(app).delete(`/api/v1/scan/${scanId}`);
      expect(delRes.statusCode).toEqual(200);
    });
  });
});
