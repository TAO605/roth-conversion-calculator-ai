import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  buildLaunchReadinessGroups,
  getLaunchReadinessSummary,
} from "@/content/launch-readiness";
import sitemap from "@/app/sitemap";

describe("launch readiness checklist", () => {
  it("builds grouped launch checklist items for production handoff", () => {
    const groups = buildLaunchReadinessGroups();
    const summary = getLaunchReadinessSummary(groups);

    expect(groups.length).toBeGreaterThanOrEqual(5);
    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["domain", "analytics", "seo", "compliance", "testing", "operations"]),
    );
    expect(groups.every((group) => group.items.length >= 2)).toBe(true);
    const items = groups.flatMap((group) => group.items);
    const completedLabels = items.filter((item) => item.status === "complete").map((item) => item.label);
    const pendingLabels = items.filter((item) => item.status === "pending").map((item) => item.label);

    expect(completedLabels).toEqual(
      expect.arrayContaining([
        "Production domain",
        "Vercel production deployment",
        "Google Search Console",
        "GA4 measurement ID",
        "Sitemap submission",
        "Robots and feeds",
        "Disclaimer review",
        "AI model cross-check",
        "Unit and integration tests",
        "E2E browser tests",
        "Lighthouse audit",
        "Health endpoint",
        "Rollback path",
      ]),
    );
    expect(pendingLabels).toEqual(["CPA review"]);
    expect(summary.total).toBeGreaterThanOrEqual(12);
    expect(summary.completed).toBeGreaterThan(0);
    expect(summary.pending).toBe(1);
    expect(items.find((item) => item.label === "AI model cross-check")?.detail).toContain("does not replace");
    expect(items.find((item) => item.label === "CPA review")?.detail).toContain(
      "ops:cpa-review-evidence-validate",
    );
  });

  it("adds a launch readiness page to sitemap and homepage discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/launch-readiness/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/launch-readiness");
    expect(pageFile).toContain("Launch Readiness Checklist");
    expect(pageFile).toContain("buildLaunchReadinessGroups");
    expect(pageFile).toContain("Production domain");
    expect(pageFile).toContain("Google Search Console");
    expect(homePage).toContain('href="/launch-readiness"');
  });
});
