import { encodeShareCode } from "@/common/storage/share-code";
import type { RothConversionInput } from "@/core/calculator/types";

export interface AgeScenarioPage {
  slug: string;
  label: string;
  title: string;
  description: string;
  age: number;
  retirementAge: number;
  penaltyNote: string;
  complianceNote: string;
  paragraphs: string[];
}

export const ageScenarioPages: AgeScenarioPage[] = [
  {
    slug: "under-59-and-a-half",
    label: "Under 59 1/2",
    title: "Roth Conversion Calculator Under 59 1/2",
    description:
      "Model Roth conversion taxes for users under 59 1/2 with age, tax-payment method, and potential early distribution penalty assumptions.",
    age: 45,
    retirementAge: 65,
    penaltyNote:
      "The calculator models a 10% early distribution penalty only when taxes are paid by withholding from the IRA and no exception is selected.",
    complianceNote:
      "This educational page does not determine whether an exception applies or whether a conversion is appropriate.",
    paragraphs: [
      "Users under 59 1/2 often need to pay close attention to how conversion taxes are paid.",
      "A Roth conversion itself is modeled as taxable income, while withholding money from the IRA for taxes may create a separate early distribution penalty assumption.",
      "Use this scenario to compare outside-funds tax payment against IRA withholding while keeping the result as an educational estimate.",
    ],
  },
  {
    slug: "age-59-and-a-half-to-retirement",
    label: "59 1/2 to retirement",
    title: "Roth Conversion Calculator After 59 1/2",
    description:
      "Estimate Roth conversion tax impact for users who are at least 59 1/2 and still planning toward retirement.",
    age: 60,
    retirementAge: 67,
    penaltyNote:
      "The calculator does not model an early distribution penalty once the age input is at least 59.5.",
    complianceNote:
      "This educational page explains calculator assumptions and does not provide tax, investment, or retirement advice.",
    paragraphs: [
      "After 59 1/2, the calculator can focus more on federal bracket impact, state tax assumptions, and years to retirement.",
      "The remaining compounding window may still affect break-even timing and projected after-tax value.",
      "Users should still verify account-specific rules, withholding choices, state treatment, and broader income interactions with a qualified professional.",
    ],
  },
  {
    slug: "near-retirement",
    label: "Near retirement",
    title: "Roth Conversion Calculator Near Retirement",
    description:
      "Model Roth conversion scenarios for users close to retirement using a shorter compounding window and retirement tax-rate assumptions.",
    age: 63,
    retirementAge: 67,
    penaltyNote:
      "Near-retirement scenarios usually depend more on tax bracket room and retirement income assumptions than long compounding periods.",
    complianceNote:
      "This educational page supports scenario modeling only and does not recommend a conversion amount or timing.",
    paragraphs: [
      "Near-retirement users often compare current-year tax cost against a relatively short runway before retirement.",
      "The calculator lets users adjust retirement age, expected return, and expected retirement marginal tax rate to see how sensitive the estimate is.",
      "The output should be treated as a planning worksheet for professional review, not as a final tax strategy.",
    ],
  },
  {
    slug: "already-retired",
    label: "Already retired",
    title: "Roth Conversion Calculator for Retirees",
    description:
      "Estimate Roth conversion tax impact for retired users with current income, state tax, and future tax assumptions.",
    age: 68,
    retirementAge: 68,
    penaltyNote:
      "The calculator sets years to retirement to zero when current age is at or above the retirement age input.",
    complianceNote:
      "This educational page does not model every retirement-income interaction and is not professional tax advice.",
    paragraphs: [
      "Retired users may use the calculator to isolate current-year federal and state tax cost from a Roth conversion.",
      "Because the years-to-retirement input can be zero, the output may emphasize upfront cost and tax-rate assumptions more than long-term accumulation.",
      "Other retirement income, deductions, credits, Medicare-related thresholds, and state rules are outside the core calculator scope.",
    ],
  },
];

export function getAgeScenarioPageBySlug(slug: string): AgeScenarioPage | undefined {
  return ageScenarioPages.find((page) => page.slug === slug);
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

export function buildAgeScenarioCalculatorHref(page: AgeScenarioPage): string {
  return `/#${encodeShareCode({
    ...defaultCalculatorPrefill,
    age: page.age,
    retirementAge: page.retirementAge,
  })}`;
}
