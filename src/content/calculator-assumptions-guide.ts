export interface CalculatorAssumption {
  label: string;
  calculatorKey: string;
  plainMeaning: string;
  commonMistake: string;
  reviewNote: string;
}

export interface CalculatorAssumptionGroup {
  id: string;
  title: string;
  goal: string;
  assumptions: CalculatorAssumption[];
}

function assumption(
  label: string,
  calculatorKey: string,
  plainMeaning: string,
  commonMistake: string,
  reviewNote: string,
): CalculatorAssumption {
  return { label, calculatorKey, plainMeaning, commonMistake, reviewNote };
}

export function buildCalculatorAssumptionGroups(): CalculatorAssumptionGroup[] {
  return [
    {
      id: "tax-profile",
      title: "Tax Profile",
      goal: "Inputs that place the conversion inside a current-year tax context.",
      assumptions: [
        assumption(
          "Filing status",
          "filingStatus",
          "The federal filing status used to choose the applicable tax bracket table.",
          "Using last year's filing status when the current year is expected to be different.",
          "Confirm filing status with tax software or a tax professional before relying on bracket estimates.",
        ),
        assumption(
          "Current taxable income",
          "currentTaxableIncome",
          "Estimated taxable income before adding the modeled Roth conversion.",
          "Entering gross salary instead of taxable income after deductions and other adjustments.",
          "Ask a CPA whether projected taxable income, deductions, credits, and other income are complete.",
        ),
        assumption(
          "State marginal tax rate",
          "stateMarginalTaxRate",
          "A user-estimated state income tax rate applied to the taxable conversion amount.",
          "Assuming state tax is zero without checking residency, local tax, or state-specific treatment.",
          "Verify state and local treatment separately because the calculator uses a simplified user-entered rate.",
        ),
      ],
    },
    {
      id: "account-values",
      title: "Account Values and Basis",
      goal: "Inputs that determine the taxable portion of the conversion.",
      assumptions: [
        assumption(
          "Conversion amount",
          "conversionAmount",
          "The gross amount modeled as moving from traditional retirement accounts into Roth.",
          "Entering only the expected tax cost instead of the amount being converted.",
          "Review custodian paperwork and confirm the intended gross conversion amount.",
        ),
        assumption(
          "Traditional IRA balance",
          "traditionalIraBalance",
          "The current traditional IRA value used for simplified pro-rata basis modeling.",
          "Ignoring other traditional, SEP, or SIMPLE IRA balances that may matter for basis treatment.",
          "Bring account statements and Form 8606 history to a professional review.",
        ),
        assumption(
          "After-tax basis",
          "basis",
          "Traditional IRA money that may already have been taxed and can reduce modeled taxable conversion.",
          "Guessing basis without records or confusing Roth contributions with traditional IRA basis.",
          "Confirm basis using Form 8606 and tax records before using the estimate for planning.",
        ),
      ],
    },
    {
      id: "conversion-settings",
      title: "Conversion Settings",
      goal: "Inputs that affect penalty assumptions and current-year cost structure.",
      assumptions: [
        assumption(
          "Age",
          "age",
          "Current age used for simplified early-distribution penalty logic.",
          "Assuming age removes all distribution rules without reviewing five-year and ordering rules.",
          "Review penalty exceptions and distribution rules separately with a qualified professional.",
        ),
        assumption(
          "Tax payment method",
          "taxPaymentMethod",
          "Whether taxes are modeled as paid from outside funds, IRA withholding, or unknown.",
          "Treating IRA withholding the same as outside-funds payment for penalty modeling.",
          "Confirm payment method, withholding, and estimated-tax rules before executing a conversion.",
        ),
        assumption(
          "Amount withheld for taxes",
          "withheldForTaxes",
          "Amount modeled as withheld from the IRA distribution for taxes.",
          "Entering withholding when taxes are actually expected to be paid from outside funds.",
          "Review custodian withholding forms and whether any withheld amount creates separate consequences.",
        ),
      ],
    },
    {
      id: "projection-settings",
      title: "Projection Settings",
      goal: "Inputs that shape long-term comparison results and break-even estimates.",
      assumptions: [
        assumption(
          "Expected annual return",
          "expectedAnnualReturn",
          "Assumed annual compound growth rate used in the projection model.",
          "Using an optimistic return as if it were guaranteed.",
          "Run multiple scenarios because market returns can differ materially from assumptions.",
        ),
        assumption(
          "Retirement age",
          "retirementAge",
          "Age used to calculate the modeled investment horizon.",
          "Using a default retirement age without considering actual withdrawal timing.",
          "Compare more than one time horizon if retirement or withdrawal timing is uncertain.",
        ),
        assumption(
          "Retirement marginal tax rate",
          "retirementMarginalTaxRate",
          "Estimated tax rate used for the traditional account after-tax comparison.",
          "Assuming future tax rates are known or unchanged.",
          "Treat this as a scenario assumption, not a prediction.",
        ),
        assumption(
          "Inflation rate",
          "inflationRate",
          "Assumption used for real-value context in long-term projections.",
          "Confusing nominal return, real return, and inflation-adjusted value.",
          "Review whether the result should be discussed in nominal or real-dollar terms.",
        ),
      ],
    },
  ];
}

export function getCalculatorAssumptionSummary(groups: CalculatorAssumptionGroup[]) {
  const assumptions = groups.flatMap((group) => group.assumptions);

  return {
    totalGroups: groups.length,
    totalAssumptions: assumptions.length,
    calculatorKeys: Array.from(new Set(assumptions.map((entry) => entry.calculatorKey))),
  };
}
