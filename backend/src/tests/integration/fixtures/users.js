const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const testUsers = {
  validUser: {
    _id: new mongoose.Types.ObjectId(),
    email: 'user@test.com',
    password: 'password123'
  },
  adminUser: {
    _id: new mongoose.Types.ObjectId(),
    email: 'admin@example.com',
    password: bcrypt.hashSync('Admin123!', 10),
    name: 'Admin User',
    role: 'admin'
  },
  // Raw credentials for testing
  credentials: {
    valid: {
      email: 'test@example.com',
      password: 'Password123!'
    },
    invalid: {
      email: 'wrong@example.com',
      password: 'WrongPass123!'
    }
  }
};

module.exports = testUsers; 