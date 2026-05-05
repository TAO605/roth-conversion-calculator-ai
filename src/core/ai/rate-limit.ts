import { createHash } from "node:crypto";

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function createInMemoryRateLimiter(config: RateLimitConfig) {
  const buckets = new Map<string, Bucket>();

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const existing = buckets.get(key);
      const bucket =
        existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + Math.max(1, config.windowMs) };

      if (bucket.count >= config.maxRequests) {
        buckets.set(key, bucket);

        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
        };
      }

      bucket.count += 1;
      buckets.set(key, bucket);

      return {
        allowed: true,
        remaining: Math.max(0, config.maxRequests - bucket.count),
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    },
  };
}

export function getClientRateLimitKey(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const client = forwardedFor || realIp || "anonymous";
  const digest = createHash("sha256").update(client).digest("hex").slice(0, 24);

  return `ip:${digest}`;
}
