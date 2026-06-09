import { describe, expect, it } from "vitest";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  getStateRuleRegistryEntry,
  stateRuleRegistry,
  stateRuleRegistryHasAllStatePages,
  type StateRuleStatus,
} from "@/content/state-rule-registry";
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
      selectedState: "california",
      stateMarginalTaxRate: 0.093,
      taxYear: 2026,
    });
  });

  it("keeps every state page covered by the state rule registry scaffold", () => {
    const registrySlugs = new Set(stateRuleRegistry.map((entry) => entry.slug));

    expect(stateRuleRegistryHasAllStatePages()).toBe(true);
    expect(statePages.every((page) => registrySlugs.has(page.slug))).toBe(true);
  });

  it("uses only supported state rule registry statuses", () => {
    const supportedStatuses = new Set<StateRuleStatus>(["manual-only", "no-income-tax", "needs-review"]);

    expect(stateRuleRegistry.every((entry) => supportedStatuses.has(entry.status))).toBe(true);
    expect(getStateRuleRegistryEntry(null).status).toBe("manual-only");
    expect(getStateRuleRegistryEntry("texas").status).toBe("no-income-tax");
    expect(getStateRuleRegistryEntry("california").status).toBe("needs-review");
  });
});
