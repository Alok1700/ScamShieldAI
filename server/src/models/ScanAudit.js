const mongoose = require('mongoose');

const ScanAuditSchema = new mongoose.Schema({
  scanId: { type: String, required: true, index: true },
  scanType: { type: String, required: true },
  processingStatus: { type: String, enum: ['success', 'partial', 'failed'], default: 'success' },
  moduleAvailability: {
    mlService: { type: Boolean, default: false },
    rulesEngine: { type: Boolean, default: true },
    threatIntel: { type: Boolean, default: false },
    llmExplainer: { type: Boolean, default: false },
    ocrEngine: { type: Boolean, default: false },
    qrEngine: { type: Boolean, default: false }
  },
  processingTimeMs: { type: Number, default: 0 },
  errorSummary: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.models.ScanAudit || mongoose.model('ScanAudit', ScanAuditSchema);
