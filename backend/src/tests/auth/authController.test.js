const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis()
        };
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };
            req.body = userData;

            authService.registerUser.mockResolvedValue({
                _id: 'some-id',
                email: userData.email
            });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully'
            });
        });

        it('should handle registration error', async () => {
            req.body = {
                email: 'test@test.com',
                password: 'password123'
            };

            authService.registerUser.mockRejectedValue(new Error('Registration failed'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Registration failed'
            });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
            const userData = {
                email: 'test@test.com',
                password: 'password123'
            };
            req.body = userData;

            const loginResult = {
                token: 'some-token',
                user: { id: 'some-id', email: userData.email }
            };
            authService.loginUser.mockResolvedValue(loginResult);

            await authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith(loginResult);
        });

        it('should handle login error', async () => {
            req.body = {
                email: 'test@test.com',
                password: 'wrong-password'
            };

            authService.loginUser.mockRejectedValue(new Error('Invalid credentials'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials'
            });
        });
    });
}); 