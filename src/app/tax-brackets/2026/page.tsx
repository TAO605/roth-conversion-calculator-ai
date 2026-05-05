import Link from "next/link";
import { formatCurrency, formatPercent } from "@/common/format/currency";
import { taxBracketRatePages } from "@/content/tax-bracket-rate-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";

const filingStatusLabels = {
  single: "Single",
  married_joint: "Married filing jointly",
  married_separate: "Married filing separately",
  head_of_household: "Head of household",
} as const;

export const metadata = {
  title: "2026 Federal Tax Brackets for Roth Conversions",
  description:
    "2026 federal tax bracket tables by filing status for educational Roth conversion scenario modeling.",
  alternates: { canonical: "/tax-brackets/2026" },
};

export default function FederalTaxBrackets2026Page() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Tax year 2026</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">2026 Federal Tax Brackets</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Educational federal bracket tables used by the Roth Conversion Calculator. A Roth conversion can add taxable
          income across more than one bracket, so these tables are only one part of tax-cost modeling.
        </p>
      </header>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator to estimate how a conversion amount may move through these brackets using your filing
          status and current taxable income.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href="/#calculator"
        >
          Open the calculator
        </Link>
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Browse by federal bracket rate</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {taxBracketRatePages.map((ratePage) => (
            <Link
              className="rounded-[999px] bg-white px-4 py-2 text-sm font-semibold text-systemBlue shadow-sm dark:bg-white/10"
              href={`/tax-brackets/2026/${ratePage.slug}`}
              key={ratePage.slug}
            >
              {formatPercent(ratePage.rate)} bracket
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6">
        {Object.entries(FEDERAL_TAX_BRACKETS_2026).map(([filingStatus, brackets]) => (
          <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10" key={filingStatus}>
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">
              {filingStatusLabels[filingStatus as keyof typeof filingStatusLabels]}
            </h2>
            <div className="mt-4 overflow-x-auto rounded-[16px] border border-neutral-200 bg-white/60 dark:border-white/10 dark:bg-white/5">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rate</th>
                    <th className="px-4 py-3 font-semibold">Taxable income range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                  {brackets.map((bracket) => (
                    <tr key={`${filingStatus}-${bracket.rate}-${bracket.min}`}>
                      <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">
                        {formatPercent(bracket.rate)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(bracket.min)} - {bracket.max === null ? "No cap" : formatCurrency(bracket.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
