import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildSearchConsoleSubmissionLoop,
  buildSeoMonitoringGroups,
  getSearchConsoleSources,
  getSeoMonitoringSummary,
} from "@/content/seo-monitoring";
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

  it("builds a Search Console submission and indexing loop from official surfaces", () => {
    const steps = buildSearchConsoleSubmissionLoop();
    const labels = steps.map((step) => step.label);
    const sources = getSearchConsoleSources();

    expect(labels).toEqual(
      expect.arrayContaining([
        "Run production SEO smoke before submitting",
        "Submit or resubmit sitemap.xml",
        "Inspect priority URLs",
        "Request indexing only after material changes",
        "Review Page indexing report",
        "Record and route exceptions",
      ]),
    );
    expect(steps.map((step) => step.tool)).toEqual(
      expect.arrayContaining([
        "npm run seo:smoke",
        "Google Search Console Sitemaps report",
        "Google Search Console URL Inspection",
        "Google Search Console Page indexing report",
      ]),
    );
    expect(sources.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://support.google.com/webmasters/answer/7451001",
        "https://support.google.com/webmasters/answer/9012289",
        "https://support.google.com/webmasters/answer/7440203",
        "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      ]),
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
    expect(pageFile).toContain("buildSearchConsoleSubmissionLoop");
    expect(pageFile).toContain("Search Console submission loop");
    expect(homePage).toContain('href="/seo-monitoring"');
    expect(siteIndexUrls).toContain("/seo-monitoring");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
  });
});
