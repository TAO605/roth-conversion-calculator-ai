import { formatCurrency, formatPercent } from "@/common/format/currency";
import {
  getStateRuleRegistryEntry,
  type StateRuleAmountReadiness,
  type StateRuleStatus,
} from "@/content/state-rule-registry";
import { statePages } from "@/content/state-pages";
import type { RothConversionInput, RothConversionResult, StateReadinessInputs } from "@/core/calculator/types";

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
  selectedStateAmountReadiness: StateRuleAmountReadiness | null;
  userStateReadinessInputs: StateReadinessInputSummary;
  amountEstimateStatus: "manual_rate_only";
  summary: string;
  boundaryNote: string;
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
}

export interface StateReadinessInputSummary {
  providedCount: number;
  totalCount: number;
  status: "not_started" | "partially_provided" | "ready_for_professional_review";
  rows: { label: string; value: string; provided: boolean }[];
  summary: string;
}

export interface StateRulesStateExample {
  code: string;
  name: string;
  slug: string;
  exampleRate: number;
  ruleStatus: StateRuleStatus;
  ruleStatusLabel: string;
  ruleBoundaryNote: string;
  hasAmountReadinessWorksheet: boolean;
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

function formatOptionalCurrencyValue(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? formatCurrency(value) : "Not provided";
}

function formatOptionalBoolean(value: boolean | null | undefined): string {
  if (value === true) {
    return "Yes";
  }

  if (value === false) {
    return "No";
  }

  return "Not provided";
}

function residencyStatusLabel(value: StateReadinessInputs["residencyStatus"] | undefined): string {
  switch (value) {
    case "resident":
      return "Resident";
    case "part_year":
      return "Part-year resident";
    case "nonresident":
      return "Nonresident";
    default:
      return "Not provided";
  }
}

function buildUserStateReadinessInputSummary(input: RothConversionInput): StateReadinessInputSummary {
  const values = input.stateReadinessInputs;
  const rows = [
    {
      label: "Residency status",
      provided: values?.residencyStatus !== undefined && values.residencyStatus !== "not_provided",
      value: residencyStatusLabel(values?.residencyStatus),
    },
    {
      label: "State adjusted gross income",
      provided: typeof values?.stateAdjustedGrossIncome === "number" && Number.isFinite(values.stateAdjustedGrossIncome),
      value: formatOptionalCurrencyValue(values?.stateAdjustedGrossIncome),
    },
    {
      label: "State IRA basis or already-taxed amount",
      provided: typeof values?.stateIraBasis === "number" && Number.isFinite(values.stateIraBasis),
      value: formatOptionalCurrencyValue(values?.stateIraBasis),
    },
    {
      label: "Local tax may apply",
      provided: typeof values?.localTaxApplies === "boolean",
      value: formatOptionalBoolean(values?.localTaxApplies),
    },
    {
      label: "Other-state tax credit may apply",
      provided: typeof values?.otherStateTaxCreditApplies === "boolean",
      value: formatOptionalBoolean(values?.otherStateTaxCreditApplies),
    },
    {
      label: "State review notes",
      provided: typeof values?.notes === "string" && values.notes.trim().length > 0,
      value: values?.notes?.trim() ? values.notes.trim() : "Not provided",
    },
  ];
  const providedCount = rows.filter((row) => row.provided).length;
  const status =
    providedCount === 0
      ? "not_started"
      : providedCount === rows.length
        ? "ready_for_professional_review"
        : "partially_provided";

  return {
    providedCount,
    rows,
    status,
    summary: `${providedCount} of ${rows.length} selected-state readiness inputs have been provided for professional review. These inputs are not used by the state tax formula.`,
    totalCount: rows.length,
  };
}

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
    hasAmountReadinessWorksheet: getStateRuleRegistryEntry(page.slug).amountReadiness !== undefined,
    name: page.stateName,
    ruleBoundaryNote: getStateRuleRegistryEntry(page.slug).boundaryNote,
    ruleStatus: getStateRuleRegistryEntry(page.slug).status,
    ruleStatusLabel: getStateRuleRegistryEntry(page.slug).statusLabel,
    slug: page.slug,
  }));
  const selectedState = supportedStateExamples.find((state) => state.slug === input.selectedState) ?? null;
  const stateRuleEntry = selectedState === null ? getStateRuleRegistryEntry(null) : getStateRuleRegistryEntry(selectedState.slug);
  const userStateReadinessInputs = buildUserStateReadinessInputSummary(input);

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
    selectedStateAmountReadiness: stateRuleEntry.amountReadiness ?? null,
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
    userStateReadinessInputs,
  };
}
