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
  netInvestmentIncomeInput: number | null;
  niitExposureBase: number | null;
  boundedNiitEstimate: number | null;
  amountEstimateStatus: "bounded_estimate_available" | "missing_net_investment_income_inputs";
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
  const netInvestmentIncomeInput =
    typeof input.netInvestmentIncome === "number" && Number.isFinite(input.netInvestmentIncome)
      ? Math.max(0, input.netInvestmentIncome)
      : null;
  const niitExposureBase =
    netInvestmentIncomeInput === null ? null : Math.min(netInvestmentIncomeInput, magiProxyExcessAfterConversion);
  const boundedNiitEstimate = niitExposureBase === null ? null : Number((niitExposureBase * 0.038).toFixed(2));
  const amountEstimateStatus =
    netInvestmentIncomeInput === null ? "missing_net_investment_income_inputs" : "bounded_estimate_available";
  const boundaryNote =
    netInvestmentIncomeInput === null
      ? "The bounded NIIT preview requires user-entered net investment income. The calculator shows the MAGI proxy excess, but Form 8960 classification, deductions, trade or business exceptions, credits, and Form 8960 treatment still require separate review."
      : "This is a bounded NIIT preview using the user-entered net investment income and the calculator MAGI proxy after conversion. It is not a full Form 8960 calculation and does not classify investment income, deductions, trade or business exceptions, credits, or every MAGI adjustment.";
  const summary =
    netInvestmentIncomeInput === null
      ? `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator MAGI proxy, moving the proxy from ${formatCurrency(
          magiProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          magiProxyAfterConversion,
        )} after conversion. The proxy exceeds the ${formatCurrency(
          filingStatusThreshold,
        )} NIIT review threshold by ${formatCurrency(
          magiProxyExcessAfterConversion,
        )}. The bounded 3.8% NIIT preview stays pending until net investment income is provided.`
      : `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator MAGI proxy, moving the proxy from ${formatCurrency(
          magiProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          magiProxyAfterConversion,
        )} after conversion. With user-entered net investment income of ${formatCurrency(
          netInvestmentIncomeInput,
        )}, the bounded NIIT exposure base is ${formatCurrency(niitExposureBase ?? 0)} and the 3.8% preview is ${formatCurrency(
          boundedNiitEstimate ?? 0,
        )}.`;

  return {
    amountEstimateStatus,
    basis: "calculator_magi_proxy",
    boundedNiitEstimate,
    boundaryNote,
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
    netInvestmentIncomeInput,
    niitExposureBase,
    niitRate: 0.038,
    officialReferences: NIIT_OFFICIAL_REFERENCES,
    summary,
    taxableConversionIncrease,
    taxYear: input.taxYear,
    title: netInvestmentIncomeInput === null ? "NIIT Amount Review Prep" : "NIIT Bounded Estimate Preview",
  };
}
