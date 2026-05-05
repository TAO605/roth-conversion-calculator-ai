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
    expect(groups.flatMap((group) => group.items).every((item) => item.status === "pending")).toBe(true);
    expect(summary.total).toBeGreaterThanOrEqual(12);
    expect(summary.completed).toBe(0);
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
