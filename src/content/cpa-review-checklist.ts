export interface CpaReviewChecklistItem {
  label: string;
  handoffOutput: string;
  detail: string;
}

export interface CpaReviewChecklistGroup {
  id: string;
  title: string;
  goal: string;
  items: CpaReviewChecklistItem[];
}

function item(label: string, handoffOutput: string, detail: string): CpaReviewChecklistItem {
  return { label, handoffOutput, detail };
}

export function buildCpaReviewChecklistGroups(): CpaReviewChecklistGroup[] {
  return [
    {
      id: "inputs",
      title: "Calculator Inputs",
      goal: "Give the professional enough context to understand the calculator scenario and assumptions.",
      items: [
        item(
          "Calculator result summary",
          "Calculator PDF",
          "Export or copy the calculator result summary, including conversion amount, filing status, income, tax-year label, and output totals.",
        ),
        item(
          "Scenario assumptions",
          "Calculator PDF",
          "List expected return, retirement age, retirement marginal tax rate, inflation rate, state tax assumption, and tax payment method.",
        ),
        item(
          "Alternative scenarios",
          "Question list",
          "Bring any sensitivity, bracket capacity, or multi-year conversion scenarios that changed the result materially.",
        ),
      ],
    },
    {
      id: "tax-documents",
      title: "Tax Documents and Account Records",
      goal: "Collect the records that determine whether the simplified calculator assumptions fit the user's tax facts.",
      items: [
        item(
          "Traditional IRA basis records",
          "Tax document packet",
          "Bring Form 8606 history, nondeductible contribution records, and any basis tracking notes.",
        ),
        item(
          "Traditional IRA and 401k balances",
          "Tax document packet",
          "Provide recent statements for traditional IRAs, rollover IRAs, SEP/SIMPLE IRAs, and relevant workplace plans.",
        ),
        item(
          "Current-year income estimate",
          "Tax document packet",
          "Prepare projected wages, self-employment income, investment income, deductions, and other income that may affect bracket placement.",
        ),
      ],
    },
    {
      id: "model-limits",
      title: "Calculator Model Limits",
      goal: "Make sure the professional reviews items intentionally outside the calculator model.",
      items: [
        item(
          "State tax assumptions",
          "Question list",
          "Ask whether the user-entered state marginal rate is reasonable for residency, local tax, and state-specific treatment.",
        ),
        item(
          "IRMAA and ACA subsidy review",
          "Question list",
          "Ask whether Roth conversion income may affect Medicare IRMAA, ACA premium tax credits, or other income-linked thresholds.",
        ),
        item(
          "RMD, NIIT, AMT, and credit interactions",
          "Question list",
          "Ask whether RMD timing, NIIT, AMT, credits, deductions, or other tax interactions require separate modeling.",
        ),
      ],
    },
    {
      id: "advisor-questions",
      title: "Questions for the Professional",
      goal: "Turn calculator output into review questions rather than self-directed tax advice.",
      items: [
        item(
          "Written professional recommendation",
          "Decision record",
          "Ask the CPA or advisor to document their recommendation, assumptions, and caveats in writing.",
        ),
        item(
          "Conversion timing review",
          "Question list",
          "Ask whether timing, withholding, quarterly estimates, or multi-year planning should be considered.",
        ),
        item(
          "Penalty and five-year rule review",
          "Question list",
          "Ask whether early-distribution penalties, exceptions, and Roth conversion five-year rules affect the user's plan.",
        ),
      ],
    },
    {
      id: "records",
      title: "Recordkeeping After Review",
      goal: "Keep a clear trail of what was calculated, reviewed, and actually executed.",
      items: [
        item(
          "Save calculator and advisor materials",
          "Decision record",
          "Keep the calculator PDF, professional notes, tax documents, and final decision record together.",
        ),
        item(
          "Track final conversion paperwork",
          "Tax document packet",
          "Save custodian confirmations, Form 1099-R, Form 5498, and any tax software worksheets after execution.",
        ),
        item(
          "Schedule post-filing review",
          "Decision record",
          "After filing, compare actual tax return treatment against the pre-conversion estimate and update future assumptions.",
        ),
      ],
    },
  ];
}

export function getCpaReviewChecklistSummary(groups: CpaReviewChecklistGroup[]) {
  const items = groups.flatMap((group) => group.items);

  return {
    totalGroups: groups.length,
    totalItems: items.length,
    handoffOutputs: Array.from(new Set(items.map((item) => item.handoffOutput))),
  };
}
