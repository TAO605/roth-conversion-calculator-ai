export interface FiveYearRulePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface FiveYearRuleSection {
  id: string;
  title: string;
  purpose: string;
  points: FiveYearRulePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): FiveYearRulePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildFiveYearRuleSections(): FiveYearRuleSection[] {
  return [
    {
      id: "qualified-distribution-clock",
      title: "Roth IRA Qualified Distribution Clock",
      purpose: "Separate the Roth IRA qualified distribution concept from the conversion-specific recapture concept.",
      points: [
        point(
          "Qualified distribution 5-year period",
          "Qualified distributions",
          "A Roth IRA qualified distribution analysis commonly looks at whether the Roth IRA 5-year period and another qualifying condition are satisfied.",
          "Ask a tax professional how the Roth IRA 5-year period applies to the user's first Roth IRA contribution or conversion year.",
        ),
        point(
          "First Roth IRA year matters",
          "Qualified distributions",
          "The first year a Roth IRA is established can matter for qualified distribution timing, even when later conversions occur.",
          "Bring records showing the first Roth IRA contribution or conversion year.",
        ),
        point(
          "Qualified distribution review is not the same as conversion tax cost",
          "Qualified distributions",
          "The calculator estimates conversion tax cost and projections; it does not determine whether a later Roth IRA withdrawal is qualified.",
          "Review withdrawal treatment separately from the conversion estimate.",
        ),
      ],
    },
    {
      id: "conversion-clock",
      title: "Conversion-Specific 5-Year Period",
      purpose: "Explain why each conversion may need its own review when converted amounts are withdrawn later.",
      points: [
        point(
          "Separate 5-year period for each conversion or rollover",
          "Conversion recapture",
          "Educational IRS materials describe a separate 5-year period that can apply to each conversion or rollover for certain distribution rules.",
          "Ask the CPA to track conversion years separately when multiple conversions have occurred.",
        ),
        point(
          "Conversion principal and earnings are reviewed differently",
          "Conversion recapture",
          "Converted amounts, regular contributions, and earnings can have different withdrawal treatment under Roth IRA rules.",
          "Bring contribution, conversion, and earnings records instead of relying on total Roth balance alone.",
        ),
        point(
          "Multiple-year conversion schedules need recordkeeping",
          "Conversion recapture",
          "A multi-year conversion strategy can create multiple conversion-year records that should be tracked for later review.",
          "Save conversion confirmations by tax year and amount.",
        ),
      ],
    },
    {
      id: "ordering-rules",
      title: "Distribution Ordering Rules",
      purpose: "Highlight that Roth IRA withdrawals may be treated as coming from different buckets in a specific order.",
      points: [
        point(
          "Roth IRA distribution ordering rules",
          "Ordering rules",
          "Roth IRA distributions are commonly reviewed under ordering concepts for regular contributions, conversions, and earnings.",
          "Ask how ordering rules affect the specific withdrawal being reviewed.",
        ),
        point(
          "Regular contributions may be different from converted amounts",
          "Ordering rules",
          "User records should distinguish regular Roth IRA contributions from converted traditional IRA money.",
          "Bring contribution history and custodian statements.",
        ),
        point(
          "Earnings require separate review",
          "Ordering rules",
          "Investment earnings inside the Roth IRA can have different tax and penalty considerations than contribution or conversion principal.",
          "Review earnings treatment with tax software or a professional before withdrawing.",
        ),
      ],
    },
    {
      id: "age-and-exceptions",
      title: "Age, Penalties, and Exceptions",
      purpose: "Keep age and exception language educational and separate from personalized withdrawal advice.",
      points: [
        point(
          "Age 59 1/2 and exception review",
          "Age and exceptions",
          "Age can affect whether certain penalty rules or exceptions need review, especially when converted amounts are withdrawn.",
          "Confirm age, distribution date, and any claimed exception with a tax professional.",
        ),
        point(
          "Early withdrawal exceptions are fact-specific",
          "Age and exceptions",
          "Exceptions may depend on detailed facts and documentation, so the calculator should not decide whether an exception applies.",
          "Keep supporting records for any exception being discussed.",
        ),
        point(
          "Tax cost estimate does not equal withdrawal clearance",
          "Age and exceptions",
          "Paying conversion tax does not automatically answer every later withdrawal question.",
          "Review later withdrawal timing as a separate tax topic.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary and Records",
      purpose: "Make clear where the calculator helps and where professional review is still needed.",
      points: [
        point(
          "Calculator output does not decide withdrawal treatment",
          "Calculator limits",
          "The calculator models current conversion tax cost, projections, and simplified break-even estimates, not later Roth IRA distribution qualification.",
          "Use calculator output as a worksheet, not a withdrawal approval.",
        ),
        point(
          "Save conversion year and amount records",
          "Calculator limits",
          "Later 5-year rule review may need exact conversion years and amounts, not just current Roth IRA balance.",
          "Archive Form 1099-R, Form 5498, Form 8606, and custodian confirmations.",
        ),
        point(
          "Ask before combining multiple rules",
          "Calculator limits",
          "Qualified distributions, conversion recapture, ordering rules, age, and exceptions can overlap.",
          "Bring a written question list when several Roth IRA rules may apply at once.",
        ),
      ],
    },
  ];
}

export function getFiveYearRulesSummary(sections: FiveYearRuleSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
