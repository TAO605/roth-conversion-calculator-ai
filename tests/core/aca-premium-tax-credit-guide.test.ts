import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { buildAcaPtcGuideSections, getAcaPtcGuideSummary } from "@/content/aca-premium-tax-credit-guide";
import { blogPosts } from "@/content/blog";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion ACA premium tax credit guide", () => {
  it("builds an educational guide for Marketplace premium tax credit interactions", () => {
    const sections = buildAcaPtcGuideSections();
    const summary = getAcaPtcGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "marketplace-basics",
        "conversion-income",
        "advance-credit-reconciliation",
        "household-and-coverage",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Marketplace savings are based on estimated household income");
    expect(labels).toContain("Roth conversion income can change annual household income");
    expect(labels).toContain("Advance premium tax credits are reconciled on the tax return");
    expect(labels).toContain("Form 1095-A and Form 8962 records should be reviewed");
    expect(labels).toContain("Calculator does not estimate ACA premium tax credits");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Marketplace income", "Conversion income", "APTC reconciliation", "Calculator limits"]),
    );
  });

  it("exposes the ACA PTC guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-aca-premium-tax-credit-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-aca-premium-tax-credit-guide");
    expect(pageFile).toContain("Roth Conversion ACA Premium Tax Credit Guide");
    expect(pageFile).toContain("buildAcaPtcGuideSections");
    expect(homePage).toContain('href="/roth-conversion-aca-premium-tax-credit-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-aca-premium-tax-credit-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-aca-premium-tax-credit-guide");
  });
});
