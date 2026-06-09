import { formatCurrency, formatCurrencyWithCents, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildRmdReviewPrep } from "@/features/tax-impact-warnings/rmd-review-prep";
import { buildSocialSecurityTaxationReviewPrep } from "@/features/tax-impact-warnings/social-security-review-prep";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

function formatBreakEven(result: RothConversionResult) {
  return result.breakEvenYear === null ? "Not reached in projection period" : `${result.breakEvenYear} years`;
}

export function buildProfessionalHandoffText(input: RothConversionInput, result: RothConversionResult): string {
  const reviewItems = buildTaxImpactReviewItems(input, result);
  const triggeredItems = reviewItems.filter((item) => item.level === "input_triggered_review");
  const standardItems = reviewItems.filter((item) => item.level === "standard_review");
  const irmaaPrep = buildIrmaaReviewPrep(input, result);
  const acaPrep = buildAcaPremiumTaxCreditReviewPrep(input, result);
  const socialSecurityPrep = buildSocialSecurityTaxationReviewPrep(input, result);
  const niitPrep = buildNiitReviewPrep(input, result);
  const rmdPrep = buildRmdReviewPrep(input);

  return [
    "Roth Conversion Professional Review Packet",
    `Tax year: ${input.taxYear}`,
    "Purpose: Educational estimate summary for discussion with a qualified tax professional.",
    "",
    "Calculator inputs to verify",
    `Conversion amount: ${formatCurrency(input.conversionAmount)}`,
    `Traditional IRA balance: ${formatCurrency(input.traditionalIraBalance)}`,
    `After-tax basis entered: ${formatCurrency(input.basis)}`,
    `Filing status: ${input.filingStatus}`,
    `Current taxable income entered: ${formatCurrency(input.currentTaxableIncome)}`,
    `State marginal tax assumption: ${formatPercent(input.stateMarginalTaxRate)}`,
    `Age entered: ${input.age}`,
    `Retirement age assumption: ${input.retirementAge}`,
    `Tax payment method modeled: ${input.taxPaymentMethod}`,
    `Expected annual return assumption: ${formatPercent(input.expectedAnnualReturn)}`,
    `Retirement marginal tax assumption: ${formatPercent(input.retirementMarginalTaxRate)}`,
    "",
    "Modeled calculator output",
    `Taxable conversion estimate: ${formatCurrency(result.taxableConversion)}`,
    `Federal tax estimate: ${formatCurrency(result.federalTax)}`,
    `State tax estimate: ${formatCurrency(result.stateTax)}`,
    `Potential early distribution penalty: ${formatCurrency(result.earlyDistributionPenalty)}`,
    `Total upfront cost estimate: ${formatCurrency(result.totalUpfrontCost)}`,
    `Modeled break-even estimate: ${formatBreakEven(result)}`,
    `Projected after-tax difference: ${formatCurrency(result.afterTaxDifference)}`,
    `Federal bracket before conversion: ${formatPercent(result.bracketImpact.beforeRate)}`,
    `Federal bracket after conversion: ${formatPercent(result.bracketImpact.afterRate)}`,
    `Amount modeled in higher brackets: ${formatCurrency(result.bracketImpact.incomeTaxedInHigherBrackets)}`,
    "",
    "Input-triggered review items",
    ...(triggeredItems.length
      ? triggeredItems.map((item) => `- ${item.label}: ${item.reason}`)
      : ["- None triggered by the current simplified inputs."]),
    "",
    "Additional review items",
    ...standardItems.map((item) => `- ${item.label}: ${item.reason}`),
    "",
    "IRMAA review prep",
    `Premium year reviewed by the calculator context: ${irmaaPrep.premiumYear}`,
    `Usual lookback tax year to verify: ${irmaaPrep.usualLookbackTaxYear}`,
    `Calculator income proxy after conversion: ${formatCurrency(irmaaPrep.incomeProxy)}`,
    `2026 Part B proxy preview: ${formatCurrencyWithCents(
      irmaaPrep.partBEstimate.totalMonthlyPremium,
    )} per month using calculator income proxy; includes ${formatCurrencyWithCents(
      irmaaPrep.partBEstimate.monthlyAdjustmentAmount,
    )} of IRMAA adjustment in the CMS full Part B table.`,
    `Part B proxy bracket: ${irmaaPrep.partBEstimate.bracketLabel}`,
    `Part B proxy boundary: ${irmaaPrep.partBEstimate.boundaryNote}`,
    `IRMAA threshold note: ${irmaaPrep.thresholdLabel}`,
    `IRMAA prep summary: ${irmaaPrep.summary}`,
    "Inputs still needed before any premium amount review:",
    ...irmaaPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "ACA premium tax credit review prep",
    `Calculator income proxy before conversion: ${formatCurrency(acaPrep.incomeProxyBeforeConversion)}`,
    `Taxable conversion income increase: ${formatCurrency(acaPrep.conversionIncomeIncrease)}`,
    `Calculator income proxy after conversion: ${formatCurrency(acaPrep.incomeProxyAfterConversion)}`,
    `ACA amount estimate status: ${acaPrep.amountEstimateStatus}`,
    `ACA boundary: ${acaPrep.boundaryNote}`,
    "Inputs still needed before any subsidy amount review:",
    ...acaPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "Social Security benefit taxation review prep",
    `Non-Social-Security income proxy before conversion: ${formatCurrency(
      socialSecurityPrep.nonSocialSecurityIncomeProxyBeforeConversion,
    )}`,
    `Taxable conversion income increase: ${formatCurrency(socialSecurityPrep.taxableConversionIncrease)}`,
    `Non-Social-Security income proxy after conversion: ${formatCurrency(
      socialSecurityPrep.nonSocialSecurityIncomeProxyAfterConversion,
    )}`,
    `Social Security taxable-benefit amount estimate status: ${socialSecurityPrep.amountEstimateStatus}`,
    `Social Security threshold note: ${socialSecurityPrep.thresholdNote}`,
    `Social Security boundary: ${socialSecurityPrep.boundaryNote}`,
    "Inputs still needed before any taxable-benefit amount review:",
    ...socialSecurityPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "NIIT amount review prep",
    `MAGI proxy before conversion: ${formatCurrency(niitPrep.magiProxyBeforeConversion)}`,
    `Taxable conversion income increase: ${formatCurrency(niitPrep.taxableConversionIncrease)}`,
    `MAGI proxy after conversion: ${formatCurrency(niitPrep.magiProxyAfterConversion)}`,
    `Filing-status NIIT threshold: ${formatCurrency(niitPrep.filingStatusThreshold)}`,
    `MAGI proxy excess after conversion: ${formatCurrency(niitPrep.magiProxyExcessAfterConversion)}`,
    `NIIT amount estimate status: ${niitPrep.amountEstimateStatus}`,
    `NIIT formula note: ${niitPrep.formulaNote}`,
    `NIIT boundary: ${niitPrep.boundaryNote}`,
    "Inputs still needed before any NIIT amount review:",
    ...niitPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "RMD Uniform Lifetime preview",
    `Owner age entered: ${rmdPrep.ownerAge}`,
    `Traditional IRA balance proxy entered: ${formatCurrency(rmdPrep.balanceProxy)}`,
    `RMD preview status: ${rmdPrep.previewStatus}`,
    `Uniform Lifetime Table distribution period: ${
      rmdPrep.uniformLifetimeDistributionPeriod === null
        ? "Not available in this bounded preview"
        : rmdPrep.uniformLifetimeDistributionPeriod.toFixed(1)
    }`,
    `Annual RMD preview: ${
      rmdPrep.annualRmdPreview === null ? "Not estimated" : formatCurrency(rmdPrep.annualRmdPreview)
    }`,
    `RMD boundary: ${rmdPrep.boundaryNote}`,
    "Inputs still needed before any required amount review:",
    ...rmdPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "Documents and questions to bring",
    "- Most recent federal and state tax returns.",
    "- Form 8606 records for nondeductible IRA basis, if any.",
    "- Traditional, SEP, SIMPLE, and Roth IRA year-end balances and custodian statements.",
    "- Current-year income estimate, withholding records, and estimated tax payments.",
    "- Medicare, Marketplace coverage, Social Security, investment income, and RMD context if any item above applies.",
    "",
    "Boundary note",
    "This packet does not determine whether a Roth conversion is appropriate for a specific person. It summarizes calculator inputs, modeled outputs, and review topics.",
    "",
    REQUIRED_DISCLAIMER,
  ].join("\n");
}
