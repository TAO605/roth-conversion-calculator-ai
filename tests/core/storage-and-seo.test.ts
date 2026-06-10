import { describe, expect, it, beforeEach } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import {
  buildShareUrl,
  loadStoredCalculatorInput,
  mergeCalculatorInput,
  saveCalculatorInput,
} from "@/common/storage/calculator-persistence";
import { faqJsonLd, webApplicationJsonLd } from "@/core/seo/json-ld";
import { faqItems } from "@/features/faq/faq-items";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata } from "@/app/layout";
import { siteConfig } from "@/core/seo/site-config";

const defaults: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

describe("calculator persistence and share URLs", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("merges a partial decoded share payload onto safe defaults", () => {
    const merged = mergeCalculatorInput(defaults, {
      conversionAmount: 75000,
      filingStatus: "married_joint",
      netInvestmentIncome: 22000,
      selectedState: "new-york",
      taxPaymentMethod: "withhold_from_ira",
    });

    expect(merged.conversionAmount).toBe(75000);
    expect(merged.filingStatus).toBe("married_joint");
    expect(merged.netInvestmentIncome).toBe(22000);
    expect(merged.selectedState).toBe("new-york");
    expect(merged.taxPaymentMethod).toBe("withhold_from_ira");
    expect(merged.taxYear).toBe(2026);
  });

  it("sanitizes optional NIIT net investment income from decoded share or storage payloads", () => {
    expect(mergeCalculatorInput(defaults, { netInvestmentIncome: 18000 }).netInvestmentIncome).toBe(18000);
    expect(mergeCalculatorInput(defaults, { netInvestmentIncome: -1 }).netInvestmentIncome).toBeNull();
    expect(mergeCalculatorInput(defaults, { netInvestmentIncome: Number.NaN }).netInvestmentIncome).toBeNull();
  });

  it("sanitizes optional Social Security taxable-benefit review inputs from decoded payloads", () => {
    const merged = mergeCalculatorInput(defaults, {
      annualSocialSecurityBenefits: 30000,
      taxExemptInterest: 1000,
    });

    expect(merged.annualSocialSecurityBenefits).toBe(30000);
    expect(merged.taxExemptInterest).toBe(1000);
    expect(mergeCalculatorInput(defaults, { annualSocialSecurityBenefits: -1 }).annualSocialSecurityBenefits).toBeNull();
    expect(mergeCalculatorInput(defaults, { taxExemptInterest: Number.NaN }).taxExemptInterest).toBeNull();
  });

  it("sanitizes optional ACA Marketplace review inputs from decoded payloads", () => {
    const merged = mergeCalculatorInput(defaults, {
      annualAdvancePremiumTaxCredit: 7200,
      marketplaceCoverageMonths: 12,
    });

    expect(merged.annualAdvancePremiumTaxCredit).toBe(7200);
    expect(merged.marketplaceCoverageMonths).toBe(12);
    expect(mergeCalculatorInput(defaults, { annualAdvancePremiumTaxCredit: -1 }).annualAdvancePremiumTaxCredit).toBeNull();
    expect(mergeCalculatorInput(defaults, { marketplaceCoverageMonths: 13 }).marketplaceCoverageMonths).toBeNull();
  });

  it("sanitizes optional AMT comparison inputs from decoded payloads", () => {
    const merged = mergeCalculatorInput(defaults, {
      amtRegularTaxLiability: 28000,
      amtTentativeMinimumTax: 31000,
    });

    expect(merged.amtTentativeMinimumTax).toBe(31000);
    expect(merged.amtRegularTaxLiability).toBe(28000);
    expect(mergeCalculatorInput(defaults, { amtTentativeMinimumTax: -1 }).amtTentativeMinimumTax).toBeNull();
    expect(mergeCalculatorInput(defaults, { amtRegularTaxLiability: Number.NaN }).amtRegularTaxLiability).toBeNull();
  });

  it("drops unsupported selectedState values from decoded share or storage payloads", () => {
    const merged = mergeCalculatorInput(defaults, {
      selectedState: "not-a-supported-state",
      stateMarginalTaxRate: 0.08,
    });

    expect(merged.selectedState).toBeNull();
    expect(merged.stateMarginalTaxRate).toBe(0.08);
  });

  it("sanitizes selected-state readiness inputs from decoded share or storage payloads", () => {
    const merged = mergeCalculatorInput(defaults, {
      stateReadinessInputs: {
        localTaxApplies: true,
        notes: "x".repeat(650),
        otherStateTaxCreditApplies: false,
        reviewedStateTaxEstimate: 6200,
        residencyStatus: "resident",
        stateAdjustedGrossIncome: 120000,
        stateIraBasis: 7000,
      },
    });

    expect(merged.stateReadinessInputs).toMatchObject({
      localTaxApplies: true,
      otherStateTaxCreditApplies: false,
      reviewedStateTaxEstimate: 6200,
      residencyStatus: "resident",
      stateAdjustedGrossIncome: 120000,
      stateIraBasis: 7000,
    });
    expect(merged.stateReadinessInputs?.notes).toHaveLength(500);

    const unsafe = mergeCalculatorInput(defaults, {
      stateReadinessInputs: {
        localTaxApplies: "yes" as unknown as boolean,
        notes: 123 as unknown as string,
        otherStateTaxCreditApplies: null,
        reviewedStateTaxEstimate: -1,
        residencyStatus: "bad-status" as "resident",
        stateAdjustedGrossIncome: Number.NaN,
        stateIraBasis: null,
      },
    });

    expect(unsafe.stateReadinessInputs).toMatchObject({
      localTaxApplies: null,
      notes: "",
      otherStateTaxCreditApplies: null,
      reviewedStateTaxEstimate: null,
      residencyStatus: "not_provided",
      stateAdjustedGrossIncome: null,
      stateIraBasis: null,
    });
  });

  it("builds a share URL with hash encoded calculator input", () => {
    const url = buildShareUrl("https://www.roth-conversion-calculator-ai.shop/calculator", defaults);

    expect(url.startsWith("https://www.roth-conversion-calculator-ai.shop/calculator#")).toBe(true);
    expect(url.length).toBeGreaterThan("https://www.roth-conversion-calculator-ai.shop/calculator#".length);
  });

  it("saves and loads calculator input from localStorage", () => {
    saveCalculatorInput(defaults);

    expect(loadStoredCalculatorInput()).toMatchObject({
      conversionAmount: defaults.conversionAmount,
      filingStatus: defaults.filingStatus,
    });
  });
});

describe("seo json-ld", () => {
  it("describes the calculator as a finance web application", () => {
    const jsonLd = webApplicationJsonLd();

    expect(jsonLd["@type"]).toBe("WebApplication");
    expect(jsonLd.applicationCategory).toBe("FinanceApplication");
    expect(jsonLd.name).toContain("Roth Conversion Calculator");
  });

  it("builds FAQPage structured data from reusable FAQ items for pages that visibly mount them", () => {
    const jsonLd = faqJsonLd(faqItems);

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toHaveLength(4);
    expect(jsonLd.mainEntity[0]).toMatchObject({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
      },
    });
  });

  it("includes maintenance pages in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/release-notes");
  });

  it("adds crawl priority and change frequency hints to sitemap entries", () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url === "https://www.roth-conversion-calculator-ai.shop");
    const calculatorHub = entries.find(
      (entry) => entry.url === "https://www.roth-conversion-calculator-ai.shop/calculators",
    );
    const blogPost = entries.find((entry) => entry.url.includes("/blog/what-is-a-roth-conversion-2026"));

    expect(home).toMatchObject({
      changeFrequency: "weekly",
      priority: 1,
    });
    expect(calculatorHub).toMatchObject({
      changeFrequency: "weekly",
      priority: 0.9,
    });
    expect(blogPost).toMatchObject({
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  it("keeps recently updated static SEO operation pages fresh in sitemap lastmod", () => {
    const entries = sitemap();
    const releaseNotes = entries.find((entry) => entry.url === `${siteConfig.siteUrl}/release-notes`);
    const seoMonitoring = entries.find((entry) => entry.url === `${siteConfig.siteUrl}/seo-monitoring`);
    const methodology = entries.find((entry) => entry.url === `${siteConfig.siteUrl}/methodology`);
    const taxDataUpdate = entries.find((entry) => entry.url === `${siteConfig.siteUrl}/tax-data-update`);

    expect(releaseNotes?.lastModified?.toISOString().slice(0, 10)).toBe("2026-05-30");
    expect(seoMonitoring?.lastModified?.toISOString().slice(0, 10)).toBe("2026-05-30");
    expect(methodology?.lastModified?.toISOString().slice(0, 10)).toBe("2026-05-30");
    expect(taxDataUpdate?.lastModified?.toISOString().slice(0, 10)).toBe("2026-05-30");
  });

  it("uses one canonical site URL for metadata, robots, and sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    const robotsConfig = robots();

    expect(siteConfig.siteUrl).toBe("https://www.roth-conversion-calculator-ai.shop");
    expect(metadata.metadataBase?.toString()).toBe(`${siteConfig.siteUrl}/`);
    expect(metadata.openGraph?.url).toBe(siteConfig.siteUrl);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Roth Conversion Calculator 2026",
    });
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/sitemap.xml`);
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/feed.xml`);
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/llms.txt`);
    expect(urls.every((url) => url.startsWith(siteConfig.siteUrl))).toBe(true);
  });
});
