export interface GlossaryTerm {
  slug: string;
  title: string;
  shortDefinition: string;
  definition: string;
  relatedSlugs: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "roth-conversion",
    title: "Roth Conversion",
    shortDefinition: "A movement of retirement assets from a pre-tax account into a Roth IRA.",
    definition:
      "A Roth conversion moves assets from a traditional IRA, qualified plan, or similar pre-tax retirement account into a Roth IRA. The taxable portion is generally included in current-year income, so the timing, amount, filing status, state tax assumptions, and payment method all matter for educational modeling.",
    relatedSlugs: ["taxable-conversion", "federal-tax-bracket", "break-even-year"],
  },
  {
    slug: "taxable-conversion",
    title: "Taxable Conversion",
    shortDefinition: "The portion of a Roth conversion that is treated as taxable income.",
    definition:
      "The taxable conversion amount is the part of a Roth conversion that is modeled as ordinary income for the year. It may be lower than the gross conversion when after-tax basis is present, but the exact amount depends on basis records, account aggregation, and tax reporting rules.",
    relatedSlugs: ["after-tax-basis", "pro-rata-rule", "form-8606"],
  },
  {
    slug: "after-tax-basis",
    title: "After-Tax Basis",
    shortDefinition: "Money in a traditional IRA that has already been taxed.",
    definition:
      "After-tax basis generally refers to nondeductible money in a traditional IRA that has already been taxed. Basis can reduce the taxable portion of a Roth conversion, but it must be tracked carefully and is commonly reported using Form 8606.",
    relatedSlugs: ["pro-rata-rule", "form-8606", "taxable-conversion"],
  },
  {
    slug: "pro-rata-rule",
    title: "Pro-Rata Rule",
    shortDefinition: "A rule that can make IRA conversions partly taxable even when basis exists.",
    definition:
      "The pro-rata rule is an IRA tax concept that can treat a conversion as coming proportionally from pre-tax and after-tax IRA money. It is especially important for backdoor Roth situations because existing pre-tax IRA balances may make part of the conversion taxable.",
    relatedSlugs: ["after-tax-basis", "backdoor-roth", "form-8606"],
  },
  {
    slug: "form-8606",
    title: "Form 8606",
    shortDefinition: "An IRS form commonly used to report nondeductible IRA basis and conversions.",
    definition:
      "Form 8606 is commonly associated with reporting nondeductible IRA contributions, basis, and certain Roth conversion information. A calculator can estimate basis effects, but actual reporting should be verified with tax software or a qualified tax professional.",
    relatedSlugs: ["after-tax-basis", "pro-rata-rule", "backdoor-roth"],
  },
  {
    slug: "federal-tax-bracket",
    title: "Federal Tax Bracket",
    shortDefinition: "A marginal rate range used in the federal income tax system.",
    definition:
      "A federal tax bracket is a marginal rate range applied to taxable income. A Roth conversion can fill remaining room in a current bracket and may push additional income into higher brackets, so bracket capacity is a useful educational metric.",
    relatedSlugs: ["marginal-tax-rate", "taxable-conversion", "bracket-capacity"],
  },
  {
    slug: "marginal-tax-rate",
    title: "Marginal Tax Rate",
    shortDefinition: "The rate applied to the next dollar of taxable income.",
    definition:
      "A marginal tax rate is the rate that applies to the next dollar of taxable income. For Roth conversion modeling, the marginal rate reached by the conversion can differ from the average effective tax rate across the entire conversion.",
    relatedSlugs: ["federal-tax-bracket", "state-marginal-tax-rate", "break-even-year"],
  },
  {
    slug: "state-marginal-tax-rate",
    title: "State Marginal Tax Rate",
    shortDefinition: "A user-estimated state income tax rate applied to the taxable conversion.",
    definition:
      "The state marginal tax rate is an assumption used to estimate state tax on a taxable Roth conversion. State treatment varies widely, so the calculator treats this as a user-controlled educational input rather than a verified state-specific tax conclusion.",
    relatedSlugs: ["marginal-tax-rate", "taxable-conversion", "federal-tax-bracket"],
  },
  {
    slug: "break-even-year",
    title: "Break-Even Year",
    shortDefinition: "The modeled year when Roth after-tax value offsets upfront conversion cost.",
    definition:
      "The break-even year is an educational estimate of when projected Roth value advantages may offset modeled upfront tax costs. It is sensitive to return assumptions, tax rates, time horizon, and whether taxes are paid from outside funds.",
    relatedSlugs: ["expected-annual-return", "retirement-tax-rate", "roth-conversion"],
  },
  {
    slug: "expected-annual-return",
    title: "Expected Annual Return",
    shortDefinition: "A user assumption for compound growth in projections.",
    definition:
      "Expected annual return is the assumed yearly investment growth rate used in projection math. It is not a guarantee and can materially change Roth conversion break-even estimates and future after-tax value comparisons.",
    relatedSlugs: ["break-even-year", "retirement-tax-rate", "multi-year-conversion"],
  },
  {
    slug: "retirement-tax-rate",
    title: "Retirement Tax Rate",
    shortDefinition: "A user estimate of future marginal tax rate in retirement.",
    definition:
      "Retirement tax rate is a planning assumption for what marginal tax rate might apply to future traditional IRA withdrawals. Because future law, income, deductions, and state rules can change, this input should be modeled as a scenario rather than a certainty.",
    relatedSlugs: ["break-even-year", "marginal-tax-rate", "expected-annual-return"],
  },
  {
    slug: "early-distribution-penalty",
    title: "Early Distribution Penalty",
    shortDefinition: "A potential penalty related to certain distributions before age 59.5.",
    definition:
      "An early distribution penalty may be relevant when taxes are withheld from an IRA distribution and the person is under age 59.5 without an applicable exception. The calculator models this as a warning area and not as a complete legal determination.",
    relatedSlugs: ["tax-withholding", "roth-conversion", "taxable-conversion"],
  },
  {
    slug: "tax-withholding",
    title: "Tax Withholding",
    shortDefinition: "Money withheld from a distribution to pay estimated taxes.",
    definition:
      "Tax withholding is money withheld from a retirement account distribution for taxes. In a Roth conversion context, withholding from the IRA may reduce the amount that reaches the Roth IRA and can create penalty considerations for some users.",
    relatedSlugs: ["early-distribution-penalty", "roth-conversion", "taxable-conversion"],
  },
  {
    slug: "backdoor-roth",
    title: "Backdoor Roth",
    shortDefinition: "A strategy concept involving nondeductible IRA contributions and Roth conversion.",
    definition:
      "Backdoor Roth is a common name for a strategy where a person makes a nondeductible traditional IRA contribution and then converts to Roth. The pro-rata rule, basis records, and Form 8606 reporting are central considerations.",
    relatedSlugs: ["pro-rata-rule", "after-tax-basis", "form-8606"],
  },
  {
    slug: "multi-year-conversion",
    title: "Multi-Year Conversion",
    shortDefinition: "A conversion approach spread across more than one tax year.",
    definition:
      "A multi-year conversion spreads a planned Roth conversion amount across multiple tax years. This can change bracket exposure and cash-flow timing, but equal splits are only educational scenarios and not an optimized tax plan.",
    relatedSlugs: ["federal-tax-bracket", "break-even-year", "expected-annual-return"],
  },
  {
    slug: "bracket-capacity",
    title: "Bracket Capacity",
    shortDefinition: "Estimated remaining room before taxable income reaches a higher bracket.",
    definition:
      "Bracket capacity is the estimated amount of additional taxable income that can fit in a current federal bracket before reaching the next bracket. It is useful for scenario analysis but does not include every tax interaction.",
    relatedSlugs: ["federal-tax-bracket", "marginal-tax-rate", "multi-year-conversion"],
  },
];

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.slug === slug);
}
