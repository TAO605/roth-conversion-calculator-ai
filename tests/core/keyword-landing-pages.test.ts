import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  buildKeywordLandingCalculatorHref,
  getKeywordLandingPageBySlug,
  keywordLandingPages,
} from "@/content/keyword-landing-pages";
import sitemap from "@/app/sitemap";

describe("keyword landing pages", () => {
  it("defines high-intent calculator keyword pages with substantive compliant content", () => {
    const slugs = new Set(keywordLandingPages.map((page) => page.slug));

    expect(keywordLandingPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(keywordLandingPages.map((page) => page.slug)).toEqual(
      expect.arrayContaining([
        "roth-ira-conversion-calculator",
        "roth-conversion-tax-calculator",
        "roth-conversion-break-even-calculator",
        "2026-roth-conversion-calculator",
      ]),
    );
    expect(keywordLandingPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(keywordLandingPages.every((page) => page.disclaimer.includes("educational"))).toBe(true);
  });

  it("builds calculator anchor links for each keyword page", () => {
    const page = getKeywordLandingPageBySlug("roth-conversion-break-even-calculator");

    expect(page).toBeDefined();
    expect(buildKeywordLandingCalculatorHref(page!)).toBe("/#calculator");
  });

  it("adds a calculator keyword hub and root keyword pages to sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/calculators/page.tsx"), "utf8");
    const dynamicFile = fs.readFileSync(path.join(process.cwd(), "src/app/(keyword-pages)/[keyword]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/calculators");

    for (const page of keywordLandingPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Calculator Pages");
    expect(hubFile).toContain("keywordLandingPages.map");
    expect(dynamicFile).toContain("generateStaticParams");
    expect(dynamicFile).toContain("buildKeywordLandingCalculatorHref");
    expect(homePage).toContain('href="/site-index"');
  });
});
