const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    logger.trace('Verifying authentication token');
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.debug('No token provided');
      return next(new AppError('No token, authorization denied', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      logger.debug('Token verified successfully', { userId: decoded.id });
      next();
    } catch (err) {
      logger.debug('Invalid token', { error: err.message });
      next(new AppError('Token is not valid', 401));
    }
  } catch (error) {
    logger.error('Auth middleware error', { 
      errorMessage: error.message,
      stackTrace: error.stack 
    });
    next(error);
  }
};

module.exports = { authenticate }; 