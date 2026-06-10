"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card } from "@/common/ui/card";
import {
  loadShareInputFromHash,
  loadStoredCalculatorInput,
  mergeCalculatorInput,
  saveCalculatorInput,
  clearStoredCalculatorInput,
} from "@/common/storage/calculator-persistence";
import { CalculatorInput } from "@/features/calculator-input/CalculatorInput";
import { ResultScopeBadges } from "@/features/result-scope/ResultScopeBadges";
import { ResultSummary } from "@/features/result-summary/ResultSummary";
import { ResultInputValidationNotice } from "@/features/result-validation/ResultInputValidationNotice";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";
import { TaxPaymentComparison } from "@/features/tax-payment-comparison/TaxPaymentComparison";
import { ShareResultButton } from "@/features/share-link/ShareResultButton";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { validateCalculatorInput } from "@/core/calculator/validation";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { isFeatureEnabled } from "@/core/features/feature-registry";

const initialInput: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  netInvestmentIncome: null,
  annualSocialSecurityBenefits: null,
  taxExemptInterest: null,
  annualAdvancePremiumTaxCredit: null,
  marketplaceCoverageMonths: null,
  amtTentativeMinimumTax: null,
  amtRegularTaxLiability: null,
  selectedState: null,
  stateReadinessInputs: undefined,
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

function LazyPanelFallback({ className = "min-h-24", label = "Loading module..." }: { className?: string; label?: string }) {
  return (
    <div className={`${className} rounded border border-neutral-200 bg-white p-4 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400`}>
      {label}
    </div>
  );
}

function LazyActionButtonFallback({ label }: { label: string }) {
  return (
    <button
      className="inline-flex min-h-11 w-full items-center justify-center rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-400 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-500"
      disabled
      type="button"
    >
      {label}
    </button>
  );
}

const ProjectionChart = dynamic<{ projection: RothConversionResult["projection"] }>(
  () => import("@/features/charts/ProjectionChart").then((module) => module.ProjectionChart),
  { loading: () => <LazyPanelFallback className="min-h-[17rem]" label="Loading projection..." /> },
);

const PdfReportButton = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/pdf-report/PdfReportButton").then((module) => module.PdfReportButton),
  { loading: () => <LazyActionButtonFallback label="Loading report..." /> },
);

const CopyProfessionalHandoffButton = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () =>
    import("@/features/professional-handoff/CopyProfessionalHandoffButton").then(
      (module) => module.CopyProfessionalHandoffButton,
    ),
  { loading: () => <LazyActionButtonFallback label="Loading CPA packet..." /> },
);

const EmailReportButton = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/email-report/EmailReportButton").then((module) => module.EmailReportButton),
  { loading: () => <LazyActionButtonFallback label="Loading email draft..." /> },
);

const AiExplainer = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/ai-assistant/AiExplainer").then((module) => module.AiExplainer),
  { loading: () => <LazyPanelFallback className="min-h-[24rem]" label="Loading explanation assistant..." /> },
);

const CalculationBreakdown = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/calculation-breakdown/CalculationBreakdown").then((module) => module.CalculationBreakdown),
  { loading: () => <LazyPanelFallback className="min-h-[18rem]" label="Loading calculation details..." /> },
);

const CalculatorAnalyticsBeacon = dynamic<{ input: RothConversionInput; result: RothConversionResult }>(
  () => import("@/features/analytics/CalculatorAnalyticsBeacon").then((module) => module.CalculatorAnalyticsBeacon),
  { loading: () => null, ssr: false },
);

const ScenarioHistoryPanel = dynamic<{
  input: RothConversionInput;
  onRestore: (input: RothConversionInput) => void;
}>(
  () => import("@/features/scenario-history/ScenarioHistoryPanel").then((module) => module.ScenarioHistoryPanel),
  { loading: () => <LazyPanelFallback className="min-h-[12rem]" label="Loading saved scenarios..." /> },
);

export function HomeCalculatorClient() {
  const [input, setInput] = useState<RothConversionInput>(initialInput);
  const [hasLoadedPersistedInput, setHasLoadedPersistedInput] = useState(false);
  const result = useMemo(() => calculateRothConversion(input), [input]);
  const inputErrors = useMemo(() => validateCalculatorInput(input), [input]);
  const hasInputErrors = Object.keys(inputErrors).length > 0;

  useEffect(() => {
    const shared = loadShareInputFromHash(window.location.hash);
    const stored = loadStoredCalculatorInput();
    const restored = shared ?? stored;

    if (restored) {
      setInput((current) => mergeCalculatorInput(current, restored));
    }

    setHasLoadedPersistedInput(true);
  }, []);

  useEffect(() => {
    if (hasLoadedPersistedInput) {
      saveCalculatorInput(input);
    }
  }, [hasLoadedPersistedInput, input]);

  return (
    <>
      {isFeatureEnabled("privacy-safe-analytics") ? <CalculatorAnalyticsBeacon input={input} result={result} /> : null}
      <section
        aria-label="Roth conversion calculator"
        className="grid w-full min-w-0 max-w-full gap-5 lg:grid-cols-5"
        id="calculator"
      >
        <section aria-labelledby="calculator-inputs-heading" className="lg:col-span-2">
          <Card>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white" id="calculator-inputs-heading">Inputs</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              Adjust any parameter. Results update instantly.
            </p>
          </div>
          <CalculatorInput onChange={setInput} value={input} />
          </Card>
        </section>

        <article aria-label="Roth conversion estimate results" className="grid gap-5 lg:col-span-3">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white" id="calculator-results-heading">Results</h2>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  High-confidence federal estimate with user-estimated state and future assumptions.
                </p>
              </div>
            </div>
            {isFeatureEnabled("result-scope-boundary") ? <ResultScopeBadges taxYear={input.taxYear} /> : null}
            {hasInputErrors ? <ResultInputValidationNotice errors={inputErrors} /> : <ResultSummary result={result} />}
            <div
              aria-label="Result actions"
              className="mt-4 grid w-full min-w-0 grid-cols-2 gap-2 md:grid-cols-5 [&>button]:w-full"
            >
              {!hasInputErrors && isFeatureEnabled("share-link") ? <ShareResultButton input={input} /> : null}
              {!hasInputErrors && isFeatureEnabled("pdf-report") ? <PdfReportButton input={input} result={result} /> : null}
              {!hasInputErrors && isFeatureEnabled("email-report") ? <EmailReportButton input={input} result={result} /> : null}
              {!hasInputErrors && isFeatureEnabled("professional-handoff") ? (
                <CopyProfessionalHandoffButton input={input} result={result} />
              ) : null}
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-systemRed transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-systemRed focus:ring-offset-2 dark:border-white/10 dark:bg-neutral-950 dark:hover:bg-neutral-900 dark:focus:ring-offset-neutral-950"
                onClick={() => {
                  clearStoredCalculatorInput();
                  setInput(initialInput);
                  window.history.replaceState(null, "", window.location.pathname);
                }}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={16} />
                Reset
              </button>
            </div>
            {!hasInputErrors && isFeatureEnabled("tax-impact-warnings-boundary") ? (
              <div className="mt-4">
                <TaxImpactWarnings input={input} result={result} />
              </div>
            ) : null}
            {!hasInputErrors && isFeatureEnabled("tax-payment-comparison") ? (
              <div className="mt-4">
                <TaxPaymentComparison input={input} result={result} />
              </div>
            ) : null}
          </Card>
          {!hasInputErrors && isFeatureEnabled("ai-explainer") ? (
            <div id="ai-explainer">
              <AiExplainer input={input} result={result} />
            </div>
          ) : null}
          {!hasInputErrors && isFeatureEnabled("projection-chart") ? (
            <Card>
              <h2 className="mb-4 text-2xl font-bold text-neutral-950 dark:text-white">Projection</h2>
              <ProjectionChart projection={result.projection} />
            </Card>
          ) : null}
          {!hasInputErrors && isFeatureEnabled("calculation-breakdown") ? (
            <details className="rounded border border-neutral-200 bg-white p-6 shadow-none dark:border-white/10 dark:bg-neutral-950">
              <summary className="cursor-pointer text-base font-semibold text-neutral-950 dark:text-white">
                Advanced calculation details
              </summary>
              <div className="mt-5">
                <CalculationBreakdown input={input} result={result} />
              </div>
            </details>
          ) : null}
          {!hasInputErrors && isFeatureEnabled("scenario-history") ? (
            <ScenarioHistoryPanel input={input} onRestore={setInput} />
          ) : null}
        </article>
      </section>
    </>
  );
}
