import type { FilingStatus, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export type TaxImpactReviewLevel = "standard_review" | "input_triggered_review";

export interface TaxImpactReviewItem {
  id: string;
  label: string;
  level: TaxImpactReviewLevel;
  reason: string;
  guideHref: string;
}

const NIIT_MAGI_REVIEW_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_of_household: 200000,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

export function buildTaxImpactReviewItems(
  input: RothConversionInput,
  result: RothConversionResult,
): TaxImpactReviewItem[] {
  const taxableIncomeProxyAfterConversion = input.currentTaxableIncome + result.taxableConversion;
  const niitThreshold = NIIT_MAGI_REVIEW_THRESHOLDS[input.filingStatus];
  const nearMedicareReviewAge = input.age >= 63 || input.retirementAge <= 65;
  const likelyPreMedicareAge = input.age < 65;
  const socialSecurityReviewAge = input.age >= 62 || input.retirementAge <= 67;
  const rmdReviewAge = input.age >= 73 || input.retirementAge <= 73;

  return [
    {
      id: "irmaa",
      label: "Medicare IRMAA",
      level: nearMedicareReviewAge ? "input_triggered_review" : "standard_review",
      reason: nearMedicareReviewAge
        ? "Age inputs indicate Medicare timing may be close enough to review income-related premium effects."
        : "IRMAA depends on Medicare status, MAGI, and lookback-year rules not captured by this estimate.",
      guideHref: "/roth-conversion-irmaa-guide",
    },
    {
      id: "aca",
      label: "ACA premium tax credits",
      level: likelyPreMedicareAge ? "input_triggered_review" : "standard_review",
      reason: likelyPreMedicareAge
        ? "Age inputs are below Medicare age; Marketplace coverage or advance premium credits need separate review if applicable."
        : "ACA premium tax credit effects depend on Marketplace coverage, household size, and subsidy reconciliation inputs.",
      guideHref: "/roth-conversion-aca-premium-tax-credit-guide",
    },
    {
      id: "social-security",
      label: "Social Security benefit taxation",
      level: socialSecurityReviewAge ? "input_triggered_review" : "standard_review",
      reason: socialSecurityReviewAge
        ? "Age inputs are near common benefit-claiming years; taxable-benefit worksheets may need a separate review."
        : "Social Security benefit taxation is not modeled by the calculator and can change with income assumptions.",
      guideHref: "/roth-conversion-social-security-tax-guide",
    },
    {
      id: "niit",
      label: "NIIT MAGI-side review",
      level: taxableIncomeProxyAfterConversion >= niitThreshold ? "input_triggered_review" : "standard_review",
      reason:
        taxableIncomeProxyAfterConversion >= niitThreshold
          ? `The taxable-income proxy after conversion is ${formatCurrency(
              taxableIncomeProxyAfterConversion,
            )}, which reaches the NIIT MAGI review threshold for this filing status.`
          : `NIIT still requires investment-income classification; this estimate is below the ${formatCurrency(
              niitThreshold,
            )} MAGI review threshold for this filing status.`,
      guideHref: "/roth-conversion-niit-guide",
    },
    {
      id: "rmd",
      label: "Required Minimum Distributions",
      level: rmdReviewAge ? "input_triggered_review" : "standard_review",
      reason: rmdReviewAge
        ? "Age inputs indicate RMD timing may overlap with conversion planning and needs separate record review."
        : "RMD timing, account types, and prior-year balances are outside this calculator's current inputs.",
      guideHref: "/roth-conversion-rmd-guide",
    },
    {
      id: "state",
      label: "State-specific retirement income rules",
      level: input.stateMarginalTaxRate > 0 ? "input_triggered_review" : "standard_review",
      reason:
        input.stateMarginalTaxRate > 0
          ? "A state tax rate was entered, but state deductions, credits, and retirement-income rules are not modeled."
          : "The calculator uses the state tax rate entered by the user and does not verify state-specific rules.",
      guideHref: "/states",
    },
  ];
}
