import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";
import { buildIrmaaReviewPrep, estimateIrmaaPartBFromIncomeProxy } from "@/features/tax-impact-warnings/irmaa-review-prep";
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
    expect(panel.textContent).toContain("IRMAA Review Prep");
    expect(panel.textContent).toContain("2026 Part B proxy preview");
    expect(panel.textContent).toContain("$649.20");
    expect(panel.textContent).toContain("$446.30");
    expect(panel.textContent).toContain("of IRMAA adjustment");
    expect(panel.textContent).toContain("not SSA's actual lookback-year MAGI determination");
    expect(panel.textContent).toContain("Usual lookback tax year");
    expect(panel.textContent).toContain("2024");
    expect(panel.textContent).toContain("Inputs still needed before amount review");
    expect(panel.textContent).toContain("Medicare.gov Part B costs and IRMAA");
    expect(panel.textContent).toContain("SSA-44 life-changing event form");
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

  it("builds IRMAA review prep with a bounded Part B proxy preview", () => {
    const prep = buildIrmaaReviewPrep(baseInput, baseResult);

    expect(prep.premiumYear).toBe(2026);
    expect(prep.usualLookbackTaxYear).toBe(2024);
    expect(prep.priority).toBe("higher_priority_review");
    expect(prep.thresholdLabel).toContain("$109,000");
    expect(prep.summary).toContain("income proxy after conversion");
    expect(prep.summary).toContain("not this calculator's taxable-income input");
    expect(prep.partBEstimate.totalMonthlyPremium).toBe(649.2);
    expect(prep.partBEstimate.monthlyAdjustmentAmount).toBe(446.3);
    expect(prep.partBEstimate.boundaryNote).toContain("not SSA's actual lookback-year MAGI determination");
    expect(prep.partBEstimate.sourceHref).toContain("cms.gov");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Medicare enrollment status and whether Part B or Part D applies.",
        "Whether a life-changing event may support SSA Form SSA-44 review.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/surcharge amount|premium increase|you should|strongly recommend/i);
  });

  it("maps 2026 Part B IRMAA brackets from official CMS amounts", () => {
    expect(estimateIrmaaPartBFromIncomeProxy("single", 108000).totalMonthlyPremium).toBe(202.9);
    expect(estimateIrmaaPartBFromIncomeProxy("single", 150000).totalMonthlyPremium).toBe(405.8);
    expect(estimateIrmaaPartBFromIncomeProxy("married_joint", 500000).totalMonthlyPremium).toBe(649.2);
    expect(estimateIrmaaPartBFromIncomeProxy("married_separate", 200000).totalMonthlyPremium).toBe(649.2);
    expect(estimateIrmaaPartBFromIncomeProxy("married_separate", 400000).totalMonthlyPremium).toBe(689.9);
  });

  it("keeps the warnings directly inside the results card before AI, projection, and advanced details", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");
    const resultSummaryIndex = source.indexOf("<ResultSummary result={result} />");
    const gateIndex = source.indexOf('isFeatureEnabled("tax-impact-warnings-boundary")');
    const warningIndex = source.indexOf("<TaxImpactWarnings input={input} result={result} />");
    const aiIndex = source.indexOf('id="ai-explainer"');
    const projectionIndex = source.indexOf("<ProjectionChart");
    const advancedDetailsIndex = source.indexOf("Advanced calculation details");

    expect(resultSummaryIndex).toBeGreaterThan(-1);
    expect(gateIndex).toBeGreaterThan(resultSummaryIndex);
    expect(gateIndex).toBeLessThan(warningIndex);
    expect(warningIndex).toBeGreaterThan(resultSummaryIndex);
    expect(warningIndex).toBeLessThan(aiIndex);
    expect(warningIndex).toBeLessThan(projectionIndex);
    expect(warningIndex).toBeLessThan(advancedDetailsIndex);
    expect(source.match(/<TaxImpactWarnings input=\{input\} result=\{result\} \/>/g)).toHaveLength(1);
  });
});
