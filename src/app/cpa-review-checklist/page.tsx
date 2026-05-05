import Link from "next/link";
import { buildCpaReviewChecklistGroups, getCpaReviewChecklistSummary } from "@/content/cpa-review-checklist";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "CPA Review Checklist",
  description:
    "Professional review checklist for Roth conversion calculator users, covering calculator outputs, tax documents, basis records, state assumptions, model limits, advisor questions, and recordkeeping.",
  alternates: { canonical: "/cpa-review-checklist" },
};

export default function CpaReviewChecklistPage() {
  const groups = buildCpaReviewChecklistGroups();
  const summary = getCpaReviewChecklistSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "CPA Review Checklist", path: "/cpa-review-checklist" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/</span>
        <Link className="hover:text-systemBlue" href="/disclaimer">
          Disclaimer
        </Link>
        <span>/ CPA review checklist</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Professional handoff</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          CPA Review Checklist
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Use this checklist to bring calculator output, assumptions, documents, and questions to a licensed CPA or
          qualified financial professional. The checklist supports review; it does not provide a recommendation.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} handoff areas
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalItems} checklist items
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
                  {group.goal}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.items.length} items
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.items.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.detail}</p>
                  </div>
                  <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                    Handoff: {entry.handoffOutput}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Handoff Outputs</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.handoffOutputs.map((output) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={output}
            >
              {output}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/methodology"
          >
            Review methodology
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
