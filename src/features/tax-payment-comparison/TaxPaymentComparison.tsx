import { formatCurrency } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildTaxPaymentComparison } from "@/features/tax-payment-comparison/tax-payment-comparison";

interface TaxPaymentComparisonProps {
  input: RothConversionInput;
  result: RothConversionResult;
}

export function TaxPaymentComparison({ input, result }: TaxPaymentComparisonProps) {
  const comparison = buildTaxPaymentComparison(input, result);

  return (
    <section
      aria-label="Tax payment method comparison"
      className="rounded border border-neutral-200 bg-white p-4 shadow-none dark:border-white/10 dark:bg-neutral-950"
      data-testid="tax-payment-comparison"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-systemBlue">Payment method model</p>
      <h3 className="mt-1 font-semibold text-neutral-950 dark:text-white">Tax Payment Method Comparison</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
        This compares two simplified ways to fund the estimated federal and state tax bill. It is an educational
        scenario, not a recommendation.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            Pay with outside funds
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-neutral-950 dark:text-white">
            {formatCurrency(comparison.outsideFunds.projectedRothValue)}
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
            Models the full {formatCurrency(comparison.outsideFunds.rothPrincipal)} conversion staying in the Roth
            account.
          </p>
        </div>

        <div className="rounded border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
            Withhold from IRA distribution
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold text-neutral-950 dark:text-white">
            {formatCurrency(comparison.iraWithholding.projectedRothValue)}
          </p>
          <p className="mt-2 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
            Models {formatCurrency(comparison.taxToPay)} withheld for estimated federal and state taxes before Roth
            growth.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded border border-neutral-200 bg-white p-3 text-sm leading-6 text-neutral-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200">
        In this model, preserving the tax amount outside the IRA changes projected Roth value by{" "}
        <strong>{formatCurrency(comparison.projectedValueDifference)}</strong> by retirement.
        {comparison.iraWithholding.modeledPenalty > 0 ? (
          <>
            {" "}
            A separate possible early-distribution penalty of{" "}
            <strong>{formatCurrency(comparison.iraWithholding.modeledPenalty)}</strong> may apply to IRA withholding
            before age 59.5.
          </>
        ) : null}
      </div>
    </section>
  );
}
