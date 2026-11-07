const mongoose = require('mongoose');

const ThreatPatternSchema = new mongoose.Schema({
  category: { type: String, required: true },
  pattern: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  version: { type: String, default: '1.0.0' },
  enabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.ThreatPattern || mongoose.model('ThreatPattern', ThreatPatternSchema);
