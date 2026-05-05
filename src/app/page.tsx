"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/common/ui/card";
import {
  loadShareInputFromHash,
  loadStoredCalculatorInput,
  mergeCalculatorInput,
  saveCalculatorInput,
  clearStoredCalculatorInput,
} from "@/common/storage/calculator-persistence";
import { CalculatorInput } from "@/features/calculator-input/CalculatorInput";
import { ResultSummary } from "@/features/result-summary/ResultSummary";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";
import { CalculationBreakdown } from "@/features/calculation-breakdown/CalculationBreakdown";
import { TaxBracketImpact } from "@/features/bracket-impact/TaxBracketImpact";
import { FaqSection, faqItems } from "@/features/faq/FaqSection";
import { ShareResultButton } from "@/features/share-link/ShareResultButton";
import { CopyResultButton } from "@/features/result-copy/CopyResultButton";
import { ScenarioHistoryPanel } from "@/features/scenario-history/ScenarioHistoryPanel";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";
import { TaxDataFreshnessCard } from "@/features/tax-data-freshness/TaxDataFreshnessCard";
import { CalculatorAnalyticsBeacon } from "@/features/analytics/CalculatorAnalyticsBeacon";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { isFeatureEnabled } from "@/core/features/feature-registry";
import { calculatorHowToJsonLd, faqJsonLd, organizationJsonLd, webApplicationJsonLd } from "@/core/seo/json-ld";

const initialInput: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

function LazyPanelFallback() {
  return (
    <div className="min-h-24 animate-pulse rounded-[16px] bg-white/60 p-4 text-sm text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
      Loading module...
    </div>
  );
}

const ProjectionChart = dynamic<{ projection: RothConversionResult["projection"] }>(
  () => import("@/features/charts/ProjectionChart").then((module) => module.ProjectionChart),
  { loading: LazyPanelFallback },
);

const PdfReportButton = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/pdf-report/PdfReportButton").then((module) => module.PdfReportButton),
  { loading: () => null },
);

const AiExplainer = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/ai-assistant/AiExplainer").then((module) => module.AiExplainer),
  { loading: LazyPanelFallback },
);

const ConversionSensitivityTable = dynamic<{ input: RothConversionInput }>(
  () =>
    import("@/features/conversion-sensitivity/ConversionSensitivityTable").then(
      (module) => module.ConversionSensitivityTable,
    ),
  { loading: LazyPanelFallback },
);

const FederalBracketCapacityTable = dynamic<{ input: RothConversionInput }>(
  () =>
    import("@/features/bracket-capacity/FederalBracketCapacityTable").then(
      (module) => module.FederalBracketCapacityTable,
    ),
  { loading: LazyPanelFallback },
);

const MultiYearScheduleTable = dynamic<{ input: RothConversionInput }>(
  () =>
    import("@/features/multi-year-schedule/MultiYearScheduleTable").then(
      (module) => module.MultiYearScheduleTable,
    ),
  { loading: LazyPanelFallback },
);

export default function HomePage() {
  const [input, setInput] = useState<RothConversionInput>(initialInput);
  const result = useMemo(() => calculateRothConversion(input), [input]);

  useEffect(() => {
    const shared = loadShareInputFromHash(window.location.hash);
    const stored = loadStoredCalculatorInput();
    const restored = shared ?? stored;

    if (restored) {
      setInput((current) => mergeCalculatorInput(current, restored));
    }
  }, []);

  useEffect(() => {
    saveCalculatorInput(input);
  }, [input]);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 overflow-x-clip px-4 py-6 sm:px-6 lg:px-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
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
      {isFeatureEnabled("privacy-safe-analytics") ? <CalculatorAnalyticsBeacon input={input} result={result} /> : null}
      <header className="grid w-full min-w-0 max-w-full gap-4 pt-4">
        <nav className="flex w-full min-w-0 flex-col items-start justify-between gap-3 rounded-[18px] bg-white/65 px-4 py-3 text-sm shadow-sm backdrop-blur-xl dark:bg-white/10 sm:flex-row sm:items-center">
          <Link className="shrink-0 font-semibold text-neutral-950 dark:text-white" href="/">
            RothCalc
          </Link>
          <div className="flex w-full min-w-0 flex-none flex-wrap items-center justify-start gap-3 text-neutral-600 dark:text-neutral-300 sm:w-auto sm:flex-1 sm:justify-end">
            <div className="flex min-w-0 max-w-full flex-wrap items-center justify-start gap-3 sm:justify-end">
              <a className="hover:text-systemBlue" href="#calculator">
                Calculator
              </a>
              <Link className="hover:text-systemBlue" href="/methodology">
                Methodology
              </Link>
              <Link className="hover:text-systemBlue" href="/tax-brackets/2026">
                Tax Brackets
              </Link>
              <Link className="hover:text-systemBlue" href="/states">
                States
              </Link>
              <Link className="hover:text-systemBlue" href="/blog">
                Guides
              </Link>
              <a className="hover:text-systemBlue" href="#faq">
                FAQ
              </a>
              <details className="group relative min-w-0 shrink-0">
                <summary className="cursor-pointer list-none rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200">
                  More planning guides
                </summary>
                <div className="left-4 right-4 z-20 mt-3 hidden w-auto grid-cols-2 gap-2 rounded-[18px] border border-neutral-200 bg-white/95 p-4 text-sm shadow-xl backdrop-blur-xl group-open:fixed group-open:grid dark:border-white/10 dark:bg-neutral-950/95 sm:left-auto sm:right-0 sm:w-[min(88vw,560px)] sm:grid-cols-3 sm:group-open:absolute">
                  <Link className="hover:text-systemBlue" href="/calculators">Calculators</Link>
                  <Link className="hover:text-systemBlue" href="/examples">Examples</Link>
                  <Link className="hover:text-systemBlue" href="/glossary">Glossary</Link>
                  <Link className="hover:text-systemBlue" href="/age-scenarios">Age scenarios</Link>
                  <Link className="hover:text-systemBlue" href="/basis">Basis</Link>
                  <Link className="hover:text-systemBlue" href="/multi-year-planning">Multi-year</Link>
                  <Link className="hover:text-systemBlue" href="/filing-status">Filing status</Link>
                  <Link className="hover:text-systemBlue" href="/tax-payment-methods">Tax payment</Link>
                  <Link className="hover:text-systemBlue" href="/tax-interactions">Tax interactions</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-irmaa-guide">IRMAA</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-social-security-tax-guide">Social Security</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-aca-premium-tax-credit-guide">ACA PTC</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-niit-guide">NIIT</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-rmd-guide">RMD</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-5-year-rules">5-year rules</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-capital-gains-guide">Capital gains</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-estimated-tax-guide">Estimated tax</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-recharacterization-guide">Recharacterization</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-qcd-guide">QCD</Link>
                  <Link className="hover:text-systemBlue" href="/cpa-review-checklist">CPA checklist</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-planning-checklist">Planning checklist</Link>
                  <Link className="hover:text-systemBlue" href="/calculator-assumptions-guide">Assumptions</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-mistakes">Mistakes</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-tax-forms">Forms</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-timeline">Timeline</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-custodian-process">Custodian process</Link>
                  <Link className="hover:text-systemBlue" href="/roth-conversion-cpa-questions">CPA questions</Link>
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
                  <Link className="hover:text-systemBlue" href="/site-index">Site index</Link>
                  <Link className="hover:text-systemBlue" href="/about">About</Link>
                </div>
              </details>
            </div>
            {isFeatureEnabled("theme-toggle") ? <ThemeToggle /> : null}
          </div>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">2026 educational estimate</p>
        <div className="grid gap-4 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-normal text-neutral-950 dark:text-white sm:text-5xl">
              Roth Conversion Calculator
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Estimate federal tax, state tax, potential early distribution penalties, break-even years, and Roth vs
              traditional IRA after-tax value. Calculations run locally in your browser.
            </p>
          </div>
          <div className="rounded-[18px] bg-white/65 p-4 text-sm leading-6 text-neutral-600 shadow-sm dark:bg-white/10 dark:text-neutral-300">
            Tax year: <strong>2026</strong>. Federal brackets are based on IRS tax inflation adjustments. State tax,
            future returns, and retirement tax rates are user assumptions.
          </div>
        </div>
        {isFeatureEnabled("tax-data-freshness") ? <TaxDataFreshnessCard compact /> : null}
      </header>

      <section className="grid w-full min-w-0 max-w-full gap-5 lg:grid-cols-2" aria-label="Trust and calculation methodology">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">E-E-A-T reference base</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">Official sources reviewed</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This calculator is maintained as an educational estimate for tax year 2026. The federal bracket data and
            IRA rule explanations are mapped to official IRS materials, with the page reviewed for clarity and
            limitations before publication.
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026"
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

        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Calculator transparency</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">Transparent calculation method</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The calculator shows the assumptions behind the estimate so users can review the math with a CPA or tax
            professional instead of treating the output as personal advice.
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
      </section>

      <section className="grid w-full min-w-0 max-w-full gap-5 lg:grid-cols-[0.95fr_1.05fr]" id="calculator">
        <Card>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Inputs</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Adjust any parameter. Results update instantly.
            </p>
          </div>
          <CalculatorInput onChange={setInput} value={input} />
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Results</h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  High-confidence federal estimate with user-estimated state and future assumptions.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isFeatureEnabled("copy-summary") ? <CopyResultButton input={input} result={result} /> : null}
                <ShareResultButton input={input} />
                <PdfReportButton input={input} result={result} />
                <button
                  className="min-h-11 rounded-[14px] px-4 py-2 text-sm font-semibold text-systemRed transition hover:bg-red-50 dark:hover:bg-white/10"
                  onClick={() => {
                    clearStoredCalculatorInput();
                    setInput(initialInput);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
            <ResultSummary result={result} />
            {isFeatureEnabled("scenario-history") ? (
              <div className="mt-5">
                <ScenarioHistoryPanel input={input} onRestore={setInput} />
              </div>
            ) : null}
          </Card>
          <Card>
            <h2 className="mb-4 text-2xl font-bold text-neutral-950 dark:text-white">Projection</h2>
            <ProjectionChart projection={result.projection} />
          </Card>
          <Card>
            <CalculationBreakdown input={input} result={result} />
          </Card>
          <Card>
            <TaxBracketImpact result={result} />
          </Card>
          {isFeatureEnabled("conversion-sensitivity") ? (
            <Card>
              <ConversionSensitivityTable input={input} />
            </Card>
          ) : null}
          {isFeatureEnabled("bracket-capacity") ? (
            <Card>
              <FederalBracketCapacityTable input={input} />
            </Card>
          ) : null}
          {isFeatureEnabled("multi-year-schedule") ? (
            <Card>
              <MultiYearScheduleTable input={input} />
            </Card>
          ) : null}
          <TaxImpactWarnings />
        </div>
      </section>

      {isFeatureEnabled("ai-explainer") ? <AiExplainer input={input} result={result} /> : null}
      <FaqSection />

      <footer className="w-full min-w-0 border-t border-neutral-200 py-6 text-xs leading-5 text-neutral-500 dark:border-white/10 dark:text-neutral-400">
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
        <p>{REQUIRED_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
