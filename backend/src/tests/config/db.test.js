const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../../config/db');

describe('Database Configuration', () => {
    let mongoServer;
    let validUri;
    let consoleError;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        mongoServer = await MongoMemoryServer.create();
        validUri = mongoServer.getUri();
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        consoleError.mockRestore();
    });

    beforeEach(async () => {
        await mongoose.disconnect();
        process.env.MONGODB_URI = validUri;
    });

    it('should connect to database successfully', async () => {
        const conn = await connectDB();
        expect(mongoose.connection.readyState).toBe(1);
    });

    it('should reuse existing connection', async () => {
        const conn1 = await connectDB();
        const conn2 = await connectDB();
        expect(conn1).toBe(conn2);
    });

    it('should not connect when URI is invalid', async () => {
        await mongoose.disconnect();
        process.env.MONGODB_URI = 'mongodb://invalid-uri';
        await expect(connectDB()).rejects.toThrow('Failed to connect to MongoDB');
    });
}); 