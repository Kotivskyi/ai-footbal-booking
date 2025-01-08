const mongoose = require('mongoose');
const MongoConfig = require('./mongoConfig');

let conn = null;

const connectDB = async () => {
    try {
        if (conn && mongoose.connection.readyState === 1) {
            console.log('Using existing connection');
            return conn;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        const config = new MongoConfig(process.env.NODE_ENV);
        conn = await mongoose.connect(
            process.env.MONGODB_URI, 
            config.getConnectionOptions()
        );

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
    }
};

module.exports = connectDB; 