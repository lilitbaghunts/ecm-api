const redisClient = require('../config/redis');

const cacheMiddleware = (key) => async (req, res, next) => {
  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for key: ${key}`);
    req.cacheKey = key;
    next();
  } catch (error) {
    console.error('Redis cache middleware error:', error);
    next();
  }
};

const cacheInvalidationMiddleware =
  (keysToInvalidate) => async (req, res, next) => {
    res.on('finish', async () => {
      try {
        for (const key of keysToInvalidate) {
          await redisClient.del(key);
          console.log(`Cache invalidated for key: ${key}`);
        }
      } catch (error) {
        console.error('Failed to invalidate cache:', error);
      }
    });

    next();
  };

module.exports = {
  cacheMiddleware,
  cacheInvalidationMiddleware
};
