export interface EstimatedTaxGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface EstimatedTaxGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: EstimatedTaxGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): EstimatedTaxGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildEstimatedTaxGuideSections(): EstimatedTaxGuideSection[] {
  return [
    {
      id: "estimated-tax-basics",
      title: "Estimated Tax Basics",
      purpose: "Explain why a conversion tax estimate is not the same as a payment schedule.",
      points: [
        point(
          "Estimated tax is used for income not fully covered by withholding",
          "Estimated tax",
          "Estimated tax payments can be relevant when tax is not covered through withholding or other payments during the year.",
          "Use IRS Form 1040-ES, tax software, or a CPA review to evaluate payment timing.",
        ),
        point(
          "Payment timing is separate from tax cost",
          "Estimated tax",
          "The calculator estimates tax cost but does not decide when or how the tax should be paid.",
          "Ask whether quarterly estimates, withholding, or another payment approach needs review.",
        ),
        point(
          "Safe harbor review is fact-specific",
          "Estimated tax",
          "Prior-year tax, current-year income, withholding, and timing can affect underpayment review.",
          "Bring prior-year return, current withholding, and income projections to professional review.",
        ),
      ],
    },
    {
      id: "conversion-income",
      title: "Conversion Income and Current-Year Tax",
      purpose: "Show why taxable conversion income can change payment needs during the year.",
      points: [
        point(
          "Roth conversion income can increase current-year tax payment needs",
          "Conversion income",
          "A taxable Roth conversion can increase the current-year tax estimate and may require a separate payment review.",
          "Update tax projections after selecting a conversion scenario.",
        ),
        point(
          "Large year-end conversions can create timing questions",
          "Conversion income",
          "A late-year conversion may raise questions about whether and when additional tax payments are needed.",
          "Save conversion date, amount, withholding, and confirmation records.",
        ),
        point(
          "State estimated tax may need separate review",
          "Conversion income",
          "The calculator's state tax input is a simplified assumption and does not determine state estimated tax rules.",
          "Review state payment rules separately when state tax applies.",
        ),
      ],
    },
    {
      id: "withholding-vs-estimates",
      title: "Withholding Versus Estimated Payments",
      purpose: "Separate IRA withholding assumptions from non-IRA payment planning.",
      points: [
        point(
          "IRA withholding and Form 1040-ES payments should be reviewed separately",
          "Withholding review",
          "Withholding from an IRA distribution and making estimated payments are different payment paths with different consequences.",
          "Ask how each method affects the amount converted, cash flow, and filing records.",
        ),
        point(
          "Withholding can reduce the Roth deposit",
          "Withholding review",
          "If taxes are withheld from the IRA distribution, the amount that reaches the Roth IRA may be lower than the gross distribution.",
          "Compare gross distribution, net Roth deposit, and withholding confirmation.",
        ),
        point(
          "Under age 59 1/2 needs special review",
          "Withholding review",
          "Withheld amounts can raise separate early distribution questions for younger users.",
          "Review age, exceptions, and withholding records before assuming penalty treatment.",
        ),
      ],
    },
    {
      id: "form-2210-review",
      title: "Underpayment Review",
      purpose: "Flag Form 2210 and penalty review as outside the calculator.",
      points: [
        point(
          "Form 2210 underpayment review is outside the calculator",
          "Underpayment review",
          "Underpayment penalty review can involve timing, withholding, estimated payments, prior-year tax, and annualized income questions.",
          "Use tax software or a professional review for Form 2210 analysis.",
        ),
        point(
          "Annualized income may matter for uneven income years",
          "Underpayment review",
          "Some users have uneven income because of bonuses, asset sales, Roth conversions, or retirement distributions.",
          "Bring quarter-by-quarter income and payment records when timing matters.",
        ),
        point(
          "Payment records should be saved with the scenario",
          "Underpayment review",
          "Estimated tax confirmations, withholding records, and IRS payment receipts help reconcile filing results.",
          "Archive payment records with the calculator scenario and tax forms.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make clear that payment compliance is separate from conversion modeling.",
      points: [
        point(
          "Calculator does not determine estimated tax safe harbor",
          "Calculator limits",
          "The calculator estimates conversion tax cost, state assumptions, penalties, projections, and break-even math; it does not determine safe harbor, payment deadlines, or underpayment penalties.",
          "Use calculator output as a worksheet for a tax-payment review.",
        ),
        point(
          "Estimated tax belongs in the CPA handoff packet",
          "Calculator limits",
          "Payment timing questions should be documented alongside conversion amount, tax cost, withholding, state tax, and other income-linked items.",
          "Bring Form 1040-ES, payment receipts, withholding records, and the print-ready calculator report.",
        ),
        point(
          "Payment review should be repeated after actual processing",
          "Calculator limits",
          "If the custodian processes a different amount or withholding changes, payment assumptions may need updating.",
          "Compare final confirmations with the original scenario before filing.",
        ),
      ],
    },
  ];
}

export function getEstimatedTaxGuideSummary(sections: EstimatedTaxGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
