import { describe, expect, it } from "vitest";
import { calculateBracketImpact } from "@/core/calculator/bracket-impact";

describe("federal tax bracket impact", () => {
  it("detects when a Roth conversion crosses into a higher bracket", () => {
    const impact = calculateBracketImpact({
      filingStatus: "single",
      currentTaxableIncome: 100000,
      additionalTaxableIncome: 20000,
      taxYear: 2026,
    });

    expect(impact.beforeRate).toBe(0.22);
    expect(impact.afterRate).toBe(0.24);
    expect(impact.crossesBracket).toBe(true);
    expect(impact.roomInCurrentBracketBeforeConversion).toBe(5700);
    expect(impact.incomeTaxedInHigherBrackets).toBe(14300);
  });

  it("shows remaining room when conversion stays in the same bracket", () => {
    const impact = calculateBracketImpact({
      filingStatus: "married_joint",
      currentTaxableIncome: 90000,
      additionalTaxableIncome: 5000,
      taxYear: 2026,
    });

    expect(impact.beforeRate).toBe(0.12);
    expect(impact.afterRate).toBe(0.12);
    expect(impact.crossesBracket).toBe(false);
    expect(impact.roomInCurrentBracketAfterConversion).toBe(5800);
    expect(impact.incomeTaxedInHigherBrackets).toBe(0);
  });
});
