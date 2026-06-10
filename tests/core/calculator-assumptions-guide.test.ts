import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildCalculatorAssumptionGroups,
  getCalculatorAssumptionSummary,
} from "@/content/calculator-assumptions-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("calculator assumptions guide", () => {
  it("builds a grouped guide for calculator inputs and assumptions", () => {
    const groups = buildCalculatorAssumptionGroups();
    const summary = getCalculatorAssumptionSummary(groups);
    const labels = groups.flatMap((group) => group.assumptions.map((assumption) => assumption.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["tax-profile", "account-values", "conversion-settings", "projection-settings"]),
    );
    expect(labels).toContain("Current taxable income");
    expect(labels).toContain("After-tax basis");
    expect(labels).toContain("State marginal tax rate");
    expect(labels).toContain("Tax payment method");
    expect(labels).toContain("Expected annual return");
    expect(summary.totalAssumptions).toBeGreaterThanOrEqual(12);
    expect(summary.calculatorKeys).toEqual(
      expect.arrayContaining(["currentTaxableIncome", "basis", "stateMarginalTaxRate", "taxPaymentMethod"]),
    );
  });

  it("exposes the assumptions guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/calculator-assumptions-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/calculator-assumptions-guide");
    expect(pageFile).toContain("Calculator Assumptions Guide");
    expect(pageFile).toContain("buildCalculatorAssumptionGroups");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/calculator-assumptions-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/calculator-assumptions-guide");
  });
});
