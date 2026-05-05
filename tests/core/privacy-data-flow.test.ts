import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildPrivacyDataFlowGroups, getPrivacyDataFlowSummary } from "@/content/privacy-data-flow";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("privacy data flow playbook", () => {
  it("builds a privacy and data-flow audit for calculator operations", () => {
    const groups = buildPrivacyDataFlowGroups();
    const summary = getPrivacyDataFlowSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["local-calculation", "browser-storage", "sharing", "analytics", "ai-api"]),
    );
    expect(labels).toContain("Confirm calculator runs locally");
    expect(labels).toContain("Review localStorage contents");
    expect(labels).toContain("Inspect share-link parameters");
    expect(labels).toContain("Verify privacy-safe GA4 events");
    expect(labels).toContain("Block sensitive data before AI requests");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.dataSurfaces).toEqual(
      expect.arrayContaining(["Browser memory", "localStorage", "URL hash", "GA4 event ranges", "Serverless AI route"]),
    );
  });

  it("exposes privacy data flow through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/privacy-data-flow/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/privacy-data-flow");
    expect(pageFile).toContain("Privacy Data Flow Playbook");
    expect(pageFile).toContain("buildPrivacyDataFlowGroups");
    expect(homePage).toContain('href="/privacy-data-flow"');
    expect(siteIndexUrls).toContain("/privacy-data-flow");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/privacy-data-flow");
  });
});
