import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";
import type { BracketImpact, FederalTaxDeltaInput, TaxBracket } from "@/core/calculator/types";

function bracketForIncome(income: number, brackets: TaxBracket[]): TaxBracket {
  const safeIncome = Math.max(0, income);
  return (
    brackets.find((bracket) => safeIncome >= bracket.min && (bracket.max === null || safeIncome <= bracket.max)) ??
    brackets[brackets.length - 1]
  );
}

function roomToBracketTop(income: number, bracket: TaxBracket): number | null {
  if (bracket.max === null) {
    return null;
  }

  return Math.max(0, Math.round(bracket.max - Math.max(0, income)));
}

export function calculateBracketImpact(input: FederalTaxDeltaInput): BracketImpact {
  if (input.taxYear !== 2026) {
    throw new Error(`Unsupported tax year: ${input.taxYear}`);
  }

  const brackets = FEDERAL_TAX_BRACKETS_2026[input.filingStatus];
  const baseIncome = Math.max(0, input.currentTaxableIncome);
  const additionalIncome = Math.max(0, input.additionalTaxableIncome);
  const afterIncome = baseIncome + additionalIncome;
  const beforeBracket = bracketForIncome(baseIncome, brackets);
  const afterBracket = bracketForIncome(afterIncome, brackets);
  const roomBefore = roomToBracketTop(baseIncome, beforeBracket);
  const crossesBracket = beforeBracket.rate !== afterBracket.rate;

  return {
    beforeRate: beforeBracket.rate,
    afterRate: afterBracket.rate,
    beforeBracketTop: beforeBracket.max,
    afterBracketTop: afterBracket.max,
    roomInCurrentBracketBeforeConversion: roomBefore,
    roomInCurrentBracketAfterConversion: roomToBracketTop(afterIncome, afterBracket),
    incomeTaxedInHigherBrackets:
      crossesBracket && roomBefore !== null ? Math.max(0, Math.round(additionalIncome - roomBefore)) : 0,
    crossesBracket,
  };
}
