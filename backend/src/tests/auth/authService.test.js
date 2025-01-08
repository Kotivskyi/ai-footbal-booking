const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../../services/authService');
const User = require('../../models/User');

describe('Auth Service', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            const user = await authService.registerUser(userData.email, userData.password);

            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Password should be hashed
        });

        it('should not register user with existing email', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);

            await expect(
                authService.registerUser(userData.email, userData.password)
            ).rejects.toThrow('User already exists');
        });
    });

    describe('loginUser', () => {
        beforeEach(async () => {
            process.env.JWT_SECRET = 'test-secret';
        });

        it('should login user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);
            const result = await authService.loginUser(userData.email, userData.password);

            expect(result.token).toBeDefined();
            expect(result.user.email).toBe(userData.email);
        });

        it('should not login with incorrect password', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            await authService.registerUser(userData.email, userData.password);

            await expect(
                authService.loginUser(userData.email, 'wrongpassword')
            ).rejects.toThrow('Invalid credentials');
        });

        it('should not login non-existent user', async () => {
            await expect(
                authService.loginUser('nonexistent@test.com', 'password123')
            ).rejects.toThrow('Invalid credentials');
        });
    });
}); 