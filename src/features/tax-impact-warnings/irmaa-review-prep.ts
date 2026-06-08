import { formatCurrency } from "@/common/format/currency";
import type { FilingStatus, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export type IrmaaReviewPriority = "standard_review" | "higher_priority_review" | "separate_mfs_review";

export interface IrmaaReviewPrep {
  id: "irmaa-review-prep";
  title: string;
  premiumYear: number;
  usualLookbackTaxYear: number;
  incomeProxy: number;
  priority: IrmaaReviewPriority;
  thresholdLabel: string;
  summary: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const FIRST_IRMAA_REVIEW_THRESHOLDS: Partial<Record<FilingStatus, number>> = {
  head_of_household: 109000,
  married_joint: 218000,
  single: 109000,
};

function filingStatusLabel(status: FilingStatus) {
  const labels: Record<FilingStatus, string> = {
    head_of_household: "Head of household",
    married_joint: "Married filing jointly",
    married_separate: "Married filing separately",
    single: "Single",
  };

  return labels[status];
}

export function buildIrmaaReviewPrep(input: RothConversionInput, result: RothConversionResult): IrmaaReviewPrep {
  const premiumYear = input.taxYear;
  const usualLookbackTaxYear = premiumYear - 2;
  const incomeProxy = input.currentTaxableIncome + result.taxableConversion;
  const threshold = FIRST_IRMAA_REVIEW_THRESHOLDS[input.filingStatus];
  const nearMedicareTiming = input.age >= 63 || input.retirementAge <= 65;
  const thresholdReached = threshold !== undefined && incomeProxy > threshold;
  const priority: IrmaaReviewPriority =
    input.filingStatus === "married_separate"
      ? "separate_mfs_review"
      : nearMedicareTiming || thresholdReached
        ? "higher_priority_review"
        : "standard_review";

  const thresholdLabel =
    threshold === undefined
      ? "Married filing separately has special IRMAA review rules."
      : `${filingStatusLabel(input.filingStatus)} first-threshold review starts above ${formatCurrency(
          threshold,
        )} of MAGI for the 2026 premium year.`;

  const summary =
    priority === "higher_priority_review"
      ? `Your age or income inputs make Medicare IRMAA a higher-priority review item. The calculator's income proxy after conversion is ${formatCurrency(
          incomeProxy,
        )}, but IRMAA uses MAGI from the usual lookback tax year, not this calculator's taxable-income input.`
      : priority === "separate_mfs_review"
        ? "Married filing separately can follow different IRMAA review treatment, so the calculator keeps this as a separate professional review item instead of estimating a surcharge."
        : `IRMAA remains a standard review item. The calculator's income proxy after conversion is ${formatCurrency(
            incomeProxy,
          )}, but premium review still needs Medicare status and lookback-year MAGI.`;

  return {
    id: "irmaa-review-prep",
    incomeProxy,
    missingInputs: [
      "Medicare enrollment status and whether Part B or Part D applies.",
      `Filed ${usualLookbackTaxYear} tax return MAGI, including adjusted gross income and tax-exempt interest.`,
      "Any SSA IRMAA notice, Medicare premium records, or Part D plan context.",
      "Whether a life-changing event may support SSA Form SSA-44 review.",
      "Professional review of whether taxable income differs from Medicare MAGI.",
    ],
    officialReferences: [
      {
        href: "https://www.medicare.gov/basics/costs/medicare-costs/part-b-costs",
        label: "Medicare.gov Part B costs and IRMAA",
      },
      {
        href: "https://www.ssa.gov/forms/ssa-44.pdf",
        label: "SSA-44 life-changing event form",
      },
    ],
    premiumYear,
    priority,
    summary,
    thresholdLabel,
    title: "IRMAA Review Prep",
    usualLookbackTaxYear,
  };
}
