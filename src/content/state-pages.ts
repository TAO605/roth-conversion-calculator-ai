import { encodeShareCode } from "@/common/storage/share-code";
import type { RothConversionInput } from "@/core/calculator/types";

export interface StatePage {
  slug: string;
  stateCode: string;
  stateName: string;
  title: string;
  description: string;
  stateTaxRateExample: number;
  stateTaxSummary: string;
  verificationNote: string;
  paragraphs: string[];
}

export const statePages: StatePage[] = [
  {
    slug: "california",
    stateCode: "CA",
    stateName: "California",
    title: "Roth Conversion Calculator California",
    description: "Estimate Roth conversion tax impact with California state tax assumptions and federal 2026 brackets.",
    stateTaxRateExample: 0.093,
    stateTaxSummary: "California has state individual income tax, so Roth conversion income may increase state tax.",
    verificationNote: "Verify your actual California marginal tax rate and any state-specific treatment with a tax professional.",
    paragraphs: [
      "California residents often need to consider both federal tax and California state income tax when modeling a Roth conversion.",
      "This page uses an example California marginal state tax rate so you can quickly see how state tax can change the upfront cost estimate.",
      "The calculator does not replace California-specific tax guidance, and it does not model every credit, surcharge, or special income interaction.",
    ],
  },
  {
    slug: "texas",
    stateCode: "TX",
    stateName: "Texas",
    title: "Roth Conversion Calculator Texas",
    description: "Estimate Roth conversion federal tax impact for Texas residents with no state individual income tax assumption.",
    stateTaxRateExample: 0,
    stateTaxSummary: "Texas has no state individual income tax, so the state tax assumption is commonly set to 0%.",
    verificationNote: "Verify that your residency and income facts support a 0% Texas state income tax assumption.",
    paragraphs: [
      "Texas residents often model Roth conversions with a 0% state individual income tax assumption.",
      "Federal tax can still be significant because the taxable portion of a Roth conversion generally increases ordinary income.",
      "This page keeps the Texas state tax assumption simple while still highlighting federal tax, break-even timing, and professional-review items.",
    ],
  },
  {
    slug: "florida",
    stateCode: "FL",
    stateName: "Florida",
    title: "Roth Conversion Calculator Florida",
    description: "Estimate Roth conversion taxes for Florida residents using a no state individual income tax assumption.",
    stateTaxRateExample: 0,
    stateTaxSummary: "Florida has no state individual income tax, so the state tax assumption is commonly set to 0%.",
    verificationNote: "Verify your Florida residency, income sources, and any multi-state filing issues before relying on a 0% state assumption.",
    paragraphs: [
      "Florida residents commonly start Roth conversion estimates with no state individual income tax.",
      "The federal tax impact still depends on filing status, current taxable income, basis, and the size of the conversion.",
      "If you moved states during the year or have multi-state income, state tax assumptions may need professional review.",
    ],
  },
  {
    slug: "new-york",
    stateCode: "NY",
    stateName: "New York",
    title: "Roth Conversion Calculator New York",
    description: "Estimate Roth conversion tax impact with New York state tax assumptions and federal 2026 brackets.",
    stateTaxRateExample: 0.0685,
    stateTaxSummary: "New York has state individual income tax, and some residents may also face local tax considerations.",
    verificationNote: "Verify your New York state and local marginal tax rates before using the example rate.",
    paragraphs: [
      "New York residents may need to consider federal tax, state tax, and in some cases local tax when estimating Roth conversion costs.",
      "This page uses an example New York marginal state tax rate for educational modeling.",
      "Local tax, residency status, deductions, and credits are outside the MVP calculator scope and should be reviewed separately.",
    ],
  },
  {
    slug: "washington",
    stateCode: "WA",
    stateName: "Washington",
    title: "Roth Conversion Calculator Washington",
    description: "Estimate Roth conversion federal tax impact for Washington residents using a 0% wage income tax assumption.",
    stateTaxRateExample: 0,
    stateTaxSummary: "Washington does not have a broad state individual income tax on wages.",
    verificationNote: "Verify state-specific rules and income types before assuming a 0% state rate.",
    paragraphs: [
      "Washington residents often use a 0% broad state individual income tax assumption for Roth conversion modeling.",
      "The federal tax estimate remains the main driver for many users, especially when conversion income crosses federal brackets.",
      "State-specific income classifications and future law changes are outside the calculator scope and should be verified.",
    ],
  },
  {
    slug: "new-jersey",
    stateCode: "NJ",
    stateName: "New Jersey",
    title: "Roth Conversion Calculator New Jersey",
    description: "Estimate Roth conversion tax impact with New Jersey state tax assumptions and federal 2026 brackets.",
    stateTaxRateExample: 0.0637,
    stateTaxSummary: "New Jersey has state individual income tax, so Roth conversion income may increase state tax.",
    verificationNote: "Verify New Jersey treatment, basis rules, and your actual marginal state rate with a tax professional.",
    paragraphs: [
      "New Jersey residents should consider both federal tax and state tax when estimating Roth conversion costs.",
      "This page uses an example marginal state tax rate to show how the state component affects total upfront cost.",
      "New Jersey-specific basis and retirement income treatment can be nuanced and is outside this MVP calculator scope.",
    ],
  },
];

export function getStatePageBySlug(slug: string): StatePage | undefined {
  return statePages.find((page) => page.slug === slug);
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

export function buildStateCalculatorHref(page: StatePage): string {
  return `/#${encodeShareCode({
    ...defaultCalculatorPrefill,
    stateMarginalTaxRate: page.stateTaxRateExample,
  })}`;
}
