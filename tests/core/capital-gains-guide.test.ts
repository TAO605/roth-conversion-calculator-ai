import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildCapitalGainsGuideSections, getCapitalGainsGuideSummary } from "@/content/capital-gains-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion capital gains guide", () => {
  it("builds an educational guide for capital gains and qualified dividend interactions", () => {
    const sections = buildCapitalGainsGuideSections();
    const summary = getCapitalGainsGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "preferential-rate-basics",
        "conversion-income-stacking",
        "worksheet-review",
        "portfolio-events",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Long-term capital gains and qualified dividends can use preferential tax rates");
    expect(labels).toContain("Roth conversion income can reduce room in lower capital gain rate bands");
    expect(labels).toContain("Qualified Dividends and Capital Gain Tax Worksheet review is separate");
    expect(labels).toContain("Large realized gains can change conversion scenario comparisons");
    expect(labels).toContain("Calculator does not compute Schedule D or capital gain worksheets");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Preferential rates", "Income stacking", "Worksheet review", "Calculator limits"]),
    );
  });

  it("exposes the capital gains guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-capital-gains-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-capital-gains-guide");
    expect(pageFile).toContain("Roth Conversion Capital Gains Guide");
    expect(pageFile).toContain("buildCapitalGainsGuideSections");
    expect(homePage).toContain('href="/roth-conversion-capital-gains-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-capital-gains-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-capital-gains-guide");
  });
});
