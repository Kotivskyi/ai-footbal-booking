const logger = require('./logger');

/**
 * Custom error class for application-specific errors
 * @extends Error
 */
class AppError extends Error {
  /**
   * Create an AppError
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.metadata = {};
    
    // Log error when it's created
    const logLevel = this.statusCode >= 500 ? 'error' : 'debug';
    logger[logLevel](`AppError: ${this.message}`, this, {
      statusCode: this.statusCode,
    });

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Creates a 400 Bad Request error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static badRequest(message) {
    return new AppError(message, 400);
  }

  /**
   * Creates a 401 Unauthorized error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static unauthorized(message) {
    return new AppError(message, 401);
  }

  /**
   * Creates a 403 Forbidden error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static forbidden(message) {
    return new AppError(message || 'Forbidden', 403);
  }

  /**
   * Creates a 404 Not Found error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static notFound(message) {
    return new AppError(message, 404);
  }

  /**
   * Creates a 409 Conflict error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static conflict(message) {
    return new AppError(message, 409);
  }

  /**
   * Creates a 422 Unprocessable Entity error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static validation(message) {
    return new AppError(message || 'Validation failed', 422);
  }

  /**
   * Creates a 500 Internal Server Error
   * @param {string} message - Error message
   * @returns {AppError}
   */
  static internal(message) {
    return new AppError(message || 'Internal server error', 500);
  }

  /**
   * Converts the error to a plain object for response
   * @returns {Object}
   */
  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      metadata: this.metadata
    };
  }
}

module.exports = AppError; 