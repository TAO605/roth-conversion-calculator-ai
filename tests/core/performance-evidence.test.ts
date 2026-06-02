import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mobile performance evidence", () => {
  it("exposes a Lighthouse-backed production performance command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/performance-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:performance"]).toBe("node scripts/performance-evidence.mjs");
    expect(script).toContain("lighthouse");
    expect(script).toContain("PERFORMANCE_EVIDENCE_URL");
    expect(script).toContain("--only-categories=performance,seo");
    expect(script).toContain("minPerformanceScore");
    expect(script).toContain('PERFORMANCE_EVIDENCE_MIN_SCORE || "0.5"');
    expect(script).toContain("maxLargestContentfulPaintMs");
    expect(script).toContain("maxTotalBlockingTimeMs");
    expect(script).toContain('PERFORMANCE_EVIDENCE_MAX_TBT_MS || "600"');
    expect(script).toContain("maxCumulativeLayoutShift");
    expect(script).toContain("lighthouse-mobile-lab");
    expect(script).toContain("manualReviewRequired");
    expect(script).toContain("thresholdResults");
    expect(script).toContain("largest-contentful-paint");
    expect(script).toContain("total-blocking-time");
    expect(script).toContain("cumulative-layout-shift");
  });
});
