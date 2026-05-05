import type { RothConversionInput } from "@/core/calculator/types";
import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";

export interface FederalBracketCapacityRow {
  rate: number;
  min: number;
  max: number | null;
  taxableRoom: number | null;
  grossConversionCapacity: number | null;
  currentBracket: boolean;
}

function taxableConversionRatio(input: RothConversionInput): number {
  if (input.traditionalIraBalance <= 0) {
    return 1;
  }

  const basisRatio = Math.min(1, Math.max(0, input.basis / input.traditionalIraBalance));
  return Math.max(0.0001, 1 - basisRatio);
}

export function buildFederalBracketCapacityRows(input: RothConversionInput): FederalBracketCapacityRow[] {
  if (input.taxYear !== 2026) {
    throw new Error(`Unsupported tax year: ${input.taxYear}`);
  }

  const currentIncome = Math.max(0, input.currentTaxableIncome);
  const ratio = taxableConversionRatio(input);

  return FEDERAL_TAX_BRACKETS_2026[input.filingStatus]
    .filter((bracket) => bracket.max === null || bracket.max > currentIncome)
    .map((bracket) => {
      const roomStart = Math.max(currentIncome, bracket.min);
      const taxableRoom = bracket.max === null ? null : Math.max(0, Math.round(bracket.max - roomStart));

      return {
        rate: bracket.rate,
        min: bracket.min,
        max: bracket.max,
        taxableRoom,
        grossConversionCapacity: taxableRoom === null ? null : Math.round(taxableRoom / ratio),
        currentBracket: currentIncome >= bracket.min && (bracket.max === null || currentIncome <= bracket.max),
      };
    });
}
