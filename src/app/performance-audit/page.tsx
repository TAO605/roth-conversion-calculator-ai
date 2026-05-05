import Link from "next/link";
import { buildPerformanceAuditGroups, getPerformanceAuditSummary } from "@/content/performance-audit";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Performance Audit Playbook",
  description:
    "Core Web Vitals and Lighthouse audit playbook for the Roth Conversion Calculator, covering homepage performance, SEO pages, mobile UX, and release regression checks.",
  alternates: { canonical: "/performance-audit" },
};

export default function PerformanceAuditPage() {
  const groups = buildPerformanceAuditGroups();
  const summary = getPerformanceAuditSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Performance Audit Playbook", path: "/performance-audit" },
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
        <Link className="hover:text-systemBlue" href="/seo-monitoring">
          SEO monitoring
        </Link>
        <span>/ Performance audit</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Quality gate</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Performance Audit Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A practical audit checklist for Core Web Vitals, Lighthouse, mobile usability, and release regression checks.
          It keeps new SEO and operations pages from degrading the primary calculator experience.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} audit areas
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalChecks} checks
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
                {group.checks.length} checks
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.checks.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.action}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-systemBlue">{entry.target}</span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
                      {entry.routeSample}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Target Metrics</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.targetMetrics.map((metric) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={metric}
            >
              {metric}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/production-launch">
            Open launch guide
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/site-index"
          >
            Open site index
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
