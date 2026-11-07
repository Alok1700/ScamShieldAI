const express = require('express');
const router = express.Router();
const { checkMlHealth } = require('../services/ai/mlClient');

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'scamshield-ai-server',
    version: '1.0.0'
  });
});

router.get('/ready', async (req, res) => {
  const mlAvailable = await checkMlHealth();
  res.status(200).json({
    status: 'ready',
    dependencies: {
      rulesEngine: true,
      urlAnalyzer: true,
      mlService: mlAvailable,
      ocrEngine: true,
      qrDecoder: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
