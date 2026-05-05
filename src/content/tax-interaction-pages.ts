export interface TaxInteractionPage {
  slug: string;
  title: string;
  description: string;
  modelingStatus: string;
  officialSourceLabel: string;
  officialSourceUrl: string;
  paragraphs: string[];
}

export const taxInteractionPages: TaxInteractionPage[] = [
  {
    slug: "irmaa",
    title: "IRMAA and Roth Conversion Calculator Limits",
    description:
      "Learn why Medicare IRMAA can matter when Roth conversion income increases taxable income, even though it is not modeled by the calculator.",
    modelingStatus: "IRMAA is not modeled by the calculator and requires separate professional review.",
    officialSourceLabel: "Medicare.gov IRMAA information",
    officialSourceUrl: "https://www.medicare.gov/basics/costs/medicare-costs/part-b-costs",
    paragraphs: [
      "A Roth conversion can increase current-year taxable income, which may be relevant to Medicare income-related monthly adjustment amount discussions.",
      "The calculator focuses on federal income tax, user-entered state tax, penalty assumptions, and projection math; it does not estimate Medicare premium adjustments.",
      "Users near Medicare age or already enrolled in Medicare should treat IRMAA as a separate review item with a qualified professional.",
    ],
  },
  {
    slug: "aca-premium-tax-credit",
    title: "ACA Premium Tax Credit and Roth Conversion Calculator Limits",
    description:
      "Learn why ACA premium tax credit interactions can matter when Roth conversion income changes household income assumptions.",
    modelingStatus: "ACA premium tax credit effects are not modeled by the calculator and require separate review.",
    officialSourceLabel: "HealthCare.gov premium tax credit information",
    officialSourceUrl: "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
    paragraphs: [
      "A Roth conversion can affect income measures used in health insurance subsidy contexts for some households.",
      "The calculator does not estimate Marketplace eligibility, premium tax credits, repayment amounts, or health-plan cost changes.",
      "Users who rely on ACA subsidies should verify income effects outside the calculator before treating any conversion estimate as complete.",
    ],
  },
  {
    slug: "niit",
    title: "NIIT and Roth Conversion Calculator Limits",
    description:
      "Learn why net investment income tax interactions are outside the Roth Conversion Calculator's core model.",
    modelingStatus: "NIIT interactions are not modeled by the calculator and require separate review.",
    officialSourceLabel: "IRS net investment income tax information",
    officialSourceUrl: "https://www.irs.gov/newsroom/net-investment-income-tax",
    paragraphs: [
      "The net investment income tax can involve income thresholds and investment income categories outside the calculator's simplified Roth conversion model.",
      "The calculator does not determine whether NIIT applies, does not classify investment income, and does not model every adjusted gross income interaction.",
      "Users with significant investment income should treat NIIT as a separate professional-review item.",
    ],
  },
  {
    slug: "rmds",
    title: "RMDs and Roth Conversion Calculator Limits",
    description:
      "Learn why required minimum distributions can matter in Roth conversion planning and why they are outside the calculator's MVP model.",
    modelingStatus: "RMD timing and required distribution rules are not modeled by the calculator and require separate review.",
    officialSourceLabel: "IRS required minimum distribution information",
    officialSourceUrl: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs",
    paragraphs: [
      "Required minimum distributions can affect retirement account cash flow and taxable income in years when they apply.",
      "The calculator does not determine RMD obligations, sequence conversions around RMDs, or optimize multi-year conversion timing.",
      "Users close to RMD age or already taking RMDs should verify required distribution rules before relying on a conversion scenario.",
    ],
  },
];

export function getTaxInteractionPageBySlug(slug: string): TaxInteractionPage | undefined {
  return taxInteractionPages.find((page) => page.slug === slug);
}
