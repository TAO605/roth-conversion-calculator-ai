import { formatCurrency } from "@/common/format/currency";
import type { FilingStatus, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export type IrmaaReviewPriority = "standard_review" | "higher_priority_review" | "separate_mfs_review";

export interface IrmaaReviewPrep {
  id: "irmaa-review-prep";
  title: string;
  premiumYear: number;
  usualLookbackTaxYear: number;
  incomeProxy: number;
  partBEstimate: IrmaaPartBEstimate;
  priority: IrmaaReviewPriority;
  thresholdLabel: string;
  summary: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

export interface IrmaaPartBEstimate {
  premiumYear: 2026;
  basis: "calculator_income_proxy";
  coverage: "full_part_b";
  sourceLabel: string;
  sourceHref: string;
  standardMonthlyPremium: number;
  monthlyAdjustmentAmount: number;
  totalMonthlyPremium: number;
  bracketLabel: string;
  boundaryNote: string;
}

interface IrmaaPartBBracket {
  individualMin: number;
  individualMax: number | null;
  jointMin: number;
  jointMax: number | null;
  adjustment: number;
  totalPremium: number;
}

interface IrmaaPartBMarriedSeparateBracket {
  min: number;
  max: number | null;
  adjustment: number;
  totalPremium: number;
}

const CMS_2026_PART_B_SOURCE = {
  href: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
  label: "CMS 2026 Medicare Parts A & B premiums and deductibles",
};

const STANDARD_2026_PART_B_MONTHLY_PREMIUM = 202.9;

const IRMAA_2026_PART_B_BRACKETS: IrmaaPartBBracket[] = [
  { individualMin: 0, individualMax: 109000, jointMin: 0, jointMax: 218000, adjustment: 0, totalPremium: 202.9 },
  { individualMin: 109000, individualMax: 137000, jointMin: 218000, jointMax: 274000, adjustment: 81.2, totalPremium: 284.1 },
  { individualMin: 137000, individualMax: 171000, jointMin: 274000, jointMax: 342000, adjustment: 202.9, totalPremium: 405.8 },
  { individualMin: 171000, individualMax: 205000, jointMin: 342000, jointMax: 410000, adjustment: 324.6, totalPremium: 527.5 },
  { individualMin: 205000, individualMax: 500000, jointMin: 410000, jointMax: 750000, adjustment: 446.3, totalPremium: 649.2 },
  { individualMin: 500000, individualMax: null, jointMin: 750000, jointMax: null, adjustment: 487, totalPremium: 689.9 },
];

const IRMAA_2026_PART_B_MARRIED_SEPARATE_BRACKETS: IrmaaPartBMarriedSeparateBracket[] = [
  { min: 0, max: 109000, adjustment: 0, totalPremium: 202.9 },
  { min: 109000, max: 391000, adjustment: 446.3, totalPremium: 649.2 },
  { min: 391000, max: null, adjustment: 487, totalPremium: 689.9 },
];

const FIRST_IRMAA_REVIEW_THRESHOLDS: Record<FilingStatus, number> = {
  head_of_household: IRMAA_2026_PART_B_BRACKETS[0].individualMax ?? 109000,
  married_joint: IRMAA_2026_PART_B_BRACKETS[0].jointMax ?? 218000,
  married_separate: IRMAA_2026_PART_B_MARRIED_SEPARATE_BRACKETS[0].max ?? 109000,
  single: IRMAA_2026_PART_B_BRACKETS[0].individualMax ?? 109000,
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

function formatRange(min: number, max: number | null): string {
  if (min <= 0 && max !== null) {
    return `Less than or equal to ${formatCurrency(max)}`;
  }

  if (max === null) {
    return `Greater than or equal to ${formatCurrency(min)}`;
  }

  return `Greater than ${formatCurrency(min)} and less than or equal to ${formatCurrency(max)}`;
}

function fallsInRange(value: number, min: number, max: number | null): boolean {
  if (value <= min && min > 0) {
    return false;
  }

  return max === null ? value >= min : value <= max;
}

export function estimateIrmaaPartBFromIncomeProxy(
  filingStatus: FilingStatus,
  incomeProxy: number,
): IrmaaPartBEstimate {
  const normalizedIncomeProxy = Math.max(0, incomeProxy);
  const isMarriedSeparate = filingStatus === "married_separate";
  const bracket = isMarriedSeparate
    ? IRMAA_2026_PART_B_MARRIED_SEPARATE_BRACKETS.find((item) =>
        fallsInRange(normalizedIncomeProxy, item.min, item.max),
      )
    : IRMAA_2026_PART_B_BRACKETS.find((item) => {
        const min = filingStatus === "married_joint" ? item.jointMin : item.individualMin;
        const max = filingStatus === "married_joint" ? item.jointMax : item.individualMax;

        return fallsInRange(normalizedIncomeProxy, min, max);
      });

  const matchedBracket = bracket ?? IRMAA_2026_PART_B_BRACKETS[IRMAA_2026_PART_B_BRACKETS.length - 1];
  const bracketLabel = isMarriedSeparate
    ? `${filingStatusLabel(filingStatus)} MAGI: ${formatRange(
        (matchedBracket as IrmaaPartBMarriedSeparateBracket).min,
        (matchedBracket as IrmaaPartBMarriedSeparateBracket).max,
      )}`
    : `${filingStatusLabel(filingStatus)} MAGI: ${formatRange(
        filingStatus === "married_joint"
          ? (matchedBracket as IrmaaPartBBracket).jointMin
          : (matchedBracket as IrmaaPartBBracket).individualMin,
        filingStatus === "married_joint"
          ? (matchedBracket as IrmaaPartBBracket).jointMax
          : (matchedBracket as IrmaaPartBBracket).individualMax,
      )}`;

  return {
    basis: "calculator_income_proxy",
    boundaryNote:
      "This preview uses the calculator income proxy after conversion, not SSA's actual lookback-year MAGI determination. Verify Medicare enrollment, MAGI, Part D, and any SSA notice before using it for planning.",
    bracketLabel,
    coverage: "full_part_b",
    monthlyAdjustmentAmount: matchedBracket.adjustment,
    premiumYear: 2026,
    sourceHref: CMS_2026_PART_B_SOURCE.href,
    sourceLabel: CMS_2026_PART_B_SOURCE.label,
    standardMonthlyPremium: STANDARD_2026_PART_B_MONTHLY_PREMIUM,
    totalMonthlyPremium: matchedBracket.totalPremium,
  };
}

export function buildIrmaaReviewPrep(input: RothConversionInput, result: RothConversionResult): IrmaaReviewPrep {
  const premiumYear = input.taxYear;
  const usualLookbackTaxYear = premiumYear - 2;
  const incomeProxy = input.currentTaxableIncome + result.taxableConversion;
  const partBEstimate = estimateIrmaaPartBFromIncomeProxy(input.filingStatus, incomeProxy);
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
      CMS_2026_PART_B_SOURCE,
      {
        href: "https://www.medicare.gov/basics/costs/medicare-costs/part-b-costs",
        label: "Medicare.gov Part B costs and IRMAA",
      },
      {
        href: "https://www.ssa.gov/forms/ssa-44.pdf",
        label: "SSA-44 life-changing event form",
      },
    ],
    partBEstimate,
    premiumYear,
    priority,
    summary,
    thresholdLabel,
    title: "IRMAA Review Prep",
    usualLookbackTaxYear,
  };
}
