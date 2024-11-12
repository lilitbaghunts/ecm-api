const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379'
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (err) {
    console.error('Redis connection error', err);
  }
})();

module.exports = redisClient;
