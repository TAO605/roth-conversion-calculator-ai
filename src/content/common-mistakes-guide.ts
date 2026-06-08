export interface CommonMistake {
  label: string;
  reviewPath: string;
  whyItMatters: string;
  saferApproach: string;
}

export interface CommonMistakeGroup {
  id: string;
  title: string;
  goal: string;
  mistakes: CommonMistake[];
}

function mistake(
  label: string,
  reviewPath: string,
  whyItMatters: string,
  saferApproach: string,
): CommonMistake {
  return { label, reviewPath, whyItMatters, saferApproach };
}

export function buildCommonMistakeGroups(): CommonMistakeGroup[] {
  return [
    {
      id: "tax-inputs",
      title: "Tax Input Mistakes",
      goal: "Avoid inputs that make the federal and state tax estimate misleading.",
      mistakes: [
        mistake(
          "Using gross income instead of taxable income",
          "Calculator Assumptions Guide",
          "Gross salary can differ materially from taxable income after deductions, other income, and adjustments.",
          "Use a current-year taxable income estimate before conversion income, then ask a professional to review it.",
        ),
        mistake(
          "Using the wrong filing status",
          "Calculator Assumptions Guide",
          "Federal brackets depend on filing status, so a filing-status mismatch can move the estimate into wrong bracket ranges.",
          "Confirm expected current-year filing status before comparing scenarios.",
        ),
        mistake(
          "Assuming state tax is always zero",
          "State Pages",
          "State residency, local tax, and state-specific treatment may change conversion cost.",
          "Use a state assumption page as a starting point, then verify the actual marginal state rate.",
        ),
      ],
    },
    {
      id: "basis",
      title: "Basis and Account Record Mistakes",
      goal: "Avoid misunderstanding the taxable portion of the conversion.",
      mistakes: [
        mistake(
          "Guessing after-tax basis",
          "CPA Review Checklist",
          "Basis affects the taxable portion, but poor records can make the calculation unreliable.",
          "Use Form 8606 history and tax records instead of guessing.",
        ),
        mistake(
          "Ignoring other IRA balances",
          "Basis Planning",
          "Simplified basis modeling can be wrong if relevant IRA balances are missing from the picture.",
          "Collect traditional, rollover, SEP, and SIMPLE IRA balances for professional review.",
        ),
        mistake(
          "Confusing Roth contributions with traditional IRA basis",
          "Glossary",
          "Roth contributions and after-tax traditional IRA basis are different concepts.",
          "Review the glossary and Form 8606 concepts before entering basis.",
        ),
      ],
    },
    {
      id: "tax-interactions",
      title: "Tax Interaction Mistakes",
      goal: "Recognize important tax effects outside the core calculator model.",
      mistakes: [
        mistake(
          "Ignoring IRMAA and ACA subsidy effects",
          "Tax Interaction Limits",
          "Roth conversion income may affect income-linked thresholds that the calculator does not model.",
          "Review IRMAA, ACA premium tax credit, NIIT, RMD, AMT, and credit interactions separately.",
        ),
        mistake(
          "Treating the break-even year as guaranteed",
          "Methodology",
          "Break-even depends on assumed returns, future tax rates, inflation, and timing.",
          "Use break-even as a scenario estimate and compare multiple return and tax-rate assumptions.",
        ),
        mistake(
          "Ignoring future tax law uncertainty",
          "Calculator Assumptions Guide",
          "Future tax rates can differ from current assumptions.",
          "Treat retirement marginal tax rate as a scenario input, not a prediction.",
        ),
      ],
    },
    {
      id: "payment-method",
      title: "Tax Payment and Penalty Mistakes",
      goal: "Avoid misunderstanding how tax payment choices affect the modeled result.",
      mistakes: [
        mistake(
          "Treating IRA withholding like outside funds",
          "Tax Payment Methods",
          "Withholding from an IRA may reduce the amount converted and can affect penalty modeling for some users.",
          "Model outside funds and withholding separately, then review with a professional.",
        ),
        mistake(
          "Assuming every under-59.5 case has the same penalty",
          "CPA Review Checklist",
          "Penalty treatment depends on facts, exceptions, and whether money is actually distributed rather than converted.",
          "Use the penalty toggle only as an educational assumption and verify rules before acting.",
        ),
        mistake(
          "Forgetting estimated tax or withholding logistics",
          "CPA Review Checklist",
          "A conversion can create current-year tax payment obligations outside the calculator's simplified estimate.",
          "Ask about withholding, estimated payments, and timing before executing a conversion.",
        ),
      ],
    },
    {
      id: "decision-process",
      title: "Decision Process Mistakes",
      goal: "Keep calculator output in the right role: educational modeling for professional review.",
      mistakes: [
        mistake(
          "Treating calculator output as advice",
          "CPA Review Checklist",
          "The calculator cannot know the full tax, financial, legal, or investment context.",
          "Use output as a worksheet for CPA or advisor review, not as a recommendation.",
        ),
        mistake(
          "Running only one scenario",
          "Roth Conversion Planning Checklist",
          "One scenario can hide sensitivity to tax rates, returns, age, basis, and payment method.",
          "Compare multiple conversion amounts, return assumptions, and tax payment methods.",
        ),
        mistake(
          "Not saving assumptions",
          "Privacy Data Flow Playbook",
          "A result is hard to review later if the assumptions that produced it are missing.",
          "Save the print-ready report, share link, or copied summary for review and recordkeeping.",
        ),
      ],
    },
  ];
}

export function getCommonMistakeSummary(groups: CommonMistakeGroup[]) {
  const mistakes = groups.flatMap((group) => group.mistakes);

  return {
    totalGroups: groups.length,
    totalMistakes: mistakes.length,
    reviewPaths: Array.from(new Set(mistakes.map((entry) => entry.reviewPath))),
  };
}
