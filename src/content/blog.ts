export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  primaryKeyword?: string;
  ogImage?: string;
  ogImageAlt?: string;
  publishedAt: string;
  lastUpdated: string;
  author: string;
  reviewer: string;
  reviewStatus?: "pending" | "editorial" | "professional-reviewed";
  professionalReviewer?: {
    name: string;
    credential: string;
  };
  tags: string[];
  body: string[];
}

export function getBlogSeoTitle(post: BlogPost): string {
  return post.seoTitle ?? post.title;
}

export function getBlogSeoDescription(post: BlogPost): string {
  return post.seoDescription ?? post.description;
}

export function getBlogCanonicalPath(post: BlogPost): string {
  return `/blog/${post.slug}`;
}

export function getBlogOgImage(post: BlogPost): string {
  return post.ogImage ?? "/social-preview.svg";
}

export function getBlogOgImageAlt(post: BlogPost): string {
  return post.ogImageAlt ?? `${post.title} guide from Roth Conversion Calculator`;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-a-roth-conversion-2026",
    title: "What Is a Roth Conversion and How Does It Work in 2026?",
    description: "A plain-English guide to Roth conversion basics, taxable income, and key IRS rules.",
    publishedAt: "2026-05-01",
    lastUpdated: "2026-05-01",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["basics", "taxable-income", "irs-rules"],
    body: [
      "A Roth conversion moves money from a pre-tax retirement account into a Roth IRA. The taxable part is generally included in current-year income.",
      "This can change your federal tax, state tax, and other income-linked tax items. This article is educational and does not recommend whether a conversion is appropriate.",
      "Before modeling a conversion, gather your filing status, current taxable income, account balance, after-tax basis, state tax assumption, and how taxes would be paid. These inputs help a calculator show an illustrative range, but they do not replace a full tax projection.",
    ],
  },
  {
    slug: "is-a-roth-conversion-worth-it",
    title: "Is a Roth Conversion Worth It? Key Factors to Understand",
    description: "Understand the inputs that affect Roth conversion outcomes without treating a calculator as advice.",
    publishedAt: "2026-05-01",
    lastUpdated: "2026-05-01",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["planning", "break-even", "tax-rates"],
    body: [
      "The answer depends on current tax rates, future tax rates, investment horizon, estate goals, and other tax interactions.",
      "A calculator can show scenarios, but a CPA or financial professional should review your full facts.",
      "Useful scenario work usually compares more than one conversion amount and more than one time horizon. The goal is to understand tradeoffs, not to treat a single projection as a decision rule.",
    ],
  },
  {
    slug: "roth-conversion-5-year-rule",
    title: "How the 5-Year Rule Works for Roth Conversions",
    description: "Learn why Roth conversion timing and distributions can be affected by 5-year rule considerations.",
    publishedAt: "2026-05-01",
    lastUpdated: "2026-05-01",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["5-year-rule", "distributions", "irs-rules"],
    body: [
      "Roth conversions can have 5-year rule considerations that differ from regular Roth IRA contribution rules.",
      "Distribution treatment depends on age, account history, and the type of money distributed.",
      "The calculator focuses on tax-cost estimates and does not determine whether a future distribution satisfies every ordering and holding-period rule. Keep records and verify distribution treatment with a qualified professional.",
    ],
  },
  {
    slug: "roth-conversion-taxes",
    title: "Roth Conversion Taxes: Federal, State, and Penalty Basics",
    description: "See how federal taxes, state taxes, and potential penalties fit into Roth conversion estimates.",
    publishedAt: "2026-05-01",
    lastUpdated: "2026-05-01",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["taxes", "state-tax", "penalties"],
    body: [
      "The taxable part of a Roth conversion is usually added to ordinary income for the year.",
      "State treatment varies. Some penalties relate to distributions that do not actually enter the Roth IRA.",
      "Federal brackets, state assumptions, tax withholding choices, and other income-linked items can all change the final bill. Use calculator output as a worksheet for review, not as tax filing instructions.",
    ],
  },
  {
    slug: "backdoor-roth-conversion-guide",
    title: "Backdoor Roth Conversion: A Complete Guide for High Earners",
    description: "Educational overview of backdoor Roth concepts and pro-rata basis considerations.",
    publishedAt: "2026-05-01",
    lastUpdated: "2026-05-01",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["backdoor-roth", "pro-rata", "basis"],
    body: [
      "A backdoor Roth strategy often involves nondeductible traditional IRA contributions followed by conversion.",
      "The pro-rata rule and Form 8606 reporting are important and should be reviewed carefully.",
      "Existing pre-tax IRA balances can make a backdoor Roth conversion partly taxable. That is why basis tracking and account aggregation are important before relying on any simplified estimate.",
    ],
  },
  {
    slug: "roth-conversion-tax-brackets-2026",
    title: "Roth Conversion Tax Brackets in 2026: What to Watch",
    description: "Understand how a Roth conversion can fill or cross federal income tax brackets in 2026.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["tax-brackets", "2026", "federal-tax"],
    body: [
      "A Roth conversion can push additional taxable income through more than one federal bracket. The marginal rate reached by the last dollar may differ from the average federal tax rate on the whole conversion.",
      "Bracket capacity is the remaining taxable income room before the next bracket starts. A calculator can estimate this room using filing status and current taxable income.",
      "Federal bracket estimates still leave out many other tax interactions, including credits, Medicare premium surcharges, ACA subsidies, AMT, NIIT, and state-specific rules.",
    ],
  },
  {
    slug: "roth-conversion-state-taxes",
    title: "Roth Conversion State Taxes: Why Location Matters",
    description: "Learn why state income tax assumptions can materially change Roth conversion estimates.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["state-tax", "taxes", "planning"],
    body: [
      "Some states have no individual income tax, while others may tax retirement income or conversion income differently. A simple state marginal rate is only an approximation.",
      "For educational modeling, entering a state marginal rate can show how much the state assumption changes upfront conversion cost.",
      "State rules can change and may depend on residency, income type, deductions, credits, and retirement-income exclusions. Verify state treatment before acting.",
    ],
  },
  {
    slug: "roth-conversion-break-even",
    title: "Roth Conversion Break-Even: How to Interpret the Estimate",
    description: "A guide to understanding Roth conversion break-even years without treating them as advice.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["break-even", "planning", "calculator"],
    body: [
      "A break-even estimate compares the modeled upfront tax cost with the future after-tax difference between Roth and traditional account treatment.",
      "The estimate is sensitive to return assumptions, tax rates, time horizon, and whether taxes are paid from outside funds or withheld from the IRA distribution.",
      "A shorter break-even period is not automatically a recommendation. Liquidity, risk tolerance, estate goals, and tax-law uncertainty still require professional review.",
    ],
  },
  {
    slug: "paying-roth-conversion-taxes",
    title: "Paying Roth Conversion Taxes: Outside Funds vs IRA Withholding",
    description: "Compare educational considerations around paying Roth conversion taxes from outside funds or withholding.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["tax-payment", "penalties", "withholding"],
    body: [
      "Paying conversion taxes from outside funds can allow the full converted amount to enter the Roth IRA, but it requires cash liquidity.",
      "Withholding taxes from the IRA distribution may reduce the amount that reaches the Roth account. For people under age 59.5, withheld amounts can also create penalty considerations unless an exception applies.",
      "The right payment method depends on cash flow, withholding requirements, estimated tax rules, and individual facts. Use calculator warnings as prompts for professional review.",
    ],
  },
  {
    slug: "roth-conversion-pro-rata-rule",
    title: "Roth Conversion Pro-Rata Rule: Basis and Taxable Amounts",
    description: "Understand why after-tax basis can reduce but not always eliminate Roth conversion taxes.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["pro-rata", "basis", "form-8606"],
    body: [
      "When a traditional IRA includes both pre-tax and after-tax money, the taxable portion of a conversion is commonly affected by the pro-rata rule.",
      "A basis ratio can estimate what share of a conversion is treated as after-tax money, but accurate reporting depends on complete IRA records and Form 8606.",
      "Do not assume you can convert only the after-tax portion of an IRA without considering all relevant traditional, SEP, and SIMPLE IRA balances.",
    ],
  },
  {
    slug: "roth-conversion-before-retirement",
    title: "Roth Conversions Before Retirement: Planning Questions to Ask",
    description: "Educational questions for evaluating Roth conversion scenarios before retirement.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["before-retirement", "planning", "tax-rates"],
    body: [
      "Pre-retirement years can involve changing income, deductions, benefits, and savings rates. These variables can make Roth conversion modeling more complex than a single tax bracket comparison.",
      "Useful inputs include current taxable income, expected retirement age, estimated retirement tax rate, investment horizon, state tax assumption, and available cash for taxes.",
      "A calculator can organize assumptions and show educational scenarios, but it cannot determine whether a conversion fits your broader retirement plan.",
    ],
  },
  {
    slug: "roth-conversion-after-retirement",
    title: "Roth Conversions After Retirement: Tax Interactions to Review",
    description: "Learn which retirement-stage tax interactions may matter when modeling Roth conversions.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["after-retirement", "rmd", "tax-interactions"],
    body: [
      "After retirement, taxable income may come from pensions, Social Security, investments, part-time work, and retirement account distributions.",
      "Roth conversions can interact with Social Security taxation, Medicare premiums, required minimum distributions, credits, deductions, and state rules.",
      "Because these interactions are fact-specific, calculator output should be treated as an educational first pass for discussion with a CPA or financial planner.",
    ],
  },
  {
    slug: "multi-year-roth-conversion-planning",
    title: "Multi-Year Roth Conversion Planning: Equal Splits and Tradeoffs",
    description: "Understand how spreading a Roth conversion over multiple years changes educational tax estimates.",
    publishedAt: "2026-05-02",
    lastUpdated: "2026-05-02",
    author: "Roth Conversion Calculator Editorial Team",
    reviewer: "Editorial review pending",
    tags: ["multi-year", "tax-brackets", "planning"],
    body: [
      "A multi-year conversion schedule spreads a total planned conversion amount across more than one tax year. This can change which brackets are reached in each modeled year.",
      "Equal-split schedules are easy to understand, but they are not automatically optimal. Real planning may use income windows, tax-law changes, RMD timing, or cash-flow needs.",
      "Use multi-year comparisons to see how assumptions behave, then verify the actual plan with a professional who can model your complete tax return.",
    ],
  },
];

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const current = blogPosts.find((post) => post.slug === slug);

  if (!current) {
    return [];
  }

  const currentTags = new Set(current.tags);

  return blogPosts
    .filter((post) => post.slug !== slug)
    .map((post, index) => ({
      post,
      index,
      score: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.post);
}

export interface BlogTopicGroup {
  label: string;
  tag: string;
  posts: BlogPost[];
}

const topicGroups = [
  { label: "Tax Costs", tag: "taxes" },
  { label: "Planning Windows", tag: "planning" },
  { label: "Federal Brackets", tag: "tax-brackets" },
  { label: "Basis and Pro-Rata", tag: "basis" },
  { label: "Retirement Timing", tag: "after-retirement" },
] as const;

export function getBlogTopicGroups(): BlogTopicGroup[] {
  return topicGroups
    .map((group) => ({
      ...group,
      posts: blogPosts.filter((post) => post.tags.includes(group.tag)).slice(0, 4),
    }))
    .filter((group) => group.posts.length > 0);
}
