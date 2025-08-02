// Jest setup file for server tests
import mongoose from "mongoose";

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/wellness-events-test";
process.env.PORT = "5001";

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI!);
});

// Global test teardown
afterAll(async () => {
  // Disconnect from test database
  await mongoose.disconnect();
});

// Clean up database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
