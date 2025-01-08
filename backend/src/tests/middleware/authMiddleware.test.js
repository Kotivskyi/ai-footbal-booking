const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

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
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test-secret';
    });

    it('should authenticate valid token', async () => {
        const token = 'valid-token';
        const decoded = { id: 'user-id' };
        req.header.mockReturnValue(`Bearer ${token}`);
        jwt.verify.mockReturnValue(decoded);

        await authMiddleware.authenticate(req, res, next);

        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalled();
    });

    it('should reject request without token', async () => {
        req.header.mockReturnValue(undefined);

        await authMiddleware.authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No token, authorization denied'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
        req.header.mockReturnValue('Bearer invalid-token');
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await authMiddleware.authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token is not valid'
        });
        expect(next).not.toHaveBeenCalled();
    });
}); 