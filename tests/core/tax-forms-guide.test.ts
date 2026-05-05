import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildTaxFormsGuideGroups, getTaxFormsGuideSummary } from "@/content/tax-forms-guide";
import { buildLlmsText } from "@/core/seo/llms";

describe("tax forms guide", () => {
  it("builds an educational guide for Roth conversion tax forms and records", () => {
    const groups = buildTaxFormsGuideGroups();
    const summary = getTaxFormsGuideSummary(groups);
    const labels = groups.flatMap((group) => group.forms.map((form) => form.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["conversion-reporting", "basis-records", "custodian-documents", "review-package"]),
    );
    expect(labels).toContain("Form 1099-R");
    expect(labels).toContain("Form 5498");
    expect(labels).toContain("Form 8606");
    expect(labels).toContain("Traditional IRA statements");
    expect(labels).toContain("Prior-year tax returns");
    expect(summary.totalForms).toBeGreaterThanOrEqual(10);
    expect(summary.calculatorConnections).toEqual(
      expect.arrayContaining(["basis", "traditionalIraBalance", "conversionAmount", "taxableConversion"]),
    );
  });

  it("exposes the tax forms guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-tax-forms/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-tax-forms");
    expect(pageFile).toContain("Roth Conversion Tax Forms Guide");
    expect(pageFile).toContain("buildTaxFormsGuideGroups");
    expect(homePage).toContain('href="/roth-conversion-tax-forms"');
    expect(siteIndexUrls).toContain("/roth-conversion-tax-forms");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-tax-forms");
  });
});
