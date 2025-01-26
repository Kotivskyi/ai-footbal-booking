const mongoose = require('mongoose');

module.exports = async () => {
  // Clear all test data
  await Promise.all(
    Object.values(mongoose.connection.collections).map(async (collection) => {
      await collection.deleteMany({});
    })
  );

  // Close mongoose connection
  await mongoose.disconnect();

  // Stop MongoDB Memory Server
  if (global.__MONGOSERVER__) {
    await global.__MONGOSERVER__.stop();
  }
}; 