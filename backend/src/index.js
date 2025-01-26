require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const User = require('./models/user.model');
const Slot = require('./models/slot.model');

const createApp = () => {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/slots', bookingRoutes);

  return app;
};

const app = createApp();
const PORT = process.env.PORT || 5001;

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

async function startServer() {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        return server;
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Export app for testing and start server for production
module.exports = { createApp, app, startServer };

// Automatically start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
