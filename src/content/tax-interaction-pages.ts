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
      "Learn why Medicare IRMAA can matter when Roth conversion income increases taxable income, and how the calculator's bounded proxy previews differ from SSA billing determinations.",
    modelingStatus:
      "The calculator provides bounded 2026 Part B and Part D IRMAA proxy previews, but final IRMAA billing requires separate SSA and Medicare review.",
    officialSourceLabel: "Medicare.gov IRMAA information",
    officialSourceUrl: "https://www.medicare.gov/basics/costs/medicare-costs/part-b-costs",
    paragraphs: [
      "A Roth conversion can increase current-year taxable income, which may be relevant to Medicare income-related monthly adjustment amount discussions.",
      "The calculator focuses on federal income tax, user-entered state tax, penalty assumptions, projection math, and bounded 2026 IRMAA proxy previews; it does not calculate SSA billing determinations or plan-specific Medicare premiums.",
      "Users near Medicare age or already enrolled in Medicare should treat IRMAA as a separate review item with a qualified professional.",
    ],
  },
  {
    slug: "aca-premium-tax-credit",
    title: "ACA Premium Tax Credit and Roth Conversion Calculator Limits",
    description:
      "Learn why ACA premium tax credit interactions can matter when Roth conversion income changes household income assumptions, and how the calculator's APTC at-stake preview differs from Form 8962 results.",
    modelingStatus:
      "The calculator provides a bounded APTC at-stake preview from user-entered annual APTC and coverage months, but final ACA premium tax credit effects require separate Marketplace and Form 8962 review.",
    officialSourceLabel: "HealthCare.gov premium tax credit information",
    officialSourceUrl: "https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/",
    paragraphs: [
      "A Roth conversion can affect income measures used in health insurance subsidy contexts for some households.",
      "The calculator can preview the amount of user-entered advance premium tax credit at stake across Marketplace coverage months, but it does not determine Marketplace eligibility, final premium tax credits, repayment amounts, benchmark plan premiums, or health-plan cost changes.",
      "Users who rely on ACA subsidies should verify income effects outside the calculator before treating any conversion estimate as complete.",
    ],
  },
  {
    slug: "niit",
    title: "NIIT and Roth Conversion Calculator Limits",
    description:
      "Learn how the Roth Conversion Calculator's bounded NIIT preview differs from a final Form 8960 calculation.",
    modelingStatus:
      "The calculator provides a bounded 3.8% NIIT preview when net investment income is entered, but final NIIT treatment requires separate Form 8960 review.",
    officialSourceLabel: "IRS net investment income tax information",
    officialSourceUrl: "https://www.irs.gov/newsroom/net-investment-income-tax",
    paragraphs: [
      "The net investment income tax can involve income thresholds and investment income categories outside the calculator's simplified Roth conversion model.",
      "The calculator can preview 3.8% of the lesser of user-entered net investment income or the calculator MAGI proxy excess, but it does not classify investment income, deductions, trade or business exceptions, credits, or every MAGI adjustment.",
      "Users with significant investment income should treat NIIT as a separate professional-review item.",
    ],
  },
  {
    slug: "rmds",
    title: "RMDs and Roth Conversion Calculator Limits",
    description:
      "Learn why required minimum distributions can matter in Roth conversion planning, and how the calculator's Uniform Lifetime preview differs from a final RMD obligation.",
    modelingStatus:
      "The calculator provides a bounded Uniform Lifetime Table RMD preview for retained age and balance inputs, but final required distribution rules require separate custodian, IRS, or professional review.",
    officialSourceLabel: "IRS required minimum distribution information",
    officialSourceUrl: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs",
    paragraphs: [
      "Required minimum distributions can affect retirement account cash flow and taxable income in years when they apply.",
      "The calculator can preview a traditional IRA owner Uniform Lifetime amount from entered age and balance, but it does not determine final RMD obligations, inherited-account schedules, plan-specific account treatment, prior-year adjusted balances, or conversion sequencing.",
      "Users close to RMD age or already taking RMDs should verify required distribution rules before relying on a conversion scenario.",
    ],
  },
];

export function getTaxInteractionPageBySlug(slug: string): TaxInteractionPage | undefined {
  return taxInteractionPages.find((page) => page.slug === slug);
}
