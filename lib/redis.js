import { Redis } from '@upstash/redis';

let redisInstance = null;

function getRedis() {
  if (redisInstance) return redisInstance;
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return null;
    }
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redisInstance;
  } catch {
    console.warn('[Redis] Failed to initialize, falling back to direct DB');
    return null;
  }
}

/**
 * Get cached data from Redis with automatic fallback to fetcher function.
 * @param {string} key - Cache key
 * @param {Function} fetcher - Async function that returns fresh data
 * @param {number} ttl - TTL in seconds (default 60)
 */
export async function getCached(key, fetcher, ttl = 60) {
  const redis = getRedis();
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
    } catch (err) {
      console.warn(`[Redis] Cache read failed for ${key}:`, err.message);
    }
  }

  // Fallback: fetch from source
  const data = await fetcher();

  // Try to cache result
  if (redis && data) {
    try {
      await redis.set(key, JSON.stringify(data), { ex: ttl });
    } catch (err) {
      console.warn(`[Redis] Cache write failed for ${key}:`, err.message);
    }
  }

  return data;
}

/** Invalidate a cache key */
export async function invalidateCache(key) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn(`[Redis] Cache invalidation failed for ${key}:`, err.message);
  }
}

/** Invalidate all submission caches */
export async function invalidateSubmissionCaches() {
  const keys = [
    'submissions:home',
    'submissions:wall:all:1',
    'submissions:wall:i_said_it:1',
    'submissions:wall:said_to_me:1',
  ];
  await Promise.all(keys.map(invalidateCache));
}

export { getRedis };
