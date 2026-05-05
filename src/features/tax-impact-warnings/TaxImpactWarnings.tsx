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
    <div className="rounded-[16px] border border-orange-400/25 bg-orange-50/80 p-4 text-sm text-neutral-800 dark:bg-orange-400/10 dark:text-neutral-100">
      <h3 className="font-semibold text-neutral-950 dark:text-white">Tax Impact Warnings</h3>
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
    </div>
  );
}
