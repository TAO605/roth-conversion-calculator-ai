import { describe, expect, it } from "vitest";
import { decodeShareCode } from "@/common/storage/share-code";
import { buildStateCalculatorHref, getStatePageBySlug, statePages } from "@/content/state-pages";

describe("state SEO pages", () => {
  it("defines six unique state pages with substantive content", () => {
    const slugs = new Set(statePages.map((page) => page.slug));

    expect(statePages).toHaveLength(6);
    expect(slugs.size).toBe(6);
    expect(statePages.every((page) => page.paragraphs.length >= 3)).toBe(true);
  });

  it("includes no-tax and high-tax state examples", () => {
    expect(getStatePageBySlug("texas")?.stateTaxSummary).toContain("no state individual income tax");
    expect(getStatePageBySlug("california")?.stateTaxRateExample).toBeGreaterThan(0.09);
  });

  it("marks state tax rates as examples that require verification", () => {
    expect(statePages.every((page) => page.verificationNote.includes("Verify"))).toBe(true);
  });

  it("builds calculator prefill links with the state example rate", () => {
    const california = getStatePageBySlug("california");

    expect(california).toBeDefined();

    const href = buildStateCalculatorHref(california!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      stateMarginalTaxRate: 0.093,
      taxYear: 2026,
    });
  });
});
