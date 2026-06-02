import { formatCurrency } from "@/common/format/currency";
import type { RothConversionResult } from "@/core/calculator/types";

interface ResultSummaryProps {
  result: RothConversionResult;
}

const cards = [
  ["Federal tax", "federalTax"],
  ["State tax", "stateTax"],
  ["Potential penalty", "earlyDistributionPenalty"],
  ["Roth future value", "rothFutureValue"],
  ["Traditional after-tax value", "traditionalAfterTaxValue"],
] as const;

function formatBracketRoom(result: RothConversionResult): string {
  const room = result.bracketImpact.roomInCurrentBracketBeforeConversion;

  return room === null ? "Top bracket" : formatCurrency(room);
}

function bracketRoomNote(result: RothConversionResult): string {
  if (result.bracketImpact.roomInCurrentBracketBeforeConversion === null) {
    return "The current income is already in the top modeled federal bracket.";
  }

  if (result.bracketImpact.crossesBracket) {
    return `${formatCurrency(result.bracketImpact.incomeTaxedInHigherBrackets)} of the modeled conversion is taxed above the starting bracket.`;
  }

  return `${formatCurrency(result.bracketImpact.roomInCurrentBracketAfterConversion ?? 0)} remains in the starting bracket after this conversion.`;
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const afterTaxDifferenceIsPositive = result.afterTaxDifference >= 0;

  return (
    <div className="grid gap-3 sm:gap-4">
      <div className="grid gap-2 sm:gap-3 lg:grid-cols-3" aria-label="Primary result estimates">
        <div className="rounded-[16px] bg-neutral-950 p-3 text-white shadow-sm dark:bg-white sm:p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-white/65 dark:text-neutral-500">
            Estimated upfront tax
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-normal text-white dark:text-neutral-950 sm:mt-2 sm:text-3xl">
            {formatCurrency(result.totalUpfrontCost)}
          </p>
          <p className="mt-2 hidden text-xs leading-5 text-white/70 dark:text-neutral-600 sm:block">
            Federal, state, and any modeled early distribution penalty.
          </p>
        </div>

        <div className="rounded-[16px] bg-blue-500/10 p-3 shadow-sm sm:p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-systemBlue">Modeled bracket room</p>
          <p className="mt-1 text-2xl font-semibold tracking-normal text-neutral-950 dark:text-white sm:mt-2 sm:text-3xl">
            {formatBracketRoom(result)}
          </p>
          <p className="mt-2 hidden text-xs leading-5 text-neutral-600 dark:text-neutral-300 sm:block">{bracketRoomNote(result)}</p>
        </div>

        <div className="rounded-[16px] bg-white/65 p-3 shadow-sm dark:bg-white/10 sm:p-4">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            Projected after-tax difference
          </p>
          <p
            className={`mt-1 text-2xl font-semibold tracking-normal sm:mt-2 sm:text-3xl ${
              afterTaxDifferenceIsPositive ? "text-systemGreen" : "text-systemRed"
            }`}
          >
            {formatCurrency(result.afterTaxDifference)}
          </p>
          <p className="mt-2 hidden text-xs leading-5 text-neutral-600 dark:text-neutral-300 sm:block">
            Projection after upfront cost, using the assumptions entered.
          </p>
        </div>
      </div>

      <div className="rounded-[16px] bg-neutral-50 p-3 dark:bg-white/10 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              Scenario reading
            </p>
            <p className="mt-1 text-sm leading-5 text-neutral-700 dark:text-neutral-200 sm:mt-2 sm:leading-6">
              Based on your inputs, this scenario models {formatCurrency(result.taxableConversion)} of taxable Roth
              conversion income and {formatCurrency(result.totalUpfrontCost)} of upfront cost. Review the bracket room,
              hidden tax-impact warnings, and assumptions before using this estimate for planning.
            </p>
          </div>
          <div className="shrink-0 rounded-[12px] bg-white px-3 py-2 text-sm font-semibold text-neutral-950 shadow-sm dark:bg-neutral-950 dark:text-white">
            Break-even:{" "}
            {result.breakEvenYear === null
              ? "not reached in projection"
              : `${result.breakEvenYear} years`}
          </div>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-5">
        {cards.map(([label, key]) => (
          <div className="rounded-[14px] bg-white/65 p-3 dark:bg-white/10 sm:p-4" key={key}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
            <p className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white sm:mt-2 sm:text-xl">{formatCurrency(result[key])}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
