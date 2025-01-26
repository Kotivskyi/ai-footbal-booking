const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { clearDatabase, seedDatabase } = require('../../helpers/database');
const { authenticatedRequest } = require('../../helpers/request');
const testUsers = require('../../fixtures/users');
const testSlots = require('../../fixtures/slots');
const Slot = require('../../../../models/slot.model');

describe('Booking Cancellation', () => {
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
    // Create a slot with an existing booking for the test user
    const bookedSlot = {
      ...testSlots.availableSlot,
      bookedBy: [testUsers.validUser._id]
    };
    await seedDatabase({
      users: [testUsers.validUser],
      slots: [bookedSlot, testSlots.availableSlot]
    });
  });

  it('should successfully cancel a booking', async () => {
    const response = await authenticatedRequest(
      'DELETE',
      `/api/slots/${testSlots.availableSlot._id}/book`,
      testUsers.validUser
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Booking cancelled successfully');

    // Verify booking was removed from database
    const updatedSlot = await Slot.findById(testSlots.availableSlot._id);
    expect(updatedSlot.bookedBy).not.toContainEqual(testUsers.validUser._id);
  });

  it('should fail cancellation when user has no booking', async () => {
    const response = await authenticatedRequest(
      'DELETE',
      `/api/slots/${testSlots.availableSlot._id}/book`,
      testUsers.adminUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail cancellation with invalid slot ID', async () => {
    const response = await authenticatedRequest(
      'DELETE',
      '/api/slots/invalid-id/book',
      testUsers.validUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should fail cancellation when booking is in the past', async () => {
    const pastSlot = {
      ...testSlots.availableSlot,
      date: new Date('2023-01-01'),
      bookedBy: [testUsers.validUser._id]
    };
    await seedDatabase({ slots: [pastSlot] });

    const response = await authenticatedRequest(
      'DELETE',
      `/api/slots/${pastSlot._id}/book`,
      testUsers.validUser
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
}); 