import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildFederalBracketCapacityRows } from "@/features/bracket-capacity/bracket-capacity";

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

describe("federal bracket capacity rows", () => {
  it("shows remaining taxable room and gross conversion capacity by bracket", () => {
    const rows = buildFederalBracketCapacityRows(input);
    const twentyTwoPercent = rows.find((row) => row.rate === 0.22);
    const twentyFourPercent = rows.find((row) => row.rate === 0.24);

    expect(rows.length).toBeGreaterThan(0);
    expect(twentyTwoPercent).toMatchObject({
      rate: 0.22,
      taxableRoom: 20700,
      grossConversionCapacity: 20700,
      currentBracket: true,
    });
    expect(twentyFourPercent?.taxableRoom).toBe(96075);
  });

  it("adjusts gross conversion capacity when after-tax basis reduces taxable conversion ratio", () => {
    const rows = buildFederalBracketCapacityRows({
      ...input,
      traditionalIraBalance: 200000,
      basis: 50000,
    });
    const current = rows.find((row) => row.currentBracket);

    expect(current?.taxableRoom).toBe(20700);
    expect(current?.grossConversionCapacity).toBe(27600);
  });
});
