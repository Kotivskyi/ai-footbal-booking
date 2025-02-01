const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Slot = require('../../models/Slot');
const bookingService = require('../../services/bookingService');
const AppError = require('../../utils/appError');

describe('Booking Service', () => {
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
    await Slot.deleteMany({});
  });

  describe('getAvailableSlots', () => {
    it('should return available future slots with availableSpots calculation', async () => {
      // Create test slots
      const now = new Date();
      await Slot.create([
        {
          date: new Date(now.getTime() + 3 * 86400000), // 3 days in future
          time: '10:00',
          capacity: 20,
          bookedBy: Array.from({length: 5}, () => new mongoose.Types.ObjectId())
        },
        {
          date: new Date(now.getTime() - 3 * 86400000), // 3 days in past
          time: '09:00',
          capacity: 10,
          bookedBy: Array.from({length: 8}, () => new mongoose.Types.ObjectId())
        }
      ]);

      const results = await bookingService.getAvailableSlots();
      
      expect(results).toHaveLength(1);
      expect(results[0].availableSpots).toBe(15);
      expect(results[0].date.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should return empty array when no available slots', async () => {
      await Slot.create({
        date: new Date('2025-01-27'),
        time: '10:00',
        capacity: 5,
        bookedBy: new Array(5).fill(new mongoose.Types.ObjectId())
      });

      const results = await bookingService.getAvailableSlots();
      expect(results).toHaveLength(0);
    });
  });

  describe('bookSlot', () => {
    let testSlot;
    let userId;

    beforeEach(async () => {
      userId = new mongoose.Types.ObjectId();
      testSlot = await Slot.create({
        date: new Date('2025-01-27'),
        time: '10:00',
        capacity: 20,
        bookedBy: []
      });
    });

    it('should successfully book a slot for a user', async () => {
      const result = await bookingService.bookSlot(userId, testSlot._id);

      expect(result.bookedBy).toHaveLength(1);
      expect(result.bookedBy[0].toString()).toBe(userId.toString());
    });

    it('should throw AppError when slot is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await expect(bookingService.bookSlot(userId, nonExistentId))
        .rejects
        .toThrow(AppError);
    });

    it('should throw AppError when slot is at capacity', async () => {
      // Fill the slot to capacity
      testSlot.capacity = 1;
      testSlot.bookedBy = [new mongoose.Types.ObjectId()];
      await testSlot.save();

      await expect(bookingService.bookSlot(userId, testSlot._id))
        .rejects
        .toThrow(/capacity/);
    });

    it('should throw AppError when user has already booked', async () => {
      // Add user to bookedBy
      testSlot.bookedBy = [userId];
      await testSlot.save();

      await expect(bookingService.bookSlot(userId, testSlot._id))
        .rejects
        .toThrow(/already booked/);
    });
  });
});
