const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Slot = require('../../models/Slot');
const bookingService = require('../../services/bookingService');

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
      await Slot.create([
        {
          date: new Date('2025-01-27'),
          time: '10:00',
          capacity: 20,
          bookedBy: new Array(5).fill(new mongoose.Types.ObjectId())
        },
        {
          date: new Date('2024-01-01'),
          time: '09:00',
          capacity: 10,
          bookedBy: new Array(8).fill(new mongoose.Types.ObjectId())
        }
      ]);

      const results = await bookingService.getAvailableSlots();
      
      expect(results).toHaveLength(1);
      expect(results[0].availableSpots).toBe(15);
      expect(results[0].date.toISOString()).toContain('2025-01-27');
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
});
