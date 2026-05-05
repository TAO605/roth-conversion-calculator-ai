export interface SocialSecurityTaxGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface SocialSecurityTaxGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: SocialSecurityTaxGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): SocialSecurityTaxGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildSocialSecurityTaxGuideSections(): SocialSecurityTaxGuideSection[] {
  return [
    {
      id: "taxable-benefit-basics",
      title: "Taxable Social Security Benefit Basics",
      purpose: "Explain why Social Security benefit taxation is a separate review topic for retirees.",
      points: [
        point(
          "Social Security benefits may become partly taxable based on combined income",
          "Taxable benefits",
          "Social Security benefit taxation can depend on income measures that include other taxable income and certain nontaxable interest.",
          "Use IRS Publication 915, tax software, or a CPA review to determine taxable benefits.",
        ),
        point(
          "Benefit taxation is not the same as marginal bracket lookup",
          "Taxable benefits",
          "A conversion can change the taxable portion of benefits, which may make the tax effect larger than a simple bracket estimate suggests.",
          "Ask whether the conversion changes the taxable benefits worksheet before relying on a scenario.",
        ),
        point(
          "Married and single filers may have different thresholds",
          "Taxable benefits",
          "Filing status can change the Social Security benefit taxation review.",
          "Bring filing status, benefit statements, and income estimates to professional review.",
        ),
      ],
    },
    {
      id: "conversion-income",
      title: "Roth Conversion Income Interaction",
      purpose: "Show how conversion income can affect Social Security benefit tax review.",
      points: [
        point(
          "Roth conversion income can change the taxable benefits worksheet",
          "Conversion income",
          "A taxable Roth conversion adds income that may affect how much Social Security benefit is taxable for the year.",
          "Update the taxable income baseline before comparing conversion scenarios.",
        ),
        point(
          "Partial conversions may have different benefit-tax effects",
          "Conversion income",
          "Different conversion amounts can interact differently with benefit taxation and brackets.",
          "Compare multiple scenarios with tax software or a professional, not only the calculator projection.",
        ),
        point(
          "State treatment can differ from federal benefit taxation",
          "Conversion income",
          "Federal Social Security taxation and state treatment are separate topics.",
          "Review state tax assumptions separately from the simplified state-rate input.",
        ),
      ],
    },
    {
      id: "worksheet-review",
      title: "Publication 915 Worksheet Review",
      purpose: "Make the IRS worksheet boundary explicit instead of embedding an incomplete model.",
      points: [
        point(
          "Publication 915 worksheet review is separate from the calculator",
          "Publication 915 worksheet",
          "IRS Publication 915 includes worksheets and instructions for Social Security and equivalent railroad retirement benefits.",
          "Treat the calculator as a planning worksheet and use Pub. 915 or professional software for benefit-tax calculations.",
        ),
        point(
          "Benefit statements and other income records are needed",
          "Publication 915 worksheet",
          "A review normally needs Social Security benefit amounts plus wages, pensions, investment income, IRA distributions, and other income records.",
          "Bring Form SSA-1099, retirement account records, and income estimates.",
        ),
        point(
          "Worksheet results can change the tax-cost estimate",
          "Publication 915 worksheet",
          "If a conversion increases taxable benefits, the total tax effect can differ from a simple conversion-only estimate.",
          "Ask the CPA to compare calculator output with a full tax projection.",
        ),
      ],
    },
    {
      id: "retiree-scenarios",
      title: "Retiree Scenario Review",
      purpose: "Help retirees identify when benefit taxation should be reviewed before using calculator output.",
      points: [
        point(
          "Retirees should model Social Security taxation before relying on conversion estimates",
          "Retiree review",
          "Users receiving benefits may need a full tax projection that includes Social Security benefit taxation.",
          "Save scenarios with and without conversion income for professional review.",
        ),
        point(
          "RMDs and Social Security can interact with conversion income",
          "Retiree review",
          "RMD income, Social Security benefits, investment income, and conversion income can all affect the retirement tax picture.",
          "Review RMDs and Social Security together when both apply.",
        ),
        point(
          "Medicare IRMAA may also need a separate check",
          "Retiree review",
          "Higher income from a conversion can also be relevant to Medicare premium review for some users.",
          "Use the IRMAA page and a professional review for Medicare premium questions.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Clarify what the calculator estimates and what it intentionally leaves to tax software or professional review.",
      points: [
        point(
          "Calculator does not compute taxable Social Security benefits",
          "Calculator limits",
          "The calculator estimates conversion tax cost using user-entered taxable income and tax assumptions; it does not run the Pub. 915 taxable benefits worksheet.",
          "Do not treat the calculator output as a complete tax return projection.",
        ),
        point(
          "User-entered taxable income should already reflect reviewed benefit taxation",
          "Calculator limits",
          "If Social Security benefits are taxable, the taxable income input should reflect a reviewed estimate before conversion income is added.",
          "Re-run scenarios after updating the taxable income baseline.",
        ),
        point(
          "Professional review is more important for benefit recipients",
          "Calculator limits",
          "Benefit taxation, RMDs, IRMAA, state tax, credits, and deductions can overlap.",
          "Bring calculator results, benefit records, tax forms, and CPA questions to review.",
        ),
      ],
    },
  ];
}

export function getSocialSecurityTaxGuideSummary(sections: SocialSecurityTaxGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
