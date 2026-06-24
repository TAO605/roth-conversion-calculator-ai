import type { RothConversionInput } from "@/core/calculator/types";

type KeywordLandingSampleScenario = Pick<
  RothConversionInput,
  | "age"
  | "annualAdvancePremiumTaxCredit"
  | "basis"
  | "conversionAmount"
  | "currentTaxableIncome"
  | "expectedAnnualReturn"
  | "marketplaceCoverageMonths"
  | "annualSocialSecurityBenefits"
  | "netInvestmentIncome"
  | "retirementAge"
  | "retirementMarginalTaxRate"
  | "taxExemptInterest"
  | "traditionalIraBalance"
> & {
  label: string;
  assumptions: string[];
};

export interface KeywordLandingPage {
  slug: string;
  keyword: string;
  title: string;
  description: string;
  intent: string;
  taxInteractionPreview?: "irmaa" | "aca" | "social-security" | "niit";
  primaryCta: string;
  disclaimer: string;
  paragraphs: string[];
  sampleScenario: KeywordLandingSampleScenario;
  resultFocus: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const keywordLandingPages: KeywordLandingPage[] = [
  {
    slug: "roth-conversion-niit-calculator",
    keyword: "Roth Conversion NIIT Calculator",
    title: "Roth Conversion NIIT Calculator",
    description:
      "Use a Roth conversion NIIT calculator worksheet to preview how conversion income may affect the net investment income tax review.",
    intent:
      "For investors who want to check whether Roth conversion income may push MAGI over a NIIT threshold when net investment income is present.",
    taxInteractionPreview: "niit",
    primaryCta: "Open the Roth conversion NIIT calculator worksheet",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, investment, or Form 8960 advice.",
    paragraphs: [
      "This Roth Conversion NIIT Calculator page is built for users with investment income who want to see whether conversion income may create a net investment income tax review item.",
      "The calculator can show a bounded 3.8% NIIT preview from user-entered net investment income and the calculator MAGI proxy excess, but it does not classify investment income or complete Form 8960.",
      "Use the sample worksheet to understand the threshold interaction, then open the calculator and compare your investment income records, capital gains, K-1s, and Form 8960 context with a qualified professional.",
    ],
    resultFocus:
      "The sample output highlights MAGI proxy before and after conversion, NIIT threshold excess, user-entered net investment income, and bounded 3.8% NIIT preview.",
    faqs: [
      {
        question: "Does this Roth Conversion NIIT Calculator complete Form 8960?",
        answer:
          "No. This Roth Conversion NIIT Calculator provides a bounded educational preview from user-entered net investment income and a MAGI proxy. It does not classify investment income, apply every deduction, or complete Form 8960.",
      },
      {
        question: "When can a Roth conversion affect NIIT review?",
        answer:
          "A Roth conversion can affect NIIT review when conversion income raises MAGI above the applicable threshold and the taxpayer also has net investment income. The page is designed to flag that review item for professional discussion.",
      },
      {
        question: "What inputs should I prepare for a NIIT review?",
        answer:
          "Prepare conversion amount, current taxable income, filing status, net investment income, capital gains, K-1 details, and any Form 8960 context. The calculator output is a worksheet, not final tax advice.",
      },
    ],
    sampleScenario: {
      label: "Investment-income NIIT review sample",
      assumptions: [
        "$70,000 conversion",
        "$160,000 current taxable income",
        "$35,000 net investment income entered",
        "Single filing status",
      ],
      conversionAmount: 70000,
      currentTaxableIncome: 160000,
      traditionalIraBalance: 550000,
      basis: 0,
      age: 55,
      retirementAge: 67,
      expectedAnnualReturn: 0.06,
      retirementMarginalTaxRate: 0.24,
      netInvestmentIncome: 35000,
    },
  },
  {
    slug: "roth-conversion-social-security-tax-calculator",
    keyword: "Roth Conversion Social Security Tax Calculator",
    title: "Roth Conversion Social Security Tax Calculator",
    description:
      "Use a Roth conversion Social Security tax calculator worksheet to preview how conversion income may affect taxable Social Security benefit review.",
    intent:
      "For retirees receiving Social Security who want to check whether Roth conversion income may change a taxable-benefit review.",
    taxInteractionPreview: "social-security",
    primaryCta: "Open the Roth conversion Social Security tax calculator worksheet",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, Social Security benefit, or investment advice.",
    paragraphs: [
      "This Roth Conversion Social Security Tax Calculator page is built for retirees who want to see whether conversion income may affect a taxable Social Security benefit review.",
      "The calculator can show a bounded taxable-benefit preview when annual Social Security benefits and tax-exempt interest are entered, but it does not replace IRS Publication 915 worksheets or tax software.",
      "Use the sample worksheet to understand the income interaction, then open the calculator and compare Form SSA-1099, tax-exempt interest, and filing-status details with a qualified professional.",
    ],
    resultFocus:
      "The sample output highlights non-Social-Security income before and after conversion, combined-income proxy, bounded taxable-benefit preview, and missing Publication 915 review items.",
    faqs: [
      {
        question: "Does this Roth Conversion Social Security Tax Calculator calculate final benefit tax?",
        answer:
          "No. This Roth Conversion Social Security Tax Calculator shows a bounded taxable-benefit preview for education. It does not replace IRS Publication 915 worksheets, tax software, or professional tax preparation.",
      },
      {
        question: "Why can Roth conversion income affect Social Security tax?",
        answer:
          "Roth conversion income can increase the income proxy used in taxable Social Security benefit review. That may change how much of the benefit is included in taxable income, depending on filing status and other income.",
      },
      {
        question: "What records help review Social Security taxation?",
        answer:
          "Useful records include Form SSA-1099, other taxable income, tax-exempt interest, filing status, and the planned conversion amount. Use the calculator as a handoff worksheet for a qualified professional.",
      },
    ],
    sampleScenario: {
      label: "Retiree taxable-benefit review sample",
      assumptions: [
        "$40,000 conversion",
        "$38,000 current taxable income",
        "$30,000 annual Social Security benefits",
        "$1,000 tax-exempt interest",
      ],
      conversionAmount: 40000,
      currentTaxableIncome: 38000,
      traditionalIraBalance: 420000,
      basis: 0,
      age: 68,
      retirementAge: 67,
      expectedAnnualReturn: 0.05,
      retirementMarginalTaxRate: 0.22,
      annualSocialSecurityBenefits: 30000,
      taxExemptInterest: 1000,
    },
  },
  {
    slug: "roth-conversion-aca-subsidy-calculator",
    keyword: "Roth Conversion ACA Subsidy Calculator",
    title: "Roth Conversion ACA Subsidy Calculator",
    description:
      "Use a Roth conversion ACA subsidy calculator worksheet to preview how conversion income may put advance premium tax credits at stake.",
    intent:
      "For Marketplace coverage users who want to check whether Roth conversion income may affect ACA premium tax credit review.",
    taxInteractionPreview: "aca",
    primaryCta: "Open the Roth conversion ACA subsidy calculator worksheet",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, health insurance, or investment advice.",
    paragraphs: [
      "This Roth Conversion ACA Subsidy Calculator page is built for users who use Marketplace coverage and want to understand whether conversion income may create a premium tax credit review item.",
      "The calculator can show a bounded APTC at-stake preview when annual advance premium tax credit and Marketplace coverage months are entered, but it does not calculate final Form 8962 reconciliation, repayment caps, benchmark premiums, or eligibility.",
      "Use the sample worksheet to understand the handoff data, then open the calculator and compare your Marketplace records, Form 1095-A, and tax projection with a qualified professional.",
    ],
    resultFocus:
      "The sample output highlights the conversion-driven income proxy change, user-entered annual APTC at stake, monthly APTC preview, and missing Marketplace records for review.",
    faqs: [
      {
        question: "Does this Roth Conversion ACA Subsidy Calculator calculate final Form 8962 repayment?",
        answer:
          "No. This Roth Conversion ACA Subsidy Calculator shows an educational APTC at-stake preview. It does not calculate final Form 8962 reconciliation, repayment caps, benchmark premiums, or eligibility.",
      },
      {
        question: "Why can Roth conversion income affect ACA subsidies?",
        answer:
          "A Roth conversion can raise the income proxy used in Marketplace premium tax credit review. If you received advance premium tax credits, the conversion may create a Form 8962 review item.",
      },
      {
        question: "What Marketplace inputs should I collect?",
        answer:
          "Collect Form 1095-A, annual advance premium tax credit, Marketplace coverage months, household size, state, and planned conversion amount. The worksheet helps organize these inputs for review.",
      },
    ],
    sampleScenario: {
      label: "Marketplace APTC at-stake sample",
      assumptions: [
        "$30,000 conversion",
        "$52,000 current taxable income",
        "$7,200 annual APTC entered",
        "12 Marketplace coverage months",
      ],
      conversionAmount: 30000,
      currentTaxableIncome: 52000,
      traditionalIraBalance: 160000,
      basis: 0,
      age: 50,
      retirementAge: 67,
      expectedAnnualReturn: 0.06,
      retirementMarginalTaxRate: 0.22,
      annualAdvancePremiumTaxCredit: 7200,
      marketplaceCoverageMonths: 12,
    },
  },
  {
    slug: "roth-conversion-irmaa-calculator",
    keyword: "Roth Conversion IRMAA Calculator",
    title: "Roth Conversion IRMAA Calculator",
    description:
      "Use a Roth conversion IRMAA calculator worksheet to preview how conversion income may interact with 2026 Medicare Part B and Part D IRMAA thresholds.",
    intent:
      "For Medicare-age or near-Medicare users who want to check whether a Roth conversion may create an IRMAA review item.",
    taxInteractionPreview: "irmaa",
    primaryCta: "Open the Roth conversion IRMAA calculator worksheet",
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, Medicare billing, or investment advice.",
    paragraphs: [
      "This Roth Conversion IRMAA Calculator page is built for users who want to see whether Roth conversion income may need a Medicare IRMAA review.",
      "The calculator can show bounded 2026 Part B and Part D IRMAA proxy previews from the calculator income proxy after conversion, while keeping SSA lookback-year MAGI and actual billing determinations outside the calculator.",
      "Use the sample worksheet to understand the review flow, then open the calculator and bring your filed tax return, Medicare records, and any SSA notice to a qualified professional.",
    ],
    resultFocus:
      "The sample output highlights the calculator income proxy, 2026 Part B proxy premium, Part D IRMAA monthly adjustment, and the missing Medicare records needed for review.",
    faqs: [
      {
        question: "Does this Roth Conversion IRMAA Calculator determine actual Medicare premiums?",
        answer:
          "No. This Roth Conversion IRMAA Calculator provides a bounded 2026 proxy preview. Actual IRMAA determinations depend on SSA rules, lookback-year MAGI, filing status, and Medicare billing records.",
      },
      {
        question: "Why can Roth conversion income affect IRMAA?",
        answer:
          "Roth conversion income can raise MAGI for the relevant tax year. Medicare IRMAA uses MAGI thresholds, so a conversion may create a review item for Part B or Part D premium adjustments.",
      },
      {
        question: "What should I bring to an IRMAA review?",
        answer:
          "Bring the planned conversion amount, filed tax return, Medicare notices, filing status, and any life-changing-event documentation. The calculator preview is only a professional review worksheet.",
      },
    ],
    sampleScenario: {
      label: "Near-Medicare IRMAA review sample",
      assumptions: [
        "$80,000 conversion",
        "$145,000 current taxable income",
        "Single filing status",
        "Age 64, near Medicare enrollment",
      ],
      conversionAmount: 80000,
      currentTaxableIncome: 145000,
      traditionalIraBalance: 500000,
      basis: 0,
      age: 64,
      retirementAge: 65,
      expectedAnnualReturn: 0.05,
      retirementMarginalTaxRate: 0.24,
    },
  },
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
    resultFocus: "A sample output helps show how taxable conversion, upfront cost, and long-term projection fields appear before users enter their own assumptions.",
    faqs: [
      {
        question: "What does this Roth IRA Conversion Calculator estimate?",
        answer:
          "This Roth IRA Conversion Calculator estimates taxable conversion amount, federal tax impact, state tax assumptions, possible penalty modeling, break-even years, and projected after-tax comparison for education.",
      },
      {
        question: "Is the Roth IRA conversion estimate a tax filing result?",
        answer:
          "No. The estimate is not a tax return result and does not include every deduction, credit, phaseout, state rule, or tax-form detail. Review the output with a qualified professional before acting.",
      },
      {
        question: "Can I use the calculator without creating an account?",
        answer:
          "Yes. The calculator is available as a public tool and runs with browser inputs. The sample page demonstrates the result layout before you enter your own assumptions.",
      },
    ],
    sampleScenario: {
      label: "Lower-income early-career sample",
      assumptions: [
        "$25,000 conversion",
        "$65,000 current taxable income",
        "Single filing status",
        "Outside funds used for taxes",
      ],
      conversionAmount: 25000,
      currentTaxableIncome: 65000,
      traditionalIraBalance: 90000,
      basis: 0,
      age: 32,
      retirementAge: 67,
      expectedAnnualReturn: 0.07,
      retirementMarginalTaxRate: 0.24,
    },
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
    resultFocus: "The sample output focuses on taxable conversion amount, federal tax estimate, state tax input, and total upfront cost.",
    faqs: [
      {
        question: "What does this Roth Conversion Tax Calculator focus on?",
        answer:
          "This Roth Conversion Tax Calculator focuses on the current-year upfront tax-cost estimate, including taxable conversion amount, federal bracket impact, user-entered state tax, and modeled penalty assumptions.",
      },
      {
        question: "Does this calculator include every tax credit and deduction?",
        answer:
          "No. The calculator does not model every deduction, credit, phaseout, AMT item, Medicare threshold, or state-specific rule. It is an educational estimate for professional review.",
      },
      {
        question: "Why does filing status matter for Roth conversion taxes?",
        answer:
          "Filing status affects federal tax bracket thresholds. The same conversion amount can produce a different estimated federal tax impact depending on taxable income and filing status assumptions.",
      },
    ],
    sampleScenario: {
      label: "Current-year tax-cost sample",
      assumptions: [
        "$60,000 conversion",
        "$95,000 current taxable income",
        "Single filing status",
        "No state tax rate entered",
      ],
      conversionAmount: 60000,
      currentTaxableIncome: 95000,
      traditionalIraBalance: 300000,
      basis: 0,
      age: 48,
      retirementAge: 67,
      expectedAnnualReturn: 0.06,
      retirementMarginalTaxRate: 0.22,
    },
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
    resultFocus: "The sample output highlights break-even timing, projected Roth value, and projected traditional after-tax value.",
    faqs: [
      {
        question: "What does the Roth Conversion Break-Even Calculator show?",
        answer:
          "The Roth Conversion Break-Even Calculator shows when a modeled Roth conversion may exceed the traditional IRA after-tax comparison under the selected assumptions. It is a projection, not a guarantee.",
      },
      {
        question: "Why can break-even timing change?",
        answer:
          "Break-even timing can change when expected return, retirement age, tax payment method, retirement marginal tax rate, or conversion amount changes. Future market returns and tax rates may differ.",
      },
      {
        question: "Should I rely on one break-even result?",
        answer:
          "No. Treat one break-even result as a sensitivity case. Compare several assumptions and use the worksheet to discuss risk, taxes, and timing with a qualified professional.",
      },
    ],
    sampleScenario: {
      label: "Break-even sensitivity sample",
      assumptions: [
        "$75,000 conversion",
        "$120,000 current taxable income",
        "Nine years until retirement",
        "5% expected annual return",
      ],
      conversionAmount: 75000,
      currentTaxableIncome: 120000,
      traditionalIraBalance: 600000,
      basis: 0,
      age: 58,
      retirementAge: 67,
      expectedAnnualReturn: 0.05,
      retirementMarginalTaxRate: 0.22,
    },
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
    resultFocus: "The sample output shows the 2026 tax-year fields while keeping annual tax data and future-year updates explicit.",
    faqs: [
      {
        question: "What makes this a 2026 Roth Conversion Calculator?",
        answer:
          "This 2026 Roth Conversion Calculator labels the tax year and uses current-year federal bracket assumptions in the educational estimate, while separating user-entered state and future-return assumptions.",
      },
      {
        question: "Will the 2026 calculator change in future years?",
        answer:
          "Yes. Tax-year assumptions should be reviewed when IRS inflation adjustments and official guidance change. Future years should use updated data rather than reusing stale 2026 assumptions.",
      },
      {
        question: "Does this page replace official IRS guidance?",
        answer:
          "No. This page is a calculator worksheet and educational guide. Users should verify current tax-year rules with official sources and a qualified professional before making decisions.",
      },
    ],
    sampleScenario: {
      label: "2026 tax-year sample",
      assumptions: [
        "$50,000 conversion",
        "$85,000 current taxable income",
        "Single filing status",
        "2026 federal bracket assumptions",
      ],
      conversionAmount: 50000,
      currentTaxableIncome: 85000,
      traditionalIraBalance: 250000,
      basis: 0,
      age: 45,
      retirementAge: 65,
      expectedAnnualReturn: 0.07,
      retirementMarginalTaxRate: 0.22,
    },
  },
];

export function getKeywordLandingPageBySlug(slug: string): KeywordLandingPage | undefined {
  return keywordLandingPages.find((page) => page.slug === slug);
}

export function buildKeywordLandingCalculatorHref(_page: KeywordLandingPage): string {
  return "/#calculator";
}
