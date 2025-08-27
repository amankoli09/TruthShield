const NodeCache = require('node-cache');

// Create cache instance with TTL (time to live) in seconds
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL_SECONDS) || 3600, // 1 hour default
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false
});

// Clear all cache on startup
cache.flushAll();

// Cache statistics
cache.on('set', (key, value) => {
  console.log(`Cache SET: ${key}`);
});

cache.on('del', (key, value) => {
  console.log(`Cache DEL: ${key}`);
});

cache.on('expired', (key, value) => {
  console.log(`Cache EXPIRED: ${key}`);
});

module.exports = cache;
