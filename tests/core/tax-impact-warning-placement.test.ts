import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

const baseInput: RothConversionInput = {
  age: 64,
  basis: 0,
  conversionAmount: 60000,
  currentTaxableIncome: 195000,
  expectedAnnualReturn: 0.06,
  filingStatus: "single",
  inflationRate: 0.025,
  penaltyException: false,
  retirementAge: 65,
  retirementMarginalTaxRate: 0.22,
  stateMarginalTaxRate: 0.05,
  taxPaymentMethod: "outside_funds",
  taxYear: 2026,
  traditionalIraBalance: 300000,
  withheldForTaxes: 0,
};

const baseResult: RothConversionResult = {
  accuracyNotes: [],
  afterTaxDifference: 0,
  bracketImpact: {
    afterBracketTop: null,
    afterRate: 0.24,
    beforeBracketTop: 201775,
    beforeRate: 0.24,
    crossesBracket: true,
    incomeTaxedInHigherBrackets: 53225,
    roomInCurrentBracketAfterConversion: null,
    roomInCurrentBracketBeforeConversion: 6775,
  },
  breakdown: {
    basisExclusionRatio: 0,
    effectiveFederalTaxRate: 0.24,
    effectiveStateTaxRate: 0.05,
    penaltyBasis: 0,
    penaltyExplanation: "No penalty modeled.",
    taxableConversionRatio: 1,
    totalCostRate: 0.29,
  },
  breakEvenYear: null,
  earlyDistributionPenalty: 0,
  federalTax: 14400,
  projection: [],
  rothFutureValue: 0,
  stateTax: 3000,
  taxableConversion: 60000,
  totalUpfrontCost: 17400,
  traditionalAfterTaxValue: 0,
};

describe("tax impact warning placement", () => {
  it("renders hidden-cost warnings as a prioritized review panel", () => {
    render(React.createElement(TaxImpactWarnings, { input: baseInput, result: baseResult }));

    const panel = screen.getByTestId("tax-impact-warnings");

    expect(panel.textContent).toContain("Review before planning");
    expect(panel.textContent).toContain("Tax Impact Warnings");
    expect(panel.textContent).toContain("Medicare IRMAA");
    expect(panel.textContent).toContain("ACA premium tax credits");
    expect(panel.textContent).toContain("Required Minimum Distributions");
    expect(panel.textContent).toContain("input-triggered review items");
    expect(panel.textContent).toContain("Open guide");
  });

  it("prioritizes review items from inputs without calculating external tax amounts", () => {
    const items = buildTaxImpactReviewItems(baseInput, baseResult);
    const triggeredLabels = items
      .filter((item) => item.level === "input_triggered_review")
      .map((item) => item.label);

    expect(triggeredLabels).toContain("Medicare IRMAA");
    expect(triggeredLabels).toContain("ACA premium tax credits");
    expect(triggeredLabels).toContain("NIIT MAGI-side review");
    expect(triggeredLabels).toContain("State-specific retirement income rules");
    expect(items.find((item) => item.id === "niit")?.reason).toContain("taxable-income proxy");
    expect(items.find((item) => item.id === "niit")?.reason).not.toContain("NIIT amount");
  });

  it("keeps the warnings directly inside the results card before AI, projection, and advanced details", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");
    const resultSummaryIndex = source.indexOf("<ResultSummary result={result} />");
    const warningIndex = source.indexOf("<TaxImpactWarnings input={input} result={result} />");
    const aiIndex = source.indexOf('id="ai-explainer"');
    const projectionIndex = source.indexOf("<ProjectionChart");
    const advancedDetailsIndex = source.indexOf("Advanced calculation details");

    expect(resultSummaryIndex).toBeGreaterThan(-1);
    expect(warningIndex).toBeGreaterThan(resultSummaryIndex);
    expect(warningIndex).toBeLessThan(aiIndex);
    expect(warningIndex).toBeLessThan(projectionIndex);
    expect(warningIndex).toBeLessThan(advancedDetailsIndex);
    expect(source.match(/<TaxImpactWarnings input=\{input\} result=\{result\} \/>/g)).toHaveLength(1);
  });
});
