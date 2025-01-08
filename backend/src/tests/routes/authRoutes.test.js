const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
    });

    describe('POST /api/auth/register', () => {
        it('should register new user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            authService.registerUser.mockResolvedValue({
                _id: 'some-id',
                email: userData.email
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };

            const loginResult = {
                token: 'some-token',
                user: { id: 'some-id', email: userData.email }
            };
            authService.loginUser.mockResolvedValue(loginResult);

            const response = await request(app)
                .post('/api/auth/login')
                .send(userData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', userData.email);
        });
    });
}); 