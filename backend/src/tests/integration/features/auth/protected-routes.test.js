const { clearDatabase, seedDatabase } = require('../../helpers/database');
const { authenticatedRequest, generateToken } = require('../../helpers/request');
const testUsers = require('../../fixtures/users');
const request = require('supertest');
const { app } = require('../../../../index'); // Import app from index.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Protected Routes', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await clearDatabase();
    await seedDatabase({ users: [testUsers.validUser] });
  });

  it('should access protected route with valid token', async () => {
    const response = await authenticatedRequest(
      'GET',
      '/api/user/profile',
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', testUsers.validUser.email);
  });

  it('should reject access without token', async () => {
    const response = await request.get('/api/user/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject access with invalid token', async () => {
    const response = await request
      .get('/api/user/profile')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject access with expired token', async () => {
    const expiredToken = generateToken({
      ...testUsers.validUser,
      exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
    });

    const response = await request
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
}); 