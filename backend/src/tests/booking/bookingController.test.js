const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bookingService = require('../../services/bookingService');
const AppError = require('../../utils/appError');
const { bookSlot } = require('../../controllers/bookingController');

jest.mock('../../services/bookingService');
// Mock auth middleware
jest.mock('../../middleware/authMiddleware', () => ({ 
  authenticate: (req, res, next) => {
    req.user = { id: '123' };
    next();
  }
}));

describe('Booking Controller', () => {
  let mongoServer;
  let app;
  let server;
  const mockUserId = new mongoose.Types.ObjectId();
  let req;
  let res;
  let next;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    const { createApp } = require('../../app'); // Move app creation to separate file
    app = createApp();
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { slotId: 'valid-slot-id' },
      user: { id: 'user-id' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('GET /api/bookings', () => {
    it('should return 200 and available slots on successful service call', async () => {
      const mockSlots = [
        {
          _id: '5f8d0d55b54764421b7160aa',
          date: '2025-01-27',
          time: '10:00',
          capacity: 20,
          availableSpots: 15
        }
      ];

      bookingService.getAvailableSlots.mockResolvedValue(mockSlots);

      const response = await request(app).get('/api/bookings');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockSlots);
    });

    it('should return 500 and error message on failed service call', async () => {
      const errorMessage = 'Database error';
      bookingService.getAvailableSlots.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/api/bookings');

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('message', errorMessage);
    });
  });

  describe('POST /api/bookings/book/:slotId', () => {
    const mockSlotId = new mongoose.Types.ObjectId();
    
    it('should return 400 when slotId is invalid', async () => {
      const response = await request(app)
        .post('/api/bookings/book/invalid-id')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid slot ID format');
    });

    it('should successfully book a slot', async () => {
      const mockBookedSlot = {
        _id: mockSlotId,
        date: new Date(),
        bookedBy: [mockUserId]
      };
      bookingService.bookSlot.mockResolvedValue(mockBookedSlot);

      const response = await request(app)
        .post(`/api/bookings/book/${mockSlotId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          _id: mockSlotId.toString()
        })
      });
    });

    it('should return 409 when slot is full', async () => {
      bookingService.bookSlot.mockRejectedValue(
        new AppError('Slot is already at full capacity', 409)
      );

      const response = await request(app)
        .post(`/api/bookings/book/${mockSlotId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('full capacity');
    });

    it('should return 409 for duplicate booking', async () => {
      bookingService.bookSlot.mockRejectedValue(
        new AppError('You have already booked this slot', 409)
      );

      const response = await request(app)
        .post(`/api/bookings/book/${mockSlotId}`)
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('already booked');
    });
  });
});
