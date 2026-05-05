import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildHealthPayload } from "@/core/ops/health";

describe("health payload", () => {
  it("summarizes public operational status without exposing secrets", () => {
    const payload = buildHealthPayload({
      packageVersion: "1.2.3",
      now: new Date("2026-05-02T12:00:00.000Z"),
    });
    const serialized = JSON.stringify(payload);

    expect(payload).toMatchObject({
      status: "ok",
      app: "roth-conversion-calculator",
      version: "1.2.3",
      taxYear: 2026,
    });
    expect(payload.content.blogPosts).toBeGreaterThanOrEqual(12);
    expect(payload.content.glossaryTerms).toBeGreaterThanOrEqual(12);
    expect(payload.features.enabled).toBeGreaterThan(10);
    expect(serialized).not.toMatch(/OPENAI|API_KEY|SECRET|TOKEN/i);
  });

  it("mounts a public api health route with no-store cache semantics", () => {
    const route = fs.readFileSync(path.join(process.cwd(), "src/app/api/health/route.ts"), "utf8");

    expect(route).toContain("buildHealthPayload");
    expect(route).toContain("Cache-Control");
    expect(route).toContain("no-store");
  });
});
