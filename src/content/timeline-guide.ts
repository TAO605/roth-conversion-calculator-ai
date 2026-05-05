export interface TimelineGuideItem {
  label: string;
  reviewOutput: string;
  detail: string;
}

export interface TimelineGuidePhase {
  id: string;
  title: string;
  goal: string;
  items: TimelineGuideItem[];
}

function item(label: string, reviewOutput: string, detail: string): TimelineGuideItem {
  return { label, reviewOutput, detail };
}

export function buildTimelineGuidePhases(): TimelineGuidePhase[] {
  return [
    {
      id: "before-year-end",
      title: "Before Year-End Planning",
      goal: "Prepare assumptions before asking a custodian to process a conversion.",
      items: [
        item(
          "Estimate taxable income before conversion",
          "Calculator scenario",
          "Prepare filing status, taxable income, deductions, and other income before modeling conversion income.",
        ),
        item(
          "Compare conversion scenarios",
          "Calculator scenario",
          "Run more than one conversion amount and tax payment method before discussing a plan with a professional.",
        ),
        item(
          "Prepare basis records",
          "CPA question list",
          "Gather Form 8606 history and IRA basis records before relying on taxable conversion estimates.",
        ),
      ],
    },
    {
      id: "conversion-window",
      title: "Conversion Processing Window",
      goal: "Understand operational timing before year-end deadlines.",
      items: [
        item(
          "Confirm custodian processing deadline",
          "Custodian confirmation",
          "Ask the IRA custodian about internal processing cutoffs before assuming a year-end conversion will complete.",
        ),
        item(
          "Confirm gross conversion amount",
          "Custodian confirmation",
          "Record the exact amount requested and compare it with the calculator scenario.",
        ),
        item(
          "Save transaction confirmation",
          "Custodian confirmation",
          "Save confirmation numbers and transaction dates for later tax-form reconciliation.",
        ),
      ],
    },
    {
      id: "tax-payment",
      title: "Tax Payment Timing",
      goal: "Separate conversion execution from tax-payment logistics.",
      items: [
        item(
          "Review estimated tax payment needs",
          "Tax payment note",
          "Ask whether withholding or estimated payments may be needed after conversion income is added.",
        ),
        item(
          "Document outside-funds or withholding assumption",
          "Tax payment note",
          "Record whether the calculator modeled taxes paid from outside funds or withheld from an IRA.",
        ),
        item(
          "Review penalty assumptions",
          "CPA question list",
          "Confirm whether any early distribution penalty assumptions apply to withholding or other distributions.",
        ),
      ],
    },
    {
      id: "forms",
      title: "Tax Form Season",
      goal: "Reconcile calculator assumptions with tax forms and custodian records.",
      items: [
        item(
          "Match Form 1099-R and Form 5498 records",
          "Tax document packet",
          "Compare gross distributions, conversion records, and custodian confirmations before filing.",
        ),
        item(
          "Review Form 8606 treatment",
          "Tax document packet",
          "Confirm nondeductible basis and taxable conversion reporting with tax software or a professional.",
        ),
        item(
          "Update CPA review package",
          "CPA question list",
          "Bring calculator output, confirmations, forms, and questions to professional review.",
        ),
      ],
    },
    {
      id: "post-filing",
      title: "Post-Filing Review",
      goal: "Use actual filing results to improve future assumptions.",
      items: [
        item(
          "Compare filed return to calculator assumptions",
          "Post-filing review",
          "Compare actual taxable conversion, tax cost, and basis treatment against the pre-conversion scenario.",
        ),
        item(
          "Archive final decision record",
          "Post-filing review",
          "Save the calculator scenario, professional notes, filed return references, and custodian forms together.",
        ),
        item(
          "Update future scenarios",
          "Calculator scenario",
          "Use post-filing differences to improve next year's taxable income, basis, and tax payment assumptions.",
        ),
      ],
    },
  ];
}

export function getTimelineGuideSummary(phases: TimelineGuidePhase[]) {
  const items = phases.flatMap((phase) => phase.items);

  return {
    totalPhases: phases.length,
    totalItems: items.length,
    reviewOutputs: Array.from(new Set(items.map((entry) => entry.reviewOutput))),
  };
}
