export interface KeywordLandingPage {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  intent: string;
  primaryCta: string;
  disclaimer: string;
  paragraphs: string[];
}

export const keywordLandingPages: KeywordLandingPage[] = [
  {
    slug: "roth-ira-conversion-calculator",
    keyword: "Roth IRA Conversion Calculator",
    title: "Roth IRA Conversion Calculator",
    description:
      "Use a free Roth IRA conversion calculator to estimate 2026 federal tax, state tax, possible penalties, break-even years, and projected after-tax value.",
    intent: "For users searching for a direct Roth IRA conversion calculator with transparent assumptions.",
    primaryCta: "Open the Roth IRA conversion calculator",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, or investment advice.",
    paragraphs: [
      "This Roth IRA Conversion Calculator page is built for users who want to move directly from search intent into a working calculator.",
      "The calculator estimates the taxable conversion amount, federal tax impact, user-entered state tax, modeled penalty assumptions, and projected after-tax comparison.",
      "All inputs can be adjusted on the calculator page, and calculations run locally in the browser without storing personal financial information on a server.",
    ],
  },
  {
    slug: "roth-conversion-tax-calculator",
    keyword: "Roth Conversion Tax Calculator",
    title: "Roth Conversion Tax Calculator",
    description:
      "Estimate the upfront tax cost of a Roth conversion with 2026 federal brackets, filing status, taxable income, basis, and state tax assumptions.",
    intent: "For users focused on the current-year tax cost of a Roth conversion.",
    primaryCta: "Estimate Roth conversion taxes",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, or investment advice.",
    paragraphs: [
      "A Roth conversion tax estimate depends on the taxable portion of the conversion, current taxable income, filing status, and state tax assumptions.",
      "The calculator separates federal tax, state tax, and modeled penalty amounts so users can see the components of the upfront cost estimate.",
      "The result is not a tax return calculation and does not model every deduction, credit, phaseout, Medicare threshold, or state-specific rule.",
    ],
  },
  {
    slug: "roth-conversion-break-even-calculator",
    keyword: "Roth Conversion Break Even Calculator",
    title: "Roth Conversion Break-Even Calculator",
    description:
      "Estimate Roth conversion break-even timing by comparing upfront tax cost with projected Roth and traditional IRA after-tax values.",
    intent: "For users focused on how long it may take investment growth to offset conversion tax cost.",
    primaryCta: "Calculate Roth conversion break-even years",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, or investment advice.",
    paragraphs: [
      "The break-even estimate helps users understand how long a modeled Roth conversion may need before projected after-tax value is higher than the traditional account comparison.",
      "The calculator uses user-entered assumptions for expected annual return, retirement age, retirement marginal tax rate, inflation, and tax payment method.",
      "Market returns and future tax rates can differ materially from assumptions, so the break-even result should be treated as a sensitivity estimate.",
    ],
  },
  {
    slug: "2026-roth-conversion-calculator",
    keyword: "2026 Roth Conversion Calculator",
    title: "2026 Roth Conversion Calculator",
    description:
      "Use a 2026 Roth conversion calculator with current-year federal bracket assumptions and transparent educational methodology.",
    intent: "For users who specifically want 2026 tax-year assumptions and freshness signals.",
    primaryCta: "Open the 2026 calculator",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, or investment advice.",
    paragraphs: [
      "This page highlights the 2026 tax-year version of the Roth Conversion Calculator and links to the active calculator interface.",
      "The calculator labels its tax year and separates IRS-based federal bracket assumptions from user-entered state tax and future return assumptions.",
      "Annual tax data updates should be reviewed after IRS inflation adjustments are released, and users should verify rules with a qualified professional.",
    ],
  },
];

export function getKeywordLandingPageBySlug(slug: string): KeywordLandingPage | undefined {
  return keywordLandingPages.find((page) => page.slug === slug);
}

export function buildKeywordLandingCalculatorHref(_page: KeywordLandingPage): string {
  return "/#calculator";
}
