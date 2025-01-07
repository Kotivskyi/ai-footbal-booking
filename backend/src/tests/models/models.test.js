const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');
const Slot = require('../../models/Slot');

describe('Models Validation', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('User Model', () => {
        it('should throw validation error for empty user', async () => {
            const user = new User({});
            await expect(user.validate()).rejects.toThrow();
        });

        it('should validate with correct user data', async () => {
            const user = new User({
                email: 'test@test.com',
                password: 'password123'
            });
            await expect(user.validate()).resolves.not.toThrow();
        });

        it('should reject invalid email format', async () => {
            const user = new User({
                email: 'invalid-email',
                password: 'password123'
            });
            await expect(user.validate()).rejects.toThrow();
        });

        it('should reject short passwords', async () => {
            const user = new User({
                email: 'test@test.com',
                password: '12345'
            });
            await expect(user.validate()).rejects.toThrow();
        });
    });

    describe('Slot Model', () => {
        it('should throw validation error for empty slot', async () => {
            const slot = new Slot({});
            await expect(slot.validate()).rejects.toThrow();
        });

        it('should validate with correct slot data', async () => {
            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 10
            });
            await expect(slot.validate()).resolves.not.toThrow();
        });

        it('should reject invalid capacity', async () => {
            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 0
            });
            await expect(slot.validate()).rejects.toThrow();
        });

        it('should handle bookedBy references correctly', async () => {
            const user = new User({
                email: 'test@test.com',
                password: 'password123'
            });
            await user.save();

            const slot = new Slot({
                date: new Date(),
                time: '14:00',
                capacity: 10,
                bookedBy: [user._id]
            });
            await expect(slot.validate()).resolves.not.toThrow();
        });
    });
}); 
