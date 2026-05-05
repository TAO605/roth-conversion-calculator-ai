import { describe, expect, it } from "vitest";
import nextConfig from "@/../next.config";

describe("production security configuration", () => {
  it("removes framework fingerprinting and defines browser security headers", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(typeof nextConfig.headers).toBe("function");

    const headers = await nextConfig.headers?.();
    const globalHeaders = headers?.find((entry) => entry.source === "/(.*)")?.headers ?? [];
    const headerNames = globalHeaders.map((header) => header.key);

    expect(headerNames).toContain("X-Content-Type-Options");
    expect(headerNames).toContain("Referrer-Policy");
    expect(headerNames).toContain("Permissions-Policy");
    expect(headerNames).toContain("Content-Security-Policy");

    const csp = globalHeaders.find((header) => header.key === "Content-Security-Policy")?.value ?? "";

    expect(csp).toContain("https://www.googletagmanager.com");
    expect(csp).toContain("https://www.google-analytics.com");
  });
});
