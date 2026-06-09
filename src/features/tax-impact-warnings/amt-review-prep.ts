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
  amountEstimateStatus: "missing_form_6251_inputs";
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

  return {
    amountEstimateStatus: "missing_form_6251_inputs",
    amtIncomeProxyAfterConversion,
    amtIncomeProxyBeforeConversion,
    basis: "calculator_amt_income_proxy",
    boundaryNote:
      "This calculator cannot estimate AMT owed from taxable income and Roth conversion inputs alone. Alternative Minimum Tax review requires Form 6251 alternative minimum taxable income, preference items, adjustments, exemption, phaseout, tentative minimum tax, and regular tax comparison before any AMT dollar amount can be reviewed.",
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
    summary: `The taxable conversion adds ${formatCurrency(
      taxableConversionIncrease,
    )} to the calculator AMT income proxy, moving the proxy from ${formatCurrency(
      amtIncomeProxyBeforeConversion,
    )} before conversion to ${formatCurrency(
      amtIncomeProxyAfterConversion,
    )} after conversion. AMT dollars are not estimated until Form 6251 adjustment, preference, exemption, phaseout, and regular-tax comparison inputs are available.`,
    taxableConversionIncrease,
    taxYear: input.taxYear,
    title: "AMT Impact Review Prep",
  };
}
