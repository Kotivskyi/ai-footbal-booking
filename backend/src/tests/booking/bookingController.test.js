const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bookingService = require('../../services/bookingService');

jest.mock('../../services/bookingService');

describe('GET /api/bookings', () => {
  let mongoServer;
  let app;

  let server;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    const { createApp } = require('../../../src/index');
    app = createApp();
    // Apply routes and middleware
    const bookingRoutes = require('../../routes/bookingRoutes');
    app.use('/api/bookings', bookingRoutes);
    server = app.listen(0);
    await new Promise(resolve => server.on('listening', resolve));
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

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
