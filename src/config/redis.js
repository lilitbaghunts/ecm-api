const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis client error', err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
