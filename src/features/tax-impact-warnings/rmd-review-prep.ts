import { formatCurrency } from "@/common/format/currency";
import type { RothConversionInput } from "@/core/calculator/types";

export type RmdPreviewStatus = "preview_available" | "below_rmd_age" | "age_outside_table";

export interface RmdReviewPrep {
  id: "rmd-review-prep";
  title: string;
  taxYear: 2026;
  basis: "traditional_ira_balance_proxy";
  ownerAge: number;
  balanceProxy: number;
  previewStatus: RmdPreviewStatus;
  uniformLifetimeDistributionPeriod: number | null;
  annualRmdPreview: number | null;
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

const UNIFORM_LIFETIME_TABLE: Record<number, number> = {
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  116: 2.8,
  117: 2.7,
  118: 2.5,
  119: 2.3,
  120: 2.0,
};

const RMD_OFFICIAL_REFERENCES = [
  {
    href: "https://www.irs.gov/publications/p590b",
    label: "IRS Publication 590-B distributions from IRAs",
  },
  {
    href: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs",
    label: "IRS RMD FAQs",
  },
];

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildRmdReviewPrep(input: RothConversionInput): RmdReviewPrep {
  const ownerAge = Math.floor(input.age);
  const balanceProxy = Math.max(0, input.traditionalIraBalance);
  const distributionPeriod = UNIFORM_LIFETIME_TABLE[ownerAge] ?? null;
  const annualRmdPreview = distributionPeriod === null ? null : roundMoney(balanceProxy / distributionPeriod);
  const previewStatus: RmdPreviewStatus =
    ownerAge < 73 ? "below_rmd_age" : distributionPeriod === null ? "age_outside_table" : "preview_available";

  const summary =
    previewStatus === "preview_available" && annualRmdPreview !== null && distributionPeriod !== null
      ? `Using the entered traditional IRA balance proxy of ${formatCurrency(
          balanceProxy,
        )} and the Uniform Lifetime Table period ${distributionPeriod.toFixed(1)} for age ${ownerAge}, the bounded RMD preview is ${formatCurrency(
          annualRmdPreview,
        )}.`
      : previewStatus === "below_rmd_age"
        ? `The entered age is ${ownerAge}, which is below the current age-73 RMD review trigger used by this calculator. RMD timing can still matter for future conversion planning.`
        : `The entered age is ${ownerAge}, which is outside this calculator's retained Uniform Lifetime Table preview range. Use IRS tables, custodian records, or professional software for the RMD amount.`;

  return {
    annualRmdPreview,
    balanceProxy,
    basis: "traditional_ira_balance_proxy",
    boundaryNote:
      "This is a bounded traditional IRA owner preview using the entered IRA balance as a proxy. Actual RMD review may require the prior December 31 adjusted balance, account type, age determination, beneficiary/spouse table checks, inherited account rules, prior distributions, and custodian records before any required amount is used for planning.",
    id: "rmd-review-prep",
    missingInputs: [
      "Prior December 31 adjusted account balance for each IRA or plan account.",
      "Whether the account is a traditional IRA, SEP/SIMPLE IRA, employer plan, inherited account, or Roth IRA.",
      "Whether the spouse is the sole beneficiary and more than 10 years younger, which can require a different table.",
      "Any RMD already taken during the year and custodian distribution confirmations.",
      "Professional review of RMD sequencing before any Roth conversion request.",
    ],
    officialReferences: RMD_OFFICIAL_REFERENCES,
    ownerAge,
    previewStatus,
    summary,
    taxYear: input.taxYear,
    title: "RMD Uniform Lifetime Preview",
    uniformLifetimeDistributionPeriod: distributionPeriod,
  };
}
