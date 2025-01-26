const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  // Create an instance of MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);

  // Store mongoServer instance so it can be used in teardown
  global.__MONGOSERVER__ = mongoServer;

  // Optional: Run migrations here if needed
  // await runMigrations();
}; 