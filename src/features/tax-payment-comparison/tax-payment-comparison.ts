import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface TaxPaymentComparison {
  taxToPay: number;
  modeledIraWithholding: number;
  unfundedTaxAmount: number;
  outsideFunds: {
    rothPrincipal: number;
    projectedRothValue: number;
  };
  iraWithholding: {
    rothPrincipal: number;
    projectedRothValue: number;
    modeledPenalty: number;
  };
  projectedValueDifference: number;
}

function roundMoney(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

function futureValue(principal: number, annualReturn: number, years: number): number {
  return principal * (1 + annualReturn) ** Math.max(0, years);
}

export function buildTaxPaymentComparison(
  input: RothConversionInput,
  result: RothConversionResult,
): TaxPaymentComparison {
  const yearsToRetirement = Math.max(0, Math.round(input.retirementAge - input.age));
  const taxToPay = Math.max(0, result.federalTax + result.stateTax);
  const outsidePrincipal = Math.max(0, input.conversionAmount);
  const modeledIraWithholding = Math.min(taxToPay, outsidePrincipal);
  const unfundedTaxAmount = Math.max(0, taxToPay - modeledIraWithholding);
  const withheldPrincipal = Math.max(0, input.conversionAmount - modeledIraWithholding);
  const modeledPenalty = input.age < 59.5 && !input.penaltyException ? modeledIraWithholding * 0.1 : 0;
  const outsideProjectedValue = futureValue(outsidePrincipal, input.expectedAnnualReturn, yearsToRetirement);
  const withheldProjectedValue = futureValue(withheldPrincipal, input.expectedAnnualReturn, yearsToRetirement);

  return {
    taxToPay: roundMoney(taxToPay),
    modeledIraWithholding: roundMoney(modeledIraWithholding),
    unfundedTaxAmount: roundMoney(unfundedTaxAmount),
    outsideFunds: {
      rothPrincipal: roundMoney(outsidePrincipal),
      projectedRothValue: roundMoney(outsideProjectedValue),
    },
    iraWithholding: {
      rothPrincipal: roundMoney(withheldPrincipal),
      projectedRothValue: roundMoney(withheldProjectedValue),
      modeledPenalty: roundMoney(modeledPenalty),
    },
    projectedValueDifference: roundMoney(outsideProjectedValue - withheldProjectedValue),
  };
}
