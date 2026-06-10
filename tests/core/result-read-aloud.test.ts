import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { buildResultReadAloudText } from "@/features/voice-output/ResultReadAloudButton";

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

describe("result read aloud", () => {
  it("builds an educational local speech summary without advice language", () => {
    const text = buildResultReadAloudText(input, calculateRothConversion(input));

    expect(text).toContain("Educational Roth conversion estimate for tax year 2026");
    expect(text).toContain("Modeled taxable conversion");
    expect(text).toContain("Estimated federal tax");
    expect(text).toContain("User-estimated state tax");
    expect(text).toContain("Total upfront cost estimate");
    expect(text).toContain("not tax advice");
    expect(text).toContain("qualified tax professional");
    expect(text).not.toMatch(/\b(recommend|optimal|you should convert)\b/i);
  });
});
