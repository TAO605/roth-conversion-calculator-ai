import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildAmtReviewPrep } from "@/features/tax-impact-warnings/amt-review-prep";
import { buildIrmaaReviewPrep, estimateIrmaaPartBFromIncomeProxy } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildRmdReviewPrep } from "@/features/tax-impact-warnings/rmd-review-prep";
import { buildSocialSecurityTaxationReviewPrep } from "@/features/tax-impact-warnings/social-security-review-prep";
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
    expect(panel.textContent).toContain("ACA Premium Tax Credit Review Prep");
    expect(panel.textContent).toContain("Amount not estimated");
    expect(panel.textContent).toContain("Inputs needed before subsidy amount review");
    expect(panel.textContent).toContain("Marketplace coverage months");
    expect(panel.textContent).toContain("HealthCare.gov premium tax credit and Marketplace savings");
    expect(panel.textContent).toContain("Social Security Benefit Taxation Review Prep");
    expect(panel.textContent).toContain("Inputs needed before taxable-benefit amount review");
    expect(panel.textContent).toContain("Form SSA-1099 box 5");
    expect(panel.textContent).toContain("IRS Publication 915 Social Security");
    expect(panel.textContent).toContain("SSA taxes on Social Security benefits FAQ");
    expect(panel.textContent).toContain("NIIT Amount Review Prep");
    expect(panel.textContent).toContain("Inputs needed before NIIT amount review");
    expect(panel.textContent).toContain("IRS Net Investment Income Tax");
    expect(panel.textContent).toContain("IRS Form 8960 Net Investment Income Tax");
    expect(panel.textContent).toContain("Required Minimum Distributions");
    expect(panel.textContent).toContain("RMD Uniform Lifetime Preview");
    expect(panel.textContent).toContain("Review only");
    expect(panel.textContent).toContain("Inputs needed before required amount review");
    expect(panel.textContent).toContain("IRS Publication 590-B distributions from IRAs");
    expect(panel.textContent).toContain("IRS RMD FAQs");
    expect(panel.textContent).toContain("AMT Impact Review Prep");
    expect(panel.textContent).toContain("Inputs needed before AMT amount review");
    expect(panel.textContent).toContain("IRS Form 6251 Alternative Minimum Tax");
    expect(panel.textContent).toContain("IRS Instructions for Form 6251");
    expect(panel.textContent).toContain("input-triggered review items");
    expect(panel.textContent).toContain("Open guide");
  });

  it("builds AMT impact review prep without fake AMT owed dollar estimates", () => {
    const prep = buildAmtReviewPrep(baseInput, baseResult);

    expect(prep.amtIncomeProxyBeforeConversion).toBe(195000);
    expect(prep.taxableConversionIncrease).toBe(60000);
    expect(prep.amtIncomeProxyAfterConversion).toBe(255000);
    expect(prep.amountEstimateStatus).toBe("missing_form_6251_inputs");
    expect(prep.summary).toContain("$60,000");
    expect(prep.summary).toContain("$195,000");
    expect(prep.summary).toContain("$255,000");
    expect(prep.formulaNote).toContain("Form 6251");
    expect(prep.boundaryNote).toContain("cannot estimate AMT owed");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Form 6251 adjustment and preference items, including ISO, depreciation, private activity bond interest, and other AMT-specific items.",
        "Regular tax liability and tentative minimum tax comparison from Form 6251.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/amt owed:|tax due:|you should|strongly recommend/i);
  });

  it("builds a bounded RMD preview from age and IRA balance only when the Uniform Lifetime Table applies", () => {
    const prep = buildRmdReviewPrep({
      ...baseInput,
      age: 75,
      traditionalIraBalance: 300000,
    });

    expect(prep.previewStatus).toBe("preview_available");
    expect(prep.ownerAge).toBe(75);
    expect(prep.uniformLifetimeDistributionPeriod).toBe(24.6);
    expect(prep.annualRmdPreview).toBe(12195.12);
    expect(prep.summary).toContain("$300,000");
    expect(prep.summary).toContain("24.6");
    expect(prep.boundaryNote).toContain("prior December 31 adjusted balance");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Prior December 31 adjusted account balance for each IRA or plan account.",
        "Whether the spouse is the sole beneficiary and more than 10 years younger, which can require a different table.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/final required amount|you should|strongly recommend/i);
  });

  it("keeps RMD as review-only when the entered age is below the retained RMD preview range", () => {
    const prep = buildRmdReviewPrep(baseInput);

    expect(prep.previewStatus).toBe("below_rmd_age");
    expect(prep.uniformLifetimeDistributionPeriod).toBeNull();
    expect(prep.annualRmdPreview).toBeNull();
    expect(prep.summary).toContain("below the current age-73 RMD review trigger");
  });

  it("builds NIIT review prep without fake NIIT owed dollar estimates", () => {
    const prep = buildNiitReviewPrep(baseInput, baseResult);

    expect(prep.magiProxyBeforeConversion).toBe(195000);
    expect(prep.taxableConversionIncrease).toBe(60000);
    expect(prep.magiProxyAfterConversion).toBe(255000);
    expect(prep.filingStatusThreshold).toBe(200000);
    expect(prep.magiProxyExcessAfterConversion).toBe(55000);
    expect(prep.niitRate).toBe(0.038);
    expect(prep.amountEstimateStatus).toBe("missing_net_investment_income_inputs");
    expect(prep.summary).toContain("$55,000");
    expect(prep.formulaNote).toContain("3.8%");
    expect(prep.formulaNote).toContain("lesser of net investment income");
    expect(prep.boundaryNote).toContain("cannot estimate NIIT owed from the MAGI proxy alone");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Net investment income categories for Form 8960, such as interest, dividends, annuities, royalties, rents, capital gains, and passive activity income.",
        "Investment-income deductions and adjustments used on Form 8960.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/niit owed:|tax due:|you should|strongly recommend/i);
  });

  it("builds Social Security benefit taxation review prep without fake taxable-benefit dollar estimates", () => {
    const prep = buildSocialSecurityTaxationReviewPrep(baseInput, baseResult);

    expect(prep.nonSocialSecurityIncomeProxyBeforeConversion).toBe(195000);
    expect(prep.taxableConversionIncrease).toBe(60000);
    expect(prep.nonSocialSecurityIncomeProxyAfterConversion).toBe(255000);
    expect(prep.amountEstimateStatus).toBe("missing_social_security_inputs");
    expect(prep.summary).toContain("$60,000");
    expect(prep.summary).toContain("$195,000");
    expect(prep.summary).toContain("$255,000");
    expect(prep.thresholdNote).toContain("$25,000");
    expect(prep.thresholdNote).toContain("$34,000");
    expect(prep.boundaryNote).toContain("cannot estimate taxable Social Security benefit dollars");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Annual Social Security benefit amount from Form SSA-1099 box 5, or equivalent Tier 1 railroad retirement benefit records.",
        "Tax-exempt interest and other income items used in IRS Publication 915 combined-income review.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/taxable benefit amount:|benefit tax owed|you should|strongly recommend/i);
  });

  it("builds ACA premium tax credit review prep without fake subsidy dollar estimates", () => {
    const prep = buildAcaPremiumTaxCreditReviewPrep(baseInput, baseResult);

    expect(prep.incomeProxyBeforeConversion).toBe(195000);
    expect(prep.conversionIncomeIncrease).toBe(60000);
    expect(prep.incomeProxyAfterConversion).toBe(255000);
    expect(prep.amountEstimateStatus).toBe("missing_marketplace_inputs");
    expect(prep.summary).toContain("$60,000");
    expect(prep.summary).toContain("$195,000");
    expect(prep.summary).toContain("$255,000");
    expect(prep.boundaryNote).toContain("cannot estimate ACA premium tax credit dollars from taxable income alone");
    expect(prep.missingInputs).toEqual(
      expect.arrayContaining([
        "Marketplace coverage months and whether advance premium tax credits were used.",
        "Form 1095-A, Form 8962, and any Marketplace notices for reconciliation review.",
      ]),
    );
    expect(JSON.stringify(prep)).not.toMatch(/subsidy savings|premium tax credit amount|you should|strongly recommend/i);
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
