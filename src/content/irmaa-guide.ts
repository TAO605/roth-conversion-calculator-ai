export interface IrmaaGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface IrmaaGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: IrmaaGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): IrmaaGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildIrmaaGuideSections(): IrmaaGuideSection[] {
  return [
    {
      id: "irmaa-basics",
      title: "Medicare IRMAA Basics",
      purpose: "Explain what IRMAA is before users treat a conversion estimate as complete.",
      points: [
        point(
          "IRMAA can add premiums for higher-income Medicare beneficiaries",
          "IRMAA basics",
          "Income-related monthly adjustment amounts can increase Medicare premiums for some higher-income beneficiaries.",
          "Use Medicare.gov, SSA notices, tax software, or professional review for premium-specific questions.",
        ),
        point(
          "IRMAA is separate from income tax",
          "IRMAA basics",
          "The Roth conversion calculator estimates taxes and projections; Medicare premium adjustments are a separate review topic.",
          "Do not treat federal tax cost as the complete retiree cash-flow impact.",
        ),
        point(
          "Medicare enrollment status matters",
          "IRMAA basics",
          "Users not yet enrolled in Medicare may still want to understand future lookback-year effects near Medicare age.",
          "Bring Medicare enrollment timing and age assumptions to review.",
        ),
      ],
    },
    {
      id: "conversion-income",
      title: "Conversion Income and MAGI Review",
      purpose: "Show why Roth conversion income can matter for IRMAA without embedding a premium calculator.",
      points: [
        point(
          "Roth conversion income can affect MAGI used for IRMAA review",
          "MAGI review",
          "A taxable Roth conversion can increase income measures that may be relevant to IRMAA determination.",
          "Ask whether the conversion year income could affect a later Medicare premium year.",
        ),
        point(
          "Small conversion changes can matter near thresholds",
          "MAGI review",
          "Users near an IRMAA threshold may need more precise tax projection than a simplified calculator scenario.",
          "Compare multiple conversion amounts with professional tax projection software.",
        ),
        point(
          "MAGI is not the same as calculator taxable income",
          "MAGI review",
          "The calculator's taxable income input is a user assumption and does not independently compute Medicare MAGI.",
          "Confirm the correct income measure before evaluating IRMAA exposure.",
        ),
      ],
    },
    {
      id: "lookback-and-life-events",
      title: "Lookback Year and Life-Changing Events",
      purpose: "Highlight timing and appeal-related review items without making eligibility decisions.",
      points: [
        point(
          "IRMAA commonly uses tax return information from an earlier year",
          "Lookback year",
          "Medicare IRMAA determinations commonly use IRS tax return information from a prior year.",
          "Review the relevant lookback year before assuming a current-year conversion has an immediate or delayed effect.",
        ),
        point(
          "Life-changing event review is fact-specific",
          "Lookback year",
          "Some users may need to discuss whether a qualifying life-changing event affects an IRMAA determination.",
          "Use SSA procedures and professional guidance; the calculator does not evaluate appeals.",
        ),
        point(
          "Timing records should be saved",
          "Lookback year",
          "Conversion dates, tax years, filed returns, and Medicare notices should be kept together for review.",
          "Archive calculator scenarios separately from official notices and tax returns.",
        ),
      ],
    },
    {
      id: "parts-b-and-d",
      title: "Medicare Part B and Part D Review",
      purpose: "Explain that IRMAA can apply across Medicare premium categories.",
      points: [
        point(
          "Part B and Part D can have separate IRMAA amounts",
          "Part B and Part D",
          "IRMAA can be relevant to Medicare Part B and Part D premium discussions.",
          "Review both premium categories when estimating retiree cash flow.",
        ),
        point(
          "Premium notices are separate from tax forms",
          "Part B and Part D",
          "SSA or Medicare notices should be reviewed alongside tax returns and calculator records.",
          "Do not rely on tax forms alone to understand premium adjustments.",
        ),
        point(
          "Cash-flow planning may need premium estimates",
          "Part B and Part D",
          "A conversion estimate that excludes premiums may understate near-term cash-flow effects for some retirees.",
          "Pair tax-cost estimates with premium review when Medicare applies.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make clear that IRMAA is an external review item rather than a hidden calculator output.",
      points: [
        point(
          "Calculator provides only bounded IRMAA proxy previews",
          "Calculator limits",
          "The calculator estimates conversion tax cost, simplified state tax, penalty assumptions, projections, break-even math, and bounded 2026 Part B and Part D IRMAA proxy previews; it does not calculate SSA billing determinations or plan-specific premiums.",
          "Use the calculator as a worksheet, not as a Medicare premium billing calculator.",
        ),
        point(
          "IRMAA should be listed as a professional review question",
          "Calculator limits",
          "Users near Medicare age or enrolled in Medicare should add IRMAA to their CPA or advisor question list.",
          "Bring calculator scenarios, filed returns, SSA notices, and Medicare premium records.",
        ),
        point(
          "RMDs and Social Security can overlap with IRMAA review",
          "Calculator limits",
          "RMD income, Social Security taxation, investment income, and conversion income can all affect retiree income review.",
          "Review income-linked items together instead of treating the conversion estimate as isolated.",
        ),
      ],
    },
  ];
}

export function getIrmaaGuideSummary(sections: IrmaaGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
