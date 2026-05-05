export interface RecharacterizationGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface RecharacterizationGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: RecharacterizationGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): RecharacterizationGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildRecharacterizationGuideSections(): RecharacterizationGuideSection[] {
  return [
    {
      id: "conversion-rule",
      title: "Roth Conversion Recharacterization Rule",
      purpose: "Clarify the modern rule before users assume a completed conversion can be reversed.",
      points: [
        point(
          "Roth conversions made after 2017 generally cannot be recharacterized",
          "Conversion recharacterization",
          "IRS materials explain that a conversion from a traditional, SEP, or SIMPLE IRA to a Roth IRA made in 2018 or later cannot be recharacterized as if it had not happened.",
          "Confirm the exact transaction type and year with the custodian, tax software, or a CPA before making corrections.",
        ),
        point(
          "A completed conversion should be reviewed before submission",
          "Conversion recharacterization",
          "Because later reversal may not be available, users should review amount, tax year, basis, withholding, and payment assumptions before submitting a conversion request.",
          "Use calculator output as a pre-submission worksheet, not as permission to convert.",
        ),
        point(
          "Market performance after conversion does not create a calculator remedy",
          "Conversion recharacterization",
          "Investment losses after a conversion do not mean this calculator can undo or reprice the conversion.",
          "Discuss post-conversion concerns with a qualified tax professional.",
        ),
      ],
    },
    {
      id: "contribution-rule",
      title: "Contribution Recharacterization Is Different",
      purpose: "Separate regular IRA contribution treatment from completed Roth conversions.",
      points: [
        point(
          "Regular IRA contribution recharacterization is a different concept",
          "Contribution recharacterization",
          "Recharacterization rules can still be relevant for certain regular IRA or Roth IRA contributions, but that is different from recharacterizing a completed Roth conversion.",
          "Ask whether the issue involves a contribution, a conversion, or both.",
        ),
        point(
          "Contribution year and deadline details matter",
          "Contribution recharacterization",
          "Contribution recharacterization review may involve contribution year, tax filing deadline, extensions, earnings, and custodian procedures.",
          "Bring contribution confirmations and tax filing timeline records to review.",
        ),
        point(
          "Contribution corrections should not be modeled as conversions",
          "Contribution recharacterization",
          "The calculator's conversion amount input should not be used to model contribution recharacterization corrections.",
          "Use the appropriate custodian process and tax forms for contribution issues.",
        ),
      ],
    },
    {
      id: "backdoor-roth-context",
      title: "Backdoor Roth Context",
      purpose: "Explain why backdoor Roth workflows often mix terms that users should keep separate.",
      points: [
        point(
          "Backdoor Roth workflows often involve contribution recharacterization and later conversion",
          "Backdoor Roth",
          "Some users discuss recharacterizing a contribution and then converting after-tax IRA money, but those steps are not the same legal or tax action.",
          "Map each transaction step before asking the calculator to estimate conversion tax.",
        ),
        point(
          "Form 8606 and basis records are central",
          "Backdoor Roth",
          "Nondeductible contributions, basis, and pro-rata treatment can affect the taxable amount of a later conversion.",
          "Bring Form 8606 history, IRA balances, and contribution records to review.",
        ),
        point(
          "Aggregation and pro-rata rules still need review",
          "Backdoor Roth",
          "Having after-tax basis does not automatically make a conversion tax-free when other IRA balances exist.",
          "Review all traditional, SEP, SIMPLE, and rollover IRA balances.",
        ),
      ],
    },
    {
      id: "error-review",
      title: "Custodian and Filing Error Review",
      purpose: "Guide users toward fast document review when a transaction was entered incorrectly.",
      points: [
        point(
          "Custodian form errors should be reviewed quickly",
          "Error review",
          "If a user selected the wrong transaction type or entered the wrong amount, the custodian's correction process and timing matter.",
          "Contact the custodian and a tax professional promptly; do not rely on calculator edits as a correction.",
        ),
        point(
          "Tax form coding should be reconciled",
          "Error review",
          "Form 1099-R, Form 5498, and Form 8606 may need review when a user believes the transaction was reported incorrectly.",
          "Compare custodian confirmations with tax forms before filing.",
        ),
        point(
          "Keep estimated and actual scenarios separate",
          "Error review",
          "If the processed transaction differs from the planned scenario, keep both records so the difference is traceable.",
          "Save calculator PDFs, confirmation numbers, tax forms, and CPA notes.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make clear that the tool estimates consequences but cannot reverse or correct transactions.",
      points: [
        point(
          "Calculator does not undo or recharacterize conversions",
          "Calculator limits",
          "The calculator estimates tax cost, projections, and assumptions; it cannot change custodian records or determine whether a correction is available.",
          "Use the output as context for professional review only.",
        ),
        point(
          "Recharacterization questions belong in the CPA handoff packet",
          "Calculator limits",
          "Users should document transaction type, amount, tax year, account type, basis records, and custodian confirmations.",
          "Bring the complete record packet before filing.",
        ),
        point(
          "Run scenarios before processing, not after regret",
          "Calculator limits",
          "The calculator is most useful before a transaction is submitted, when users can compare assumptions and identify questions.",
          "Review conversion amount, tax payment method, basis, state tax, and income-linked interactions before processing.",
        ),
      ],
    },
  ];
}

export function getRecharacterizationGuideSummary(sections: RecharacterizationGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
