export interface CapitalGainsGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface CapitalGainsGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: CapitalGainsGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): CapitalGainsGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildCapitalGainsGuideSections(): CapitalGainsGuideSection[] {
  return [
    {
      id: "preferential-rate-basics",
      title: "Preferential Rate Basics",
      purpose: "Explain why capital gains and qualified dividends need separate review from ordinary conversion income.",
      points: [
        point(
          "Long-term capital gains and qualified dividends can use preferential tax rates",
          "Preferential rates",
          "Long-term capital gains and qualified dividends may be taxed under preferential rate rules that differ from ordinary income brackets.",
          "Use IRS worksheets, tax software, or professional review when a year includes capital gains or qualified dividends.",
        ),
        point(
          "Ordinary income and preferential income can interact",
          "Preferential rates",
          "Roth conversion income is generally ordinary income, but it can change the taxable income context used to evaluate preferential-rate income.",
          "Review the full return, not only the conversion amount.",
        ),
        point(
          "Filing status affects rate-band review",
          "Preferential rates",
          "Capital gain rate bands and ordinary income brackets can vary by filing status.",
          "Bring filing status, income estimates, and investment records to review.",
        ),
      ],
    },
    {
      id: "conversion-income-stacking",
      title: "Conversion Income Stacking",
      purpose: "Describe why taxable conversion income can reduce room in lower capital gain rate bands.",
      points: [
        point(
          "Roth conversion income can reduce room in lower capital gain rate bands",
          "Income stacking",
          "Adding ordinary conversion income may push more taxable income into ranges where preferential income is taxed differently.",
          "Compare scenarios with and without conversion income using a full tax projection.",
        ),
        point(
          "Partial conversions may have different capital gain effects",
          "Income stacking",
          "Different conversion amounts can interact differently with existing capital gains and qualified dividends.",
          "Run multiple scenarios when capital gains are expected.",
        ),
        point(
          "Taxable income input should reflect known portfolio events",
          "Income stacking",
          "If portfolio gains are expected, the calculator's taxable income assumption should be reviewed before conversion income is added.",
          "Update the income baseline after brokerage estimates or CPA projections are available.",
        ),
      ],
    },
    {
      id: "worksheet-review",
      title: "Worksheet Review",
      purpose: "Point users to worksheet and tax-software review without embedding a partial tax-return engine.",
      points: [
        point(
          "Qualified Dividends and Capital Gain Tax Worksheet review is separate",
          "Worksheet review",
          "Capital gain and qualified dividend tax calculations can require worksheets or tax software beyond a simple marginal bracket estimate.",
          "Do not use the Roth conversion calculator as a substitute for worksheet-based return preparation.",
        ),
        point(
          "Schedule D records can affect the final result",
          "Worksheet review",
          "Realized gains, losses, carryovers, and capital gain distributions may affect final tax treatment.",
          "Bring Schedule D history, brokerage statements, and capital loss carryover records.",
        ),
        point(
          "Qualified dividend classification matters",
          "Worksheet review",
          "Not every dividend is treated as a qualified dividend for tax purposes.",
          "Use Form 1099-DIV records and professional review for classification.",
        ),
      ],
    },
    {
      id: "portfolio-events",
      title: "Portfolio Event Review",
      purpose: "Identify investment events that can make conversion comparisons incomplete.",
      points: [
        point(
          "Large realized gains can change conversion scenario comparisons",
          "Portfolio events",
          "Asset sales, fund distributions, rebalancing, and concentrated-stock sales can change the income picture for the conversion year.",
          "Coordinate conversion scenarios with known portfolio events.",
        ),
        point(
          "Capital loss carryovers may need review",
          "Portfolio events",
          "Capital loss carryovers can affect taxable gain calculations but are not modeled by the calculator.",
          "Bring prior-year returns and carryover schedules to review.",
        ),
        point(
          "NIIT may overlap with capital gain review",
          "Portfolio events",
          "Investment income and higher MAGI can also raise NIIT questions for some users.",
          "Review capital gains and NIIT together when investment income is material.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make clear that the calculator estimates conversion effects, not full capital gain worksheets.",
      points: [
        point(
          "Calculator does not compute Schedule D or capital gain worksheets",
          "Calculator limits",
          "The calculator estimates conversion tax cost, simplified state tax, penalties, projections, and break-even math; it does not prepare Schedule D or capital gain worksheets.",
          "Use calculator output as a worksheet, not as tax return support.",
        ),
        point(
          "Capital gains should be part of the professional handoff",
          "Calculator limits",
          "Users with realized gains, qualified dividends, or fund distributions should add these items to the CPA review packet.",
          "Bring brokerage statements, tax estimates, and saved calculator scenarios.",
        ),
        point(
          "Income-linked interactions should be reviewed together",
          "Calculator limits",
          "Capital gains can overlap with NIIT, IRMAA, ACA premium tax credits, Social Security benefit taxation, RMDs, and state tax.",
          "Review the full income stack before relying on a single-scenario estimate.",
        ),
      ],
    },
  ];
}

export function getCapitalGainsGuideSummary(sections: CapitalGainsGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
