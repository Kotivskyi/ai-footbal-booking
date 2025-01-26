const { clearDatabase, seedDatabase } = require('../../helpers/database');
const { authenticatedRequest } = require('../../helpers/request');
const testUsers = require('../../fixtures/users');
const testSlots = require('../../fixtures/slots');
const mongoose = require('mongoose');
const Slot = require
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Slot Availability', () => {
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
    await Slot.insertMany([
      testSlots.availableSlot,
      testSlots.fullSlot,
      testSlots.pastSlot
    ]);
  });

  it('should list all available slots', async () => {
    const response = await authenticatedRequest(
      'GET',
      '/api/bookings',
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].availableSpots).toBe(15);
  });

  it('should filter slots by date range', async () => {
    const response = await authenticatedRequest(
      'GET',
      '/api/slots?startDate=2024-04-01&endDate=2024-04-30',
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(testSlots.availableSlot._id.toString());
  });

  it('should filter slots by capacity', async () => {
    const response = await authenticatedRequest(
      'GET',
      '/api/slots?minCapacity=5',
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.every(slot => slot.capacity >= 5)).toBe(true);
  });

  it('should return empty array when no slots match criteria', async () => {
    const response = await authenticatedRequest(
      'GET',
      '/api/slots?startDate=2025-01-01',
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });
}); 