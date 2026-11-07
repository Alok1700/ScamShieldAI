const mongoose = require('mongoose');

const ScanFeedbackSchema = new mongoose.Schema({
  scanId: { type: String, required: true, index: true },
  feedbackType: { type: String, enum: ['accurate', 'false_positive', 'false_negative', 'unclear'], required: true },
  comment: { type: String, maxlength: 1000 },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.ScanFeedback || mongoose.model('ScanFeedback', ScanFeedbackSchema);
