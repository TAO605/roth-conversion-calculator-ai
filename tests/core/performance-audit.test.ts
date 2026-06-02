import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildPerformanceAuditGroups, getPerformanceAuditSummary } from "@/content/performance-audit";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("performance audit playbook", () => {
  it("builds a launch-grade performance audit checklist", () => {
    const groups = buildPerformanceAuditGroups();
    const summary = getPerformanceAuditSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["core-web-vitals", "page-samples", "mobile", "regression"]),
    );
    expect(labels).toContain("Measure LCP on the calculator homepage");
    expect(labels).toContain("Check INP-sensitive calculator interactions");
    expect(labels).toContain("Run Lighthouse on SEO landing pages");
    expect(labels).toContain("Verify mobile input ergonomics");
    expect(labels).toContain("Compare bundle size after each release");
    expect(labels).toContain("Review multi-sample Lighthouse evidence");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.targetMetrics).toEqual(
      expect.arrayContaining([
        "LCP under 2.5s",
        "INP under 200ms",
        "CLS under 0.1",
        "Lighthouse SEO over 90",
        "3 samples, median TBT selected",
      ]),
    );
    expect(groups.flatMap((group) => group.checks.map((check) => check.action)).join("\n")).toContain(
      "median-total-blocking-time-valid-seo-sample",
    );
  });

  it("exposes performance audit through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/performance-audit/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/performance-audit");
    expect(pageFile).toContain("Performance Audit Playbook");
    expect(pageFile).toContain("buildPerformanceAuditGroups");
    expect(homePage).toContain('href="/performance-audit"');
    expect(siteIndexUrls).toContain("/performance-audit");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/performance-audit");
  });
});
