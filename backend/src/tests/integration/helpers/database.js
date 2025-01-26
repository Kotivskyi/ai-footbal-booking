const mongoose = require('mongoose');
const User = require('../../../models/user.model');
const Slot = require('../../../models/slot.model');

const databaseHelpers = {
  /**
   * Clear all collections in the test database
   */
  clearDatabase: async () => {
    const collections = Object.values(mongoose.connection.collections);
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  },

  /**
   * Seed the database with test data
   * @param {Object} data - The data to seed
   */
  seedDatabase: async (data = {}) => {
    if (data.users) {
      await User.insertMany(data.users);
    }
    if (data.slots) {
      await Slot.insertMany(data.slots);
    }
  },

  /**
   * Drop the test database and close connection
   */
  closeDatabase: async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
};

module.exports = databaseHelpers; 