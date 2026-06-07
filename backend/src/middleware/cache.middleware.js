const { getCache, isConnected } = require('../core/redis');
const { successResponse } = require('../core/response');

const cacheMiddleware = async (req, res, next) => {
  // Skip caching if Redis is down or method is not GET
  if (!isConnected || req.method !== 'GET') {
    return next();
  }

  // Use the full URL including query params as cache key
  const key = req.originalUrl;
  
  try {
    const cachedData = await getCache(key);
    
    if (cachedData) {
      console.log(`[Cache Hit] ${key}`);
      return successResponse(
        res, 
        200, 
        'Success', 
        cachedData.data, 
        cachedData.meta
      );
    }
    
    console.log(`[Cache Miss] ${key}`);
    
    // Intercept res.json to cache the response before sending
    const originalJson = res.json;
    res.json = function (body) {
      // Only cache successful responses that use our standard format
      if (body && body.success && res.statusCode === 200) {
        const { setCache } = require('../core/redis');
        // Cache for 1 hour by default
        setCache(key, { data: body.data, meta: body.meta }, 3600); 
      }
      originalJson.call(this, body);
    };

    next();
  } catch (error) {
    console.error(`Cache Middleware Error:`, error);
    next();
  }
};

module.exports = cacheMiddleware;
