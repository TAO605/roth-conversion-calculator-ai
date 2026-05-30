export function TaxImpactWarnings() {
  const warnings = [
    "Medicare IRMAA",
    "ACA premium tax credits",
    "Social Security benefit taxation",
    "NIIT and AMT exposure",
    "Required Minimum Distributions",
    "State-specific retirement income rules",
  ];

  return (
    <aside
      aria-label="Tax impact warnings"
      className="rounded-[16px] bg-orange-50/80 p-4 text-sm text-neutral-800 shadow-sm ring-1 ring-orange-400/25 dark:bg-orange-400/10 dark:text-neutral-100"
      data-testid="tax-impact-warnings"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-systemOrange">Review before planning</p>
      <h3 className="mt-1 font-semibold text-neutral-950 dark:text-white">Tax Impact Warnings</h3>
      <p className="mt-2 leading-6">
        A Roth conversion can increase current-year taxable income. These items are outside this calculator&apos;s MVP
        scope and require professional review:
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {warnings.map((warning) => (
          <li className="flex gap-2" key={warning}>
            <span aria-hidden="true" className="text-systemOrange">
              •
            </span>
            {warning}
          </li>
        ))}
      </ul>
    </aside>
  );
}
