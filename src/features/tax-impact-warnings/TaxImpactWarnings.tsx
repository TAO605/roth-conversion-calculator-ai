import Link from "next/link";
import { AlertTriangle, CircleHelp } from "lucide-react";
import { formatCurrency, formatCurrencyWithCents, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildAmtReviewPrep } from "@/features/tax-impact-warnings/amt-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildRmdReviewPrep } from "@/features/tax-impact-warnings/rmd-review-prep";
import { buildStateRulesReviewPrep } from "@/features/tax-impact-warnings/state-rules-review-prep";
import { buildSocialSecurityTaxationReviewPrep } from "@/features/tax-impact-warnings/social-security-review-prep";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

export function TaxImpactWarnings({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const reviewItems = buildTaxImpactReviewItems(input, result);
  const triggeredCount = reviewItems.filter((item) => item.level === "input_triggered_review").length;
  const irmaaPrep = buildIrmaaReviewPrep(input, result);
  const acaPrep = buildAcaPremiumTaxCreditReviewPrep(input, result);
  const socialSecurityPrep = buildSocialSecurityTaxationReviewPrep(input, result);
  const niitPrep = buildNiitReviewPrep(input, result);
  const rmdPrep = buildRmdReviewPrep(input);
  const amtPrep = buildAmtReviewPrep(input, result);
  const stateRulesPrep = buildStateRulesReviewPrep(input, result);

  return (
    <aside
      aria-label="Tax impact warnings"
      className="rounded border border-orange-200 bg-white p-4 text-sm text-neutral-800 shadow-none dark:border-orange-400/30 dark:bg-neutral-950 dark:text-neutral-100"
      data-testid="tax-impact-warnings"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-systemOrange">Review before planning</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-950 dark:text-white">Tax Impact Warnings</h3>
        <span className="rounded border border-orange-200 bg-white px-3 py-1 text-xs font-semibold text-systemOrange shadow-none dark:border-orange-400/30 dark:bg-neutral-950">
          {triggeredCount} input-triggered review items
        </span>
      </div>
      <p className="mt-2 leading-6">
        A Roth conversion can increase current-year taxable income. These items are outside this calculator&apos;s current
        calculation scope; the labels below use your inputs only to prioritize review.
      </p>
      <section className="mt-3 rounded border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-neutral-700 dark:border-blue-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{irmaaPrep.title}</h4>
          <span className="rounded border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-systemBlue dark:border-blue-400/30 dark:bg-neutral-950">
            {irmaaPrep.premiumYear} review
          </span>
        </div>
        <p className="mt-2">{irmaaPrep.summary}</p>
        <p className="mt-2">
          Usual lookback tax year: <strong>{irmaaPrep.usualLookbackTaxYear}</strong>. {irmaaPrep.thresholdLabel}
        </p>
        <div className="mt-2 rounded border border-blue-100 bg-white p-3 dark:border-blue-400/30 dark:bg-neutral-950">
          <p className="font-semibold text-neutral-950 dark:text-white">2026 Part B proxy preview</p>
          <p className="mt-1">
            Using the calculator income proxy, the CMS 2026 full Part B table maps this scenario to{" "}
            <strong>{formatCurrencyWithCents(irmaaPrep.partBEstimate.totalMonthlyPremium)}</strong> per month, including{" "}
            <strong>{formatCurrencyWithCents(irmaaPrep.partBEstimate.monthlyAdjustmentAmount)}</strong> of IRMAA
            adjustment.
          </p>
          <p className="mt-1">{irmaaPrep.partBEstimate.bracketLabel}.</p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
            {irmaaPrep.partBEstimate.boundaryNote}
          </p>
        </div>
        <div className="mt-2 rounded border border-blue-100 bg-white p-3 dark:border-blue-400/30 dark:bg-neutral-950">
          <p className="font-semibold text-neutral-950 dark:text-white">2026 Part D IRMAA proxy preview</p>
          <p className="mt-1">
            Using the same calculator income proxy, the CMS 2026 Part D table maps this scenario to{" "}
            <strong>{formatCurrencyWithCents(irmaaPrep.partDEstimate.monthlyAdjustmentAmount)}</strong> per month of
            Part D IRMAA adjustment.
          </p>
          <p className="mt-1">{irmaaPrep.partDEstimate.bracketLabel}.</p>
          <p className="mt-1 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
            {irmaaPrep.partDEstimate.boundaryNote}
          </p>
        </div>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">Inputs still needed before amount review:</span>
          <ul className="list-disc space-y-1 pl-4">
            {irmaaPrep.missingInputs.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {irmaaPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-neutral-700 dark:border-emerald-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{acaPrep.title}</h4>
          <span className="rounded border border-emerald-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-neutral-950 dark:text-emerald-200">
            {acaPrep.amountEstimateStatus === "aptc_at_stake_preview_available"
              ? "APTC at-stake preview"
              : "Needs Marketplace inputs"}
          </span>
        </div>
        <p className="mt-2">{acaPrep.summary}</p>
        {acaPrep.amountEstimateStatus === "aptc_at_stake_preview_available" ? (
          <p className="mt-2">
            User-entered annual APTC:{" "}
            <strong>{formatCurrency(acaPrep.annualAdvancePremiumTaxCreditInput ?? 0)}</strong>.
            Coverage months: <strong>{acaPrep.marketplaceCoverageMonthsInput ?? 0}</strong>. Monthly APTC preview:{" "}
            <strong>{formatCurrency(acaPrep.monthlyAdvancePremiumTaxCreditPreview ?? 0)}</strong>.
          </p>
        ) : null}
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">{acaPrep.boundaryNote}</p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before subsidy amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {acaPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {acaPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-violet-100 bg-violet-50 p-3 text-xs leading-5 text-neutral-700 dark:border-violet-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{socialSecurityPrep.title}</h4>
          <span className="rounded border border-violet-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-violet-800 dark:border-violet-400/30 dark:bg-neutral-950 dark:text-violet-200">
            {socialSecurityPrep.amountEstimateStatus === "bounded_estimate_available"
              ? "Bounded preview"
              : "Needs benefit inputs"}
          </span>
        </div>
        <p className="mt-2">{socialSecurityPrep.summary}</p>
        {socialSecurityPrep.amountEstimateStatus === "bounded_estimate_available" ? (
          <p className="mt-2">
            Annual Social Security benefits:{" "}
            <strong>{formatCurrency(socialSecurityPrep.annualSocialSecurityBenefitsInput ?? 0)}</strong>.
            Combined-income proxy:{" "}
            <strong>{formatCurrency(socialSecurityPrep.combinedIncomeProxyAfterConversion ?? 0)}</strong>.
            Taxable-benefit preview:{" "}
            <strong>{formatCurrency(socialSecurityPrep.taxableBenefitPreview ?? 0)}</strong>.
          </p>
        ) : null}
        <p className="mt-2">{socialSecurityPrep.thresholdNote}</p>
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
          {socialSecurityPrep.boundaryNote}
        </p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before taxable-benefit amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {socialSecurityPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {socialSecurityPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-neutral-700 dark:border-sky-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{niitPrep.title}</h4>
          <span className="rounded border border-sky-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-sky-800 dark:border-sky-400/30 dark:bg-neutral-950 dark:text-sky-200">
            {niitPrep.amountEstimateStatus === "bounded_estimate_available" ? "Bounded preview" : "Needs NII input"}
          </span>
        </div>
        <p className="mt-2">{niitPrep.summary}</p>
        {niitPrep.amountEstimateStatus === "bounded_estimate_available" ? (
          <p className="mt-2">
            User-entered net investment income: <strong>{formatCurrency(niitPrep.netInvestmentIncomeInput ?? 0)}</strong>.
            NIIT exposure base: <strong>{formatCurrency(niitPrep.niitExposureBase ?? 0)}</strong>. Bounded 3.8%
            preview: <strong>{formatCurrency(niitPrep.boundedNiitEstimate ?? 0)}</strong>.
          </p>
        ) : null}
        <p className="mt-2">{niitPrep.formulaNote}</p>
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">{niitPrep.boundaryNote}</p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before NIIT amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {niitPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {niitPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-neutral-700 dark:border-amber-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{rmdPrep.title}</h4>
          <span className="rounded border border-amber-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-400/30 dark:bg-neutral-950 dark:text-amber-200">
            {rmdPrep.previewStatus === "preview_available" ? "Bounded preview" : "Review only"}
          </span>
        </div>
        <p className="mt-2">{rmdPrep.summary}</p>
        {rmdPrep.annualRmdPreview !== null && rmdPrep.uniformLifetimeDistributionPeriod !== null ? (
          <p className="mt-2">
            Distribution period: <strong>{rmdPrep.uniformLifetimeDistributionPeriod.toFixed(1)}</strong>. Annual RMD
            preview: <strong>{formatCurrencyWithCents(rmdPrep.annualRmdPreview)}</strong>.
          </p>
        ) : null}
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">{rmdPrep.boundaryNote}</p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before required amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {rmdPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {rmdPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-neutral-200 bg-neutral-50 p-3 text-xs leading-5 text-neutral-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{amtPrep.title}</h4>
          <span className="rounded border border-neutral-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-neutral-800 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200">
            {amtPrep.amountEstimateStatus === "amt_exposure_preview_available" ? "Exposure preview" : "Needs Form 6251 inputs"}
          </span>
        </div>
        <p className="mt-2">{amtPrep.summary}</p>
        {amtPrep.amountEstimateStatus === "amt_exposure_preview_available" ? (
          <p className="mt-2">
            Tentative minimum tax: <strong>{formatCurrency(amtPrep.tentativeMinimumTaxInput ?? 0)}</strong>. Regular
            tax liability: <strong>{formatCurrency(amtPrep.regularTaxLiabilityInput ?? 0)}</strong>. AMT exposure
            preview: <strong>{formatCurrency(amtPrep.amtExposurePreview ?? 0)}</strong>.
          </p>
        ) : null}
        <p className="mt-2">{amtPrep.formulaNote}</p>
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">{amtPrep.boundaryNote}</p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before AMT amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {amtPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {amtPrep.officialReferences.map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <section className="mt-3 rounded border border-lime-100 bg-lime-50 p-3 text-xs leading-5 text-neutral-700 dark:border-lime-400/30 dark:bg-neutral-950 dark:text-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-950 dark:text-white">{stateRulesPrep.title}</h4>
          <span className="rounded border border-lime-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-lime-800 dark:border-lime-400/30 dark:bg-neutral-950 dark:text-lime-200">
            Manual-rate estimate
          </span>
        </div>
        <p className="mt-2">{stateRulesPrep.summary}</p>
        <p className="mt-2">
          Selected state example:{" "}
          <strong>
            {stateRulesPrep.selectedState === null
              ? "None"
              : `${stateRulesPrep.selectedState.name} (${stateRulesPrep.selectedState.code})`}
          </strong>
          . Rule status: <strong>{stateRulesPrep.stateRuleStatusLabel}</strong>. Manual rate:{" "}
          <strong>{formatPercent(stateRulesPrep.manualStateRate)}</strong>. Modeled state tax from that rate:{" "}
          <strong>{formatCurrency(stateRulesPrep.modeledStateTaxFromManualRate)}</strong>.
        </p>
        {stateRulesPrep.reviewedStateTaxEstimate === null ? null : (
          <p className="mt-2">
            Reviewed state tax estimate:{" "}
            <strong>{formatCurrency(stateRulesPrep.reviewedStateTaxEstimate)}</strong>. Difference from manual-rate
            estimate: <strong>{formatCurrency(stateRulesPrep.reviewedVsManualStateTaxDifference ?? 0)}</strong>.
          </p>
        )}
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
          State rule registry boundary: {stateRulesPrep.stateRuleBoundaryNote}
        </p>
        {stateRulesPrep.selectedStateAmountReadiness === null ? null : (
          <div className="mt-2 rounded border border-lime-200 bg-white p-3 dark:border-lime-400/30 dark:bg-neutral-950">
            <p className="font-semibold text-neutral-950 dark:text-white">
              {stateRulesPrep.selectedStateAmountReadiness.worksheetTitle}
            </p>
            <p className="mt-1">{stateRulesPrep.selectedStateAmountReadiness.summary}</p>
            <div className="mt-2 grid gap-1">
              <span className="font-semibold text-neutral-950 dark:text-white">Official source checklist:</span>
              <ul className="list-disc space-y-1 pl-4">
                {stateRulesPrep.selectedStateAmountReadiness.officialChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 grid gap-1">
              <span className="font-semibold text-neutral-950 dark:text-white">
                Inputs needed before selected-state amount review:
              </span>
              <ul className="list-disc space-y-1 pl-4">
                {stateRulesPrep.selectedStateAmountReadiness.missingInputs.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2 grid gap-1">
              <span className="font-semibold text-neutral-950 dark:text-white">
                User-provided readiness fields:
              </span>
              <p>
                {stateRulesPrep.userStateReadinessInputs.summary} Status:{" "}
                {stateRulesPrep.userStateReadinessInputs.statusLabel}.
              </p>
              <p>
                Completeness score: {stateRulesPrep.userStateReadinessInputs.scorePercent}%.
              </p>
              <p>{stateRulesPrep.userStateReadinessInputs.nextReviewStep}</p>
              {stateRulesPrep.userStateReadinessInputs.missingFields.length > 0 ? (
                <p>
                  Missing readiness fields: {stateRulesPrep.userStateReadinessInputs.missingFields.join(", ")}.
                </p>
              ) : (
                <p>
                  Provided readiness fields: {stateRulesPrep.userStateReadinessInputs.providedFields.join(", ")}.
                </p>
              )}
              <p className="text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
                This is a document-readiness score only, not a state-law amount calculation.
              </p>
              <ul className="list-disc space-y-1 pl-4">
                {stateRulesPrep.userStateReadinessInputs.rows.map((row) => (
                  <li key={row.label}>
                    {row.label}: {row.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <p className="mt-2 text-[11px] leading-5 text-neutral-600 dark:text-neutral-300">
          {stateRulesPrep.boundaryNote}
        </p>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Supported state example pages, not full rules:
          </span>
          <p>
            {stateRulesPrep.supportedStateExamples
              .map(
                (state) =>
                  `${state.name} (${formatPercent(state.exampleRate)}, ${state.ruleStatusLabel}${
                    state.hasAmountReadinessWorksheet ? ", worksheet ready" : ""
                  })`,
              )
              .join(", ")}
          </p>
        </div>
        <div className="mt-2 grid gap-1">
          <span className="font-semibold text-neutral-950 dark:text-white">
            Inputs needed before state-specific amount review:
          </span>
          <ul className="list-disc space-y-1 pl-4">
            {stateRulesPrep.missingInputs.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          {[
            ...stateRulesPrep.officialReferences.slice(0, 4),
            ...(stateRulesPrep.selectedStateAmountReadiness?.officialReferences ?? []),
          ].map((reference) => (
            <a
              className="font-semibold text-systemBlue hover:text-blue-700"
              href={reference.href}
              key={reference.href}
              rel="noreferrer"
              target="_blank"
            >
              {reference.label}
            </a>
          ))}
        </div>
      </section>
      <ul className="mt-3 grid gap-2">
        {reviewItems.map((item) => (
          <li className="rounded border border-neutral-200 bg-white p-3 shadow-none dark:border-white/10 dark:bg-neutral-950" key={item.id}>
            <div className="flex flex-wrap items-center gap-2">
              {item.level === "input_triggered_review" ? (
                <AlertTriangle aria-hidden="true" className="text-systemOrange" size={16} />
              ) : (
                <CircleHelp aria-hidden="true" className="text-neutral-500 dark:text-neutral-300" size={16} />
              )}
              <span className="font-semibold text-neutral-950 dark:text-white">{item.label}</span>
              <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-800 dark:border-orange-400/30 dark:bg-neutral-950 dark:text-orange-200">
                {item.level === "input_triggered_review" ? "Input-triggered review" : "Review item"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">{item.reason}</p>
            <Link className="mt-2 inline-flex text-xs font-semibold text-systemBlue hover:text-blue-700" href={item.guideHref}>
              Open guide
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
