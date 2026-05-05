import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  basisPlanningPages,
  buildBasisPlanningCalculatorHref,
  getBasisPlanningPageBySlug,
} from "@/content/basis-planning-pages";
import sitemap from "@/app/sitemap";

describe("basis planning SEO pages", () => {
  it("defines educational pages for basis, pro-rata, and Form 8606 calculator inputs", () => {
    const slugs = new Set(basisPlanningPages.map((page) => page.slug));

    expect(basisPlanningPages).toHaveLength(3);
    expect(slugs.size).toBe(3);
    expect(basisPlanningPages.map((page) => page.slug)).toEqual([
      "after-tax-basis",
      "pro-rata-rule",
      "form-8606",
    ]);
    expect(basisPlanningPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(basisPlanningPages.every((page) => page.complianceNote.includes("educational"))).toBe(true);
  });

  it("builds calculator prefill links with basis and IRA balance assumptions", () => {
    const page = getBasisPlanningPageBySlug("pro-rata-rule");

    expect(page).toBeDefined();

    const href = buildBasisPlanningCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      traditionalIraBalance: 200000,
      basis: 40000,
      conversionAmount: 50000,
      taxYear: 2026,
    });
  });

  it("adds a basis hub and detail pages to sitemap with homepage discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/basis/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(path.join(process.cwd(), "src/app/basis/[topic]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/basis");

    for (const page of basisPlanningPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/basis/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Basis and Pro-Rata Rule");
    expect(hubFile).toContain("basisPlanningPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("buildBasisPlanningCalculatorHref");
    expect(homePage).toContain('href="/basis"');
  });
});
