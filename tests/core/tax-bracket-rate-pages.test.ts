import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  buildBracketRateCalculatorHref,
  getTaxBracketRatePageBySlug,
  taxBracketRatePages,
} from "@/content/tax-bracket-rate-pages";
import sitemap from "@/app/sitemap";

describe("2026 tax bracket rate SEO pages", () => {
  it("defines one educational page for each 2026 federal bracket rate", () => {
    const slugs = new Set(taxBracketRatePages.map((page) => page.slug));

    expect(taxBracketRatePages).toHaveLength(7);
    expect(slugs.size).toBe(7);
    expect(taxBracketRatePages.map((page) => page.rate)).toEqual([0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]);
    expect(taxBracketRatePages.every((page) => page.ranges.length === 4)).toBe(true);
    expect(taxBracketRatePages.every((page) => page.disclaimer.includes("educational"))).toBe(true);
  });

  it("builds calculator links and resolves rate pages by slug", () => {
    const page = getTaxBracketRatePageBySlug("24-percent-tax-bracket");

    expect(page).toBeDefined();
    expect(page?.title).toContain("24%");
    expect(buildBracketRateCalculatorHref(page!)).toBe("/#calculator");
  });

  it("adds rate pages to sitemap and renders a dynamic route with tables", () => {
    const urls = sitemap().map((entry) => entry.url);
    const dynamicFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/tax-brackets/2026/[rate]/page.tsx"),
      "utf8",
    );
    const indexFile = fs.readFileSync(path.join(process.cwd(), "src/app/tax-brackets/2026/page.tsx"), "utf8");

    for (const page of taxBracketRatePages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/tax-brackets/2026/${page.slug}`);
    }

    expect(dynamicFile).toContain("generateStaticParams");
    expect(dynamicFile).toContain("buildBracketRateCalculatorHref");
    expect(dynamicFile).toContain("Taxable income range");
    expect(indexFile).toContain("/tax-brackets/2026/${ratePage.slug}");
  });
});
