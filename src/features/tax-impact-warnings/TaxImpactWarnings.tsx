import Link from "next/link";
import { AlertTriangle, CircleHelp } from "lucide-react";
import { formatCurrencyWithCents } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

export function TaxImpactWarnings({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const reviewItems = buildTaxImpactReviewItems(input, result);
  const triggeredCount = reviewItems.filter((item) => item.level === "input_triggered_review").length;
  const irmaaPrep = buildIrmaaReviewPrep(input, result);
  const acaPrep = buildAcaPremiumTaxCreditReviewPrep(input, result);

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
            Amount not estimated
          </span>
        </div>
        <p className="mt-2">{acaPrep.summary}</p>
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
