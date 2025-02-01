require('dotenv').config();
const connectDB = require('./config/db');
const { createApp } = require('./app');
const logger = require('./utils/logger');

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Create and configure Express app
    const app = createApp();
    const PORT = process.env.PORT || 5000;

    // Start server
    const server = app.listen(PORT, () => {
      logger.debug(`Server running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.debug('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.debug('HTTP server closed');
      });
    });

    return server;
  } catch (error) {
    logger.critical('Failed to start server', error);
    process.exit(1);
  }
};

// Export for testing
module.exports = { startServer };

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

