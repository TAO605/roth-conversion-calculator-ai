import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionResult } from "@/core/calculator/types";

function bracketTopLabel(value: number | null): string {
  return value === null ? "No upper limit" : formatCurrency(value);
}

function roomLabel(value: number | null): string {
  return value === null ? "Top federal bracket" : formatCurrency(value);
}

export function TaxBracketImpact({ result }: { result: RothConversionResult }) {
  const impact = result.bracketImpact;

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Tax Bracket Impact</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Roth conversions are taxed through progressive brackets. This shows whether the taxable conversion pushes the
          estimate into a higher federal bracket.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Before conversion</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">{formatPercent(impact.beforeRate)}</p>
          <p className="mt-1 text-sm text-neutral-500">Bracket top: {bracketTopLabel(impact.beforeBracketTop)}</p>
        </div>
        <div className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">After conversion</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">{formatPercent(impact.afterRate)}</p>
          <p className="mt-1 text-sm text-neutral-500">Bracket top: {bracketTopLabel(impact.afterBracketTop)}</p>
        </div>
        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-400/20 dark:bg-blue-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">Crosses bracket?</p>
          <p className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
            {impact.crossesBracket ? "Yes" : "No"}
          </p>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Higher-bracket amount: {formatCurrency(impact.incomeTaxedInHigherBrackets)}
          </p>
        </div>
      </div>
      <div className="rounded-md border border-neutral-200 bg-white p-4 text-sm leading-6 text-neutral-600 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300">
        Room before conversion in current bracket:{" "}
        <strong className="text-neutral-950 dark:text-white">
          {roomLabel(impact.roomInCurrentBracketBeforeConversion)}
        </strong>
        . Room after conversion in resulting bracket:{" "}
        <strong className="text-neutral-950 dark:text-white">
          {roomLabel(impact.roomInCurrentBracketAfterConversion)}
        </strong>
        .
      </div>
    </div>
  );
}
