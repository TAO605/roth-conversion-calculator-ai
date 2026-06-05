import type { BlogPost } from "@/content/blog";
import { siteConfig } from "@/core/seo/site-config";

function line(label: string, path: string, description: string): string {
  return `- [${label}](${siteConfig.siteUrl}${path}): ${description}`;
}

export function buildLlmsText(posts: BlogPost[]): string {
  const topPosts = posts.slice(0, 8);

  return [
    "# Roth Conversion Calculator",
    "",
    "Educational and illustrative purposes only. This site does not provide tax, financial, legal, or investment advice. Users should consult a licensed CPA, financial advisor, or tax professional before making financial decisions.",
    "",
    "## Core Tool",
    line("Roth Conversion Calculator", "/#calculator", "Interactive educational calculator for federal tax, state tax assumptions, penalty modeling, break-even estimates, and Roth vs traditional IRA projections."),
    line("Methodology", "/methodology", "Calculation scope, assumptions, limitations, and tax data freshness notes."),
    line("Disclaimer", "/disclaimer", "Required compliance boundary for calculator output and educational content."),
    "",
    "## Calculator Entry Pages",
    line("Calculator Pages", "/calculators", "High-intent calculator landing page hub."),
    line("Examples", "/examples", "Prefilled educational scenario examples."),
    line("Filing Status", "/filing-status", "Filing-status-specific calculator pages."),
    line("Age Scenarios", "/age-scenarios", "Age-based calculator scenarios including under 59 1/2 and retired users."),
    line("Basis and Pro-Rata", "/basis", "After-tax basis, pro-rata rule, and Form 8606 education."),
    line("Tax Payment Methods", "/tax-payment-methods", "Outside funds, IRA withholding, and not-sure payment assumptions."),
    line("2026 Tax Brackets", "/tax-brackets/2026", "Federal bracket tables and rate-specific pages."),
    line("State Pages", "/states", "State-specific educational tax assumption pages."),
    line("Glossary", "/glossary", "Plain-English Roth conversion terminology."),
    line("Site Index", "/site-index", "Human-readable inventory of calculator, education, reference, compliance, and operations pages."),
    line("Production Launch Guide", "/production-launch", "Domain, Vercel, Google Search Console, GA4, sitemap, testing, and rollback launch sequence."),
    line("SEO Monitoring Playbook", "/seo-monitoring", "Post-launch monitoring cadence for GSC, GA4, Core Web Vitals, content refreshes, incidents, and rollback review."),
    line("Performance Audit Playbook", "/performance-audit", "Core Web Vitals, Lighthouse, mobile UX, and release regression audit checklist."),
    line("Accessibility Audit Playbook", "/accessibility-audit", "WCAG, keyboard navigation, screen reader, visual contrast, reduced motion, and form error audit checklist."),
    line("Tax Data Update Playbook", "/tax-data-update", "Annual IRS source review, bracket update, validation, release, sitemap, and rollback workflow."),
    line("AI Compliance Audit Playbook", "/ai-compliance-audit", "No-advice boundaries, required disclaimer, sensitive data blocking, model-change regression, fallback, and audit trail workflow."),
    line("Content Operations Playbook", "/content-operations", "Keyword research, educational drafting, compliance review, internal linking, publishing, and content refresh workflow."),
    line("CPA Review Checklist", "/cpa-review-checklist", "Professional review handoff checklist for calculator output, tax documents, model limits, advisor questions, and records."),
    line("Professional Review Packet", "/professional-review-packet", "Professional review status, modeled scope, non-modeled tax interactions, source data, production evidence, and CPA handoff materials."),
    line("Feedback Roadmap Playbook", "/feedback-roadmap", "User feedback capture, triage, compliance risk, small-version scope, feature registry release, and follow-up workflow."),
    line("Privacy Data Flow Playbook", "/privacy-data-flow", "Local calculation, browser storage, share link, PDF, GA4, health endpoint, and AI API privacy audit workflow."),
    line("Roth Conversion Planning Checklist", "/roth-conversion-planning-checklist", "Pre-calculator checklist for tax profile, account data, assumptions, model limits, and professional review planning."),
    line("Calculator Assumptions Guide", "/calculator-assumptions-guide", "Plain-English guide to taxable income, basis, state tax rate, tax payment method, return, retirement, and inflation assumptions."),
    line("Roth Conversion Mistakes Guide", "/roth-conversion-mistakes", "Common modeling mistakes around taxable income, basis, state tax, IRMAA, ACA, withholding, penalties, and advice boundaries."),
    line("Roth Conversion Tax Forms Guide", "/roth-conversion-tax-forms", "Educational guide to Form 1099-R, Form 5498, Form 8606, IRA statements, basis records, and CPA review packages."),
    line("Roth Conversion Timeline Guide", "/roth-conversion-timeline", "Year-end planning, custodian processing, tax payment timing, tax forms, CPA review, and post-filing comparison timeline."),
    line("Roth Conversion Custodian Process Guide", "/roth-conversion-custodian-process", "Educational workflow for custodian conversion requests, confirmations, withholding records, tax form reconciliation, and post-process calculator updates."),
    line("Roth Conversion CPA Questions Guide", "/roth-conversion-cpa-questions", "Educational question bank for CPA review of taxable income, basis, tax payment method, income-linked tax interactions, filing records, and calculator assumptions."),
    line("Roth Conversion 5-Year Rules Guide", "/roth-conversion-5-year-rules", "Educational guide to Roth IRA qualified distribution clocks, conversion-specific 5-year periods, ordering rules, age and exception review, records, and calculator limits."),
    line("Roth Conversion RMD Guide", "/roth-conversion-rmd-guide", "Educational guide to RMD obligations, conversion sequence, Roth IRA owner rules, inherited account review, taxable income assumptions, and calculator limits."),
    line("Roth Conversion Social Security Tax Guide", "/roth-conversion-social-security-tax-guide", "Educational guide to taxable Social Security benefits, Roth conversion income interactions, Publication 915 worksheet review, retiree scenarios, RMD and IRMAA context, and calculator limits."),
    line("Roth Conversion IRMAA Guide", "/roth-conversion-irmaa-guide", "Educational guide to Medicare IRMAA, conversion income and MAGI review, lookback years, life-changing event review, Part B and Part D premium context, and calculator limits."),
    line("Roth Conversion ACA Premium Tax Credit Guide", "/roth-conversion-aca-premium-tax-credit-guide", "Educational guide to Marketplace premium tax credits, conversion income effects, APTC reconciliation, Form 1095-A, Form 8962, household coverage details, and calculator limits."),
    line("Roth Conversion NIIT Guide", "/roth-conversion-niit-guide", "Educational guide to net investment income tax, Roth conversion income and MAGI review, investment income classification, Form 8960 review, income-linked interactions, and calculator limits."),
    line("Roth Conversion Capital Gains Guide", "/roth-conversion-capital-gains-guide", "Educational guide to long-term capital gains, qualified dividends, ordinary-income stacking, capital gain worksheet review, portfolio events, NIIT overlap, and calculator limits."),
    line("Roth Conversion Estimated Tax Guide", "/roth-conversion-estimated-tax-guide", "Educational guide to estimated tax payments, Roth conversion income payment review, IRA withholding, Form 1040-ES, Form 2210, state payment questions, and calculator limits."),
    line("Roth Conversion Recharacterization Guide", "/roth-conversion-recharacterization-guide", "Educational guide to Roth conversion recharacterization limits, contribution recharacterization differences, backdoor Roth context, custodian error review, tax forms, and calculator limits."),
    line("Roth Conversion QCD Guide", "/roth-conversion-qcd-guide", "Educational guide to qualified charitable distributions, RMD coordination, why QCDs are not Roth conversions, Form 1099-R review, charity acknowledgments, and calculator limits."),
    "",
    "## Recent Guides",
    ...topPosts.map((post) => line(post.title, `/blog/${post.slug}`, post.description)),
    "",
    "## Machine Notes",
    "- Calculations run locally in the browser where possible.",
    "- AI responses, when available, are restricted to educational explanation and must not provide personalized tax decisions.",
    "- Financial inputs should be treated as user-provided assumptions, not verified facts.",
  ].join("\n");
}
