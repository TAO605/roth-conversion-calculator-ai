import { decodeShareCode, encodeShareCode } from "@/common/storage/share-code";
import type { FilingStatus, RothConversionInput, TaxPaymentMethod } from "@/core/calculator/types";

const STORAGE_KEY = "roth-conversion-calculator:v1";

const filingStatuses = new Set<FilingStatus>(["single", "married_joint", "married_separate", "head_of_household"]);
const taxPaymentMethods = new Set<TaxPaymentMethod>(["outside_funds", "withhold_from_ira", "not_sure"]);

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
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
