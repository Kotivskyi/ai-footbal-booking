const mongoose = require('mongoose');

const connectDB = async (options = {}) => {
    try {
        // If already connected and URI changed, disconnect first
        if (mongoose.connection.readyState === 1 && 
            mongoose.connection._connectionString !== process.env.MONGODB_URI) {
            await mongoose.disconnect();
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // MongoDB Node.js Driver 4.0+ automatically uses new topology engine
            ...options // Allow passing test-specific options
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
};

module.exports = connectDB;
