import Link from "next/link";
import { HomeCalculatorClient } from "@/app/HomeCalculatorClient";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { isFeatureEnabled } from "@/core/features/feature-registry";
import {
  calculatorHowToJsonLd,
  homepageWebPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/core/seo/json-ld";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 overflow-x-clip px-4 py-4 sm:px-6 lg:px-8">
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
      <header className="grid w-full min-w-0 max-w-full gap-4 pt-2">
        <nav
          aria-label="Primary navigation"
          className="flex w-full min-w-0 flex-col items-start justify-between gap-3 rounded border border-neutral-200 bg-white px-4 py-3 text-sm shadow-none dark:border-white/10 dark:bg-neutral-950 sm:flex-row sm:items-center"
        >
          <Link className="shrink-0 font-semibold text-neutral-950 dark:text-white" href="/">
            RothCalc
          </Link>
          <div className="flex w-full min-w-0 flex-none flex-wrap items-center justify-start gap-3 text-neutral-600 dark:text-neutral-300 sm:w-auto sm:flex-1 sm:justify-end">
            {isFeatureEnabled("theme-toggle") ? <ThemeToggle /> : null}
          </div>
        </nav>
        <h1 className="text-2xl font-bold tracking-normal text-neutral-950 dark:text-white sm:text-3xl">
          Roth Conversion Calculator 2026
        </h1>
      </header>

      <HomeCalculatorClient />

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
        <details className="mb-4 rounded border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
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
