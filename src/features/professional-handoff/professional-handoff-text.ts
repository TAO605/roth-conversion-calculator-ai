import { formatCurrency, formatCurrencyWithCents, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildAmtReviewPrep } from "@/features/tax-impact-warnings/amt-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildRmdReviewPrep } from "@/features/tax-impact-warnings/rmd-review-prep";
import { buildStateRulesReviewPrep } from "@/features/tax-impact-warnings/state-rules-review-prep";
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
  const amtPrep = buildAmtReviewPrep(input, result);
  const stateRulesPrep = buildStateRulesReviewPrep(input, result);

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
    `2026 Part D IRMAA proxy preview: ${formatCurrencyWithCents(
      irmaaPrep.partDEstimate.monthlyAdjustmentAmount,
    )} per month of Part D IRMAA adjustment using calculator income proxy.`,
    `Part D proxy bracket: ${irmaaPrep.partDEstimate.bracketLabel}`,
    `Part D proxy boundary: ${irmaaPrep.partDEstimate.boundaryNote}`,
    `IRMAA threshold note: ${irmaaPrep.thresholdLabel}`,
    `IRMAA prep summary: ${irmaaPrep.summary}`,
    "Inputs still needed before any premium amount review:",
    ...irmaaPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "ACA premium tax credit review prep",
    `Calculator income proxy before conversion: ${formatCurrency(acaPrep.incomeProxyBeforeConversion)}`,
    `Taxable conversion income increase: ${formatCurrency(acaPrep.conversionIncomeIncrease)}`,
    `Calculator income proxy after conversion: ${formatCurrency(acaPrep.incomeProxyAfterConversion)}`,
    `Annual advance premium tax credit entered: ${
      acaPrep.annualAdvancePremiumTaxCreditInput === null
        ? "Not provided"
        : formatCurrency(acaPrep.annualAdvancePremiumTaxCreditInput)
    }`,
    `Marketplace coverage months entered: ${
      acaPrep.marketplaceCoverageMonthsInput === null ? "Not provided" : String(acaPrep.marketplaceCoverageMonthsInput)
    }`,
    `Monthly APTC at-stake preview: ${
      acaPrep.monthlyAdvancePremiumTaxCreditPreview === null
        ? "Not estimated"
        : formatCurrency(acaPrep.monthlyAdvancePremiumTaxCreditPreview)
    }`,
    `Annual APTC at-stake preview: ${
      acaPrep.aptcAtStakePreview === null ? "Not estimated" : formatCurrency(acaPrep.aptcAtStakePreview)
    }`,
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
    `Annual Social Security benefits entered: ${
      socialSecurityPrep.annualSocialSecurityBenefitsInput === null
        ? "Not provided"
        : formatCurrency(socialSecurityPrep.annualSocialSecurityBenefitsInput)
    }`,
    `Tax-exempt interest entered for Publication 915 review: ${
      socialSecurityPrep.taxExemptInterestInput === null
        ? "Not provided"
        : formatCurrency(socialSecurityPrep.taxExemptInterestInput)
    }`,
    `Combined-income proxy after conversion: ${
      socialSecurityPrep.combinedIncomeProxyAfterConversion === null
        ? "Not estimated"
        : formatCurrency(socialSecurityPrep.combinedIncomeProxyAfterConversion)
    }`,
    `Bounded taxable Social Security benefit preview: ${
      socialSecurityPrep.taxableBenefitPreview === null
        ? "Not estimated"
        : formatCurrency(socialSecurityPrep.taxableBenefitPreview)
    }`,
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
    `User-entered net investment income: ${
      niitPrep.netInvestmentIncomeInput === null ? "Not provided" : formatCurrency(niitPrep.netInvestmentIncomeInput)
    }`,
    `NIIT exposure base used by bounded preview: ${
      niitPrep.niitExposureBase === null ? "Not estimated" : formatCurrency(niitPrep.niitExposureBase)
    }`,
    `Bounded NIIT 3.8% preview: ${
      niitPrep.boundedNiitEstimate === null ? "Not estimated" : formatCurrency(niitPrep.boundedNiitEstimate)
    }`,
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
    "AMT impact review prep",
    `AMT income proxy before conversion: ${formatCurrency(amtPrep.amtIncomeProxyBeforeConversion)}`,
    `Taxable conversion income increase: ${formatCurrency(amtPrep.taxableConversionIncrease)}`,
    `AMT income proxy after conversion: ${formatCurrency(amtPrep.amtIncomeProxyAfterConversion)}`,
    `Tentative minimum tax entered: ${
      amtPrep.tentativeMinimumTaxInput === null ? "Not provided" : formatCurrency(amtPrep.tentativeMinimumTaxInput)
    }`,
    `Regular tax liability entered for AMT comparison: ${
      amtPrep.regularTaxLiabilityInput === null ? "Not provided" : formatCurrency(amtPrep.regularTaxLiabilityInput)
    }`,
    `AMT exposure preview: ${
      amtPrep.amtExposurePreview === null ? "Not estimated" : formatCurrency(amtPrep.amtExposurePreview)
    }`,
    `AMT amount estimate status: ${amtPrep.amountEstimateStatus}`,
    `AMT formula note: ${amtPrep.formulaNote}`,
    `AMT boundary: ${amtPrep.boundaryNote}`,
    "Inputs still needed before any AMT amount review:",
    ...amtPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "State rules readiness",
    `Selected state example: ${
      stateRulesPrep.selectedState === null
        ? "None"
        : `${stateRulesPrep.selectedState.name} (${stateRulesPrep.selectedState.code})`
    }`,
    `State rule registry status: ${stateRulesPrep.stateRuleStatusLabel} (${stateRulesPrep.stateRuleStatus})`,
    `State rule registry boundary: ${stateRulesPrep.stateRuleBoundaryNote}`,
    `Manual state marginal rate entered: ${formatPercent(stateRulesPrep.manualStateRate)}`,
    `Taxable conversion income increase: ${formatCurrency(stateRulesPrep.taxableConversionIncrease)}`,
    `Modeled state tax from manual rate: ${formatCurrency(stateRulesPrep.modeledStateTaxFromManualRate)}`,
    `Reviewed state tax estimate: ${
      stateRulesPrep.reviewedStateTaxEstimate === null
        ? "Not provided"
        : formatCurrency(stateRulesPrep.reviewedStateTaxEstimate)
    }`,
    `Reviewed estimate difference from manual-rate state tax: ${
      stateRulesPrep.reviewedVsManualStateTaxDifference === null
        ? "Not estimated"
        : formatCurrency(stateRulesPrep.reviewedVsManualStateTaxDifference)
    }`,
    `State amount estimate status: ${stateRulesPrep.amountEstimateStatus}`,
    `Supported state example pages: ${stateRulesPrep.supportedStateExamples
      .map(
        (state) =>
          `${state.name} (${state.code}, ${state.ruleStatusLabel}${
            state.hasAmountReadinessWorksheet ? ", worksheet ready" : ""
          })`,
      )
      .join(", ")}`,
    `State rules boundary: ${stateRulesPrep.boundaryNote}`,
    ...(stateRulesPrep.selectedStateAmountReadiness === null
      ? []
      : [
          `${stateRulesPrep.selectedStateAmountReadiness.worksheetTitle}`,
          `Selected-state amount readiness status: ${stateRulesPrep.selectedStateAmountReadiness.status}`,
          `Selected-state readiness summary: ${stateRulesPrep.selectedStateAmountReadiness.summary}`,
          "Official source checklist:",
          ...stateRulesPrep.selectedStateAmountReadiness.officialChecklist.map((item) => `- ${item}`),
          "Inputs still needed before selected-state amount review:",
          ...stateRulesPrep.selectedStateAmountReadiness.missingInputs.map((item) => `- ${item}`),
          `User-provided state readiness field status: ${stateRulesPrep.userStateReadinessInputs.status}`,
          `User-provided state readiness field label: ${stateRulesPrep.userStateReadinessInputs.statusLabel}`,
          `User-provided state readiness completeness score: ${stateRulesPrep.userStateReadinessInputs.scorePercent}%`,
          stateRulesPrep.userStateReadinessInputs.summary,
          `User-provided state readiness next review step: ${stateRulesPrep.userStateReadinessInputs.nextReviewStep}`,
          `Provided state readiness fields: ${
            stateRulesPrep.userStateReadinessInputs.providedFields.length
              ? stateRulesPrep.userStateReadinessInputs.providedFields.join(", ")
              : "None"
          }`,
          `Missing state readiness fields: ${
            stateRulesPrep.userStateReadinessInputs.missingFields.length
              ? stateRulesPrep.userStateReadinessInputs.missingFields.join(", ")
              : "None"
          }`,
          "State readiness score boundary: This is a document-readiness score only, not a state-law amount calculation.",
          ...stateRulesPrep.userStateReadinessInputs.rows.map((row) => `- ${row.label}: ${row.value}`),
        ]),
    "Inputs still needed before any state-specific amount review:",
    ...stateRulesPrep.missingInputs.map((item) => `- ${item}`),
    "",
    "Documents and questions to bring",
    "- Most recent federal and state tax returns.",
    "- Form 8606 records for nondeductible IRA basis, if any.",
    "- Traditional, SEP, SIMPLE, and Roth IRA year-end balances and custodian statements.",
    "- Current-year income estimate, withholding records, and estimated tax payments.",
    "- Medicare, Marketplace coverage, Social Security, investment income, RMD, and AMT context if any item above applies.",
    "",
    "Boundary note",
    "This packet does not determine whether a Roth conversion is appropriate for a specific person. It summarizes calculator inputs, modeled outputs, and review topics.",
    "",
    REQUIRED_DISCLAIMER,
  ].join("\n");
}
