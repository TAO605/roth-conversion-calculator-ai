import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildSeoMonitoringGroups, getSeoMonitoringSummary } from "@/content/seo-monitoring";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("SEO monitoring playbook", () => {
  it("builds a post-launch SEO monitoring cadence for a Google tool site", () => {
    const groups = buildSeoMonitoringGroups();
    const summary = getSeoMonitoringSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["daily", "weekly", "monthly", "incident"]),
    );
    expect(labels).toContain("Check Google Search Console coverage");
    expect(labels).toContain("Review query impressions and CTR");
    expect(labels).toContain("Review Core Web Vitals");
    expect(labels).toContain("Publish or refresh long-tail content");
    expect(labels).toContain("Trigger rollback review");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.tools).toEqual(
      expect.arrayContaining(["Google Search Console", "GA4", "PageSpeed Insights", "Vercel Analytics"]),
    );
  });

  it("exposes SEO monitoring through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/seo-monitoring/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
    expect(pageFile).toContain("SEO Monitoring Playbook");
    expect(pageFile).toContain("buildSeoMonitoringGroups");
    expect(homePage).toContain('href="/seo-monitoring"');
    expect(siteIndexUrls).toContain("/seo-monitoring");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
  });
});
