import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  buildMultiYearPlanningCalculatorHref,
  getMultiYearPlanningPageBySlug,
  multiYearPlanningPages,
} from "@/content/multi-year-planning-pages";
import sitemap from "@/app/sitemap";

describe("multi-year planning SEO pages", () => {
  it("defines educational pages for staged Roth conversion planning", () => {
    const slugs = new Set(multiYearPlanningPages.map((page) => page.slug));

    expect(multiYearPlanningPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(multiYearPlanningPages.map((page) => page.years)).toEqual([1, 2, 3, 5]);
    expect(multiYearPlanningPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(multiYearPlanningPages.every((page) => page.complianceNote.includes("educational"))).toBe(true);
  });

  it("builds calculator prefill links for the selected schedule", () => {
    const page = getMultiYearPlanningPageBySlug("3-year-plan");

    expect(page).toBeDefined();

    const href = buildMultiYearPlanningCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      conversionAmount: 60000,
      taxPaymentMethod: "outside_funds",
      taxYear: 2026,
    });
  });

  it("adds a multi-year planning hub and detail pages to sitemap with homepage discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/multi-year-planning/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(path.join(process.cwd(), "src/app/multi-year-planning/[plan]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/multi-year-planning");

    for (const page of multiYearPlanningPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/multi-year-planning/${page.slug}`);
    }

    expect(hubFile).toContain("Multi-year Roth Conversion Planning");
    expect(hubFile).toContain("multiYearPlanningPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("buildMultiYearPlanningCalculatorHref");
    expect(homePage).toContain('href="/multi-year-planning"');
  });
});
