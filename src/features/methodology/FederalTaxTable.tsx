import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";
import type { FilingStatus } from "@/core/calculator/types";
import { formatCurrency, formatPercent } from "@/common/format/currency";

const labels: Record<FilingStatus, string> = {
  single: "Single",
  married_joint: "Married filing jointly",
  married_separate: "Married filing separately",
  head_of_household: "Head of household",
};

export function FederalTaxTable() {
  return (
    <section className="mt-8 grid gap-4">
      <h2 className="text-2xl font-bold">2026 Federal Tax Brackets Used</h2>
      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        The calculator uses a progressive tax delta method. These brackets are included so users can verify the tax-year
        assumptions.
      </p>
      <div className="grid gap-4">
        {(Object.keys(FEDERAL_TAX_BRACKETS_2026) as FilingStatus[]).map((status) => (
          <div className="overflow-hidden rounded-[16px] bg-white/70 dark:bg-white/10" key={status}>
            <h3 className="border-b border-neutral-200 px-4 py-3 font-semibold dark:border-white/10">{labels[status]}</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">From</th>
                    <th className="px-4 py-3">To</th>
                    <th className="px-4 py-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {FEDERAL_TAX_BRACKETS_2026[status].map((bracket) => (
                    <tr className="border-t border-neutral-100 dark:border-white/10" key={`${status}-${bracket.min}`}>
                      <td className="px-4 py-3">{formatCurrency(bracket.min)}</td>
                      <td className="px-4 py-3">{bracket.max === null ? "No limit" : formatCurrency(bracket.max)}</td>
                      <td className="px-4 py-3">{formatPercent(bracket.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
