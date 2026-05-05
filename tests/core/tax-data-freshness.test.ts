import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

describe("tax data freshness metadata", () => {
  it("documents the active tax year and update policy", () => {
    expect(TAX_DATA_FRESHNESS.taxYear).toBe(2026);
    expect(TAX_DATA_FRESHNESS.updateWindow).toContain("15 business days");
    expect(TAX_DATA_FRESHNESS.scope).toContain("educational");
    expect(TAX_DATA_FRESHNESS.excludedInteractions).toContain("IRMAA");
  });

  it("surfaces the freshness card on the homepage and methodology page", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const methodologyPage = fs.readFileSync(path.join(process.cwd(), "src/app/methodology/page.tsx"), "utf8");

    expect(homePage).toContain("TaxDataFreshnessCard");
    expect(methodologyPage).toContain("TaxDataFreshnessCard");
  });
});
