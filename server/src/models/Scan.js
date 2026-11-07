const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  scanId: { type: String, required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  scanType: { type: String, enum: ['text', 'url', 'image', 'qr'], required: true },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['low', 'caution', 'elevated', 'high', 'inconclusive'], required: true },
  primaryThreat: { type: String, required: true },
  summary: { type: String, required: true },
  detectedSignals: [{
    type: { type: String },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    evidence: { type: String },
    explanation: { type: String },
    source: { type: String }
  }],
  recommendations: [{ type: String }],
  scamChain: [{
    step: { type: String },
    status: { type: String, enum: ['observed', 'potential_outcome', 'not_detected'] },
    detail: { type: String }
  }],
  modelVersion: { type: String, default: '1.0.0' },
  processingTimeMs: { type: Number, default: 0 },
  consentToSave: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
