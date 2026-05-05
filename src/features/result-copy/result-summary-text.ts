import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

export function buildResultSummaryText(input: RothConversionInput, result: RothConversionResult): string {
  const breakEven = result.breakEvenYear === null ? "Not reached in projection period" : `${result.breakEvenYear} years`;

  return [
    "Roth Conversion Calculator Summary",
    `Tax year: ${input.taxYear}`,
    "",
    "Inputs",
    `Conversion amount: ${formatCurrency(input.conversionAmount)}`,
    `Traditional IRA balance: ${formatCurrency(input.traditionalIraBalance)}`,
    `After-tax basis: ${formatCurrency(input.basis)}`,
    `Current taxable income: ${formatCurrency(input.currentTaxableIncome)}`,
    `State marginal tax assumption: ${formatPercent(input.stateMarginalTaxRate)}`,
    `Expected annual return: ${formatPercent(input.expectedAnnualReturn)}`,
    `Retirement marginal tax assumption: ${formatPercent(input.retirementMarginalTaxRate)}`,
    "",
    "Results",
    `Taxable conversion: ${formatCurrency(result.taxableConversion)}`,
    `Federal tax estimate: ${formatCurrency(result.federalTax)}`,
    `State tax estimate: ${formatCurrency(result.stateTax)}`,
    `Potential early distribution penalty: ${formatCurrency(result.earlyDistributionPenalty)}`,
    `Total upfront cost: ${formatCurrency(result.totalUpfrontCost)}`,
    `Break-even estimate: ${breakEven}`,
    `Roth future value: ${formatCurrency(result.rothFutureValue)}`,
    `Traditional after-tax value: ${formatCurrency(result.traditionalAfterTaxValue)}`,
    `After-tax difference: ${formatCurrency(result.afterTaxDifference)}`,
    "",
    "Tax bracket impact",
    `Federal bracket before conversion: ${formatPercent(result.bracketImpact.beforeRate)}`,
    `Federal bracket after conversion: ${formatPercent(result.bracketImpact.afterRate)}`,
    `Amount modeled in higher brackets: ${formatCurrency(result.bracketImpact.incomeTaxedInHigherBrackets)}`,
    "",
    REQUIRED_DISCLAIMER,
  ].join("\n");
}
