import { getRedis } from './redis';

const MAX_SUBMISSIONS_PER_DAY = 6;
const WINDOW_SECONDS = 86400; // 24 hours

/**
 * Check and enforce rate limit for a user.
 * @param {string} identifier - IP or UUID
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export async function checkRateLimit(identifier) {
  const redis = getRedis();
  const key = `ratelimit:submit:${identifier}`;

  if (!redis) {
    // Fallback: allow but log warning (rate limiting disabled)
    console.warn('[RateLimit] Redis unavailable — rate limiting disabled');
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY, resetIn: 0 };
  }

  // Bypass rate limiting entirely for local development testing
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, remaining: 9999, resetIn: 0 };
  }

  try {
    const current = await redis.get(key);
    const count = parseInt(current || '0', 10);

    if (count >= MAX_SUBMISSIONS_PER_DAY) {
      const ttl = await redis.ttl(key);
      return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl : WINDOW_SECONDS };
    }

    // Increment
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    if (!current) {
      pipeline.expire(key, WINDOW_SECONDS);
    }
    await pipeline.exec();

    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY - count - 1, resetIn: 0 };
  } catch (err) {
    console.warn('[RateLimit] Error:', err.message);
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_DAY, resetIn: 0 };
  }
}

export { MAX_SUBMISSIONS_PER_DAY };
