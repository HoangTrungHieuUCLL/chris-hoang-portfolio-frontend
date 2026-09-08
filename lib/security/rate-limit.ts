/**
 * In-memory, fixed-window rate limiting.
 *
 * Known limitation (documented in README.md): this state lives in the Node.js
 * process, not a shared store. On a serverless platform with multiple
 * concurrent instances, each instance enforces its own limit, so the
 * *effective* ceiling is (per-instance limit) x (concurrent instances) - a
 * real ceiling, not an illusion of one, but not exactly the configured
 * number either. For a single personal-site chat widget this is a
 * reasonable, zero-infrastructure default; swap in a shared store (Upstash
 * Redis, Vercel KV) if usage ever justifies it.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so `buckets` doesn't grow forever: a fraction of
// calls sweep expired entries instead of running a background timer, which
// would keep a serverless instance alive between invocations for no reason.
const CLEANUP_SAMPLE_RATE = 0.02;

function cleanupExpired(now: number) {
  if (Math.random() > CLEANUP_SAMPLE_RATE) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Milliseconds until the caller may retry, only set when `allowed` is false. */
  retryAfterMs?: number;
};

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true };
}
