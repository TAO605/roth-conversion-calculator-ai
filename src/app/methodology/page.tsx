import Link from "next/link";
import { breadcrumbJsonLd, contentWebPageJsonLd } from "@/core/seo/json-ld";
import { FederalTaxTable } from "@/features/methodology/FederalTaxTable";
import { TaxDataFreshnessCard } from "@/features/tax-data-freshness/TaxDataFreshnessCard";

const relatedReferences = [
  {
    href: "/calculator-assumptions-guide",
    label: "Calculator assumptions guide",
    description: "Review how taxable income, basis, payment method, and other inputs shape the estimate.",
  },
  {
    href: "/tax-brackets/2026",
    label: "2026 federal tax brackets",
    description: "Compare the bracket tables used by the calculator for educational federal tax modeling.",
  },
  {
    href: "/examples",
    label: "Roth conversion examples",
    description: "See sample scenarios that show how the methodology behaves under different assumptions.",
  },
  {
    href: "/cpa-review-checklist",
    label: "CPA review checklist",
    description: "Prepare the assumptions and documents a qualified professional may need to review.",
  },
] as const;

export const metadata = {
  title: "Calculation Methodology",
  description: "Formulas, assumptions, and limits used by the Roth Conversion Calculator.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Calculation Methodology", path: "/methodology" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contentWebPageJsonLd({
              path: "/methodology",
              name: metadata.title,
              description: metadata.description,
              about: [
                "Roth conversion calculation methodology",
                "Progressive federal tax estimate",
                "Pro-rata basis estimate",
                "2026 federal tax brackets",
                "Educational tax modeling assumptions",
              ],
            }),
          ),
        }}
        type="application/ld+json"
      />
      <h1 className="text-4xl font-bold">Calculation Methodology</h1>
      <div className="mt-6 grid gap-4 leading-7">
        <p>Federal tax is estimated with a progressive tax delta: tax(income + taxable conversion) minus tax(income).</p>
        <p>Taxable conversion uses a pro-rata basis estimate: conversion amount multiplied by one minus basis divided by IRA balance.</p>
        <p>The default assumption is that conversion taxes are paid from outside funds.</p>
        <p>
          IRMAA, ACA APTC, NIIT, Social Security, RMD, AMT, and selected-state inputs may appear as bounded previews or
          professional-review worksheets, but final program eligibility, tax forms, credits, billing determinations, and
          state-specific rules remain outside the core conversion tax calculation.
        </p>
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
      <section className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Related Roth conversion references</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Use these companion pages to trace the calculator inputs, bracket data, example scenarios, and professional
          review handoff without treating the estimate as personal tax advice.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {relatedReferences.map((reference) => (
            <Link
              className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-systemBlue hover:text-systemBlue dark:border-white/10 dark:bg-neutral-950"
              href={reference.href}
              key={reference.href}
            >
              <span className="font-semibold">{reference.label}</span>
              <span className="mt-2 block text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {reference.description}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
