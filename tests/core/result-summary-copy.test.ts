import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { buildResultSummaryText } from "@/features/result-copy/result-summary-text";

const input: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

describe("result summary text", () => {
  it("builds a CPA-friendly educational summary with required disclaimer", () => {
    const result = calculateRothConversion(input);
    const summary = buildResultSummaryText(input, result);

    expect(summary).toContain("Roth Conversion Calculator Summary");
    expect(summary).toContain("Tax year: 2026");
    expect(summary).toContain("Conversion amount: $50,000");
    expect(summary).toContain("State tax estimate:");
    expect(summary).toContain("Total upfront cost:");
    expect(summary).toContain("Break-even estimate:");
    expect(summary).toContain("Federal bracket after conversion:");
    expect(summary).toContain(REQUIRED_DISCLAIMER);
  });
});
