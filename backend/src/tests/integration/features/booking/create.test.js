const { clearDatabase, seedDatabase } = require('../../helpers/database');
const { authenticatedRequest } = require('../../helpers/request');
const testUsers = require('../../fixtures/users');
const testSlots = require('../../fixtures/slots');
const Slot = require('../../../../models/slot.model');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

describe('Booking Creation', () => {
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
    await seedDatabase({
      users: [testUsers.validUser],
      slots: [testSlots.availableSlot, testSlots.fullSlot]
    });
  });

  it('should successfully book an available slot', async () => {
    const response = await authenticatedRequest(
      'POST',
      `/api/slots/${testSlots.availableSlot._id}/book`,
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Booking successful');

    // Verify booking in database
    const updatedSlot = await Slot.findById(testSlots.availableSlot._id);
    expect(updatedSlot.bookedBy).toContainEqual(testUsers.validUser._id);
  });

  it('should fail booking when slot is full', async () => {
    const response = await authenticatedRequest(
      'POST',
      `/api/slots/${testSlots.fullSlot._id}/book`,
      testUsers.validUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail booking when user already has a booking', async () => {
    // First booking
    await authenticatedRequest(
      'POST',
      `/api/slots/${testSlots.availableSlot._id}/book`,
      testUsers.validUser
    );

    // Try to book another slot
    const response = await authenticatedRequest(
      'POST',
      `/api/slots/${testSlots.futureSlot._id}/book`,
      testUsers.validUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail booking with invalid slot ID', async () => {
    const response = await authenticatedRequest(
      'POST',
      '/api/slots/invalid-id/book',
      testUsers.validUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
}); 