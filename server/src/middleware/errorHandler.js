const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error({
    err: err.message,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  }, 'Unhandled request error');

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Uploaded file exceeds the maximum allowed size of 10MB' });
    }
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred while processing your security scan'
    : err.message || 'Internal server error';

  return res.status(statusCode).json({
    error: message,
    statusCode
  });
}

module.exports = errorHandler;
