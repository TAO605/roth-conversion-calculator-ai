import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

describe("tax data freshness metadata", () => {
  it("documents the active tax year and update policy", () => {
    expect(TAX_DATA_FRESHNESS.taxYear).toBe(2026);
    expect(TAX_DATA_FRESHNESS.lastUpdated).toBe("May 30, 2026");
    expect(TAX_DATA_FRESHNESS.updateWindow).toContain("15 business days");
    expect(TAX_DATA_FRESHNESS.scope).toContain("educational");
    expect(TAX_DATA_FRESHNESS.excludedInteractions).toContain("final IRMAA billing determinations");
  });

  it("keeps source links and professional review status explicit", () => {
    const sourceUrls = TAX_DATA_FRESHNESS.sourceUrls.map((source) => source.url);

    expect(TAX_DATA_FRESHNESS.professionalReviewStatus).toContain("pending");
    expect(TAX_DATA_FRESHNESS.professionalReviewStatus).toContain("educational estimate");
    expect(sourceUrls).toContain(
      "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill/",
    );
    expect(sourceUrls).toContain("https://www.irs.gov/publications/p590a");
    expect(sourceUrls).toContain("https://www.irs.gov/publications/p590b");
    expect(sourceUrls).toContain("https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles");
  });

  it("surfaces the freshness card on the methodology page while the homepage stays tool-only", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const methodologyPage = fs.readFileSync(path.join(process.cwd(), "src/app/methodology/page.tsx"), "utf8");

    expect(homePage).not.toContain("TaxDataFreshnessCard");
    expect(methodologyPage).toContain("TaxDataFreshnessCard");
  });
});
