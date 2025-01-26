const { clearDatabase } = require('../../helpers/database');
const { requests } = require('../../helpers/request');
const User = require('../../../../models/user.model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Registration Flow', () => {
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
  });

  it('should successfully register a new user with valid data', async () => {
    const validUserData = {
      email: 'newuser@example.com',
      password: 'ValidPass123!',
      name: 'New User'
    };

    const response = await requests.register(validUserData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', validUserData.email);
    expect(response.body.user).not.toHaveProperty('password');

    // Verify user was created in database
    const user = await User.findOne({ email: validUserData.email });
    expect(user).toBeTruthy();
  });

  it('should fail registration with invalid email', async () => {
    const invalidUserData = {
      email: 'invalid-email',
      password: 'ValidPass123!',
      name: 'Test User'
    };

    const response = await requests.register(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail registration with short password', async () => {
    const invalidUserData = {
      email: 'test@example.com',
      password: 'short',
      name: 'Test User'
    };

    const response = await requests.register(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail registration with duplicate email', async () => {
    const userData = {
      email: 'duplicate@example.com',
      password: 'ValidPass123!',
      name: 'Test User'
    };

    // Register first user
    await requests.register(userData);

    // Try to register second user with same email
    const response = await requests.register(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
}); 