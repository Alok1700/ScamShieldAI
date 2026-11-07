const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { validateBody } = require('../middleware/validate');
const { scanTextSchema, scanUrlSchema, feedbackSchema } = require('../validators/scanValidators');
const upload = require('../middleware/upload');

// Scanning endpoints
router.post('/text', validateBody(scanTextSchema), scanController.scanText);
router.post('/url', validateBody(scanUrlSchema), scanController.scanUrl);
router.post('/image', upload.single('image'), scanController.scanImage);
router.post('/qr', upload.single('qrImage'), scanController.scanQr);

// Model evaluations for Hackathon judges & Technical View
router.get('/model-evaluations', scanController.getModelEvaluations);

// Scans & Feedback
router.get('/', scanController.listScans);
router.get('/:id', scanController.getScanById);
router.delete('/:id', scanController.deleteScan);
router.post('/:id/feedback', validateBody(feedbackSchema), scanController.submitFeedback);

module.exports = router;
