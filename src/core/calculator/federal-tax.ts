import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";
import type { FederalTaxDeltaInput, FilingStatus, TaxBracket, TaxYear } from "@/core/calculator/types";

function getBrackets(taxYear: TaxYear, filingStatus: FilingStatus): TaxBracket[] {
  if (taxYear !== 2026) {
    throw new Error(`Unsupported tax year: ${taxYear}`);
  }

  return FEDERAL_TAX_BRACKETS_2026[filingStatus];
}

export function calculateFederalTax(taxableIncome: number, filingStatus: FilingStatus, taxYear: TaxYear): number {
  const safeIncome = Math.max(0, taxableIncome);
  const brackets = getBrackets(taxYear, filingStatus);

  return brackets.reduce((tax, bracket) => {
    if (safeIncome <= bracket.min) {
      return tax;
    }

    const upper = bracket.max ?? safeIncome;
    const taxableInBracket = Math.max(0, Math.min(safeIncome, upper) - bracket.min);
    return tax + taxableInBracket * bracket.rate;
  }, 0);
}

export function calculateFederalTaxDelta(input: FederalTaxDeltaInput): number {
  const baseIncome = Math.max(0, input.currentTaxableIncome);
  const additionalIncome = Math.max(0, input.additionalTaxableIncome);

  return Math.round(
    calculateFederalTax(baseIncome + additionalIncome, input.filingStatus, input.taxYear) -
      calculateFederalTax(baseIncome, input.filingStatus, input.taxYear),
  );
}
