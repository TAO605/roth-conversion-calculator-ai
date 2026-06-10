export interface AcaPtcGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface AcaPtcGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: AcaPtcGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): AcaPtcGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildAcaPtcGuideSections(): AcaPtcGuideSection[] {
  return [
    {
      id: "marketplace-basics",
      title: "Marketplace Premium Tax Credit Basics",
      purpose: "Explain why Marketplace coverage creates a separate review item before relying on conversion estimates.",
      points: [
        point(
          "Marketplace savings are based on estimated household income",
          "Marketplace income",
          "Premium tax credit eligibility and advance savings involve household income estimates for Marketplace coverage.",
          "Use HealthCare.gov, Marketplace notices, tax software, or professional review for coverage-specific calculations.",
        ),
        point(
          "Coverage year income can differ from calculator taxable income",
          "Marketplace income",
          "The calculator uses a simplified taxable income input and does not independently calculate Marketplace household income.",
          "Confirm the correct income measure before evaluating subsidy effects.",
        ),
        point(
          "Household changes can affect Marketplace review",
          "Marketplace income",
          "Family size, filing status, coverage months, and household members can affect Marketplace calculations.",
          "Bring Marketplace application details and household information to review.",
        ),
      ],
    },
    {
      id: "conversion-income",
      title: "Roth Conversion Income Interaction",
      purpose: "Show how taxable conversion income can affect Marketplace income review.",
      points: [
        point(
          "Roth conversion income can change annual household income",
          "Conversion income",
          "A taxable Roth conversion can increase the annual income used in Marketplace premium tax credit review.",
          "Compare scenarios with and without conversion income before treating a tax-cost estimate as complete.",
        ),
        point(
          "Partial conversion scenarios may have different subsidy effects",
          "Conversion income",
          "Different conversion amounts may affect premium tax credit eligibility or reconciliation differently.",
          "Use tax software or professional projection tools for subsidy-sensitive households.",
        ),
        point(
          "State tax assumptions do not replace Marketplace review",
          "Conversion income",
          "A user-entered state tax rate does not model health insurance premium changes or subsidy repayment.",
          "Keep tax estimates and health coverage estimates separate.",
        ),
      ],
    },
    {
      id: "advance-credit-reconciliation",
      title: "Advance Credit Reconciliation",
      purpose: "Clarify why APTC and tax-return reconciliation are outside the calculator model.",
      points: [
        point(
          "Advance premium tax credits are reconciled on the tax return",
          "APTC reconciliation",
          "Advance premium tax credits may be compared with actual annual information when filing the tax return.",
          "Ask how conversion income could affect Form 8962 or repayment/refund outcomes.",
        ),
        point(
          "Form 1095-A and Form 8962 records should be reviewed",
          "APTC reconciliation",
          "Marketplace users should keep coverage and premium records for filing review.",
          "Bring Form 1095-A, Form 8962, Marketplace notices, and calculator scenarios to the CPA.",
        ),
        point(
          "Timing updates may reduce surprises",
          "APTC reconciliation",
          "Users may need to update Marketplace income estimates during the year when income changes.",
          "Review whether Marketplace estimate updates are appropriate with the Marketplace or a qualified professional.",
        ),
      ],
    },
    {
      id: "household-and-coverage",
      title: "Household and Coverage Review",
      purpose: "Flag details that commonly make ACA review more complex than a simple bracket estimate.",
      points: [
        point(
          "Coverage months and household members matter",
          "Coverage details",
          "Premium tax credit review may depend on who was covered and for which months.",
          "Bring Marketplace coverage records instead of relying only on annual income estimates.",
        ),
        point(
          "Married filing status can affect eligibility review",
          "Coverage details",
          "Filing status and household composition can be relevant to Marketplace tax credit rules.",
          "Discuss filing status assumptions before comparing conversion scenarios.",
        ),
        point(
          "Other income-linked items can overlap",
          "Coverage details",
          "ACA premium tax credit review can overlap with Social Security taxation, RMDs, NIIT, credits, and state tax assumptions.",
          "Review income-linked items together when several apply.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Separate the bounded APTC at-stake preview from final Marketplace credit calculations.",
      points: [
        point(
          "Calculator only previews APTC at stake when Marketplace inputs are entered",
          "Calculator limits",
          "The calculator estimates conversion tax cost, simplified state tax, penalties, projections, break-even math, and a bounded advance premium tax credit at-stake preview from user-entered APTC and coverage months.",
          "Use the preview as a handoff cue, not as a final Marketplace eligibility, benchmark plan, repayment-cap, or Form 8962 result.",
        ),
        point(
          "Taxable income input should be reviewed when subsidies apply",
          "Calculator limits",
          "Marketplace users should verify the income baseline before adding conversion income.",
          "Re-run scenarios after updating income estimates through tax software or professional review.",
        ),
        point(
          "ACA questions belong in the professional handoff packet",
          "Calculator limits",
          "If Marketplace coverage applies, ACA premium tax credit review should be listed beside RMD, Social Security, IRMAA, NIIT, and state tax questions.",
          "Bring calculator output, Marketplace records, and filing documents to review.",
        ),
      ],
    },
  ];
}

export function getAcaPtcGuideSummary(sections: AcaPtcGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
