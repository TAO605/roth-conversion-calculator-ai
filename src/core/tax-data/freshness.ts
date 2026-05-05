import type { TaxYear } from "@/core/calculator/types";

export const TAX_DATA_FRESHNESS: {
  taxYear: TaxYear;
  reviewedMonth: string;
  sourceLabel: string;
  updateWindow: string;
  scope: string;
  excludedInteractions: string[];
} = {
  taxYear: 2026,
  reviewedMonth: "May 2026",
  sourceLabel: "IRS annual tax inflation adjustments and retirement account publications",
  updateWindow: "Updated within 15 business days after new annual IRS tax tables are released.",
  scope: "Federal calculations are educational estimates based on the inputs provided by the user.",
  excludedInteractions: ["IRMAA", "ACA subsidies", "NIIT", "AMT", "tax credits", "state-specific deductions"],
};
