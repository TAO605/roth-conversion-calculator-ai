import { encodeShareCode } from "@/common/storage/share-code";
import type { FilingStatus, RothConversionInput } from "@/core/calculator/types";

export interface FilingStatusPage {
  slug: string;
  filingStatus: FilingStatus;
  label: string;
  title: string;
  description: string;
  bracketNote: string;
  paragraphs: string[];
}

export const filingStatusPages: FilingStatusPage[] = [
  {
    slug: "single",
    filingStatus: "single",
    label: "Single",
    title: "Roth Conversion Calculator for Single Filers",
    description: "Estimate Roth conversion tax impact for single filers using 2026 federal brackets.",
    bracketNote: "Single filers may reach higher brackets with smaller conversion amounts than joint filers.",
    paragraphs: [
      "Single filers can use the Roth Conversion Calculator to model how a conversion adds to current taxable income.",
      "The federal tax impact depends on taxable income before the conversion, after-tax IRA basis, state tax assumptions, and how conversion taxes are paid.",
      "This page is educational and does not determine whether a conversion is appropriate for a specific taxpayer.",
    ],
  },
  {
    slug: "married-filing-jointly",
    filingStatus: "married_joint",
    label: "Married filing jointly",
    title: "Roth Conversion Calculator for Married Filing Jointly",
    description: "Estimate Roth conversion tax impact for married joint filers using 2026 federal brackets.",
    bracketNote: "Joint filers generally have wider federal bracket ranges than single filers.",
    paragraphs: [
      "Married filing jointly is a common status for household-level Roth conversion scenario modeling.",
      "Wider federal brackets may change how much taxable conversion income fits before reaching a higher bracket.",
      "The calculator still requires user assumptions for state tax, future returns, retirement tax rate, and tax payment method.",
    ],
  },
  {
    slug: "married-filing-separately",
    filingStatus: "married_separate",
    label: "Married filing separately",
    title: "Roth Conversion Calculator for Married Filing Separately",
    description: "Estimate Roth conversion tax impact for married separate filers using 2026 federal brackets.",
    bracketNote: "Married filing separately can have narrower bracket ranges and special tax interactions.",
    paragraphs: [
      "Married filing separately can produce different bracket exposure than joint filing for Roth conversion estimates.",
      "Some tax rules and limitations may be more restrictive for separate filers, so calculator output should be treated as a starting point.",
      "Professional review is especially important when filing status is chosen for broader tax, student loan, residency, or benefit reasons.",
    ],
  },
  {
    slug: "head-of-household",
    filingStatus: "head_of_household",
    label: "Head of household",
    title: "Roth Conversion Calculator for Head of Household",
    description: "Estimate Roth conversion tax impact for head of household filers using 2026 federal brackets.",
    bracketNote: "Head of household brackets differ from single and married filing separately brackets.",
    paragraphs: [
      "Head of household filers can model Roth conversion scenarios using the filing status that matches their expected tax return.",
      "The bracket ranges and taxable income room can differ from single filing status, affecting estimated federal tax cost.",
      "The calculator does not determine filing status eligibility and should not be used as a substitute for tax filing guidance.",
    ],
  },
];

export function getFilingStatusPageBySlug(slug: string): FilingStatusPage | undefined {
  return filingStatusPages.find((page) => page.slug === slug);
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

export function buildFilingStatusCalculatorHref(page: FilingStatusPage): string {
  return `/#${encodeShareCode({
    ...defaultCalculatorPrefill,
    filingStatus: page.filingStatus,
  })}`;
}
