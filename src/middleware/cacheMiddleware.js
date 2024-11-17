const redisClient = require('../config/redis');

const cacheMiddleware = (type) => async (req, res, next) => {
  const { page = 1, limit = 50, ...filters } = req.query;

  const cacheKeyParts = [`${type}:page:${page}`, `limit:${limit}`];

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      cacheKeyParts.push(`${key}:${value}`);
    }
  });

  const cacheKey = cacheKeyParts.join('|');
  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for key: ${cacheKey}`);
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error('Error fetching cache:', error);
    next();
  }
};

const cacheInvalidationMiddleware = (keys) => async (req, res, next) => {
  res.on('finish', async () => {
    try {
      const keysToInvalidate = await redisClient.keys(keys);
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
