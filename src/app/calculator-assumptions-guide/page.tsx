import Link from "next/link";
import {
  buildCalculatorAssumptionGroups,
  getCalculatorAssumptionSummary,
} from "@/content/calculator-assumptions-guide";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd, contentWebPageJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Calculator Assumptions Guide",
  description:
    "Plain-English Roth conversion calculator assumptions guide covering taxable income, basis, state tax rate, tax payment method, expected return, and professional review notes.",
  alternates: { canonical: "/calculator-assumptions-guide" },
};

export default function CalculatorAssumptionsGuidePage() {
  const groups = buildCalculatorAssumptionGroups();
  const summary = getCalculatorAssumptionSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Calculator Assumptions Guide", path: "/calculator-assumptions-guide" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contentWebPageJsonLd({
              path: "/calculator-assumptions-guide",
              name: metadata.title,
              description: metadata.description,
              about: [
                "Calculator assumptions",
                "Roth conversion inputs",
                "Educational tax modeling",
                "Professional review preparation",
              ],
            }),
          ),
        }}
        type="application/ld+json"
      />      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/ Assumptions guide</span>
      </nav>

      <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Input clarity</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Calculator Assumptions Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Plain-English explanations for the Roth conversion calculator inputs, common mistakes to avoid, and review
          notes to discuss with a CPA or qualified professional.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} input groups
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalAssumptions} assumptions
          </span>
        </div>
      </header>

      <section className="grid gap-5">
        {groups.map((group) => (
          <article className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950" key={group.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{group.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {group.goal}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.assumptions.length} fields
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.assumptions.map((entry) => (
                <div
                  className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  key={entry.calculatorKey}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      {entry.plainMeaning}
                    </p>
                  </div>
                  <p className="rounded-md bg-amber-500/10 p-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Common mistake: {entry.commonMistake}
                  </p>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    Review note: {entry.reviewNote}
                  </p>
                  <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                    {entry.calculatorKey}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Calculator Keys Covered</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.calculatorKeys.map((key) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={key}
            >
              {key}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/roth-conversion-planning-checklist"
          >
            Open planning checklist
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
