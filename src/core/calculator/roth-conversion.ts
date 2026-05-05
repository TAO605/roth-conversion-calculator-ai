import { calculateFederalTaxDelta } from "@/core/calculator/federal-tax";
import { calculateBracketImpact } from "@/core/calculator/bracket-impact";
import type { ProjectionPoint, RothConversionInput, RothConversionResult } from "@/core/calculator/types";

function roundMoney(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

function roundRate(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 10000) / 10000;
}

function futureValue(principal: number, annualReturn: number, years: number): number {
  return principal * (1 + annualReturn) ** Math.max(0, years);
}

function calculateTaxableConversion(input: RothConversionInput): number {
  if (input.traditionalIraBalance <= 0) {
    return Math.max(0, input.conversionAmount);
  }

  const basisRatio = Math.min(Math.max(input.basis / input.traditionalIraBalance, 0), 1);
  return Math.max(0, input.conversionAmount * (1 - basisRatio));
}

function calculateBasisExclusionRatio(input: RothConversionInput): number {
  if (input.traditionalIraBalance <= 0) {
    return 0;
  }

  return Math.min(Math.max(input.basis / input.traditionalIraBalance, 0), 1);
}

function calculateEarlyPenalty(input: RothConversionInput): number {
  if (input.age >= 59.5 || input.penaltyException) {
    return 0;
  }

  if (input.taxPaymentMethod !== "withhold_from_ira") {
    return 0;
  }

  return Math.max(0, input.withheldForTaxes) * 0.1;
}

function penaltyBasis(input: RothConversionInput): number {
  if (input.age >= 59.5 || input.penaltyException || input.taxPaymentMethod !== "withhold_from_ira") {
    return 0;
  }

  return Math.max(0, input.withheldForTaxes);
}

function penaltyExplanation(input: RothConversionInput): string {
  if (input.age >= 59.5) {
    return "No early distribution penalty is modeled because age is at least 59.5.";
  }

  if (input.penaltyException) {
    return "No early distribution penalty is modeled because the penalty exception toggle is enabled.";
  }

  if (input.taxPaymentMethod === "withhold_from_ira") {
    return "The modeled penalty applies only to the amount withheld from the IRA distribution for taxes.";
  }

  if (input.taxPaymentMethod === "not_sure") {
    return "No penalty amount is modeled because the tax payment method is marked not sure.";
  }

  return "No early distribution penalty is modeled because taxes are assumed to be paid from outside funds.";
}

function buildProjection(input: RothConversionInput, yearsToRetirement: number): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];

  for (let year = 0; year <= yearsToRetirement; year += 1) {
    const rothValue = futureValue(input.conversionAmount, input.expectedAnnualReturn, year);
    const traditionalValue = futureValue(input.conversionAmount, input.expectedAnnualReturn, year);

    points.push({
      year,
      rothValue: roundMoney(rothValue),
      traditionalAfterTaxValue: roundMoney(traditionalValue * (1 - input.retirementMarginalTaxRate)),
    });
  }

  return points;
}

function findBreakEvenYear(projection: ProjectionPoint[], upfrontCost: number): number | null {
  const point = projection.find((item) => item.rothValue - item.traditionalAfterTaxValue >= upfrontCost);
  return point ? point.year : null;
}

export function calculateRothConversion(input: RothConversionInput): RothConversionResult {
  const basisExclusionRatio = calculateBasisExclusionRatio(input);
  const taxableConversion = calculateTaxableConversion(input);
  const federalTax = calculateFederalTaxDelta({
    filingStatus: input.filingStatus,
    currentTaxableIncome: input.currentTaxableIncome,
    additionalTaxableIncome: taxableConversion,
    taxYear: input.taxYear,
  });
  const bracketImpact = calculateBracketImpact({
    filingStatus: input.filingStatus,
    currentTaxableIncome: input.currentTaxableIncome,
    additionalTaxableIncome: taxableConversion,
    taxYear: input.taxYear,
  });
  const stateTax = taxableConversion * Math.max(0, input.stateMarginalTaxRate);
  const earlyDistributionPenalty = calculateEarlyPenalty(input);
  const totalUpfrontCost = federalTax + stateTax + earlyDistributionPenalty;
  const yearsToRetirement = Math.max(0, Math.round(input.retirementAge - input.age));
  const rothFutureValue = futureValue(input.conversionAmount, input.expectedAnnualReturn, yearsToRetirement);
  const traditionalAfterTaxValue =
    futureValue(input.conversionAmount, input.expectedAnnualReturn, yearsToRetirement) *
    (1 - input.retirementMarginalTaxRate);
  const projection = buildProjection(input, yearsToRetirement);

  return {
    taxableConversion: roundMoney(taxableConversion),
    federalTax: roundMoney(federalTax),
    stateTax: roundMoney(stateTax),
    earlyDistributionPenalty: roundMoney(earlyDistributionPenalty),
    totalUpfrontCost: roundMoney(totalUpfrontCost),
    rothFutureValue: roundMoney(rothFutureValue),
    traditionalAfterTaxValue: roundMoney(traditionalAfterTaxValue),
    afterTaxDifference: roundMoney(rothFutureValue - traditionalAfterTaxValue - totalUpfrontCost),
    breakEvenYear: findBreakEvenYear(projection, totalUpfrontCost),
    accuracyNotes: [
      "High confidence: federal progressive tax estimate, pro-rata basis calculation, and compound growth math.",
      "User-estimated: state tax rate, future return, inflation, and retirement tax rate.",
      "Professional review required: IRMAA, ACA subsidies, NIIT, AMT, RMDs, credits, and state-specific rules.",
    ],
    projection,
    breakdown: {
      basisExclusionRatio: roundRate(basisExclusionRatio),
      taxableConversionRatio: roundRate(input.conversionAmount > 0 ? taxableConversion / input.conversionAmount : 0),
      effectiveFederalTaxRate: roundRate(taxableConversion > 0 ? federalTax / taxableConversion : 0),
      effectiveStateTaxRate: roundRate(taxableConversion > 0 ? stateTax / taxableConversion : 0),
      totalCostRate: roundRate(input.conversionAmount > 0 ? totalUpfrontCost / input.conversionAmount : 0),
      penaltyBasis: roundMoney(penaltyBasis(input)),
      penaltyExplanation: penaltyExplanation(input),
    },
    bracketImpact,
  };
}
