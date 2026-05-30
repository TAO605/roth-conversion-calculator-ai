import Link from "next/link";
import {
  buildSearchConsoleSubmissionLoop,
  buildSeoMonitoringGroups,
  getSearchConsoleSources,
  getSeoMonitoringSummary,
} from "@/content/seo-monitoring";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "SEO Monitoring Playbook",
  description:
    "Post-launch SEO monitoring playbook for Google Search Console, GA4, Core Web Vitals, sitemap coverage, content refreshes, incidents, and rollback review.",
  alternates: { canonical: "/seo-monitoring" },
};

export default function SeoMonitoringPage() {
  const groups = buildSeoMonitoringGroups();
  const searchConsoleSteps = buildSearchConsoleSubmissionLoop();
  const searchConsoleSources = getSearchConsoleSources();
  const summary = getSeoMonitoringSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "SEO Monitoring Playbook", path: "/seo-monitoring" },
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
        <Link className="hover:text-systemBlue" href="/production-launch">
          Production launch
        </Link>
        <span>/ SEO monitoring</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Post-launch operations</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          SEO Monitoring Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A practical operating cadence for a Google SEO calculator site after launch. It separates daily launch watch,
          weekly SEO review, monthly growth review, and incident response so optimization does not disturb the locked
          calculation engine.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} cadences
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalChecks} checks
          </span>
        </div>
      </header>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
              Search Console submission loop
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">
              Sitemap, URL Inspection, and Page Indexing Checks
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Use this loop after major releases, tax-data updates, or new SEO page clusters. It starts with the local
              smoke command, then moves into Google Search Console only after canonical and crawl signals are clean.
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            {searchConsoleSteps.length} steps
          </span>
        </div>
        <div className="mt-5 grid gap-3">
          {searchConsoleSteps.map((step, index) => (
            <article
              className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
              key={step.label}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-neutral-950 dark:text-white">
                  {index + 1}. {step.label}
                </h3>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                  {step.tool}
                </span>
              </div>
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{step.action}</p>
              <p className="rounded-[14px] bg-neutral-100 p-3 text-sm leading-6 text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
                Evidence: {step.evidence}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-2 text-sm">
          {searchConsoleSources.map((source) => (
            <a
              className="rounded-[12px] bg-neutral-50 px-3 py-2 text-neutral-700 transition hover:text-systemBlue dark:bg-white/10 dark:text-neutral-200"
              href={source.url}
              key={source.url}
              rel="noreferrer"
              target="_blank"
            >
              {source.label}
            </a>
          ))}
        </div>
      </section>

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
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white dark:bg-white dark:text-neutral-950">
                {group.id}
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {group.checks.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                      {entry.tool}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.action}</p>
                  <p className="rounded-[14px] bg-amber-500/10 p-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Escalation: {entry.escalation}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Tool Coverage</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.tools.map((tool) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={tool}
            >
              {tool}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/site-index">
            Open site index
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/launch-readiness"
          >
            Open launch checklist
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
