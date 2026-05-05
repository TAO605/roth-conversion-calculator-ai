import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";

export interface ConversionSensitivityRow {
  label: string;
  conversionAmount: number;
  taxableConversion: number;
  totalUpfrontCost: number;
  breakEvenYear: number | null;
  afterTaxDifference: number;
  afterFederalRate: number;
}

const multipliers = [0.5, 0.75, 1, 1.25, 1.5] as const;

function capConversionAmount(amount: number, balance: number): number {
  return Math.max(0, Math.min(Math.round(amount), Math.max(0, balance)));
}

function labelForMultiplier(multiplier: (typeof multipliers)[number]): string {
  if (multiplier === 1) {
    return "Current";
  }

  return `${Math.round(multiplier * 100)}%`;
}

export function buildConversionSensitivityRows(input: RothConversionInput): ConversionSensitivityRow[] {
  const seen = new Set<number>();

  return multipliers
    .map((multiplier) => ({
      label: labelForMultiplier(multiplier),
      amount: capConversionAmount(input.conversionAmount * multiplier, input.traditionalIraBalance),
    }))
    .filter((scenario) => {
      if (seen.has(scenario.amount)) {
        return false;
      }

      seen.add(scenario.amount);
      return scenario.amount > 0;
    })
    .map((scenario) => {
      const result = calculateRothConversion({
        ...input,
        conversionAmount: scenario.amount,
      });

      return {
        label: scenario.label,
        conversionAmount: scenario.amount,
        taxableConversion: result.taxableConversion,
        totalUpfrontCost: result.totalUpfrontCost,
        breakEvenYear: result.breakEvenYear,
        afterTaxDifference: result.afterTaxDifference,
        afterFederalRate: result.bracketImpact.afterRate,
      };
    });
}
