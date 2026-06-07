const { createClient } = require('redis');

let redisClient;
let isConnected = false;
let _lastRedisError = null;
let _lastRedisErrorAt = 0;
const _REDIS_ERROR_THROTTLE_MS = 60 * 1000; // 1 minute

const initRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      let msg = '';
      if (typeof AggregateError !== 'undefined' && err instanceof AggregateError) {
        const parts = (err.errors || []).map(e => (e && e.message) ? e.message : String(e)).filter(Boolean);
        msg = parts.length ? parts.join(' | ') : (err && err.message ? err.message : String(err || 'AggregateError'));
      } else {
        msg = err && err.message ? err.message : String(err || 'unknown');
      }

      if (!msg) return; // avoid logging empty messages
      const now = Date.now();
      if (msg !== _lastRedisError || now - _lastRedisErrorAt > _REDIS_ERROR_THROTTLE_MS) {
        console.error('Redis Client Error:', msg);
        _lastRedisError = msg;
        _lastRedisErrorAt = now;
      }
      isConnected = false;
    });

    await redisClient.connect();
    isConnected = true;
    _lastRedisError = null;
    _lastRedisErrorAt = 0;
    console.log('✅ Redis connected successfully');
  } catch (error) {
    const msg = error && error.message ? error.message : String(error || 'unknown');
    console.warn('⚠️ Redis connection failed. Caching will be disabled.', msg);
    isConnected = false;
  }
};

const getCache = async (key) => {
  if (!isConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis Get Error (${key}):`, error.message);
    return null;
  }
};

const setCache = async (key, data, expirationSeconds = 3600) => {
  if (!isConnected) return;
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: expirationSeconds
    });
  } catch (error) {
    console.error(`Redis Set Error (${key}):`, error.message);
  }
};

const clearCache = async (pattern) => {
  if (!isConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(`Redis Clear Cache Error (${pattern}):`, error.message);
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  clearCache,
  get isConnected() { return isConnected; }
};
