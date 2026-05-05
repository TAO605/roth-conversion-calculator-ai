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

  return errors;
}
