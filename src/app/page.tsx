import Link from "next/link";
import { Card } from "@/common/ui/card";
import { HomeCalculatorClient } from "@/app/HomeCalculatorClient";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { isFeatureEnabled } from "@/core/features/feature-registry";
import {
  calculatorHowToJsonLd,
  faqJsonLd,
  homepageWebPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/core/seo/json-ld";
import { faqItems } from "@/features/faq/faq-items";
import { FaqSection } from "@/features/faq/FaqSection";
import { TaxDataFreshnessCard } from "@/features/tax-data-freshness/TaxDataFreshnessCard";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd()) }}
        type="application/ld+json"
      />
      {isFeatureEnabled("homepage-howto-structured-data") ? (
        <>
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorHowToJsonLd()) }}
            type="application/ld+json"
          />
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            type="application/ld+json"
          />
        </>
      ) : null}
      {isFeatureEnabled("faq-schema") ? (
        <script dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }} type="application/ld+json" />
      ) : null}
      <header className="grid w-full min-w-0 max-w-full gap-4 pt-4">
        <nav
          aria-label="Primary navigation"
          className="flex w-full min-w-0 flex-col items-start justify-between gap-3 rounded-[18px] bg-white/65 px-4 py-3 text-sm shadow-sm backdrop-blur-xl dark:bg-white/10 sm:flex-row sm:items-center"
        >
          <Link className="shrink-0 font-semibold text-neutral-950 dark:text-white" href="/">
            RothCalc
          </Link>
          <div className="flex w-full min-w-0 flex-none flex-wrap items-center justify-start gap-3 text-neutral-600 dark:text-neutral-300 sm:w-auto sm:flex-1 sm:justify-end">
            <div className="flex min-w-0 max-w-full flex-wrap items-center justify-start gap-3 sm:justify-end">
              <a className="hover:text-systemBlue" href="#calculator">
                Calculator
              </a>
              <a className="hover:text-systemBlue" href="#ai-explainer">
                AI helper
              </a>
              <a className="hover:text-systemBlue" href="#method-and-sources">
                Sources
              </a>
            </div>
            {isFeatureEnabled("theme-toggle") ? <ThemeToggle /> : null}
          </div>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">AI-powered 2026 estimate</p>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-normal text-neutral-950 dark:text-white sm:text-5xl">
              AI Roth Conversion Calculator
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Estimate Roth conversion taxes, break-even years, and after-tax value. AI then explains the result,
              the inputs, and the limits in plain English without giving personal tax advice.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <a className="rounded-full bg-systemBlue px-5 py-3 text-white shadow-sm transition hover:bg-blue-600" href="#calculator">
                Start calculating
              </a>
              <a className="rounded-full bg-white/70 px-5 py-3 text-neutral-800 shadow-sm transition hover:bg-white dark:bg-white/10 dark:text-neutral-100 dark:hover:bg-white/15" href="#ai-explainer">
                Ask AI after results
              </a>
            </div>
          </div>
          <div className="rounded-[18px] bg-white/65 p-4 text-sm leading-6 text-neutral-600 shadow-sm dark:bg-white/10 dark:text-neutral-300">
            <strong>One focused workflow.</strong> Calculate the tax estimate, ask AI what the numbers mean, then
            review the method and IRS sources. Your financial inputs stay in this browser.
          </div>
        </div>
        <section className="grid gap-3 text-sm text-neutral-600 dark:text-neutral-300 sm:grid-cols-3" aria-label="AI calculator workflow">
          <div className="rounded-[16px] bg-white/60 p-4 dark:bg-white/10">
            <strong className="block text-neutral-950 dark:text-white">1. Calculate</strong>
            Enter conversion amount, income, basis, state tax, age, and expected return.
          </div>
          <div className="rounded-[16px] bg-white/60 p-4 dark:bg-white/10">
            <strong className="block text-neutral-950 dark:text-white">2. Ask AI</strong>
            Get a plain-English explanation of break-even years, penalties, basis, and assumptions.
          </div>
          <div className="rounded-[16px] bg-white/60 p-4 dark:bg-white/10">
            <strong className="block text-neutral-950 dark:text-white">3. Review</strong>
            Check the transparent method, official sources, and compliance limits before acting.
          </div>
        </section>
      </header>

      <HomeCalculatorClient />

      <section className="grid w-full min-w-0 max-w-full gap-5 lg:grid-cols-2" id="method-and-sources" aria-label="Trust and calculation methodology">
        {isFeatureEnabled("tax-data-freshness") ? <TaxDataFreshnessCard compact /> : null}
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Calculator transparency</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">Transparent calculation method</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The estimate is intentionally plain: it shows the core math, the assumptions you entered, and the limits a
            CPA or tax professional should review before any real decision.
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
            <p className="rounded-[12px] bg-neutral-50 px-3 py-2 dark:bg-white/10">
              Taxable conversion = conversion amount minus pro-rata after-tax basis.
            </p>
            <p className="rounded-[12px] bg-neutral-50 px-3 py-2 dark:bg-white/10">
              Current-year cost = estimated federal income tax plus user-entered state tax plus any modeled early
              distribution penalty.
            </p>
            <p className="rounded-[12px] bg-neutral-50 px-3 py-2 dark:bg-white/10">
              Future comparison = Roth tax-free projection versus traditional IRA projection after the selected
              retirement marginal tax rate.
            </p>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">E-E-A-T reference base</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">Official sources reviewed</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This page is maintained for tax year 2026, updated {TAX_DATA_FRESHNESS.lastUpdated}, and grounded in official IRS materials. The
            content is educational and does not replace individualized tax advice.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill/"
              rel="noreferrer"
              target="_blank"
            >
              IRS tax inflation adjustments for tax year 2026
            </a>
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href="https://www.irs.gov/publications/p590a"
              rel="noreferrer"
              target="_blank"
            >
              IRS Publication 590-A
            </a>
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href="https://www.irs.gov/publications/p590b"
              rel="noreferrer"
              target="_blank"
            >
              IRS Publication 590-B
            </a>
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href="https://www.irs.gov/forms-pubs/about-form-8606"
              rel="noreferrer"
              target="_blank"
            >
              IRS Form 8606 basis reporting
            </a>
          </div>
        </Card>
      </section>

      <FaqSection />

      <footer
        aria-label="Footer navigation and disclaimer"
        className="w-full min-w-0 border-t border-neutral-200 py-6 text-xs leading-5 text-neutral-500 dark:border-white/10 dark:text-neutral-400"
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <Link className="hover:text-systemBlue" href="/blog">
            Guides
          </Link>
          <Link className="hover:text-systemBlue" href="/calculators">
            Calculators
          </Link>
          <Link className="hover:text-systemBlue" href="/examples">
            Examples
          </Link>
          <Link className="hover:text-systemBlue" href="/states">
            States
          </Link>
          <Link className="hover:text-systemBlue" href="/age-scenarios">
            Age
          </Link>
          <Link className="hover:text-systemBlue" href="/basis">
            Basis
          </Link>
          <Link className="hover:text-systemBlue" href="/multi-year-planning">
            Multi-year
          </Link>
          <Link className="hover:text-systemBlue" href="/glossary">
            Glossary
          </Link>
          <Link className="hover:text-systemBlue" href="/filing-status">
            Filing Status
          </Link>
          <Link className="hover:text-systemBlue" href="/tax-brackets/2026">
            Tax Brackets
          </Link>
          <Link className="hover:text-systemBlue" href="/tax-payment-methods">
            Tax Payment
          </Link>
          <Link className="hover:text-systemBlue" href="/tax-interactions">
            Limits
          </Link>
          <Link className="hover:text-systemBlue" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-systemBlue" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-systemBlue" href="/disclaimer">
            Disclaimer
          </Link>
          <Link className="hover:text-systemBlue" href="/editorial-policy">
            Editorial Policy
          </Link>
          <Link className="hover:text-systemBlue" href="/release-notes">
            Release Notes
          </Link>
        </div>
        <details className="mb-4 rounded-[16px] bg-white/60 p-4 dark:bg-white/10">
          <summary className="cursor-pointer text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            More planning guides
          </summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link className="hover:text-systemBlue" href="/roth-conversion-irmaa-guide">IRMAA guide</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-social-security-tax-guide">Social Security tax</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-aca-premium-tax-credit-guide">ACA premium tax credit</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-niit-guide">NIIT guide</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-rmd-guide">RMD guide</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-5-year-rules">5-year rules</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-capital-gains-guide">Capital gains</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-estimated-tax-guide">Estimated tax</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-recharacterization-guide">Recharacterization</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-qcd-guide">QCD guide</Link>
            <Link className="hover:text-systemBlue" href="/calculator-assumptions-guide">Calculator assumptions</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-planning-checklist">Planning checklist</Link>
            <Link className="hover:text-systemBlue" href="/cpa-review-checklist">CPA review checklist</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-tax-forms">Tax forms</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-timeline">Timeline</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-mistakes">Common mistakes</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-custodian-process">Custodian process</Link>
            <Link className="hover:text-systemBlue" href="/roth-conversion-cpa-questions">CPA questions</Link>
            <Link className="hover:text-systemBlue" href="/site-index">Full site index</Link>
            <Link className="hover:text-systemBlue" href="/launch-readiness">Launch readiness</Link>
            <Link className="hover:text-systemBlue" href="/production-launch">Production launch</Link>
            <Link className="hover:text-systemBlue" href="/seo-monitoring">SEO monitoring</Link>
            <Link className="hover:text-systemBlue" href="/performance-audit">Performance audit</Link>
            <Link className="hover:text-systemBlue" href="/accessibility-audit">Accessibility audit</Link>
            <Link className="hover:text-systemBlue" href="/tax-data-update">Tax data update</Link>
            <Link className="hover:text-systemBlue" href="/ai-compliance-audit">AI compliance audit</Link>
            <Link className="hover:text-systemBlue" href="/content-operations">Content operations</Link>
            <Link className="hover:text-systemBlue" href="/feedback-roadmap">Feedback roadmap</Link>
            <Link className="hover:text-systemBlue" href="/privacy-data-flow">Privacy data flow</Link>
          </div>
        </details>
        <p>{REQUIRED_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
