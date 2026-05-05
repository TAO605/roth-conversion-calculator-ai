import { formatCurrency } from "@/common/format/currency";
import type { RothConversionResult } from "@/core/calculator/types";

interface ResultSummaryProps {
  result: RothConversionResult;
}

const cards = [
  ["Federal tax", "federalTax"],
  ["State tax", "stateTax"],
  ["Potential penalty", "earlyDistributionPenalty"],
  ["Total upfront cost", "totalUpfrontCost"],
  ["Roth future value", "rothFutureValue"],
  ["After-tax difference", "afterTaxDifference"],
] as const;

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(([label, key]) => (
        <div className="rounded-[16px] bg-white/65 p-4 dark:bg-white/10" key={key}>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">{formatCurrency(result[key])}</p>
        </div>
      ))}
      <div className="rounded-[16px] bg-blue-500/10 p-4 sm:col-span-2 xl:col-span-3">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-systemBlue">Break-even estimate</p>
        <p className="mt-2 text-xl font-semibold text-neutral-950 dark:text-white">
          {result.breakEvenYear === null
            ? "Not reached within the current projection period"
            : `${result.breakEvenYear} years`}
        </p>
      </div>
    </div>
  );
}
