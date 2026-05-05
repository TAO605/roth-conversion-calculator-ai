import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";

export interface MultiYearConversionScheduleRow {
  years: number;
  annualConversionAmount: number;
  totalConverted: number;
  totalFederalTax: number;
  totalStateTax: number;
  totalPenalty: number;
  totalUpfrontCost: number;
  highestFederalRate: number;
}

const scheduleYears = [1, 2, 3, 5] as const;

function roundMoney(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

function cappedTotalConversion(input: RothConversionInput): number {
  const requested = Math.max(0, input.conversionAmount);
  const balance = Math.max(0, input.traditionalIraBalance);

  if (balance === 0) {
    return requested;
  }

  return Math.min(requested, balance);
}

export function buildMultiYearConversionScheduleRows(input: RothConversionInput): MultiYearConversionScheduleRow[] {
  const totalConversion = cappedTotalConversion(input);

  if (totalConversion <= 0) {
    return [];
  }

  return scheduleYears.map((years) => {
    const annualConversionAmount = roundMoney(totalConversion / years);
    const annualWithholding = roundMoney(Math.max(0, input.withheldForTaxes) / years);
    let totalFederalTax = 0;
    let totalStateTax = 0;
    let totalPenalty = 0;
    let totalUpfrontCost = 0;
    let highestFederalRate = 0;

    for (let year = 0; year < years; year += 1) {
      const result = calculateRothConversion({
        ...input,
        age: input.age + year,
        conversionAmount: annualConversionAmount,
        withheldForTaxes: annualWithholding,
      });

      totalFederalTax += result.federalTax;
      totalStateTax += result.stateTax;
      totalPenalty += result.earlyDistributionPenalty;
      totalUpfrontCost += result.totalUpfrontCost;
      highestFederalRate = Math.max(highestFederalRate, result.bracketImpact.afterRate);
    }

    return {
      years,
      annualConversionAmount,
      totalConverted: roundMoney(annualConversionAmount * years),
      totalFederalTax: roundMoney(totalFederalTax),
      totalStateTax: roundMoney(totalStateTax),
      totalPenalty: roundMoney(totalPenalty),
      totalUpfrontCost: roundMoney(totalUpfrontCost),
      highestFederalRate,
    };
  });
}
