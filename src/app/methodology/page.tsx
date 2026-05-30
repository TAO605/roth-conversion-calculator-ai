import { FederalTaxTable } from "@/features/methodology/FederalTaxTable";
import { TaxDataFreshnessCard } from "@/features/tax-data-freshness/TaxDataFreshnessCard";

export const metadata = {
  title: "Calculation Methodology",
  description: "Formulas, assumptions, and limits used by the Roth Conversion Calculator.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">Calculation Methodology</h1>
      <div className="mt-6 grid gap-4 leading-7">
        <p>Federal tax is estimated with a progressive tax delta: tax(income + taxable conversion) minus tax(income).</p>
        <p>Taxable conversion uses a pro-rata basis estimate: conversion amount multiplied by one minus basis divided by IRA balance.</p>
        <p>The default assumption is that conversion taxes are paid from outside funds.</p>
        <p>IRMAA, ACA subsidies, NIIT, AMT, RMDs, credits, and state-specific rules are outside the MVP calculation scope.</p>
        <p>
          Primary references:{" "}
          <a className="text-systemBlue underline" href="https://www.irs.gov/publications/p590a">
            IRS Publication 590-A
          </a>
          ,{" "}
          <a className="text-systemBlue underline" href="https://www.irs.gov/publications/p590b">
            IRS Publication 590-B
          </a>
          , and IRS tax inflation adjustments for tax year 2026.
        </p>
      </div>
      <div className="mt-8">
        <TaxDataFreshnessCard />
      </div>
      <FederalTaxTable />
    </main>
  );
}
