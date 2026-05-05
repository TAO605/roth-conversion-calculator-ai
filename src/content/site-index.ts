import { ageScenarioPages } from "@/content/age-scenario-pages";
import { basisPlanningPages } from "@/content/basis-planning-pages";
import { blogPosts } from "@/content/blog";
import { exampleScenarioPages } from "@/content/example-scenario-pages";
import { filingStatusPages } from "@/content/filing-status-pages";
import { glossaryTerms } from "@/content/glossary";
import { keywordLandingPages } from "@/content/keyword-landing-pages";
import { multiYearPlanningPages } from "@/content/multi-year-planning-pages";
import { statePages } from "@/content/state-pages";
import { taxBracketRatePages } from "@/content/tax-bracket-rate-pages";
import { taxInteractionPages } from "@/content/tax-interaction-pages";
import { taxPaymentMethodPages } from "@/content/tax-payment-method-pages";

export interface SiteIndexLink {
  label: string;
  href: string;
  description: string;
}

export interface SiteIndexGroup {
  id: string;
  title: string;
  description: string;
  links: SiteIndexLink[];
}

function link(label: string, href: string, description: string): SiteIndexLink {
  return { label, href, description };
}

export function buildSiteIndexGroups(): SiteIndexGroup[] {
  return [
    {
      id: "calculator",
      title: "Calculator Entry Points",
      description: "Primary calculator experiences and high-intent keyword landing pages.",
      links: [
        link("Roth Conversion Calculator", "/#calculator", "Live calculator with local browser-based estimates."),
        link("Calculator Hub", "/calculators", "Browse the main calculator landing pages."),
        link("Calculator Assumptions Guide", "/calculator-assumptions-guide", "Plain-English guide to key inputs, common mistakes, and review notes."),
        link("Roth Conversion Planning Checklist", "/roth-conversion-planning-checklist", "Prepare tax profile, account data, assumptions, and review questions before using the calculator."),
        link("Roth Conversion Mistakes Guide", "/roth-conversion-mistakes", "Common modeling mistakes and safer review paths before relying on calculator output."),
        link("Roth Conversion Tax Forms Guide", "/roth-conversion-tax-forms", "Forms and records commonly used to review conversion, basis, withholding, and CPA handoff assumptions."),
        link("Roth Conversion Timeline Guide", "/roth-conversion-timeline", "Planning, processing, tax payment, forms, and post-filing review sequence."),
        link("Roth Conversion Custodian Process Guide", "/roth-conversion-custodian-process", "Custodian request, confirmation, withholding, tax form reconciliation, and post-process review workflow."),
        link("Roth Conversion CPA Questions Guide", "/roth-conversion-cpa-questions", "Question bank for professional review of calculator assumptions, records, tax payment methods, and model limits."),
        link("Roth Conversion 5-Year Rules Guide", "/roth-conversion-5-year-rules", "Educational guide to qualified distribution clocks, conversion-specific 5-year periods, ordering rules, age review, and calculator boundaries."),
        link("Roth Conversion RMD Guide", "/roth-conversion-rmd-guide", "Educational guide to RMD obligations, conversion sequence, Roth IRA owner rules, inherited accounts, and calculator boundaries."),
        link("Roth Conversion Social Security Tax Guide", "/roth-conversion-social-security-tax-guide", "Educational guide to taxable Social Security benefits, conversion income interactions, Publication 915 review, retiree scenarios, and calculator boundaries."),
        link("Roth Conversion IRMAA Guide", "/roth-conversion-irmaa-guide", "Educational guide to Medicare IRMAA, conversion income and MAGI review, lookback years, Part B and Part D premiums, and calculator boundaries."),
        link("Roth Conversion ACA Premium Tax Credit Guide", "/roth-conversion-aca-premium-tax-credit-guide", "Educational guide to Marketplace income, Roth conversion income, APTC reconciliation, Form 1095-A, Form 8962, and calculator boundaries."),
        link("Roth Conversion NIIT Guide", "/roth-conversion-niit-guide", "Educational guide to net investment income tax, conversion income and MAGI review, investment income classification, Form 8960, and calculator boundaries."),
        link("Roth Conversion Capital Gains Guide", "/roth-conversion-capital-gains-guide", "Educational guide to capital gains, qualified dividends, income stacking, worksheet review, portfolio events, and calculator boundaries."),
        link("Roth Conversion Estimated Tax Guide", "/roth-conversion-estimated-tax-guide", "Educational guide to estimated tax payments, IRA withholding, Form 1040-ES, Form 2210, safe-harbor review, and calculator boundaries."),
        link("Roth Conversion Recharacterization Guide", "/roth-conversion-recharacterization-guide", "Educational guide to post-2017 conversion recharacterization limits, contribution recharacterization, backdoor Roth context, custodian errors, and calculator boundaries."),
        link("Roth Conversion QCD Guide", "/roth-conversion-qcd-guide", "Educational guide to qualified charitable distributions, RMD coordination, conversion separation, recordkeeping, and calculator boundaries."),
        ...keywordLandingPages.map((page) => link(page.title, `/${page.slug}`, page.intent)),
      ],
    },
    {
      id: "education",
      title: "Educational Guides",
      description: "Editorial articles and scenario pages that explain assumptions without giving advice.",
      links: [
        link("Blog Hub", "/blog", "Long-form educational Roth conversion guides."),
        ...blogPosts.map((post) => link(post.title, `/blog/${post.slug}`, post.description)),
        link("Example Scenarios", "/examples", "Prefilled educational scenario examples."),
        ...exampleScenarioPages.map((page) => link(page.title, `/examples/${page.slug}`, page.description)),
        link("Age Scenarios", "/age-scenarios", "Age-based calculator entry paths."),
        ...ageScenarioPages.map((page) => link(page.title, `/age-scenarios/${page.slug}`, page.description)),
      ],
    },
    {
      id: "reference",
      title: "Reference Pages",
      description: "Tax data transparency, terminology, state assumptions, and model-limit pages.",
      links: [
        link("Methodology", "/methodology", "Calculation formulas, assumptions, and limitations."),
        link("2026 Federal Tax Brackets", "/tax-brackets/2026", "Current tax-year bracket reference tables."),
        ...taxBracketRatePages.map((page) => link(page.title, `/tax-brackets/2026/${page.slug}`, page.description)),
        link("Glossary", "/glossary", "Plain-English Roth conversion terminology."),
        ...glossaryTerms.map((term) => link(term.title, `/glossary/${term.slug}`, term.shortDefinition)),
        link("State Pages", "/states", "State tax assumption pages."),
        ...statePages.map((page) => link(page.title, `/states/${page.slug}`, page.description)),
        link("Basis Planning", "/basis", "After-tax basis and pro-rata education."),
        ...basisPlanningPages.map((page) => link(page.title, `/basis/${page.slug}`, page.description)),
        link("Filing Status", "/filing-status", "Filing-status-specific calculator pages."),
        ...filingStatusPages.map((page) => link(page.title, `/filing-status/${page.slug}`, page.description)),
        link("Tax Payment Methods", "/tax-payment-methods", "Outside funds and withholding assumption pages."),
        ...taxPaymentMethodPages.map((page) => link(page.title, `/tax-payment-methods/${page.slug}`, page.description)),
        link("Multi-Year Planning", "/multi-year-planning", "Equal-split conversion schedule education."),
        ...multiYearPlanningPages.map((page) => link(page.title, `/multi-year-planning/${page.slug}`, page.description)),
        link("Tax Interaction Limits", "/tax-interactions", "Income-linked limits not modeled by the calculator."),
        ...taxInteractionPages.map((page) => link(page.title, `/tax-interactions/${page.slug}`, page.description)),
      ],
    },
    {
      id: "compliance",
      title: "Compliance and Trust",
      description: "Required legal, privacy, editorial, and transparency pages.",
      links: [
        link("Privacy Policy", "/privacy", "Privacy and local-calculation data handling details."),
        link("Terms of Service", "/terms", "Website terms and permitted use."),
        link("Disclaimer", "/disclaimer", "Tax, financial, legal, and investment advice boundary."),
        link("About", "/about", "Publisher and product positioning."),
        link("Editorial Policy", "/editorial-policy", "Content quality and review standards."),
      ],
    },
    {
      id: "operations",
      title: "Operations and Launch",
      description: "Production handoff, update history, machine-readable indexes, and health checks.",
      links: [
        link("Release Notes", "/release-notes", "Small-version update log and rollback map."),
        link("Launch Readiness", "/launch-readiness", "Production handoff checklist."),
        link("Production Launch Guide", "/production-launch", "Domain, Vercel, Google, testing, and rollback launch sequence."),
        link("SEO Monitoring Playbook", "/seo-monitoring", "Post-launch GSC, GA4, Core Web Vitals, content, and incident cadence."),
        link("Performance Audit Playbook", "/performance-audit", "Core Web Vitals, Lighthouse, mobile UX, and release regression checks."),
        link("Accessibility Audit Playbook", "/accessibility-audit", "WCAG, keyboard, screen reader, contrast, motion, and form checks."),
        link("Tax Data Update Playbook", "/tax-data-update", "Annual IRS source, bracket, validation, release, and rollback workflow."),
        link("AI Compliance Audit Playbook", "/ai-compliance-audit", "No-advice, disclaimer, sensitive data, model upgrade, fallback, and audit checks."),
        link("Content Operations Playbook", "/content-operations", "Keyword research, drafting, compliance review, publishing, and refresh workflow."),
        link("CPA Review Checklist", "/cpa-review-checklist", "Professional handoff checklist for calculator outputs, documents, model limits, and questions."),
        link("Feedback Roadmap Playbook", "/feedback-roadmap", "User feedback, triage, small-version scope, rollout, and follow-up workflow."),
        link("Privacy Data Flow Playbook", "/privacy-data-flow", "Local calculation, storage, sharing, analytics, health, and AI API data-flow checks."),
        link("Health Endpoint", "/api/health", "Public operational health payload."),
        link("RSS Feed", "/feed.xml", "Blog feed for content distribution."),
        link("LLMs Text", "/llms.txt", "Machine-readable site summary for AI discovery."),
        link("Sitemap", "/sitemap.xml", "XML sitemap for search engines."),
      ],
    },
  ];
}

export function getSiteIndexSummary(groups: SiteIndexGroup[]) {
  const totalLinks = groups.reduce((count, group) => count + group.links.length, 0);

  return {
    totalGroups: groups.length,
    totalLinks,
  };
}
