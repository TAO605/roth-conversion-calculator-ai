import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildIrmaaGuideSections, getIrmaaGuideSummary } from "@/content/irmaa-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion IRMAA guide", () => {
  it("builds an educational guide for Medicare IRMAA interactions", () => {
    const sections = buildIrmaaGuideSections();
    const summary = getIrmaaGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "irmaa-basics",
        "conversion-income",
        "lookback-and-life-events",
        "parts-b-and-d",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("IRMAA can add premiums for higher-income Medicare beneficiaries");
    expect(labels).toContain("Roth conversion income can affect MAGI used for IRMAA review");
    expect(labels).toContain("IRMAA commonly uses tax return information from an earlier year");
    expect(labels).toContain("Part B and Part D can have separate IRMAA amounts");
    expect(labels).toContain("Calculator does not estimate Medicare IRMAA");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["IRMAA basics", "MAGI review", "Lookback year", "Calculator limits"]),
    );
  });

  it("exposes the IRMAA guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-irmaa-guide/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-irmaa-guide");
    expect(pageFile).toContain("Roth Conversion IRMAA Guide");
    expect(pageFile).toContain("buildIrmaaGuideSections");
    expect(homePage).toContain('href="/roth-conversion-irmaa-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-irmaa-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-irmaa-guide");
  });
});
