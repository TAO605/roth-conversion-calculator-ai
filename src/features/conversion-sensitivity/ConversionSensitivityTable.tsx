import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildConversionSensitivityRows } from "@/features/conversion-sensitivity/conversion-sensitivity";

export function ConversionSensitivityTable({ input }: { input: RothConversionInput }) {
  const rows = buildConversionSensitivityRows(input);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Conversion sensitivity</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Educational comparison of nearby conversion amounts using the same assumptions. This is not an optimization
          recommendation.
        </p>
      </div>
      <div className="overflow-x-auto rounded-[16px] border border-neutral-200 bg-white/60 dark:border-white/10 dark:bg-white/5">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Scenario</th>
              <th className="px-4 py-3 font-semibold">Conversion</th>
              <th className="px-4 py-3 font-semibold">Taxable</th>
              <th className="px-4 py-3 font-semibold">Upfront cost</th>
              <th className="px-4 py-3 font-semibold">Break-even</th>
              <th className="px-4 py-3 font-semibold">After-tax diff</th>
              <th className="px-4 py-3 font-semibold">Fed bracket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
            {rows.map((row) => (
              <tr className={row.label === "Current" ? "bg-blue-500/10" : ""} key={`${row.label}-${row.conversionAmount}`}>
                <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">{row.label}</td>
                <td className="px-4 py-3">{formatCurrency(row.conversionAmount)}</td>
                <td className="px-4 py-3">{formatCurrency(row.taxableConversion)}</td>
                <td className="px-4 py-3">{formatCurrency(row.totalUpfrontCost)}</td>
                <td className="px-4 py-3">{row.breakEvenYear === null ? "Not reached" : `${row.breakEvenYear} yrs`}</td>
                <td className="px-4 py-3">{formatCurrency(row.afterTaxDifference)}</td>
                <td className="px-4 py-3">{formatPercent(row.afterFederalRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
