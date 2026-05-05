import { describe, expect, it, beforeEach } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import {
  buildShareUrl,
  loadStoredCalculatorInput,
  mergeCalculatorInput,
  saveCalculatorInput,
} from "@/common/storage/calculator-persistence";
import { faqJsonLd, webApplicationJsonLd } from "@/core/seo/json-ld";
import { faqItems } from "@/features/faq/FaqSection";
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
      taxPaymentMethod: "withhold_from_ira",
    });

    expect(merged.conversionAmount).toBe(75000);
    expect(merged.filingStatus).toBe("married_joint");
    expect(merged.taxPaymentMethod).toBe("withhold_from_ira");
    expect(merged.taxYear).toBe(2026);
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

  it("builds FAQPage structured data from the visible homepage FAQ", () => {
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

  it("uses one canonical site URL for metadata, robots, and sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    const robotsConfig = robots();

    expect(siteConfig.siteUrl).toBe("https://www.roth-conversion-calculator-ai.shop");
    expect(metadata.metadataBase?.toString()).toBe(`${siteConfig.siteUrl}/`);
    expect(metadata.openGraph?.url).toBe(siteConfig.siteUrl);
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "AI Roth Conversion Calculator 2026",
    });
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/sitemap.xml`);
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/feed.xml`);
    expect(robotsConfig.sitemap).toContain(`${siteConfig.siteUrl}/llms.txt`);
    expect(urls.every((url) => url.startsWith(siteConfig.siteUrl))).toBe(true);
  });
});
