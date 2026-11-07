const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const config = require('./config');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const scanRoutes = require('./routes/scanRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev, allow origins for testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing with strict limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Logging (excluding health checks to avoid log spam)
app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url.startsWith('/api/v1/health') || req.url.startsWith('/api/v1/ready')
  }
}));

// Global Rate Limiting
app.use('/api/', rateLimiter);

// API Routes
app.use('/api/v1/scan', scanRoutes);
app.use('/api/v1', healthRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'ScamShield AI REST API',
    tagline: 'Detect Scams. Understand Risks. Stay Protected.',
    version: '1.0.0',
    docs: '/api/v1/health'
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} not found` });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;
