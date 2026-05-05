import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildConversionSensitivityRows } from "@/features/conversion-sensitivity/conversion-sensitivity";

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

describe("conversion sensitivity rows", () => {
  it("builds five educational conversion amount scenarios around the current input", () => {
    const rows = buildConversionSensitivityRows(input);

    expect(rows).toHaveLength(5);
    expect(rows.map((row) => row.conversionAmount)).toEqual([25000, 37500, 50000, 62500, 75000]);
    expect(rows[2]).toMatchObject({
      label: "Current",
      conversionAmount: 50000,
    });
    expect(rows.every((row) => row.totalUpfrontCost > 0)).toBe(true);
  });

  it("caps scenario amounts at the traditional IRA balance", () => {
    const rows = buildConversionSensitivityRows({
      ...input,
      conversionAmount: 240000,
      traditionalIraBalance: 250000,
    });

    expect(Math.max(...rows.map((row) => row.conversionAmount))).toBe(250000);
  });
});
