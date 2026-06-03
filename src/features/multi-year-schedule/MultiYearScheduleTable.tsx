import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildMultiYearConversionScheduleRows } from "@/features/multi-year-schedule/multi-year-schedule";

export function MultiYearScheduleTable({ input }: { input: RothConversionInput }) {
  const rows = buildMultiYearConversionScheduleRows(input);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Multi-year conversion schedule</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Compares equal annual splits for the conversion amount you entered. This is an educational cash-flow view, not
          a recommendation to convert in any specific year or amount.
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Schedule</th>
              <th className="px-4 py-3 font-semibold">Annual conversion</th>
              <th className="px-4 py-3 font-semibold">Total converted</th>
              <th className="px-4 py-3 font-semibold">Federal tax</th>
              <th className="px-4 py-3 font-semibold">State tax</th>
              <th className="px-4 py-3 font-semibold">Penalty</th>
              <th className="px-4 py-3 font-semibold">Total cost</th>
              <th className="px-4 py-3 font-semibold">Highest fed bracket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
            {rows.map((row) => (
              <tr className={row.years === 1 ? "bg-blue-500/10" : ""} key={row.years}>
                <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">
                  {row.years === 1 ? "Lump sum" : `${row.years} years`}
                </td>
                <td className="px-4 py-3">{formatCurrency(row.annualConversionAmount)}</td>
                <td className="px-4 py-3">{formatCurrency(row.totalConverted)}</td>
                <td className="px-4 py-3">{formatCurrency(row.totalFederalTax)}</td>
                <td className="px-4 py-3">{formatCurrency(row.totalStateTax)}</td>
                <td className="px-4 py-3">{formatCurrency(row.totalPenalty)}</td>
                <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">
                  {formatCurrency(row.totalUpfrontCost)}
                </td>
                <td className="px-4 py-3">{formatPercent(row.highestFederalRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
        Assumes today&apos;s filing status, taxable income, state rate, and 2026 federal brackets repeat for each modeled
        year. Annual age increments are applied only for early-distribution penalty modeling.
      </p>
    </section>
  );
}
