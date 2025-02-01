const winston = require('winston');

// Define custom log levels and colors
const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    debug: 3,
    trace: 4
  },
  colors: {
    critical: 'red bold',
    error: 'red',
    warn: 'yellow',
    debug: 'blue',
    trace: 'gray'
  }
};

// Add colors to Winston
winston.addColors(customLevels.colors);

// Create format for development environment
const developmentFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.colorize(),
  winston.format.printf(
    ({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    }
  )
);

// Create format for production environment
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.LOG_LEVEL || 'debug', // Set default log level
  format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console(),
    
    // Write critical logs to critical.log
    new winston.transports.File({ 
      filename: 'logs/critical.log', 
      level: 'critical' 
    }),
    
    // Write error and above logs to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Add request context if available
logger.requestContext = (req) => {
  if (!req) return {};
  
  return {
    requestId: req.id,
    method: req.method,
    path: req.path,
    userId: req.user?.id
  };
};

// Helper methods with structured logging
const loggerWithContext = {
  trace: (message, context = {}) => {
    logger.log('trace', message, context);
  },

  debug: (message, context = {}) => {
    logger.log('debug', message, context);
  },

  warn: (message, context = {}) => {
    logger.log('warn', message, context);
  },

  error: (message, error = null, context = {}) => {
    const errorContext = error ? {
      errorMessage: error.message,
      stackTrace: error.stack,
      ...context
    } : context;
    
    logger.log('error', message, errorContext);
  },

  critical: (message, error = null, context = {}) => {
    const errorContext = error ? {
      errorMessage: error.message,
      stackTrace: error.stack,
      ...context
    } : context;
    
    logger.log('critical', message, errorContext);
  }
};

module.exports = loggerWithContext; 