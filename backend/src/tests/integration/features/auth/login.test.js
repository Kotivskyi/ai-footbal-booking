const { clearDatabase, seedDatabase } = require('../../helpers/database');
const { request } = require('../../helpers/request');
const testUsers = require('../../fixtures/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Login Flow', () => {
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
    // Create user directly with hashed password
    await seedDatabase({ 
      users: [{
        ...testUsers.validUser,
        password: bcrypt.hashSync(testUsers.validUser.password, 8)
      }]
    });
  });

  it('should successfully login with valid credentials', async () => {
    const response = await request.post('/api/auth/login').send({
      email: testUsers.validUser.email,
      password: testUsers.validUser.password
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', testUsers.validUser.email);
    expect(response.body.user).not.toHaveProperty('password');

    // Verify JWT token is valid
    const decoded = jwt.verify(
      response.body.token, 
      process.env.JWT_SECRET || 'test-secret'
    );
    expect(decoded).toHaveProperty('id');
    expect(decoded).toHaveProperty('email', testUsers.validUser.email);
  });

  it('should fail login with invalid email', async () => {
    const response = await request.post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: testUsers.credentials.valid.password
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail login with invalid password', async () => {
    const response = await request.post('/api/auth/login').send({
      email: testUsers.credentials.valid.email,
      password: 'wrongpassword'
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
}); 