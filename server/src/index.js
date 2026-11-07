// ScamShield AI Backend Server Entry Point
const http = require('http');
const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  logger.error({ err: err?.message || err, stack: err?.stack }, 'Uncaught exception in server process');
});

process.on('unhandledRejection', (reason) => {
  logger.error({ reason: reason?.message || reason }, 'Unhandled rejection in server process');
});

async function startServer() {
  // Connect to MongoDB if URI provided
  if (config.mongoUri) {
    try {
      await mongoose.connect(config.mongoUri);
      logger.info('Connected to MongoDB Atlas database');
    } catch (err) {
      logger.warn({ err: err.message }, 'MongoDB connection failed; running in high-performance in-memory repository mode');
    }
  } else {
    logger.info('Running in zero-config in-memory repository mode (set MONGODB_URI to persist to Atlas)');
  }

  let server = null;

  function tryListen(port, retries = 3) {
    server = http.createServer(app);

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && retries > 0) {
        logger.warn(`Port ${port} is busy or clearing previous sockets. Retrying in 1.5s... (${retries} attempts left)`);
        setTimeout(() => {
          tryListen(port, retries - 1);
        }, 1500);
        return;
      }

      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is occupied by another running process.`);
        logger.error(`To free port ${port}, close other server terminals or run: npm run clean:ports`);
      } else {
        logger.error({ err: err?.message || err }, 'Server listen error');
      }
      process.exit(1);
    });

    server.listen(port, config.host, () => {
      logger.info(`ScamShield AI Server is running on http://${config.host}:${port} [${config.env}]`);
    });
  }

  tryListen(config.port, 3);

  const shutdown = () => {
    logger.info('Shutting down ScamShield AI Server gracefully...');
    if (server) {
      server.close(() => {
        if (mongoose.connection.readyState === 1) {
          mongoose.connection.close(false, () => {
            logger.info('MongoDB connection closed.');
            process.exit(0);
          });
        } else {
          process.exit(0);
        }
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch(err => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
