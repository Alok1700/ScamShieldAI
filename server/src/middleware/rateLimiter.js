const rateLimit = require('express-rate-limit');
const config = require('../config');

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: process.env.NODE_ENV === 'test' ? 1000 : config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many scan requests from this IP address. Please wait a few moments before trying again.',
    retryAfterMinutes: Math.round(config.rateLimitWindowMs / 60000)
  }
});

module.exports = limiter;
