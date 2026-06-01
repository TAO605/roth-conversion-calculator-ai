import Link from "next/link";
import { buildCpaQuestionGroups, getCpaQuestionGuideSummary } from "@/content/cpa-questions-guide";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd, contentWebPageJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion CPA Questions Guide",
  description:
    "Educational CPA question bank for Roth conversion review covering taxable income, basis, pro-rata treatment, withholding, estimated taxes, income-linked tax interactions, filing records, and post-filing review.",
  alternates: { canonical: "/roth-conversion-cpa-questions" },
};

export default function RothConversionCpaQuestionsPage() {
  const groups = buildCpaQuestionGroups();
  const summary = getCpaQuestionGuideSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Roth Conversion CPA Questions Guide", path: "/roth-conversion-cpa-questions" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contentWebPageJsonLd({
              path: "/roth-conversion-cpa-questions",
              name: metadata.title,
              description: metadata.description,
              about: [
                "CPA questions",
                "Roth conversion review",
                "Tax professional handoff",
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
        <span>/ CPA questions guide</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Professional review prep</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Roth Conversion CPA Questions Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Educational question bank for taking calculator output to a CPA or tax professional. It helps users ask about
          assumptions, records, and model limits without turning the site into tax advice.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} review groups
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalQuestions} questions
          </span>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 font-semibold text-violet-700 dark:text-violet-300">
            {summary.totalMaterials} materials
          </span>
        </div>
      </header>

      <section className="grid gap-5">
        {groups.map((group) => (
          <article className="rounded-[20px] bg-white/75 p-5 shadow-sm dark:bg-white/10" key={group.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{group.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {group.purpose}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.questions.length} questions
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {group.questions.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.prompt}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.prompt}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.whyAsk}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                      Topic: {entry.reviewTopic}
                    </span>
                    {entry.materialsToBring.map((material) => (
                      <span
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
                        key={material}
                      >
                        {material}
                      </span>
                    ))}
                  </div>
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
            href="/cpa-review-checklist"
          >
            Open CPA checklist
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
