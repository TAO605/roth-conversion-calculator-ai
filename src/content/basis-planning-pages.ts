import { encodeShareCode } from "@/common/storage/share-code";
import type { RothConversionInput } from "@/core/calculator/types";

export interface BasisPlanningPage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  complianceNote: string;
  basis: number;
  traditionalIraBalance: number;
  paragraphs: string[];
}

export const basisPlanningPages: BasisPlanningPage[] = [
  {
    slug: "after-tax-basis",
    title: "After-Tax Basis and Roth Conversion Calculator",
    description:
      "Learn how after-tax basis can reduce the taxable portion of a Roth conversion and why recordkeeping matters.",
    summary: "Basis can reduce taxable conversion amounts when tracked correctly and combined with the calculator's pro-rata assumptions.",
    complianceNote: "This educational page explains basis concepts only and does not provide tax, financial, legal, or investment advice.",
    basis: 40000,
    traditionalIraBalance: 200000,
    paragraphs: [
      "After-tax basis is money in a traditional IRA that has already been taxed and may reduce the taxable portion of a Roth conversion.",
      "The calculator uses basis and total traditional IRA balance to estimate the taxable conversion amount in a simplified educational model.",
      "Accurate basis records, often associated with Form 8606, are important because poor records can make the estimate misleading.",
    ],
  },
  {
    slug: "pro-rata-rule",
    title: "Pro-Rata Rule and Roth Conversion Calculator",
    description:
      "See how the pro-rata rule can make a Roth conversion partly taxable even when after-tax basis exists.",
    summary: "The pro-rata rule can allocate conversion treatment across pre-tax and after-tax IRA money based on account balances.",
    complianceNote: "This educational page explains pro-rata assumptions only and does not provide tax, financial, legal, or investment advice.",
    basis: 40000,
    traditionalIraBalance: 200000,
    paragraphs: [
      "The pro-rata rule is especially important when an IRA contains both pre-tax and after-tax amounts.",
      "The calculator simplifies this by using basis divided by traditional IRA balance to estimate the excluded portion of a conversion.",
      "Because aggregation and reporting rules can be nuanced, the page is intended for educational modeling rather than filing guidance.",
    ],
  },
  {
    slug: "form-8606",
    title: "Form 8606 and Roth Conversion Calculator",
    description:
      "Understand why Form 8606 is commonly associated with nondeductible contributions, basis tracking, and Roth conversions.",
    summary: "Form 8606 is often referenced when basis or nondeductible IRA contributions need to be documented for tax reporting.",
    complianceNote: "This educational page explains form-related concepts only and does not provide tax, financial, legal, or investment advice.",
    basis: 40000,
    traditionalIraBalance: 200000,
    paragraphs: [
      "Form 8606 is commonly connected to nondeductible IRA contributions, after-tax basis, and certain Roth conversion reporting needs.",
      "The calculator can estimate basis effects, but it does not replace tax software or professional filing review.",
      "The page is designed to help users identify when basis records may need verification before making a conversion decision.",
    ],
  },
];

export function getBasisPlanningPageBySlug(slug: string): BasisPlanningPage | undefined {
  return basisPlanningPages.find((page) => page.slug === slug);
}

const defaultCalculatorPrefill: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

export function buildBasisPlanningCalculatorHref(page: BasisPlanningPage): string {
  return `/#${encodeShareCode({
    ...defaultCalculatorPrefill,
    traditionalIraBalance: page.traditionalIraBalance,
    basis: page.basis,
  })}`;
}
