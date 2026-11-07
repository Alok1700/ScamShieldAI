const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  safeBrowsingApiKey: process.env.SAFE_BROWSING_API_KEY || '',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
};

module.exports = config;
