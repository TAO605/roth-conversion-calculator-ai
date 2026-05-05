import Link from "next/link";
import { buildCapitalGainsGuideSections, getCapitalGainsGuideSummary } from "@/content/capital-gains-guide";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Capital Gains Guide",
  description:
    "Educational Roth conversion capital gains guide explaining long-term capital gains, qualified dividends, income stacking, worksheet review, Schedule D records, portfolio events, NIIT overlap, and calculator boundaries.",
  alternates: { canonical: "/roth-conversion-capital-gains-guide" },
};

export default function RothConversionCapitalGainsGuidePage() {
  const sections = buildCapitalGainsGuideSections();
  const summary = getCapitalGainsGuideSummary(sections);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Roth Conversion Capital Gains Guide", path: "/roth-conversion-capital-gains-guide" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/ Capital gains guide</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
          Investment income education
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Roth Conversion Capital Gains Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Educational guide for users with realized gains, qualified dividends, fund distributions, or portfolio events.
          It explains why Roth conversion income can require a separate capital gain worksheet review. The calculator
          does not compute Schedule D or capital gain worksheets.
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
          <article className="rounded-[20px] bg-white/75 p-5 shadow-sm dark:bg-white/10" key={section.id}>
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
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                      {entry.explanation}
                    </p>
                  </div>
                  <p className="rounded-[14px] bg-amber-500/10 p-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
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

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
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
            href="/roth-conversion-niit-guide"
          >
            Open NIIT guide
          </Link>
          <a
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="https://www.irs.gov/taxtopics/tc409"
            rel="noreferrer"
            target="_blank"
          >
            IRS Topic 409
          </a>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
