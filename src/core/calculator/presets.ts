import type { RothConversionInput } from "@/core/calculator/types";
import { statePages } from "@/content/state-pages";

export interface ScenarioPreset {
  id: "young_professional" | "near_retirement" | "estate_planning";
  label: string;
  description: string;
  disclaimer: string;
  values: Partial<RothConversionInput>;
}

export interface StateTaxPreset {
  slug: string;
  stateCode: string;
  label: string;
  rate: number;
  note: string;
}

const scenarioPresets: ScenarioPreset[] = [
  {
    id: "young_professional",
    label: "Young professional",
    description: "Lower current income, longer compounding horizon, outside funds for taxes.",
    disclaimer: "This is a sample scenario for education, not a recommendation.",
    values: {
      conversionAmount: 25000,
      traditionalIraBalance: 90000,
      basis: 0,
      currentTaxableIncome: 65000,
      age: 32,
      retirementAge: 67,
      expectedAnnualReturn: 0.07,
      retirementMarginalTaxRate: 0.24,
      taxPaymentMethod: "outside_funds",
      withheldForTaxes: 0,
    },
  },
  {
    id: "near_retirement",
    label: "Near retirement",
    description: "Shorter horizon, larger IRA balance, careful tax-cost visibility.",
    disclaimer: "This is a sample scenario for education, not a recommendation.",
    values: {
      conversionAmount: 75000,
      traditionalIraBalance: 600000,
      basis: 0,
      currentTaxableIncome: 120000,
      age: 58,
      retirementAge: 67,
      expectedAnnualReturn: 0.05,
      retirementMarginalTaxRate: 0.22,
      taxPaymentMethod: "outside_funds",
      withheldForTaxes: 0,
    },
  },
  {
    id: "estate_planning",
    label: "Estate planning",
    description: "Higher balance and longer legacy horizon assumptions.",
    disclaimer: "This is a sample scenario for education, not a recommendation.",
    values: {
      conversionAmount: 150000,
      traditionalIraBalance: 1200000,
      basis: 50000,
      currentTaxableIncome: 240000,
      age: 62,
      retirementAge: 72,
      expectedAnnualReturn: 0.06,
      retirementMarginalTaxRate: 0.24,
      taxPaymentMethod: "outside_funds",
      withheldForTaxes: 0,
    },
  },
];

const noStateIncomeTax = new Set(["TX", "FL", "WA"]);

export function getScenarioPresets(): ScenarioPreset[] {
  return scenarioPresets;
}

export function getStateTaxPresets(): StateTaxPreset[] {
  return statePages
    .map((page) => ({
      slug: page.slug,
      stateCode: page.stateCode,
      label: page.stateName,
      rate: page.stateTaxRateExample,
      note: noStateIncomeTax.has(page.stateCode)
        ? "No broad state individual income tax example."
        : "Example marginal rate; verify your bracket.",
    }))
    .sort((first, second) => first.label.localeCompare(second.label));
}

export function applyScenarioPreset(input: RothConversionInput, presetId: ScenarioPreset["id"]): RothConversionInput {
  const preset = scenarioPresets.find((item) => item.id === presetId);

  if (!preset) {
    return input;
  }

  return {
    ...input,
    ...preset.values,
    taxYear: input.taxYear,
    penaltyException: preset.values.penaltyException ?? input.penaltyException,
    stateMarginalTaxRate: input.stateMarginalTaxRate,
  };
}
