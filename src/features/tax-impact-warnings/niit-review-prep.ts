import { formatCurrency } from "@/common/format/currency";
import type { FilingStatus, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface NiitReviewPrep {
  id: "niit-review-prep";
  title: string;
  taxYear: 2026;
  basis: "calculator_magi_proxy";
  magiProxyBeforeConversion: number;
  taxableConversionIncrease: number;
  magiProxyAfterConversion: number;
  filingStatusThreshold: number;
  magiProxyExcessAfterConversion: number;
  niitRate: 0.038;
  amountEstimateStatus: "missing_net_investment_income_inputs";
  formulaNote: string;
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const NIIT_MAGI_THRESHOLDS: Record<FilingStatus, number> = {
  head_of_household: 200000,
  married_joint: 250000,
  married_separate: 125000,
  single: 200000,
};

const NIIT_OFFICIAL_REFERENCES = [
  {
    href: "https://www.irs.gov/newsroom/net-investment-income-tax",
    label: "IRS Net Investment Income Tax",
  },
  {
    href: "https://www.irs.gov/forms-pubs/about-form-8960",
    label: "IRS Form 8960 Net Investment Income Tax",
  },
  {
    href: "https://www.irs.gov/instructions/i8960",
    label: "IRS Instructions for Form 8960",
  },
];

export function buildNiitReviewPrep(input: RothConversionInput, result: RothConversionResult): NiitReviewPrep {
  const magiProxyBeforeConversion = Math.max(0, input.currentTaxableIncome);
  const taxableConversionIncrease = Math.max(0, result.taxableConversion);
  const magiProxyAfterConversion = magiProxyBeforeConversion + taxableConversionIncrease;
  const filingStatusThreshold = NIIT_MAGI_THRESHOLDS[input.filingStatus];
  const magiProxyExcessAfterConversion = Math.max(0, magiProxyAfterConversion - filingStatusThreshold);

  return {
    amountEstimateStatus: "missing_net_investment_income_inputs",
    basis: "calculator_magi_proxy",
    boundaryNote:
      "This calculator cannot estimate NIIT owed from the MAGI proxy alone. NIIT applies to the lesser of net investment income or the amount MAGI exceeds the filing-status threshold, so investment-income classification and Form 8960 inputs are required before any NIIT dollar amount can be reviewed.",
    filingStatusThreshold,
    formulaNote:
      "NIIT is generally 3.8% of the lesser of net investment income or modified adjusted gross income above the applicable filing-status threshold.",
    id: "niit-review-prep",
    magiProxyAfterConversion,
    magiProxyBeforeConversion,
    magiProxyExcessAfterConversion,
    missingInputs: [
      "Net investment income categories for Form 8960, such as interest, dividends, annuities, royalties, rents, capital gains, and passive activity income.",
      "Investment-income deductions and adjustments used on Form 8960.",
      "Modified adjusted gross income details rather than only the calculator taxable-income input.",
      "Whether any income is excluded from net investment income or belongs to a trade or business exception.",
      "Capital gain, passive activity, rental, and K-1 records that may affect Form 8960 review.",
    ],
    niitRate: 0.038,
    officialReferences: NIIT_OFFICIAL_REFERENCES,
    summary: `The taxable conversion adds ${formatCurrency(
      taxableConversionIncrease,
    )} to the calculator MAGI proxy, moving the proxy from ${formatCurrency(
      magiProxyBeforeConversion,
    )} before conversion to ${formatCurrency(
      magiProxyAfterConversion,
    )} after conversion. The proxy exceeds the ${formatCurrency(
      filingStatusThreshold,
    )} NIIT review threshold by ${formatCurrency(
      magiProxyExcessAfterConversion,
    )}, but NIIT dollars are not estimated until net investment income inputs are available.`,
    taxableConversionIncrease,
    taxYear: input.taxYear,
    title: "NIIT Amount Review Prep",
  };
}
