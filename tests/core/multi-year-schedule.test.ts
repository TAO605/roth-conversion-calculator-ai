import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildMultiYearConversionScheduleRows } from "@/features/multi-year-schedule/multi-year-schedule";

const input: RothConversionInput = {
  conversionAmount: 60000,
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

describe("multi-year conversion schedule rows", () => {
  it("compares common equal-split schedules without mutating the original input", () => {
    const original = structuredClone(input);
    const rows = buildMultiYearConversionScheduleRows(input);

    expect(input).toEqual(original);
    expect(rows).toHaveLength(4);
    expect(rows.map((row) => row.years)).toEqual([1, 2, 3, 5]);
    expect(rows.map((row) => row.annualConversionAmount)).toEqual([60000, 30000, 20000, 12000]);
    expect(rows.every((row) => row.totalConverted === 60000)).toBe(true);
    expect(rows.every((row) => row.totalUpfrontCost > 0)).toBe(true);
    expect(rows.every((row) => row.highestFederalRate > 0)).toBe(true);
  });

  it("caps modeled conversion schedules at the available traditional IRA balance", () => {
    const rows = buildMultiYearConversionScheduleRows({
      ...input,
      conversionAmount: 90000,
      traditionalIraBalance: 45000,
    });

    expect(rows[0]).toMatchObject({
      years: 1,
      annualConversionAmount: 45000,
      totalConverted: 45000,
    });
    expect(rows[3]).toMatchObject({
      years: 5,
      annualConversionAmount: 9000,
      totalConverted: 45000,
    });
  });

  it("keeps annual withholding aligned with each split when IRA withholding is modeled", () => {
    const rows = buildMultiYearConversionScheduleRows({
      ...input,
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 12000,
    });

    expect(rows[0].totalPenalty).toBe(1200);
    expect(rows[1].totalPenalty).toBe(1200);
    expect(rows[3].totalPenalty).toBe(1200);
  });
});
