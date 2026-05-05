export interface PlanningChecklistItem {
  label: string;
  calculatorInput?: string;
  detail: string;
}

export interface PlanningChecklistGroup {
  id: string;
  title: string;
  goal: string;
  items: PlanningChecklistItem[];
}

function item(label: string, calculatorInput: string | undefined, detail: string): PlanningChecklistItem {
  return { label, calculatorInput, detail };
}

export function buildPlanningChecklistGroups(): PlanningChecklistGroup[] {
  return [
    {
      id: "tax-profile",
      title: "Tax Profile",
      goal: "Prepare current-year tax information before entering calculator assumptions.",
      items: [
        item(
          "Filing status and taxable income",
          "filingStatus",
          "Gather current filing status and estimated taxable income before any Roth conversion amount.",
        ),
        item(
          "Current taxable income estimate",
          "currentTaxableIncome",
          "Prepare a current-year taxable income estimate before adding any modeled Roth conversion income.",
        ),
        item(
          "Current age",
          "age",
          "Confirm current age because penalty modeling can change around age 59 1/2.",
        ),
        item(
          "State tax assumptions",
          "stateMarginalTaxRate",
          "Estimate a state marginal income tax rate or confirm a zero-state-income-tax assumption.",
        ),
      ],
    },
    {
      id: "account-data",
      title: "Account Data",
      goal: "Collect account values and basis records that affect taxable conversion estimates.",
      items: [
        item(
          "Traditional IRA balance",
          "traditionalIraBalance",
          "Use a current total traditional IRA balance, including relevant rollover, SEP, or SIMPLE IRA balances if applicable.",
        ),
        item(
          "After-tax basis",
          "basis",
          "Gather Form 8606 history or nondeductible contribution records before entering basis.",
        ),
        item(
          "Planned conversion amount",
          "conversionAmount",
          "Enter the gross amount intended to move from pre-tax retirement accounts to Roth IRA for the scenario.",
        ),
      ],
    },
    {
      id: "conversion-assumptions",
      title: "Conversion Assumptions",
      goal: "Document assumptions that can materially change the projection and break-even estimate.",
      items: [
        item(
          "Tax payment method",
          "taxPaymentMethod",
          "Decide whether taxes are modeled as paid from outside funds, IRA withholding, or unknown.",
        ),
        item(
          "Expected annual return",
          "expectedAnnualReturn",
          "Use a conservative scenario range rather than treating one return assumption as certain.",
        ),
        item(
          "Retirement age and future tax rate",
          "retirementAge",
          "Prepare retirement age and retirement marginal tax rate assumptions for the comparison model.",
        ),
      ],
    },
    {
      id: "model-limits",
      title: "Model Limits to Review",
      goal: "Identify items the calculator intentionally does not fully model.",
      items: [
        item(
          "IRMAA, ACA, NIIT, AMT, and credits",
          undefined,
          "Review income-linked effects outside the core calculator before treating a scenario as complete.",
        ),
        item(
          "RMD and five-year rule timing",
          undefined,
          "Ask a professional whether RMD sequencing or Roth conversion five-year rules affect the scenario.",
        ),
        item(
          "State-specific rules",
          undefined,
          "Verify state and local tax treatment separately because the calculator uses a user-entered state rate.",
        ),
      ],
    },
    {
      id: "review",
      title: "Review Plan",
      goal: "Turn calculator output into a professional-review worksheet, not a self-directed recommendation.",
      items: [
        item(
          "Professional review plan",
          undefined,
          "Plan to share calculator output, assumptions, and tax records with a licensed CPA or qualified advisor.",
        ),
        item(
          "Save scenarios for comparison",
          undefined,
          "Use copy, PDF, or share-link tools to preserve scenarios for later review.",
        ),
        item(
          "Record decision separately",
          undefined,
          "Keep the actual decision, professional recommendation, and tax filing results separate from calculator estimates.",
        ),
      ],
    },
  ];
}

export function getPlanningChecklistSummary(groups: PlanningChecklistGroup[]) {
  const items = groups.flatMap((group) => group.items);

  return {
    totalGroups: groups.length,
    totalItems: items.length,
    calculatorInputs: Array.from(new Set(items.map((entry) => entry.calculatorInput).filter(Boolean))) as string[],
  };
}
