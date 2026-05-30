import Link from "next/link";
import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

export function TaxDataFreshnessCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-[18px] border border-blue-500/15 bg-blue-500/10 p-4 text-sm leading-6 text-neutral-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-neutral-200">
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-systemBlue" size={18} />
        <div className="min-w-0">
          <h2 className={compact ? "text-sm font-semibold text-neutral-950 dark:text-white" : "text-xl font-bold text-neutral-950 dark:text-white"}>
            Tax data freshness
          </h2>
          <p className="mt-1">
            Tax year <strong>{TAX_DATA_FRESHNESS.taxYear}</strong>, updated {TAX_DATA_FRESHNESS.lastUpdated}.{" "}
            {TAX_DATA_FRESHNESS.scope}
          </p>
          <p className="mt-2 inline-flex max-w-full items-start gap-2 rounded-[10px] bg-white/65 px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm dark:bg-white/10 dark:text-neutral-200">
            <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-systemBlue" size={14} />
            <span>{TAX_DATA_FRESHNESS.professionalReviewStatus}</span>
          </p>
          {!compact ? (
            <div className="mt-3 grid gap-2">
              <p>
                Source basis: {TAX_DATA_FRESHNESS.sourceLabel}. {TAX_DATA_FRESHNESS.updateWindow}
              </p>
              <div className="flex flex-wrap gap-2">
                {TAX_DATA_FRESHNESS.sourceUrls.map((source) => (
                  <a
                    className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-systemBlue shadow-sm hover:text-blue-700 dark:bg-white/10 dark:hover:text-blue-300"
                    href={source.url}
                    key={source.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {source.label}
                    <ExternalLink aria-hidden="true" size={12} />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">
            Not modeled: {TAX_DATA_FRESHNESS.excludedInteractions.join(", ")}.
          </p>
          <Link className="mt-2 inline-flex text-xs font-semibold text-systemBlue hover:text-blue-700 dark:hover:text-blue-300" href="/tax-data-update">
            Review the tax data update playbook
          </Link>
        </div>
      </div>
    </section>
  );
}
