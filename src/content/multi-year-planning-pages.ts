import { encodeShareCode } from "@/common/storage/share-code";
import type { RothConversionInput } from "@/core/calculator/types";

export interface MultiYearPlanningPage {
  slug: string;
  years: number;
  title: string;
  description: string;
  summary: string;
  annualConversionLabel: string;
  complianceNote: string;
  paragraphs: string[];
}

const totalExampleConversion = 60000;

export const multiYearPlanningPages: MultiYearPlanningPage[] = [
  {
    slug: "lump-sum",
    years: 1,
    title: "Lump-Sum Roth Conversion Example",
    description: "Compare a lump-sum Roth conversion against staged educational conversion schedules.",
    summary: "A lump-sum example models the full conversion amount in one tax year.",
    annualConversionLabel: "$60,000 in one year",
    complianceNote:
      "This educational page explains equal-split schedule modeling and does not recommend a conversion amount or timing.",
    paragraphs: [
      "A lump-sum Roth conversion places the full modeled conversion amount into one tax year.",
      "This can make bracket impact, state tax assumptions, and cash-flow cost easier to see in a single-year estimate.",
      "The calculator's multi-year table compares this against equal annual splits for education only.",
    ],
  },
  {
    slug: "2-year-plan",
    years: 2,
    title: "2-Year Roth Conversion Plan Example",
    description: "Model an educational 2-year equal-split Roth conversion schedule and compare it with a lump sum.",
    summary: "A 2-year example splits the modeled conversion amount into two equal annual amounts.",
    annualConversionLabel: "$30,000 per year for 2 years",
    complianceNote:
      "This educational page explains equal-split schedule modeling and does not recommend a conversion amount or timing.",
    paragraphs: [
      "A 2-year equal split can help users see how spreading conversion income may change annual tax exposure in the simplified model.",
      "The calculator keeps filing status, taxable income, state rate, and 2026 federal brackets constant for the educational schedule.",
      "Real multi-year planning may involve changing income, deductions, tax law, investment returns, and professional tax review.",
    ],
  },
  {
    slug: "3-year-plan",
    years: 3,
    title: "3-Year Roth Conversion Plan Example",
    description: "Model an educational 3-year equal-split Roth conversion schedule with calculator assumptions.",
    summary: "A 3-year example splits the modeled conversion amount into three equal annual amounts.",
    annualConversionLabel: "$20,000 per year for 3 years",
    complianceNote:
      "This educational page explains equal-split schedule modeling and does not recommend a conversion amount or timing.",
    paragraphs: [
      "A 3-year split can make annual conversion amounts smaller while extending the modeled tax-payment period.",
      "The schedule is useful for understanding how the calculator compares federal tax, state tax, penalties, and highest bracket by year count.",
      "The page does not optimize a schedule and should not be treated as tax planning advice.",
    ],
  },
  {
    slug: "5-year-plan",
    years: 5,
    title: "5-Year Roth Conversion Plan Example",
    description: "Model an educational 5-year equal-split Roth conversion schedule and compare annual tax-cost timing.",
    summary: "A 5-year example splits the modeled conversion amount into five equal annual amounts.",
    annualConversionLabel: "$12,000 per year for 5 years",
    complianceNote:
      "This educational page explains equal-split schedule modeling and does not recommend a conversion amount or timing.",
    paragraphs: [
      "A 5-year equal split shows the longest staged example included in the current calculator table.",
      "Smaller annual conversion amounts may interact differently with bracket capacity in the simplified educational model.",
      "Actual long-range conversion planning can be affected by income changes, RMD timing, state changes, and tax-law updates.",
    ],
  },
];

export function getMultiYearPlanningPageBySlug(slug: string): MultiYearPlanningPage | undefined {
  return multiYearPlanningPages.find((page) => page.slug === slug);
}

const defaultCalculatorPrefill: RothConversionInput = {
  conversionAmount: totalExampleConversion,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
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

export function buildMultiYearPlanningCalculatorHref(_page: MultiYearPlanningPage): string {
  return `/#${encodeShareCode(defaultCalculatorPrefill)}`;
}
