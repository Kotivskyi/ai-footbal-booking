const supertest = require('supertest');
const { app } = require('../../../index');  // Import app from index.js
const jwt = require('jsonwebtoken');

const request = supertest(app);

const requestHelpers = {
  /**
   * Generate a valid JWT token for testing
   * @param {Object} user - User object to generate token for
   * @returns {String} JWT token
   */
  generateToken: (user) => {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  },

  /**
   * Make an authenticated request
   * @param {String} method - HTTP method
   * @param {String} url - Request URL
   * @param {Object} user - User object to authenticate as
   * @param {Object} data - Request body data
   */
  authenticatedRequest: async (method, url, user, data = null) => {
    const token = requestHelpers.generateToken(user);
    const req = request[method.toLowerCase()](url)
      .set('Authorization', `Bearer ${token}`);
    
    if (data) {
      req.send(data);
    }
    
    return req;
  },

  /**
   * Helper for common requests
   */
  requests: {
    login: (credentials) => request.post('/api/auth/login').send(credentials),
    register: (userData) => request.post('/api/auth/register').send(userData),
    getSlots: (token) => request.get('/api/slots')
      .set('Authorization', `Bearer ${token}`),
    bookSlot: (token, slotId) => request.post(`/api/slots/${slotId}/book`)
      .set('Authorization', `Bearer ${token}`)
  }
};

module.exports = requestHelpers; 