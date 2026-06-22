import type { TaxYear } from "@/core/calculator/types";

export const TAX_DATA_FRESHNESS: {
  taxYear: TaxYear;
  lastUpdated: string;
  reviewedMonth: string;
  sourceLabel: string;
  sourceUrls: {
    label: string;
    url: string;
  }[];
  professionalReviewStatus: string;
  updateWindow: string;
  scope: string;
  excludedInteractions: string[];
} = {
  taxYear: 2026,
  lastUpdated: "May 30, 2026",
  reviewedMonth: "May 2026",
  sourceLabel: "IRS annual tax inflation adjustments and retirement account publications",
  sourceUrls: [
    {
      label: "IRS tax inflation adjustments for tax year 2026",
      url: "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill/",
    },
    {
      label: "IRS Publication 590-A",
      url: "https://www.irs.gov/publications/p590a",
    },
    {
      label: "IRS Publication 590-B",
      url: "https://www.irs.gov/publications/p590b",
    },
    {
      label: "CMS 2026 Medicare Parts B premiums and deductibles",
      url: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles",
    },
  ],
  professionalReviewStatus: "Tax professional review pending; use this as an educational estimate only.",
  updateWindow: "Updated within 15 business days after new annual IRS tax tables are released.",
  scope: "Federal calculations are educational estimates based on the inputs provided by the user.",
  excludedInteractions: [
    "final IRMAA billing determinations",
    "ACA subsidies",
    "NIIT final Form 8960 calculations",
    "AMT",
    "tax credits",
    "state-specific deductions",
  ],
};
