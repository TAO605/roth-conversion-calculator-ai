import { formatCurrency, formatPercent } from "@/common/format/currency";
import { getStateRuleRegistryEntry, type StateRuleStatus } from "@/content/state-rule-registry";
import { statePages } from "@/content/state-pages";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface StateRulesReviewPrep {
  id: "state-rules-review-prep";
  title: string;
  taxYear: 2026;
  basis: "manual_state_marginal_rate";
  manualStateRate: number;
  selectedState: StateRulesStateExample | null;
  taxableConversionIncrease: number;
  modeledStateTaxFromManualRate: number;
  supportedStateExamples: StateRulesStateExample[];
  stateRuleStatus: StateRuleStatus;
  stateRuleStatusLabel: string;
  stateRuleBoundaryNote: string;
  amountEstimateStatus: "manual_rate_only";
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

export interface StateRulesStateExample {
  code: string;
  name: string;
  slug: string;
  exampleRate: number;
  ruleStatus: StateRuleStatus;
  ruleStatusLabel: string;
  ruleBoundaryNote: string;
}

const STATE_RULES_OFFICIAL_REFERENCES = [
  {
    href: "https://www.irs.gov/businesses/small-businesses-self-employed/state-government-websites",
    label: "IRS state government websites directory",
  },
  {
    href: "https://www.ftb.ca.gov/",
    label: "California Franchise Tax Board",
  },
  {
    href: "https://www.tax.ny.gov/",
    label: "New York State Department of Taxation and Finance",
  },
  {
    href: "https://www.nj.gov/treasury/taxation/",
    label: "New Jersey Division of Taxation",
  },
  {
    href: "https://comptroller.texas.gov/taxes/",
    label: "Texas Comptroller tax information",
  },
  {
    href: "https://floridarevenue.com/",
    label: "Florida Department of Revenue",
  },
  {
    href: "https://dor.wa.gov/",
    label: "Washington Department of Revenue",
  },
];

export function buildStateRulesReviewPrep(
  input: RothConversionInput,
  result: RothConversionResult,
): StateRulesReviewPrep {
  const manualStateRate = Math.max(0, input.stateMarginalTaxRate);
  const taxableConversionIncrease = Math.max(0, result.taxableConversion);
  const modeledStateTaxFromManualRate = Math.max(0, result.stateTax);
  const supportedStateExamples = statePages.map((page) => ({
    code: page.stateCode,
    exampleRate: page.stateTaxRateExample,
    name: page.stateName,
    ruleBoundaryNote: getStateRuleRegistryEntry(page.slug).boundaryNote,
    ruleStatus: getStateRuleRegistryEntry(page.slug).status,
    ruleStatusLabel: getStateRuleRegistryEntry(page.slug).statusLabel,
    slug: page.slug,
  }));
  const selectedState = supportedStateExamples.find((state) => state.slug === input.selectedState) ?? null;
  const stateRuleEntry = selectedState === null ? getStateRuleRegistryEntry(null) : getStateRuleRegistryEntry(selectedState.slug);

  return {
    amountEstimateStatus: "manual_rate_only",
    basis: "manual_state_marginal_rate",
    boundaryNote:
      "This calculator applies only the manually entered state marginal rate to the taxable conversion. It does not determine residency, source income, state adjusted gross income, retirement-income exclusions, credits, local taxes, state AMT or minimum taxes, reciprocity, part-year residency, or multi-state filing rules.",
    id: "state-rules-review-prep",
    manualStateRate,
    missingInputs: [
      "Resident, part-year resident, or nonresident filing status for each state involved during the tax year.",
      "State adjusted gross income, additions, subtractions, deductions, credits, and retirement-income exclusions.",
      "Whether the conversion income is sourced, allocated, or taxed differently because of a move or multi-state income.",
      "Local income tax, state AMT, state minimum tax, or surcharge review where applicable.",
      "Official state tax forms, instructions, and professional review before relying on a state-specific amount.",
    ],
    modeledStateTaxFromManualRate,
    officialReferences: STATE_RULES_OFFICIAL_REFERENCES,
    selectedState,
    stateRuleBoundaryNote: stateRuleEntry.boundaryNote,
    stateRuleStatus: stateRuleEntry.status,
    stateRuleStatusLabel: stateRuleEntry.statusLabel,
    summary: `The calculator used ${
      selectedState === null ? "the manually entered state marginal rate" : `the ${selectedState.name} example rate`
    } of ${formatPercent(
      manualStateRate,
    )} against ${formatCurrency(
      taxableConversionIncrease,
    )} of taxable conversion income, producing a simplified state tax estimate of ${formatCurrency(
      modeledStateTaxFromManualRate,
    )}. ${
      selectedState === null
        ? "No supported state example is selected."
        : `${selectedState.name} is selected as an educational state example with rule status: ${stateRuleEntry.statusLabel}.`
    } ${stateRuleEntry.boundaryNote} The supported state pages are educational examples only; a full state-law engine is not active.`,
    supportedStateExamples,
    taxableConversionIncrease,
    taxYear: input.taxYear,
    title: "State Rules Readiness",
  };
}
