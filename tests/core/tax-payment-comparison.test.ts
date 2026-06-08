import React from "react";
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";
import { TaxPaymentComparison } from "@/features/tax-payment-comparison/TaxPaymentComparison";
import { buildTaxPaymentComparison } from "@/features/tax-payment-comparison/tax-payment-comparison";

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

describe("tax payment comparison", () => {
  it("models outside funds as preserving more Roth principal than IRA withholding", () => {
    const result = calculateRothConversion(input);
    const comparison = buildTaxPaymentComparison(input, result);

    expect(comparison.taxToPay).toBe(result.federalTax + result.stateTax);
    expect(comparison.modeledIraWithholding).toBe(comparison.taxToPay);
    expect(comparison.unfundedTaxAmount).toBe(0);
    expect(comparison.outsideFunds.rothPrincipal).toBe(input.conversionAmount);
    expect(comparison.iraWithholding.rothPrincipal).toBeLessThan(input.conversionAmount);
    expect(comparison.projectedValueDifference).toBeGreaterThan(0);
    expect(comparison.iraWithholding.modeledPenalty).toBeGreaterThan(0);
  });

  it("caps IRA withholding and modeled penalty when estimated tax is larger than the conversion", () => {
    const smallConversionInput = {
      ...input,
      conversionAmount: 5000,
    };
    const result = {
      ...calculateRothConversion(smallConversionInput),
      federalTax: 4500,
      stateTax: 1500,
    };
    const comparison = buildTaxPaymentComparison(smallConversionInput, result);

    expect(comparison.taxToPay).toBeGreaterThan(smallConversionInput.conversionAmount);
    expect(comparison.modeledIraWithholding).toBe(smallConversionInput.conversionAmount);
    expect(comparison.unfundedTaxAmount).toBeGreaterThan(0);
    expect(comparison.iraWithholding.rothPrincipal).toBe(0);
    expect(comparison.iraWithholding.modeledPenalty).toBe(500);
  });

  it("renders a comparison without recommendation language", () => {
    const result = calculateRothConversion(input);
    const { container } = render(React.createElement(TaxPaymentComparison, { input, result }));
    const copy = container.textContent ?? "";

    expect(screen.getByTestId("tax-payment-comparison").textContent).toContain("Tax Payment Method Comparison");
    expect(copy).toContain("Pay with outside funds");
    expect(copy).toContain("Withhold from IRA distribution");
    expect(copy).toContain("not a recommendation");
    expect(copy).not.toMatch(/\byou should\b/i);
    expect(copy).not.toMatch(/\bstrongly recommend\b/i);
    expect(copy).not.toMatch(/\bbest move\b/i);
  });

  it("renders the withholding cap boundary when estimated tax exceeds the conversion", () => {
    const smallConversionInput = {
      ...input,
      conversionAmount: 5000,
    };
    const result = {
      ...calculateRothConversion(smallConversionInput),
      federalTax: 4500,
      stateTax: 1500,
    };
    const { container } = render(React.createElement(TaxPaymentComparison, { input: smallConversionInput, result }));
    const copy = container.textContent ?? "";

    expect(copy).toContain("withheld from the IRA before Roth growth");
    expect(copy).toContain("estimated tax is outside this withholding model");
    expect(copy).toContain("penalty basis is capped");
  });


  it("is gated through the main feature registry on the homepage", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(source).toContain('isFeatureEnabled("tax-payment-comparison")');
    expect(source).toContain("<TaxPaymentComparison input={input} result={result} />");
  });
});
