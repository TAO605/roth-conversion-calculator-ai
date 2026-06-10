export interface RmdGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface RmdGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: RmdGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): RmdGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildRmdGuideSections(): RmdGuideSection[] {
  return [
    {
      id: "rmd-basics",
      title: "Required Minimum Distribution Basics",
      purpose: "Explain why RMD status is a separate review item before modeling or processing a conversion.",
      points: [
        point(
          "RMD amount is not a Roth conversion amount",
          "RMD obligation",
          "Required minimum distributions from traditional retirement accounts are generally treated as distributions that must be handled separately from eligible conversion amounts.",
          "Ask a CPA or plan administrator to confirm whether any annual RMD must be completed before a conversion request.",
        ),
        point(
          "RMD rules depend on account type and age",
          "RMD obligation",
          "Traditional IRAs, employer plans, inherited accounts, and Roth IRAs can have different RMD treatment.",
          "Bring account type, birth date, beneficiary status, and plan documents for review.",
        ),
        point(
          "RMD income can change the calculator input",
          "RMD obligation",
          "If an RMD is taxable income for the year, it may need to be included in the taxable income assumption before adding conversion income.",
          "Update taxable income assumptions before relying on a conversion estimate.",
        ),
      ],
    },
    {
      id: "conversion-sequence",
      title: "Conversion Sequence Review",
      purpose: "Keep the order of required distributions and conversions clear for professional review.",
      points: [
        point(
          "Take required distributions before converting remaining eligible assets",
          "Conversion sequence",
          "When RMD rules apply, users commonly need to review whether the required distribution must be satisfied before converting other eligible amounts.",
          "Confirm sequencing with the custodian, plan administrator, or CPA before submitting a request.",
        ),
        point(
          "Do not model RMDs as Roth deposits",
          "Conversion sequence",
          "The calculator's conversion amount input should not be used as a shortcut for required distributions that are not eligible for conversion.",
          "Keep RMD records and conversion confirmations separate.",
        ),
        point(
          "Year-end processing can add operational risk",
          "Conversion sequence",
          "RMD deadlines, custodian cutoffs, and conversion processing dates can collide near year-end.",
          "Document transaction dates and confirmations in the CPA handoff packet.",
        ),
      ],
    },
    {
      id: "roth-ira-owner",
      title: "Roth IRA Owner Treatment",
      purpose: "Clarify why Roth IRA owner rules differ from traditional IRA RMD assumptions.",
      points: [
        point(
          "Roth IRA owners generally do not take lifetime RMDs",
          "Roth IRA owner rules",
          "Original Roth IRA owners generally are not subject to lifetime RMDs from their Roth IRA during their life.",
          "Still review beneficiary, inherited account, and employer-plan Roth account differences separately.",
        ),
        point(
          "Converted funds still need records",
          "Roth IRA owner rules",
          "Even if Roth IRA owner lifetime RMDs are not the issue, conversion year, amount, and tax records remain important.",
          "Save Form 1099-R, Form 5498, Form 8606, and custodian confirmations.",
        ),
        point(
          "Employer Roth account rules may differ",
          "Roth IRA owner rules",
          "Roth IRA language should not be casually applied to every designated Roth or workplace plan situation.",
          "Ask the plan administrator how plan-specific rules apply.",
        ),
      ],
    },
    {
      id: "inherited-accounts",
      title: "Inherited Account Review",
      purpose: "Flag beneficiary distribution rules as outside the calculator's conversion model.",
      points: [
        point(
          "Inherited Roth accounts can have beneficiary distribution rules",
          "Inherited account rules",
          "Inherited Roth IRA and inherited retirement account rules may require separate beneficiary distribution analysis.",
          "Bring beneficiary status, date of death, account type, and inherited account records to review.",
        ),
        point(
          "Beneficiary rules are not modeled by the calculator",
          "Inherited account rules",
          "The calculator is designed for educational conversion estimates, not inherited-account distribution schedules.",
          "Do not use the calculator as an inherited account RMD tool.",
        ),
        point(
          "Inherited account timing can affect cash flow",
          "Inherited account rules",
          "Required beneficiary distributions can affect taxable income and cash-flow assumptions around conversions.",
          "Review inherited account distributions separately from voluntary conversion scenarios.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make explicit what the calculator does and does not determine when RMDs are relevant.",
      points: [
        point(
          "Calculator only previews Uniform Lifetime RMD when age and balance inputs fit",
          "Calculator limits",
          "The calculator estimates conversion tax cost, simplified state tax, penalties, projections, break-even math, and a bounded Uniform Lifetime Table preview from entered age and traditional IRA balance when the retained table range applies.",
          "Use IRS resources, custodian records, tax software, and professional review for final RMD obligations, account-type checks, inherited-account rules, and sequencing.",
        ),
        point(
          "RMDs can change the federal taxable income input",
          "Calculator limits",
          "If RMD income is part of the year, it may affect the starting taxable income entered into the calculator.",
          "Run updated scenarios only after the income baseline is reviewed.",
        ),
        point(
          "Sequence, eligibility, and reporting need separate records",
          "Calculator limits",
          "A useful review packet separates required distributions, eligible conversion amounts, withholding, and final tax reporting.",
          "Archive RMD confirmations separately from Roth conversion confirmations.",
        ),
      ],
    },
  ];
}

export function getRmdGuideSummary(sections: RmdGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
