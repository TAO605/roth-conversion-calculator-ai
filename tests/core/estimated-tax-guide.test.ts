import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildEstimatedTaxGuideSections, getEstimatedTaxGuideSummary } from "@/content/estimated-tax-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion estimated tax guide", () => {
  it("builds an educational guide for estimated tax payment review", () => {
    const sections = buildEstimatedTaxGuideSections();
    const summary = getEstimatedTaxGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "estimated-tax-basics",
        "conversion-income",
        "withholding-vs-estimates",
        "form-2210-review",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Estimated tax is used for income not fully covered by withholding");
    expect(labels).toContain("Roth conversion income can increase current-year tax payment needs");
    expect(labels).toContain("IRA withholding and Form 1040-ES payments should be reviewed separately");
    expect(labels).toContain("Form 2210 underpayment review is outside the calculator");
    expect(labels).toContain("Calculator does not determine estimated tax safe harbor");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Estimated tax", "Conversion income", "Withholding review", "Calculator limits"]),
    );
  });

  it("exposes the estimated tax guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-estimated-tax-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-estimated-tax-guide");
    expect(pageFile).toContain("Roth Conversion Estimated Tax Guide");
    expect(pageFile).toContain("buildEstimatedTaxGuideSections");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/roth-conversion-estimated-tax-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-estimated-tax-guide");
  });
});
