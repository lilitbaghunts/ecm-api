const { createClient } = require('redis');

let redisClient;

(async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URI || 'redis://localhost:6379'
    });
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection error', err);
  }
})();

module.exports = redisClient;
