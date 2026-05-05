import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  buildExampleScenarioCalculatorHref,
  exampleScenarioPages,
  getExampleScenarioPageBySlug,
} from "@/content/example-scenario-pages";
import sitemap from "@/app/sitemap";

describe("example scenario SEO pages", () => {
  it("defines crawlable scenario pages for every calculator preset", () => {
    const slugs = new Set(exampleScenarioPages.map((page) => page.slug));

    expect(exampleScenarioPages).toHaveLength(3);
    expect(slugs.size).toBe(3);
    expect(exampleScenarioPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(exampleScenarioPages.every((page) => page.disclaimer.includes("not a recommendation"))).toBe(true);
  });

  it("builds calculator links that prefill the selected scenario assumptions", () => {
    const page = getExampleScenarioPageBySlug("young-professional");

    expect(page).toBeDefined();

    const href = buildExampleScenarioCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      conversionAmount: 25000,
      currentTaxableIncome: 65000,
      age: 32,
      taxYear: 2026,
    });
  });

  it("adds examples hub and detail pages to sitemap and homepage discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/examples/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(path.join(process.cwd(), "src/app/examples/[example]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/examples");

    for (const page of exampleScenarioPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/examples/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Calculator Examples");
    expect(hubFile).toContain("exampleScenarioPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("buildExampleScenarioCalculatorHref");
    expect(homePage).toContain('href="/examples"');
  });
});
