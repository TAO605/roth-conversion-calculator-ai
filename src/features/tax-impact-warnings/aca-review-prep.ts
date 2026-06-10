import { formatCurrency } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface AcaPremiumTaxCreditReviewPrep {
  id: "aca-premium-tax-credit-review-prep";
  title: string;
  taxYear: 2026;
  basis: "calculator_income_proxy";
  incomeProxyBeforeConversion: number;
  incomeProxyAfterConversion: number;
  conversionIncomeIncrease: number;
  annualAdvancePremiumTaxCreditInput: number | null;
  marketplaceCoverageMonthsInput: number | null;
  monthlyAdvancePremiumTaxCreditPreview: number | null;
  aptcAtStakePreview: number | null;
  amountEstimateStatus: "aptc_at_stake_preview_available" | "missing_marketplace_inputs";
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const ACA_PREMIUM_TAX_CREDIT_REFERENCES = [
  {
    href: "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
    label: "HealthCare.gov premium tax credit and Marketplace savings",
  },
  {
    href: "https://www.healthcare.gov/taxes-reconciling/",
    label: "HealthCare.gov reconciling advance premium tax credits",
  },
  {
    href: "https://www.irs.gov/forms-pubs/about-form-8962",
    label: "IRS Form 8962 premium tax credit",
  },
];

export function buildAcaPremiumTaxCreditReviewPrep(
  input: RothConversionInput,
  result: RothConversionResult,
): AcaPremiumTaxCreditReviewPrep {
  const incomeProxyBeforeConversion = Math.max(0, input.currentTaxableIncome);
  const conversionIncomeIncrease = Math.max(0, result.taxableConversion);
  const incomeProxyAfterConversion = incomeProxyBeforeConversion + conversionIncomeIncrease;
  const annualAdvancePremiumTaxCreditInput =
    typeof input.annualAdvancePremiumTaxCredit === "number" && Number.isFinite(input.annualAdvancePremiumTaxCredit)
      ? Math.max(0, input.annualAdvancePremiumTaxCredit)
      : null;
  const marketplaceCoverageMonthsInput =
    typeof input.marketplaceCoverageMonths === "number" && Number.isFinite(input.marketplaceCoverageMonths)
      ? Math.min(12, Math.max(0, input.marketplaceCoverageMonths))
      : null;
  const hasAptcPreviewInputs =
    annualAdvancePremiumTaxCreditInput !== null &&
    marketplaceCoverageMonthsInput !== null &&
    marketplaceCoverageMonthsInput > 0;
  const monthlyAdvancePremiumTaxCreditPreview = hasAptcPreviewInputs
    ? Number((annualAdvancePremiumTaxCreditInput / marketplaceCoverageMonthsInput).toFixed(2))
    : null;
  const aptcAtStakePreview = hasAptcPreviewInputs ? annualAdvancePremiumTaxCreditInput : null;
  const amountEstimateStatus = hasAptcPreviewInputs
    ? "aptc_at_stake_preview_available"
    : "missing_marketplace_inputs";
  const boundaryNote =
    amountEstimateStatus === "aptc_at_stake_preview_available"
      ? "This is an advance premium tax credit at-stake preview based only on the user-entered APTC and Marketplace coverage months. It does not calculate the final Form 8962 credit, expected contribution, benchmark plan premium, repayment cap, poverty-line percentage, or reconciliation result."
      : "The ACA APTC at-stake preview requires Marketplace-specific inputs. Enter annual advance premium tax credit and coverage months for the bounded preview; final household eligibility, benchmark premium, repayment cap, and Form 8962 reconciliation still require separate review.";
  const summary =
    amountEstimateStatus === "aptc_at_stake_preview_available"
      ? `The taxable conversion adds ${formatCurrency(
          conversionIncomeIncrease,
        )} to the calculator income proxy, moving the proxy from ${formatCurrency(
          incomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          incomeProxyAfterConversion,
        )} after conversion. The user-entered advance premium tax credit at stake is ${formatCurrency(
          aptcAtStakePreview ?? 0,
        )} across ${marketplaceCoverageMonthsInput} Marketplace coverage months, or about ${formatCurrency(
          monthlyAdvancePremiumTaxCreditPreview ?? 0,
        )} per covered month before Form 8962 reconciliation.`
      : `The taxable conversion adds ${formatCurrency(
          conversionIncomeIncrease,
        )} to the calculator income proxy, moving the proxy from ${formatCurrency(
          incomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          incomeProxyAfterConversion,
        )} after conversion. The bounded APTC at-stake preview stays pending until Marketplace-specific inputs are provided.`;

  return {
    amountEstimateStatus,
    annualAdvancePremiumTaxCreditInput,
    aptcAtStakePreview,
    basis: "calculator_income_proxy",
    boundaryNote,
    conversionIncomeIncrease,
    id: "aca-premium-tax-credit-review-prep",
    incomeProxyAfterConversion,
    incomeProxyBeforeConversion,
    marketplaceCoverageMonthsInput,
    missingInputs: [
      "Marketplace coverage months and whether advance premium tax credits were used.",
      "Household size and all household members included on the Marketplace application.",
      "Marketplace estimated household income before and after the Roth conversion scenario.",
      "Second lowest cost Silver plan benchmark premium and selected plan premium from Marketplace records.",
      "Form 1095-A, Form 8962, and any Marketplace notices for reconciliation review.",
      "Whether Medicare, employer coverage, Medicaid, or other minimum essential coverage affects eligibility.",
    ],
    monthlyAdvancePremiumTaxCreditPreview,
    officialReferences: ACA_PREMIUM_TAX_CREDIT_REFERENCES,
    summary,
    taxYear: input.taxYear,
    title:
      amountEstimateStatus === "aptc_at_stake_preview_available"
        ? "ACA Advance Premium Tax Credit Preview"
        : "ACA Premium Tax Credit Review Prep",
  };
}
