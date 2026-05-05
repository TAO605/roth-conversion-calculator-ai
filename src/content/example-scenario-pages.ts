import { encodeShareCode } from "@/common/storage/share-code";
import { applyScenarioPreset, getScenarioPresets, type ScenarioPreset } from "@/core/calculator/presets";
import type { RothConversionInput } from "@/core/calculator/types";

export interface ExampleScenarioPage {
  slug: string;
  presetId: ScenarioPreset["id"];
  label: string;
  title: string;
  description: string;
  disclaimer: string;
  useCase: string;
  paragraphs: string[];
}

const scenarioCopy: Record<ScenarioPreset["id"], Omit<ExampleScenarioPage, "presetId">> = {
  young_professional: {
    slug: "young-professional",
    label: "Young professional",
    title: "Young Professional Roth Conversion Example",
    description:
      "Open a Roth conversion calculator example with lower current income, a smaller conversion amount, and a longer compounding window.",
    disclaimer: "This example is educational and not a recommendation to convert, invest, or use a specific amount.",
    useCase: "Lower current income, longer compounding horizon, and outside-funds tax payment assumptions.",
    paragraphs: [
      "This example uses a younger age, moderate taxable income, and a smaller conversion amount to show how a long compounding window changes the projection.",
      "It is designed to help users understand inputs such as current taxable income, retirement age, expected return, and retirement marginal tax rate.",
      "The scenario does not decide whether a Roth conversion is appropriate for any person and should only be used as a calculator walkthrough.",
    ],
  },
  near_retirement: {
    slug: "near-retirement",
    label: "Near retirement",
    title: "Near Retirement Roth Conversion Example",
    description:
      "Open a near-retirement Roth conversion calculator example with a larger IRA balance and shorter projection window.",
    disclaimer: "This example is educational and not a recommendation to convert, invest, or use a specific amount.",
    useCase: "Shorter horizon, larger IRA balance, and careful upfront tax-cost visibility.",
    paragraphs: [
      "This example uses a shorter runway before retirement to show how upfront tax cost and break-even timing become more visible.",
      "It helps users see how conversion amount, taxable income, age, and retirement tax-rate assumptions interact in the model.",
      "The scenario is a starting point for understanding the calculator and is not a tax planning recommendation.",
    ],
  },
  estate_planning: {
    slug: "estate-planning",
    label: "Estate planning",
    title: "Estate Planning Roth Conversion Example",
    description:
      "Open a Roth conversion calculator example with a higher balance, after-tax basis, and legacy-oriented projection assumptions.",
    disclaimer: "This example is educational and not a recommendation to convert, invest, or use a specific amount.",
    useCase: "Higher balance, after-tax basis, and longer legacy-oriented projection assumptions.",
    paragraphs: [
      "This example uses a larger balance and after-tax basis to demonstrate how the taxable conversion amount can differ from the gross conversion amount.",
      "It is useful for learning how basis, federal brackets, state tax assumptions, and future value projections appear in the calculator.",
      "Estate and beneficiary planning can involve legal and tax issues outside this calculator, so this scenario remains educational only.",
    ],
  },
};

export const exampleScenarioPages: ExampleScenarioPage[] = getScenarioPresets().map((preset) => ({
  presetId: preset.id,
  ...scenarioCopy[preset.id],
}));

export function getExampleScenarioPageBySlug(slug: string): ExampleScenarioPage | undefined {
  return exampleScenarioPages.find((page) => page.slug === slug);
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

export function buildExampleScenarioCalculatorHref(page: ExampleScenarioPage): string {
  return `/#${encodeShareCode(applyScenarioPreset(defaultCalculatorPrefill, page.presetId))}`;
}
