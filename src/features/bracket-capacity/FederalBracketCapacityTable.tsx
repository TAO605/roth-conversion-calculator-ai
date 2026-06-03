import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildFederalBracketCapacityRows } from "@/features/bracket-capacity/bracket-capacity";

export function FederalBracketCapacityTable({ input }: { input: RothConversionInput }) {
  const rows = buildFederalBracketCapacityRows(input);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Federal bracket capacity</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Shows remaining taxable income room in each 2026 federal bracket. Gross conversion capacity adjusts for the
          basis ratio you entered and is educational only.
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Rate</th>
              <th className="px-4 py-3 font-semibold">Bracket range</th>
              <th className="px-4 py-3 font-semibold">Taxable room</th>
              <th className="px-4 py-3 font-semibold">Gross conversion capacity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
            {rows.map((row) => (
              <tr className={row.currentBracket ? "bg-blue-500/10" : ""} key={`${row.rate}-${row.min}`}>
                <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">{formatPercent(row.rate)}</td>
                <td className="px-4 py-3">
                  {formatCurrency(row.min)} - {row.max === null ? "No cap" : formatCurrency(row.max)}
                </td>
                <td className="px-4 py-3">{row.taxableRoom === null ? "No cap" : formatCurrency(row.taxableRoom)}</td>
                <td className="px-4 py-3">
                  {row.grossConversionCapacity === null ? "No cap" : formatCurrency(row.grossConversionCapacity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
