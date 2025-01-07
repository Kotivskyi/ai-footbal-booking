const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../../config/db');

describe('Database Configuration', () => {
    let mongoServer;

    beforeEach(async () => {
        mongoServer = await MongoMemoryServer.create();
    });

    afterEach(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('connectDB', () => {
        it('should connect when URI is valid', async () => {
            // Arrange
            process.env.MONGODB_URI = mongoServer.getUri();

            // Act
            const connection = await connectDB();

            // Assert
            expect(connection).toBeDefined();
            expect(mongoose.connection.readyState).toBe(1); // Connected
        });

        it('should not connect when URI is missing', async () => {
            // Arrange
            delete process.env.MONGODB_URI;

            // Act & Assert
            await expect(connectDB()).rejects.toThrow();
        });

        it('should not connect when URI is invalid', async () => {
            // Arrange
            process.env.MONGODB_URI = 'invalid-uri';

            // Act & Assert
            await expect(connectDB()).rejects.toThrow();
        });

        it('should reuse existing connection', async () => {
            // Arrange
            process.env.MONGODB_URI = mongoServer.getUri();
            
            // Act
            const connection1 = await connectDB();
            const connection2 = await connectDB();

            // Assert
            expect(connection1).toBe(connection2);
        });
    });
});
