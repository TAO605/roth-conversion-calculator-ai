import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildTimelineGuidePhases, getTimelineGuideSummary } from "@/content/timeline-guide";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion timeline guide", () => {
  it("builds an educational timeline for planning and reviewing a Roth conversion", () => {
    const phases = buildTimelineGuidePhases();
    const summary = getTimelineGuideSummary(phases);
    const labels = phases.flatMap((phase) => phase.items.map((item) => item.label));

    expect(phases.map((phase) => phase.id)).toEqual(
      expect.arrayContaining(["before-year-end", "conversion-window", "tax-payment", "forms", "post-filing"]),
    );
    expect(labels).toContain("Estimate taxable income before conversion");
    expect(labels).toContain("Confirm custodian processing deadline");
    expect(labels).toContain("Review estimated tax payment needs");
    expect(labels).toContain("Match Form 1099-R and Form 5498 records");
    expect(labels).toContain("Compare filed return to calculator assumptions");
    expect(summary.totalItems).toBeGreaterThanOrEqual(12);
    expect(summary.reviewOutputs).toEqual(
      expect.arrayContaining(["Calculator scenario", "Custodian confirmation", "Tax payment note", "Post-filing review"]),
    );
  });

  it("exposes the timeline guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-timeline/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-timeline");
    expect(pageFile).toContain("Roth Conversion Timeline Guide");
    expect(pageFile).toContain("buildTimelineGuidePhases");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/roth-conversion-timeline");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-timeline");
  });
});
