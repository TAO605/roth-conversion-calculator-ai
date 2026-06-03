import Link from "next/link";
import { buildFiveYearRuleSections, getFiveYearRulesSummary } from "@/content/five-year-rules-guide";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd, contentWebPageJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion 5-Year Rules Guide",
  description:
    "Educational Roth conversion 5-year rules guide explaining qualified distribution clocks, conversion-specific 5-year periods, ordering rules, age 59 1/2 review, exceptions, records, and calculator boundaries.",
  alternates: { canonical: "/roth-conversion-5-year-rules" },
};

export default function RothConversionFiveYearRulesPage() {
  const sections = buildFiveYearRuleSections();
  const summary = getFiveYearRulesSummary(sections);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Roth Conversion 5-Year Rules Guide", path: "/roth-conversion-5-year-rules" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contentWebPageJsonLd({
              path: "/roth-conversion-5-year-rules",
              name: metadata.title,
              description: metadata.description,
              about: [
                "Roth conversion five-year rules",
                "Distribution timing review",
                "Retirement account records",
                "Calculator boundaries",
              ],
            }),
          ),
        }}
        type="application/ld+json"
      />      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/ 5-year rules guide</span>
      </nav>

      <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Rule education</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Roth Conversion 5-Year Rules Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Educational guide to common Roth IRA 5-year rule concepts that users may need to discuss before withdrawing
          converted amounts. This page explains rule categories and recordkeeping; it does not decide withdrawal tax
          treatment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalSections} sections
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalPoints} review points
          </span>
        </div>
      </header>

      <section className="grid gap-5">
        {sections.map((section) => (
          <article className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950" key={section.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{section.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {section.purpose}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {section.points.length} points
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {section.points.map((entry) => (
                <div
                  className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      {entry.explanation}
                    </p>
                  </div>
                  <p className="rounded-md bg-amber-500/10 p-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Review note: {entry.professionalReviewNote}
                  </p>
                  <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                    Topic: {entry.reviewTopic}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Review Topics</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.reviewTopics.map((topic) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={topic}
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/roth-conversion-cpa-questions"
          >
            Open CPA questions
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/roth-conversion-tax-forms"
          >
            Open tax forms guide
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
