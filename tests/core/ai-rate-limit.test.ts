import { describe, expect, it } from "vitest";
import {
  createInMemoryRateLimiter,
  getAiExplainerMaxRequestsPerHour,
  getClientRateLimitKey,
  isAllowedAiRequestOrigin,
} from "@/core/ai/rate-limit";

describe("AI rate limit", () => {
  it("allows requests inside the configured window and blocks the next request", () => {
    const limiter = createInMemoryRateLimiter({ maxRequests: 2, windowMs: 1000 });

    expect(limiter.check("client-a", 1000)).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check("client-a", 1200)).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.check("client-a", 1300)).toMatchObject({ allowed: false, remaining: 0 });
  });

  it("resets after the window expires", () => {
    const limiter = createInMemoryRateLimiter({ maxRequests: 1, windowMs: 1000 });

    expect(limiter.check("client-a", 1000).allowed).toBe(true);
    expect(limiter.check("client-a", 1500).allowed).toBe(false);
    expect(limiter.check("client-a", 2101)).toMatchObject({ allowed: true, remaining: 0 });
  });

  it("builds a stable client key from proxy headers without storing raw IP text", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
    });

    const key = getClientRateLimitKey(headers);

    expect(key).toMatch(/^ip:/);
    expect(key).not.toContain("203.0.113.10");
  });

  it("defaults the public AI explainer to a conservative hourly limit", () => {
    expect(getAiExplainerMaxRequestsPerHour()).toBe(5);
    expect(getAiExplainerMaxRequestsPerHour("3")).toBe(3);
    expect(getAiExplainerMaxRequestsPerHour("100")).toBe(20);
    expect(getAiExplainerMaxRequestsPerHour("not-a-number")).toBe(5);
  });

  it("allows AI requests only from the canonical site origin or referer", () => {
    const siteUrl = "https://www.roth-conversion-calculator-ai.shop";

    expect(
      isAllowedAiRequestOrigin(
        new Headers({ origin: "https://www.roth-conversion-calculator-ai.shop" }),
        siteUrl,
      ),
    ).toMatchObject({ allowed: true, reason: "same_origin" });

    expect(
      isAllowedAiRequestOrigin(
        new Headers({ referer: "https://www.roth-conversion-calculator-ai.shop/#calculator" }),
        siteUrl,
      ),
    ).toMatchObject({ allowed: true, reason: "same_origin" });

    expect(isAllowedAiRequestOrigin(new Headers(), siteUrl)).toMatchObject({
      allowed: false,
      reason: "missing_origin",
    });

    expect(isAllowedAiRequestOrigin(new Headers({ origin: "https://example.com" }), siteUrl)).toMatchObject({
      allowed: false,
      reason: "cross_origin",
    });
  });
});
