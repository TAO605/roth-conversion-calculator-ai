import { describe, expect, it } from "vitest";
import { calculateFederalTaxDelta } from "@/core/calculator/federal-tax";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { validateCalculatorInput } from "@/core/calculator/validation";
import { decodeShareCode, encodeShareCode } from "@/common/storage/share-code";

const baseInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single" as const,
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds" as const,
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026 as const,
};

describe("federal tax calculation", () => {
  it("calculates federal tax delta using progressive brackets for single filers", () => {
    expect(
      calculateFederalTaxDelta({
        filingStatus: "single",
        currentTaxableIncome: 85000,
        additionalTaxableIncome: 50000,
        taxYear: 2026,
      }),
    ).toBeGreaterThan(0);
  });

  it("returns zero federal tax when additional taxable income is zero", () => {
    expect(
      calculateFederalTaxDelta({
        filingStatus: "married_joint",
        currentTaxableIncome: 100000,
        additionalTaxableIncome: 0,
        taxYear: 2026,
      }),
    ).toBe(0);
  });
});

describe("roth conversion calculation", () => {
  it("reduces taxable conversion by the pro-rata basis share", () => {
    const result = calculateRothConversion({
      ...baseInput,
      conversionAmount: 50000,
      traditionalIraBalance: 200000,
      basis: 40000,
    });

    expect(result.taxableConversion).toBe(40000);
  });

  it("does not apply a 10% penalty when taxes are paid from outside funds", () => {
    const result = calculateRothConversion(baseInput);

    expect(result.earlyDistributionPenalty).toBe(0);
  });

  it("applies a 10% penalty to withheld IRA distribution when under 59.5 without exception", () => {
    const result = calculateRothConversion({
      ...baseInput,
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 6000,
    });

    expect(result.earlyDistributionPenalty).toBe(600);
  });

  it("does not apply the modeled early distribution penalty at age 59.5 or older", () => {
    const result = calculateRothConversion({
      ...baseInput,
      age: 59.5,
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 6000,
    });

    expect(result.earlyDistributionPenalty).toBe(0);
    expect(result.breakdown.penaltyBasis).toBe(0);
    expect(result.breakdown.penaltyExplanation).toContain("age is at least 59.5");
  });

  it("does not apply the modeled early distribution penalty when exception is selected", () => {
    const result = calculateRothConversion({
      ...baseInput,
      penaltyException: true,
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 6000,
    });

    expect(result.earlyDistributionPenalty).toBe(0);
    expect(result.breakdown.penaltyBasis).toBe(0);
    expect(result.breakdown.penaltyExplanation).toContain("penalty exception");
  });

  it("does not model a penalty amount when tax payment method is not sure", () => {
    const result = calculateRothConversion({
      ...baseInput,
      taxPaymentMethod: "not_sure",
      withheldForTaxes: 6000,
    });

    expect(result.earlyDistributionPenalty).toBe(0);
    expect(result.breakdown.penaltyBasis).toBe(0);
    expect(result.breakdown.penaltyExplanation).toContain("not sure");
  });

  it("returns a future Roth value and a break-even year", () => {
    const result = calculateRothConversion(baseInput);

    expect(result.rothFutureValue).toBeGreaterThan(baseInput.conversionAmount);
    expect(result.breakEvenYear === null || result.breakEvenYear > 0).toBe(true);
  });

  it("returns a transparent calculation breakdown", () => {
    const result = calculateRothConversion({
      ...baseInput,
      conversionAmount: 50000,
      traditionalIraBalance: 200000,
      basis: 40000,
      stateMarginalTaxRate: 0.05,
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 6000,
    });

    expect(result.breakdown.basisExclusionRatio).toBe(0.2);
    expect(result.breakdown.taxableConversionRatio).toBe(0.8);
    expect(result.breakdown.effectiveFederalTaxRate).toBeGreaterThan(0);
    expect(result.breakdown.totalCostRate).toBeGreaterThan(0);
    expect(result.breakdown.penaltyBasis).toBe(6000);
    expect(result.breakdown.penaltyExplanation).toContain("withheld");
  });
});

describe("input validation and share codes", () => {
  it("returns validation errors for negative conversion amount and basis above balance", () => {
    const errors = validateCalculatorInput({
      ...baseInput,
      conversionAmount: -1,
      basis: 300000,
    });

    expect(errors.conversionAmount).toContain("non-negative");
    expect(errors.basis).toContain("IRA balance");
  });

  it("round-trips share codes without uploading data", () => {
    const code = encodeShareCode(baseInput);
    expect(decodeShareCode(code)).toMatchObject({
      conversionAmount: baseInput.conversionAmount,
      filingStatus: baseInput.filingStatus,
      taxPaymentMethod: baseInput.taxPaymentMethod,
    });
  });
});
