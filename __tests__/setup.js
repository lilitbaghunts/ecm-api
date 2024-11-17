require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const redisClient = require('../src/config/redis');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await redisClient.disconnect();
});
