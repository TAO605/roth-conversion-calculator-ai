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
  amountEstimateStatus: "missing_marketplace_inputs";
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

  return {
    amountEstimateStatus: "missing_marketplace_inputs",
    basis: "calculator_income_proxy",
    boundaryNote:
      "This calculator cannot estimate ACA premium tax credit dollars from taxable income alone. Marketplace household income, household size, coverage months, benchmark plan premium, Form 1095-A, and Form 8962 context are required before any subsidy change amount can be reviewed.",
    conversionIncomeIncrease,
    id: "aca-premium-tax-credit-review-prep",
    incomeProxyAfterConversion,
    incomeProxyBeforeConversion,
    missingInputs: [
      "Marketplace coverage months and whether advance premium tax credits were used.",
      "Household size and all household members included on the Marketplace application.",
      "Marketplace estimated household income before and after the Roth conversion scenario.",
      "Second lowest cost Silver plan benchmark premium and selected plan premium from Marketplace records.",
      "Form 1095-A, Form 8962, and any Marketplace notices for reconciliation review.",
      "Whether Medicare, employer coverage, Medicaid, or other minimum essential coverage affects eligibility.",
    ],
    officialReferences: ACA_PREMIUM_TAX_CREDIT_REFERENCES,
    summary: `The taxable conversion adds ${formatCurrency(
      conversionIncomeIncrease,
    )} to the calculator income proxy, moving the proxy from ${formatCurrency(
      incomeProxyBeforeConversion,
    )} before conversion to ${formatCurrency(
      incomeProxyAfterConversion,
    )} after conversion. ACA premium tax credit dollars are not estimated until Marketplace-specific inputs are available.`,
    taxYear: input.taxYear,
    title: "ACA Premium Tax Credit Review Prep",
  };
}
