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

export interface AiRequestOriginResult {
  allowed: boolean;
  reason: "same_origin" | "missing_origin" | "cross_origin" | "invalid_origin";
}

interface Bucket {
  count: number;
  resetAt: number;
}

export function getAiExplainerMaxRequestsPerHour(value = process.env.AI_EXPLAINER_MAX_REQUESTS_PER_HOUR): number {
  if (!value) {
    return 5;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 5;
  }

  return Math.min(parsed, 20);
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

export function isAllowedAiRequestOrigin(
  headers: Headers,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.roth-conversion-calculator-ai.shop",
): AiRequestOriginResult {
  const origin = headers.get("origin")?.trim();
  const referer = headers.get("referer")?.trim();

  if (!origin && !referer) {
    return { allowed: false, reason: "missing_origin" };
  }

  try {
    const expectedHost = new URL(siteUrl).host;
    const originHost = origin ? new URL(origin).host : undefined;
    const refererHost = referer ? new URL(referer).host : undefined;

    if (originHost === expectedHost || refererHost === expectedHost) {
      return { allowed: true, reason: "same_origin" };
    }

    return { allowed: false, reason: "cross_origin" };
  } catch {
    return { allowed: false, reason: "invalid_origin" };
  }
}
