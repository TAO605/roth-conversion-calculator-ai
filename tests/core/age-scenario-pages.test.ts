import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  ageScenarioPages,
  buildAgeScenarioCalculatorHref,
  getAgeScenarioPageBySlug,
} from "@/content/age-scenario-pages";
import sitemap from "@/app/sitemap";

describe("age scenario SEO pages", () => {
  it("defines four age scenario pages with compliant educational content", () => {
    const slugs = new Set(ageScenarioPages.map((page) => page.slug));

    expect(ageScenarioPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(ageScenarioPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(ageScenarioPages.every((page) => page.complianceNote.includes("educational"))).toBe(true);
  });

  it("builds calculator prefill links with age and retirement age assumptions", () => {
    const page = getAgeScenarioPageBySlug("under-59-and-a-half");

    expect(page).toBeDefined();

    const href = buildAgeScenarioCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      age: 45,
      retirementAge: 65,
      taxYear: 2026,
    });
  });

  it("adds an age scenario hub and detail pages to sitemap with static routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/age-scenarios/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(path.join(process.cwd(), "src/app/age-scenarios/[scenario]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/age-scenarios");

    for (const page of ageScenarioPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/age-scenarios/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Calculator by Age");
    expect(hubFile).toContain("ageScenarioPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("buildAgeScenarioCalculatorHref");
    expect(homePage).toContain('href="/site-index"');
  });
});
