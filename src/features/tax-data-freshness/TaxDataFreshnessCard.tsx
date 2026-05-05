import { CheckCircle2 } from "lucide-react";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

export function TaxDataFreshnessCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-[18px] border border-blue-500/15 bg-blue-500/10 p-4 text-sm leading-6 text-neutral-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-neutral-200">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-systemBlue" size={18} />
        <div>
          <h2 className={compact ? "text-sm font-semibold text-neutral-950 dark:text-white" : "text-xl font-bold text-neutral-950 dark:text-white"}>
            Tax data freshness
          </h2>
          <p className="mt-1">
            Tax year <strong>{TAX_DATA_FRESHNESS.taxYear}</strong>, reviewed {TAX_DATA_FRESHNESS.reviewedMonth}.{" "}
            {TAX_DATA_FRESHNESS.scope}
          </p>
          {!compact ? (
            <p className="mt-2">
              Source basis: {TAX_DATA_FRESHNESS.sourceLabel}. {TAX_DATA_FRESHNESS.updateWindow}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
            Not modeled: {TAX_DATA_FRESHNESS.excludedInteractions.join(", ")}.
          </p>
        </div>
      </div>
    </section>
  );
}
