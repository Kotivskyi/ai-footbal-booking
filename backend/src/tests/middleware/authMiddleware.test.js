const jwt = require('jsonwebtoken');
const { authenticate } = require('../../middleware/authMiddleware');
const AppError = require('../../utils/appError');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should authenticate valid token', async () => {
        const token = 'valid-token';
        const decoded = { id: 'user-id' };
        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockReturnValue(decoded);

        await authenticate(req, res, next);

        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
        req.header.mockReturnValue(null);
        
        await authenticate(req, res, next);
        
        expect(next).toHaveBeenCalledWith(
            expect.any(AppError)
        );
        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('No token, authorization denied');
    });

    it('should reject invalid token', async () => {
        req.header.mockReturnValue('Bearer invalid_token');
        jwt.verify.mockImplementation(() => {
            throw new jwt.JsonWebTokenError('Invalid token');
        });

        await authenticate(req, res, next);

        expect(next).toHaveBeenCalledWith(
            expect.any(AppError)
        );
        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Token is not valid');
    });
}); 