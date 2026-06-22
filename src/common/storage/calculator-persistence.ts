import { decodeShareCode, encodeShareCode } from "@/common/storage/share-code";
import { statePages } from "@/content/state-pages";
import type {
  FilingStatus,
  RothConversionInput,
  StateReadinessInputs,
  StateResidencyStatus,
  TaxPaymentMethod,
} from "@/core/calculator/types";

const STORAGE_KEY = "roth-conversion-calculator:v1";

const filingStatuses = new Set<FilingStatus>(["single", "married_joint", "married_separate", "head_of_household"]);
const taxPaymentMethods = new Set<TaxPaymentMethod>(["outside_funds", "withhold_from_ira", "not_sure"]);
const stateResidencyStatuses = new Set<StateResidencyStatus>(["not_provided", "resident", "part_year", "nonresident"]);
const stateSlugs = new Set(statePages.map((page) => page.slug));

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function selectedState(value: unknown, fallback: string | null | undefined): string | null {
  return typeof value === "string" && stateSlugs.has(value) ? value : fallback ?? null;
}

function nullableFiniteNumber(value: unknown, fallback: number | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback ?? null;
}

function nullableNonNegativeFiniteNumber(value: unknown, fallback: number | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  return fallback ?? null;
}

function nullableBoolean(value: unknown, fallback: boolean | null | undefined): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback ?? null;
}

function safeNotes(value: unknown, fallback: string | undefined): string {
  const source = typeof value === "string" ? value : fallback ?? "";

  return source.slice(0, 500);
}

function stateReadinessInputs(
  value: unknown,
  fallback: StateReadinessInputs | undefined,
): StateReadinessInputs | undefined {
  if (typeof value !== "object" || value === null) {
    return fallback;
  }

  const partial = value as Partial<StateReadinessInputs>;

  return {
    localTaxApplies: nullableBoolean(partial.localTaxApplies, fallback?.localTaxApplies),
    notes: safeNotes(partial.notes, fallback?.notes),
    otherStateTaxCreditApplies: nullableBoolean(
      partial.otherStateTaxCreditApplies,
      fallback?.otherStateTaxCreditApplies,
    ),
    residencyStatus:
      partial.residencyStatus && stateResidencyStatuses.has(partial.residencyStatus)
        ? partial.residencyStatus
        : fallback?.residencyStatus ?? "not_provided",
    stateAdjustedGrossIncome: nullableFiniteNumber(
      partial.stateAdjustedGrossIncome,
      fallback?.stateAdjustedGrossIncome,
    ),
    stateIraBasis: nullableFiniteNumber(partial.stateIraBasis, fallback?.stateIraBasis),
    reviewedStateTaxEstimate: nullableNonNegativeFiniteNumber(
      partial.reviewedStateTaxEstimate,
      fallback?.reviewedStateTaxEstimate,
    ),
  };
}

export function mergeCalculatorInput(
  defaults: RothConversionInput,
  partial: Partial<RothConversionInput>,
): RothConversionInput {
  return {
    conversionAmount: finiteNumber(partial.conversionAmount, defaults.conversionAmount),
    traditionalIraBalance: finiteNumber(partial.traditionalIraBalance, defaults.traditionalIraBalance),
    basis: finiteNumber(partial.basis, defaults.basis),
    filingStatus:
      partial.filingStatus && filingStatuses.has(partial.filingStatus) ? partial.filingStatus : defaults.filingStatus,
    currentTaxableIncome: finiteNumber(partial.currentTaxableIncome, defaults.currentTaxableIncome),
    netInvestmentIncome: nullableNonNegativeFiniteNumber(
      partial.netInvestmentIncome,
      defaults.netInvestmentIncome,
    ),
    annualSocialSecurityBenefits: nullableNonNegativeFiniteNumber(
      partial.annualSocialSecurityBenefits,
      defaults.annualSocialSecurityBenefits,
    ),
    taxExemptInterest: nullableNonNegativeFiniteNumber(partial.taxExemptInterest, defaults.taxExemptInterest),
    annualAdvancePremiumTaxCredit: nullableNonNegativeFiniteNumber(
      partial.annualAdvancePremiumTaxCredit,
      defaults.annualAdvancePremiumTaxCredit,
    ),
    marketplaceCoverageMonths: nullableNonNegativeFiniteNumber(
      typeof partial.marketplaceCoverageMonths === "number" &&
        partial.marketplaceCoverageMonths >= 0 &&
        partial.marketplaceCoverageMonths <= 12
        ? partial.marketplaceCoverageMonths
        : undefined,
      defaults.marketplaceCoverageMonths,
    ),
    amtTentativeMinimumTax: nullableNonNegativeFiniteNumber(
      partial.amtTentativeMinimumTax,
      defaults.amtTentativeMinimumTax,
    ),
    amtRegularTaxLiability: nullableNonNegativeFiniteNumber(
      partial.amtRegularTaxLiability,
      defaults.amtRegularTaxLiability,
    ),
    selectedState: selectedState(partial.selectedState, defaults.selectedState),
    stateReadinessInputs: stateReadinessInputs(partial.stateReadinessInputs, defaults.stateReadinessInputs),
    stateMarginalTaxRate: finiteNumber(partial.stateMarginalTaxRate, defaults.stateMarginalTaxRate),
    age: finiteNumber(partial.age, defaults.age),
    penaltyException:
      typeof partial.penaltyException === "boolean" ? partial.penaltyException : defaults.penaltyException,
    taxPaymentMethod:
      partial.taxPaymentMethod && taxPaymentMethods.has(partial.taxPaymentMethod)
        ? partial.taxPaymentMethod
        : defaults.taxPaymentMethod,
    withheldForTaxes: finiteNumber(partial.withheldForTaxes, defaults.withheldForTaxes),
    retirementAge: finiteNumber(partial.retirementAge, defaults.retirementAge),
    expectedAnnualReturn: finiteNumber(partial.expectedAnnualReturn, defaults.expectedAnnualReturn),
    retirementMarginalTaxRate: finiteNumber(partial.retirementMarginalTaxRate, defaults.retirementMarginalTaxRate),
    inflationRate: finiteNumber(partial.inflationRate, defaults.inflationRate),
    taxYear: 2026,
  };
}

export function buildShareUrl(baseUrl: string, input: RothConversionInput): string {
  return `${baseUrl}#${encodeShareCode(input)}`;
}

export function saveCalculatorInput(input: RothConversionInput): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
}

export function loadStoredCalculatorInput(): Partial<RothConversionInput> | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as Partial<RothConversionInput>;
  } catch {
    return null;
  }
}

export function clearStoredCalculatorInput(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadShareInputFromHash(hash: string): Partial<RothConversionInput> | null {
  const code = hash.replace(/^#/, "");

  if (!code) {
    return null;
  }

  return decodeShareCode(code);
}
