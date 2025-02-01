const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const logger = require('./utils/logger');

const createApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());

  // Log incoming requests in development
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      logger.debug('Incoming request', {
        method: req.method,
        path: req.path,
        body: req.body,
        query: req.query
      });
      next();
    });
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);

  // Test route
  app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    logger.error('Error handling middleware', { 
      error: err.message,
      stack: err.stack 
    });
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  });

  // Handle 404 routes
  app.use((req, res) => {
    logger.debug('Route not found', { path: req.path });
    const error = AppError.notFound('Route not found');
    res.status(404).json(error.toJSON());
  });

  return app;
};

module.exports = { createApp }; 