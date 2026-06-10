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
  annualSocialSecurityBenefitsInput: number | null;
  taxExemptInterestInput: number | null;
  combinedIncomeProxyAfterConversion: number | null;
  taxableBenefitPreview: number | null;
  taxableBenefitPreviewRateCap: 0.5 | 0.85 | null;
  amountEstimateStatus:
    | "bounded_estimate_available"
    | "married_separate_special_review"
    | "missing_social_security_inputs";
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

function socialSecurityThresholds(filingStatus: FilingStatus):
  | { baseAmount: number; adjustedBaseAmount: number; highTierAdditionLimit: number; rateLabel: string }
  | null {
  if (filingStatus === "married_joint") {
    return {
      adjustedBaseAmount: 44000,
      baseAmount: 32000,
      highTierAdditionLimit: 6000,
      rateLabel: "married filing jointly",
    };
  }

  if (filingStatus === "married_separate") {
    return null;
  }

  return {
    adjustedBaseAmount: 34000,
    baseAmount: 25000,
    highTierAdditionLimit: 4500,
    rateLabel: "single/head of household style",
  };
}

function boundedTaxableSocialSecurityBenefit(
  filingStatus: FilingStatus,
  annualBenefits: number,
  combinedIncome: number,
): { taxableBenefitPreview: number; taxableBenefitPreviewRateCap: 0.5 | 0.85 | null } {
  const thresholds = socialSecurityThresholds(filingStatus);

  if (!thresholds || annualBenefits <= 0 || combinedIncome <= thresholds.baseAmount) {
    return { taxableBenefitPreview: 0, taxableBenefitPreviewRateCap: null };
  }

  const halfBenefits = annualBenefits * 0.5;
  const eightyFivePercentBenefits = annualBenefits * 0.85;

  if (combinedIncome <= thresholds.adjustedBaseAmount) {
    return {
      taxableBenefitPreview: Number(Math.min((combinedIncome - thresholds.baseAmount) * 0.5, halfBenefits).toFixed(2)),
      taxableBenefitPreviewRateCap: 0.5,
    };
  }

  return {
    taxableBenefitPreview: Number(
      Math.min(
        (combinedIncome - thresholds.adjustedBaseAmount) * 0.85 + Math.min(thresholds.highTierAdditionLimit, halfBenefits),
        eightyFivePercentBenefits,
      ).toFixed(2),
    ),
    taxableBenefitPreviewRateCap: 0.85,
  };
}

export function buildSocialSecurityTaxationReviewPrep(
  input: RothConversionInput,
  result: RothConversionResult,
): SocialSecurityTaxationReviewPrep {
  const nonSocialSecurityIncomeProxyBeforeConversion = Math.max(0, input.currentTaxableIncome);
  const taxableConversionIncrease = Math.max(0, result.taxableConversion);
  const nonSocialSecurityIncomeProxyAfterConversion =
    nonSocialSecurityIncomeProxyBeforeConversion + taxableConversionIncrease;
  const annualSocialSecurityBenefitsInput =
    typeof input.annualSocialSecurityBenefits === "number" && Number.isFinite(input.annualSocialSecurityBenefits)
      ? Math.max(0, input.annualSocialSecurityBenefits)
      : null;
  const taxExemptInterestInput =
    typeof input.taxExemptInterest === "number" && Number.isFinite(input.taxExemptInterest)
      ? Math.max(0, input.taxExemptInterest)
      : null;
  const thresholds = socialSecurityThresholds(input.filingStatus);
  const canPreview =
    thresholds !== null && annualSocialSecurityBenefitsInput !== null && taxExemptInterestInput !== null;
  const combinedIncomeProxyAfterConversion = canPreview
    ? nonSocialSecurityIncomeProxyAfterConversion + taxExemptInterestInput + annualSocialSecurityBenefitsInput * 0.5
    : null;
  const preview =
    canPreview && combinedIncomeProxyAfterConversion !== null
      ? boundedTaxableSocialSecurityBenefit(
          input.filingStatus,
          annualSocialSecurityBenefitsInput,
          combinedIncomeProxyAfterConversion,
        )
      : { taxableBenefitPreview: null, taxableBenefitPreviewRateCap: null };
  const amountEstimateStatus =
    thresholds === null
      ? "married_separate_special_review"
      : canPreview
        ? "bounded_estimate_available"
        : "missing_social_security_inputs";
  const boundaryNote =
    amountEstimateStatus === "bounded_estimate_available"
      ? "This is a bounded taxable Social Security benefit preview using the calculator non-Social-Security income proxy, user-entered annual benefits, and user-entered tax-exempt interest. It is not a full Publication 915 worksheet and does not handle lump-sum elections, repayment adjustments, railroad retirement edge cases, or married-filing-separately lived-together rules."
      : amountEstimateStatus === "married_separate_special_review"
        ? "Married filing separately can require special Social Security benefit taxation review. This calculator does not provide a taxable-benefit preview for that filing status because Publication 915 treatment can depend on whether spouses lived together during the year."
        : "The bounded taxable Social Security benefit preview requires annual benefit and tax-exempt interest inputs. IRS Publication 915 review still needs filing details, other income items, and special-case checks before any Publication 915 taxable-benefit amount is used.";
  const summary =
    amountEstimateStatus === "bounded_estimate_available"
      ? `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator non-Social-Security income proxy, moving the proxy from ${formatCurrency(
          nonSocialSecurityIncomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          nonSocialSecurityIncomeProxyAfterConversion,
        )} after conversion. With annual Social Security benefits of ${formatCurrency(
          annualSocialSecurityBenefitsInput ?? 0,
        )} and tax-exempt interest of ${formatCurrency(
          taxExemptInterestInput ?? 0,
        )}, the bounded combined-income proxy is ${formatCurrency(
          combinedIncomeProxyAfterConversion ?? 0,
        )} and the taxable-benefit preview is ${formatCurrency(preview.taxableBenefitPreview ?? 0)}.`
      : `The taxable conversion adds ${formatCurrency(
          taxableConversionIncrease,
        )} to the calculator non-Social-Security income proxy, moving the proxy from ${formatCurrency(
          nonSocialSecurityIncomeProxyBeforeConversion,
        )} before conversion to ${formatCurrency(
          nonSocialSecurityIncomeProxyAfterConversion,
        )} after conversion. The bounded taxable-benefit preview stays pending until SSA-1099 benefit and Publication 915 inputs are provided.`;

  return {
    amountEstimateStatus,
    annualSocialSecurityBenefitsInput,
    basis: "calculator_non_social_security_income_proxy",
    boundaryNote,
    combinedIncomeProxyAfterConversion,
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
    summary,
    taxableBenefitPreview: preview.taxableBenefitPreview,
    taxableBenefitPreviewRateCap: preview.taxableBenefitPreviewRateCap,
    taxExemptInterestInput,
    taxYear: input.taxYear,
    taxableConversionIncrease,
    thresholdNote: thresholdNoteForFilingStatus(input.filingStatus),
    title:
      amountEstimateStatus === "bounded_estimate_available"
        ? "Social Security Taxable Benefit Preview"
        : "Social Security Benefit Taxation Review Prep",
  };
}
