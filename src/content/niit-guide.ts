export interface NiitGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface NiitGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: NiitGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): NiitGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildNiitGuideSections(): NiitGuideSection[] {
  return [
    {
      id: "niit-basics",
      title: "Net Investment Income Tax Basics",
      purpose: "Explain why NIIT needs separate review for investment-income households.",
      points: [
        point(
          "NIIT is a 3.8% tax tied to net investment income and MAGI thresholds",
          "NIIT basics",
          "The net investment income tax can apply to certain individuals, estates, and trusts when net investment income and modified adjusted gross income thresholds are involved.",
          "Use IRS NIIT resources, Form 8960 instructions, tax software, or professional review for exact treatment.",
        ),
        point(
          "NIIT is separate from ordinary income tax brackets",
          "NIIT basics",
          "The calculator estimates ordinary federal income tax from conversion income but does not classify investment income or apply NIIT rules.",
          "Do not treat the marginal bracket estimate as a complete tax projection.",
        ),
        point(
          "Filing status and income thresholds matter",
          "NIIT basics",
          "NIIT review can depend on filing status, MAGI, and investment income categories.",
          "Bring filing status, investment income records, and tax projection details to review.",
        ),
      ],
    },
    {
      id: "conversion-income",
      title: "Roth Conversion Income and MAGI",
      purpose: "Clarify how conversion income can influence NIIT review even if it is not itself net investment income.",
      points: [
        point(
          "Roth conversion income can raise MAGI even when it is not net investment income",
          "MAGI review",
          "A taxable Roth conversion may increase MAGI, which can matter when evaluating whether NIIT thresholds are crossed.",
          "Ask whether conversion income changes the MAGI side of the NIIT analysis.",
        ),
        point(
          "Multiple conversion amounts can have different NIIT effects",
          "MAGI review",
          "A small conversion and a large conversion may have different interactions with MAGI thresholds and investment income.",
          "Compare scenarios using tax software or a CPA projection when investment income is significant.",
        ),
        point(
          "MAGI review may differ from calculator taxable income",
          "MAGI review",
          "The calculator's taxable income input is simplified and user-provided; it does not independently compute NIIT MAGI.",
          "Confirm the income measure before relying on a scenario.",
        ),
      ],
    },
    {
      id: "investment-income",
      title: "Investment Income Classification",
      purpose: "Flag that net investment income categories are outside the calculator.",
      points: [
        point(
          "Net investment income categories need separate classification",
          "Investment income",
          "Interest, dividends, capital gains, rental income, passive activity income, and other categories may need tax classification review.",
          "Bring brokerage estimates, K-1s, rental records, and passive activity information to professional review.",
        ),
        point(
          "Capital gains can interact with conversion income",
          "Investment income",
          "Conversion income can change overall income context while capital gains may affect investment income calculations.",
          "Review capital gain timing separately from conversion amount modeling.",
        ),
        point(
          "Business and passive activity details can matter",
          "Investment income",
          "Some income requires detailed classification before NIIT can be evaluated.",
          "Do not use the Roth conversion calculator to classify business or passive activity income.",
        ),
      ],
    },
    {
      id: "form-8960-review",
      title: "Form 8960 Review",
      purpose: "Point users to the tax filing workflow without replacing it.",
      points: [
        point(
          "Form 8960 review is outside the calculator",
          "Form 8960",
          "NIIT is commonly reported and calculated through Form 8960 when applicable.",
          "Use tax software or a tax professional to review Form 8960, not the calculator.",
        ),
        point(
          "Tax documents should be collected before NIIT review",
          "Form 8960",
          "Investment income records, capital gain statements, K-1s, and prior tax returns may be needed.",
          "Bundle documents with calculator scenarios for CPA review.",
        ),
        point(
          "Post-filing comparison can improve future scenarios",
          "Form 8960",
          "If NIIT applied, comparing filed results with calculator assumptions can improve future conversion modeling.",
          "Save filed-return references with the scenario history.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make the NIIT limitation explicit in user-facing language.",
      points: [
        point(
          "Calculator does not estimate NIIT",
          "Calculator limits",
          "The calculator estimates conversion tax cost, state tax assumptions, penalties, projections, and break-even math; it does not compute net investment income tax.",
          "List NIIT as a professional review item when investment income is material.",
        ),
        point(
          "NIIT should be reviewed with other income-linked items",
          "Calculator limits",
          "NIIT can overlap with Social Security taxation, IRMAA, ACA premium tax credits, RMDs, state tax, and capital gains.",
          "Review income-linked items together instead of treating conversion tax in isolation.",
        ),
        point(
          "Calculator output is a worksheet, not Form 8960 support",
          "Calculator limits",
          "Calculator results can help organize assumptions but do not replace tax forms, instructions, or professional judgment.",
          "Bring calculator output as supporting context only.",
        ),
      ],
    },
  ];
}

export function getNiitGuideSummary(sections: NiitGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
