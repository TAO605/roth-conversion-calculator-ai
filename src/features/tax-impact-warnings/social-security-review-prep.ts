import { formatCurrency } from "@/common/format/currency";
import type { FilingStatus, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface SocialSecurityTaxationReviewPrep {
  id: "social-security-taxation-review-prep";
  title: string;
  taxYear: 2026;
  basis: "calculator_non_social_security_income_proxy";
  nonSocialSecurityIncomeProxyBeforeConversion: number;
  taxableConversionIncrease: number;
  nonSocialSecurityIncomeProxyAfterConversion: number;
  amountEstimateStatus: "missing_social_security_inputs";
  thresholdNote: string;
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const SOCIAL_SECURITY_TAXATION_REFERENCES = [
  {
    href: "https://www.irs.gov/publications/p915",
    label: "IRS Publication 915 Social Security and equivalent railroad retirement benefits",
  },
  {
    href: "https://www.irs.gov/forms-pubs/about-publication-915",
    label: "IRS About Publication 915",
  },
  {
    href: "https://www.ssa.gov/faqs/en/questions/KA-02471.html",
    label: "SSA taxes on Social Security benefits FAQ",
  },
];

function thresholdNoteForFilingStatus(filingStatus: FilingStatus): string {
  if (filingStatus === "married_joint") {
    return "IRS and SSA combined-income review commonly uses $32,000 and $44,000 reference amounts for married filing jointly.";
  }

  if (filingStatus === "married_separate") {
    return "Married filing separately can require special Social Security benefit taxation review, especially when spouses lived together during the year.";
  }

  return "IRS and SSA combined-income review commonly uses $25,000 and $34,000 reference amounts for single, head of household, qualifying surviving spouse, and married filing separately when spouses lived apart all year.";
}

export function buildSocialSecurityTaxationReviewPrep(
  input: RothConversionInput,
  result: RothConversionResult,
): SocialSecurityTaxationReviewPrep {
  const nonSocialSecurityIncomeProxyBeforeConversion = Math.max(0, input.currentTaxableIncome);
  const taxableConversionIncrease = Math.max(0, result.taxableConversion);
  const nonSocialSecurityIncomeProxyAfterConversion =
    nonSocialSecurityIncomeProxyBeforeConversion + taxableConversionIncrease;

  return {
    amountEstimateStatus: "missing_social_security_inputs",
    basis: "calculator_non_social_security_income_proxy",
    boundaryNote:
      "This calculator cannot estimate taxable Social Security benefit dollars from the current taxable-income input alone. IRS Publication 915 review needs annual Social Security benefits, tax-exempt interest, filing details, and other income items before a taxable-benefit amount can be reviewed.",
    id: "social-security-taxation-review-prep",
    missingInputs: [
      "Annual Social Security benefit amount from Form SSA-1099 box 5, or equivalent Tier 1 railroad retirement benefit records.",
      "Tax-exempt interest and other income items used in IRS Publication 915 combined-income review.",
      "Whether benefits include a lump-sum payment for an earlier year.",
      "Whether married filing separately spouses lived together during the tax year.",
      "Federal return context for Form 1040 line 6a and line 6b review.",
    ],
    nonSocialSecurityIncomeProxyAfterConversion,
    nonSocialSecurityIncomeProxyBeforeConversion,
    officialReferences: SOCIAL_SECURITY_TAXATION_REFERENCES,
    summary: `The taxable conversion adds ${formatCurrency(
      taxableConversionIncrease,
    )} to the calculator non-Social-Security income proxy, moving the proxy from ${formatCurrency(
      nonSocialSecurityIncomeProxyBeforeConversion,
    )} before conversion to ${formatCurrency(
      nonSocialSecurityIncomeProxyAfterConversion,
    )} after conversion. Taxable Social Security benefit dollars are not estimated until SSA-1099 and Publication 915 inputs are available.`,
    taxYear: input.taxYear,
    taxableConversionIncrease,
    thresholdNote: thresholdNoteForFilingStatus(input.filingStatus),
    title: "Social Security Benefit Taxation Review Prep",
  };
}
