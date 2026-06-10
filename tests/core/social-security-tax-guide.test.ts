import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildSiteIndexGroups } from "@/content/site-index";
import {
  buildSocialSecurityTaxGuideSections,
  getSocialSecurityTaxGuideSummary,
} from "@/content/social-security-tax-guide";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion Social Security tax guide", () => {
  it("builds an educational guide for Social Security tax interactions", () => {
    const sections = buildSocialSecurityTaxGuideSections();
    const summary = getSocialSecurityTaxGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "taxable-benefit-basics",
        "conversion-income",
        "worksheet-review",
        "retiree-scenarios",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Social Security benefits may become partly taxable based on combined income");
    expect(labels).toContain("Roth conversion income can change the taxable benefits worksheet");
    expect(labels).toContain("Publication 915 worksheet review is separate from the calculator");
    expect(labels).toContain("Retirees should model Social Security taxation before relying on conversion estimates");
    expect(labels).toContain("Calculator does not compute taxable Social Security benefits");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Taxable benefits", "Conversion income", "Publication 915 worksheet", "Calculator limits"]),
    );
  });

  it("exposes the Social Security tax guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-social-security-tax-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-social-security-tax-guide");
    expect(pageFile).toContain("Roth Conversion Social Security Tax Guide");
    expect(pageFile).toContain("buildSocialSecurityTaxGuideSections");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/roth-conversion-social-security-tax-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-social-security-tax-guide");
  });
});
