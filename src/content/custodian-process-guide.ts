export interface CustodianProcessCheckpoint {
  label: string;
  reviewArtifact: string;
  detail: string;
  caution: string;
}

export interface CustodianProcessStep {
  id: string;
  title: string;
  purpose: string;
  checkpoints: CustodianProcessCheckpoint[];
}

function checkpoint(
  label: string,
  reviewArtifact: string,
  detail: string,
  caution: string,
): CustodianProcessCheckpoint {
  return { label, reviewArtifact, detail, caution };
}

export function buildCustodianProcessSteps(): CustodianProcessStep[] {
  return [
    {
      id: "pre-request",
      title: "Before Contacting the Custodian",
      purpose: "Prepare account facts and calculator assumptions before submitting a Roth conversion request.",
      checkpoints: [
        checkpoint(
          "Confirm eligible source and destination accounts",
          "Account eligibility note",
          "Identify the traditional IRA, SEP IRA, SIMPLE IRA, rollover IRA, or plan account involved and the Roth account destination.",
          "Eligibility and plan rules vary. Confirm account-specific rules with the custodian or plan administrator.",
        ),
        checkpoint(
          "Compare the requested amount with calculator assumptions",
          "Calculator scenario",
          "Keep a copy of the conversion amount, taxable income, basis, state tax rate, and tax payment assumptions used in the calculator.",
          "The calculator is a planning worksheet, not a custodian instruction or tax filing document.",
        ),
        checkpoint(
          "Prepare basis and pro-rata records",
          "Basis record packet",
          "Gather Form 8606 history, nondeductible contribution records, and IRA balance records when after-tax basis is involved.",
          "Do not assume basis treatment without professional review when records are incomplete.",
        ),
      ],
    },
    {
      id: "request-submission",
      title: "Submitting the Conversion Request",
      purpose: "Record exactly what was requested and how taxes are expected to be handled.",
      checkpoints: [
        checkpoint(
          "Record whether taxes are paid from outside funds or withholding",
          "Submitted conversion request",
          "Document whether the user intends to pay estimated taxes from non-IRA money or withhold from the distribution.",
          "Withholding can reduce the amount converted and may affect penalty assumptions for users under 59 1/2.",
        ),
        checkpoint(
          "Confirm gross conversion amount and processing date",
          "Submitted conversion request",
          "Save the requested gross amount, request date, intended tax year, and custodian processing deadline.",
          "Year-end requests may be subject to custodian cutoffs and market settlement timing.",
        ),
        checkpoint(
          "Capture delivery method and account identifiers",
          "Submitted conversion request",
          "Record whether the request was submitted online, by phone, or by form, plus non-sensitive account references.",
          "Do not store full account numbers in browser notes, share links, or AI prompts.",
        ),
      ],
    },
    {
      id: "processing-review",
      title: "After Processing",
      purpose: "Compare the completed transaction with the original calculator scenario.",
      checkpoints: [
        checkpoint(
          "Save the conversion confirmation number",
          "Custodian confirmation",
          "Keep confirmation numbers, transaction IDs, effective dates, and final processed amounts.",
          "If the processed amount differs from the modeled amount, update the scenario before relying on estimates.",
        ),
        checkpoint(
          "Compare gross amount, withheld amount, and net Roth deposit",
          "Custodian confirmation",
          "Separate the amount distributed, amount converted, and amount withheld so the records can be reviewed later.",
          "A net Roth deposit may not equal the taxable distribution when withholding or fees are involved.",
        ),
        checkpoint(
          "Archive the year-end account statement",
          "Custodian confirmation",
          "Save statements that show IRA fair market value and Roth account activity around the conversion.",
          "Use statements as review records, not as a substitute for professional tax reporting.",
        ),
      ],
    },
    {
      id: "tax-records",
      title: "Tax Form Reconciliation",
      purpose: "Connect custodian documents with tax forms and calculator assumptions before filing.",
      checkpoints: [
        checkpoint(
          "Reconcile custodian records with Form 1099-R and Form 5498",
          "Tax form reconciliation",
          "Compare gross distributions, Roth conversion reporting, dates, and custodian confirmations.",
          "Form 5498 can arrive after filing season; keep transaction confirmations for the filing review package.",
        ),
        checkpoint(
          "Review Form 8606 treatment when basis exists",
          "Tax form reconciliation",
          "Connect nondeductible basis records with the taxable conversion amount used for filing review.",
          "Basis errors can materially change taxable conversion estimates.",
        ),
        checkpoint(
          "Prepare a CPA handoff packet",
          "Tax form reconciliation",
          "Bundle the calculator PDF, conversion confirmation, tax forms, basis records, and open questions.",
          "The packet supports review; it does not replace tax software or professional judgment.",
        ),
      ],
    },
    {
      id: "post-process",
      title: "Post-Process Review",
      purpose: "Use actual transaction and filing data to improve future calculator assumptions.",
      checkpoints: [
        checkpoint(
          "Update the calculator scenario with actual processed amounts",
          "Post-process review",
          "Replace estimated conversion amounts, withholding, and tax payment notes with actual records.",
          "Keep estimated and actual scenarios separate so assumptions remain traceable.",
        ),
        checkpoint(
          "Document differences between estimate and filed result",
          "Post-process review",
          "Record differences caused by taxable income, basis, state treatment, withholding, or other tax interactions.",
          "Large differences should be reviewed before using the same assumptions again.",
        ),
        checkpoint(
          "Store records for future conversions",
          "Post-process review",
          "Archive the review packet with release version, tax year, custodian records, and professional notes.",
          "Avoid putting sensitive tax documents into share links, analytics events, or AI chat messages.",
        ),
      ],
    },
  ];
}

export function getCustodianProcessSummary(steps: CustodianProcessStep[]) {
  const checkpoints = steps.flatMap((step) => step.checkpoints);

  return {
    totalSteps: steps.length,
    totalCheckpoints: checkpoints.length,
    reviewArtifacts: Array.from(new Set(checkpoints.map((entry) => entry.reviewArtifact))),
  };
}
