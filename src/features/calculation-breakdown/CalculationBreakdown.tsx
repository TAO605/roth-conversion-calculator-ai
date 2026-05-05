import { formatCurrency, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

interface CalculationBreakdownProps {
  input: RothConversionInput;
  result: RothConversionResult;
}

export function CalculationBreakdown({ input, result }: CalculationBreakdownProps) {
  const rows = [
    {
      label: "Basis exclusion ratio",
      value: formatPercent(result.breakdown.basisExclusionRatio),
      detail: `${formatCurrency(input.basis)} basis / ${formatCurrency(input.traditionalIraBalance)} IRA balance`,
    },
    {
      label: "Taxable conversion ratio",
      value: formatPercent(result.breakdown.taxableConversionRatio),
      detail: `${formatCurrency(result.taxableConversion)} taxable / ${formatCurrency(input.conversionAmount)} converted`,
    },
    {
      label: "Effective federal tax rate on taxable conversion",
      value: formatPercent(result.breakdown.effectiveFederalTaxRate),
      detail: `${formatCurrency(result.federalTax)} federal tax / ${formatCurrency(result.taxableConversion)} taxable conversion`,
    },
    {
      label: "Effective state tax rate",
      value: formatPercent(result.breakdown.effectiveStateTaxRate),
      detail: "User-entered state marginal rate applied to taxable conversion.",
    },
    {
      label: "Total upfront cost rate",
      value: formatPercent(result.breakdown.totalCostRate),
      detail: `${formatCurrency(result.totalUpfrontCost)} total upfront cost / ${formatCurrency(input.conversionAmount)} converted`,
    },
    {
      label: "Penalty basis modeled",
      value: formatCurrency(result.breakdown.penaltyBasis),
      detail: result.breakdown.penaltyExplanation,
    },
  ];

  return (
    <div className="grid gap-3">
      <div>
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Calculation Breakdown</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          These figures show how the calculator reached the estimate. They are educational assumptions, not tax advice.
        </p>
      </div>
      <div className="grid gap-3">
        {rows.map((row) => (
          <div className="grid gap-2 rounded-[16px] bg-white/65 p-4 dark:bg-white/10 md:grid-cols-[1fr_auto]" key={row.label}>
            <div>
              <p className="font-semibold text-neutral-950 dark:text-white">{row.label}</p>
              <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{row.detail}</p>
            </div>
            <p className="text-2xl font-bold text-systemBlue md:text-right">{row.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
