import { formatCurrency } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface AmtReviewPrep {
  id: "amt-review-prep";
  title: string;
  taxYear: 2026;
  basis: "calculator_amt_income_proxy";
  amtIncomeProxyBeforeConversion: number;
  taxableConversionIncrease: number;
  amtIncomeProxyAfterConversion: number;
  tentativeMinimumTaxInput: number | null;
  regularTaxLiabilityInput: number | null;
  amtExposurePreview: number | null;
  amountEstimateStatus: "amt_exposure_preview_available" | "missing_form_6251_inputs";
  formulaNote: string;
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const AMT_OFFICIAL_REFERENCES = [
  {
    href: "https://www.irs.gov/forms-pubs/about-form-6251",
    label: "IRS Form 6251 Alternative Minimum Tax",
  },
  {
    href: "https://www.irs.gov/instructions/i6251",
    label: "IRS Instructions for Form 6251",
  },
  {
    href: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026",
    label: "IRS tax year 2026 inflation adjustments",
  },
];

export function buildAmtReviewPrep(input: RothConversionInput, result: RothConversionResult): AmtReviewPrep {
  const amtIncomeProxyBeforeConversion = Math.max(0, input.currentTaxableIncome);
  const taxableConversionIncrease = Math.max(0, result.taxableConversion);
  const amtIncomeProxyAfterConversion = amtIncomeProxyBeforeConversion + taxableConversionIncrease;
  const tentativeMinimumTaxInput =
    typeof input.amtTentativeMinimumTax === "number" && Number.isFinite(input.amtTentativeMinimumTax)
      ? Math.max(0, input.amtTentativeMinimumTax)
      : null;
  const regularTaxLiabilityInput =
    typeof input.amtRegularTaxLiability === "number" && Number.isFinite(input.amtRegularTaxLiability)
      ? Math.max(0, input.amtRegularTaxLiability)
      : null;
  const hasAmtComparisonInputs = tentativeMinimumTaxInput !== null && regularTaxLiabilityInput !== null;
  const amtExposurePreview = hasAmtComparisonInputs
    ? Math.max(0, Number((tentativeMinimumTaxInput - regularTaxLiabilityInput).toFixed(2)))
    : null;
  const amountEstimateStatus = hasAmtComparisonInputs
    ? "amt_exposure_preview_available"
    : "missing_form_6251_inputs";
  const boundaryNote =
    amountEstimateStatus === "amt_exposure_preview_available"
      ? "This is an AMT exposure preview using user-entered Form 6251 tentative minimum tax and regular tax liability comparison values. It does not calculate alternative minimum taxable income, preference items, exemption, phaseout, AMT credit, state AMT, or the full Form 6251 result."
      : "The AMT exposure preview requires user-entered Form 6251 tentative minimum tax and regular tax liability comparison values. Alternative minimum taxable income, preference items, adjustments, exemption, phaseout, credits, and final Form 6251 treatment still require separate review.";
  const summary =
    amountEstimateStatus === "amt_exposure_preview_available"
      ? `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator AMT income proxy, moving the proxy from ${formatCurrency(
          amtIncomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          amtIncomeProxyAfterConversion,
        )} after conversion. With user-entered tentative minimum tax of ${formatCurrency(
          tentativeMinimumTaxInput ?? 0,
        )} and regular tax liability of ${formatCurrency(
          regularTaxLiabilityInput ?? 0,
        )}, the AMT exposure preview is ${formatCurrency(amtExposurePreview ?? 0)}.`
      : `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator AMT income proxy, moving the proxy from ${formatCurrency(
          amtIncomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          amtIncomeProxyAfterConversion,
        )} after conversion. The AMT exposure preview stays pending until Form 6251 comparison inputs are provided.`;

  return {
    amountEstimateStatus,
    amtExposurePreview,
    amtIncomeProxyAfterConversion,
    amtIncomeProxyBeforeConversion,
    basis: "calculator_amt_income_proxy",
    boundaryNote,
    formulaNote:
      "Form 6251 generally starts from regular taxable income, applies AMT-specific adjustments and preference items, applies the AMT exemption and phaseout rules, then compares tentative minimum tax with regular tax.",
    id: "amt-review-prep",
    missingInputs: [
      "Form 6251 adjustment and preference items, including ISO, depreciation, private activity bond interest, and other AMT-specific items.",
      "AMT exemption and phaseout context for the filing status and tax year.",
      "Regular tax liability and tentative minimum tax comparison from Form 6251.",
      "Prior-year AMT credit and Form 8801 context, if any.",
      "Professional review of state AMT or state-specific minimum tax rules where applicable.",
    ],
    officialReferences: AMT_OFFICIAL_REFERENCES,
    regularTaxLiabilityInput,
    summary,
    taxableConversionIncrease,
    taxYear: input.taxYear,
    tentativeMinimumTaxInput,
    title: amountEstimateStatus === "amt_exposure_preview_available" ? "AMT Exposure Preview" : "AMT Impact Review Prep",
  };
}
