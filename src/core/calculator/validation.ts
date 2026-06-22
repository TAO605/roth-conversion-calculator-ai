import type { CalculatorErrors, RothConversionInput } from "@/core/calculator/types";

export function validateCalculatorInput(input: RothConversionInput): CalculatorErrors {
  const errors: CalculatorErrors = {};

  if (input.conversionAmount < 0) {
    errors.conversionAmount = "Conversion amount must be non-negative.";
  }

  if (input.traditionalIraBalance < 0) {
    errors.traditionalIraBalance = "Traditional IRA balance must be non-negative.";
  }

  if (input.basis < 0 || input.basis > input.traditionalIraBalance) {
    errors.basis = "Basis must be non-negative and cannot exceed the IRA balance.";
  }

  if (input.retirementAge <= input.age) {
    errors.retirementAge = "Retirement age should be greater than current age.";
  }

  if (input.stateMarginalTaxRate < 0 || input.stateMarginalTaxRate > 0.15) {
    errors.stateMarginalTaxRate = "State tax rate should usually be between 0% and 15%.";
  }

  if (input.withheldForTaxes < 0) {
    errors.withheldForTaxes = "Withheld tax amount must be non-negative.";
  }

  if (input.withheldForTaxes > input.conversionAmount) {
    errors.withheldForTaxes = "Withheld tax amount cannot exceed the conversion amount.";
  }

  if (typeof input.netInvestmentIncome === "number" && input.netInvestmentIncome < 0) {
    errors.netInvestmentIncome = "Net investment income must be non-negative.";
  }

  if (typeof input.annualSocialSecurityBenefits === "number" && input.annualSocialSecurityBenefits < 0) {
    errors.annualSocialSecurityBenefits = "Annual Social Security benefits must be non-negative.";
  }

  if (typeof input.taxExemptInterest === "number" && input.taxExemptInterest < 0) {
    errors.taxExemptInterest = "Tax-exempt interest must be non-negative.";
  }

  if (typeof input.annualAdvancePremiumTaxCredit === "number" && input.annualAdvancePremiumTaxCredit < 0) {
    errors.annualAdvancePremiumTaxCredit = "Annual advance premium tax credit must be non-negative.";
  }

  if (
    typeof input.marketplaceCoverageMonths === "number" &&
    (input.marketplaceCoverageMonths < 0 || input.marketplaceCoverageMonths > 12)
  ) {
    errors.marketplaceCoverageMonths = "Marketplace coverage months must be between 0 and 12.";
  }

  if (typeof input.amtTentativeMinimumTax === "number" && input.amtTentativeMinimumTax < 0) {
    errors.amtTentativeMinimumTax = "Tentative minimum tax must be non-negative.";
  }

  if (typeof input.amtRegularTaxLiability === "number" && input.amtRegularTaxLiability < 0) {
    errors.amtRegularTaxLiability = "Regular tax liability must be non-negative.";
  }

  return errors;
}
