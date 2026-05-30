import Link from "next/link";
import { AlertTriangle, CircleHelp } from "lucide-react";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

export function TaxImpactWarnings({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const reviewItems = buildTaxImpactReviewItems(input, result);
  const triggeredCount = reviewItems.filter((item) => item.level === "input_triggered_review").length;

  return (
    <aside
      aria-label="Tax impact warnings"
      className="rounded-[16px] bg-orange-50/80 p-4 text-sm text-neutral-800 shadow-sm ring-1 ring-orange-400/25 dark:bg-orange-400/10 dark:text-neutral-100"
      data-testid="tax-impact-warnings"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-systemOrange">Review before planning</p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-neutral-950 dark:text-white">Tax Impact Warnings</h3>
        <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-systemOrange shadow-sm dark:bg-white/10">
          {triggeredCount} input-triggered review items
        </span>
      </div>
      <p className="mt-2 leading-6">
        A Roth conversion can increase current-year taxable income. These items are outside this calculator&apos;s current
        calculation scope; the labels below use your inputs only to prioritize review.
      </p>
      <ul className="mt-3 grid gap-2">
        {reviewItems.map((item) => (
          <li className="rounded-[12px] bg-white/65 p-3 shadow-sm dark:bg-white/10" key={item.id}>
            <div className="flex flex-wrap items-center gap-2">
              {item.level === "input_triggered_review" ? (
                <AlertTriangle aria-hidden="true" className="text-systemOrange" size={16} />
              ) : (
                <CircleHelp aria-hidden="true" className="text-neutral-500 dark:text-neutral-300" size={16} />
              )}
              <span className="font-semibold text-neutral-950 dark:text-white">{item.label}</span>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-800 dark:bg-orange-400/15 dark:text-orange-200">
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
