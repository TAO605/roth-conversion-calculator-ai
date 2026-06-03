import Link from "next/link";
import { buildPrivacyDataFlowGroups, getPrivacyDataFlowSummary } from "@/content/privacy-data-flow";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Privacy Data Flow Playbook",
  description:
    "Privacy and data-flow audit playbook for the Roth Conversion Calculator, covering local calculation, browser storage, share links, PDF exports, GA4 events, health checks, and AI API boundaries.",
  alternates: { canonical: "/privacy-data-flow" },
};

export default function PrivacyDataFlowPage() {
  const groups = buildPrivacyDataFlowGroups();
  const summary = getPrivacyDataFlowSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Privacy Data Flow Playbook", path: "/privacy-data-flow" },
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
        <Link className="hover:text-systemBlue" href="/privacy">
          Privacy
        </Link>
        <span>/ Privacy data flow</span>
      </nav>

      <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Privacy architecture</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Privacy Data Flow Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A privacy audit workflow for local calculator execution, browser storage, sharing, analytics, health checks,
          and AI request boundaries. It keeps personal financial assumptions under user control.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} data areas
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalChecks} checks
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
                {group.checks.length} checks
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.checks.map((entry) => (
                <div
                  className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.action}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-systemBlue">
                      {entry.dataSurface}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
                      {entry.evidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Data Surfaces</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.dataSurfaces.map((surface) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={surface}
            >
              {surface}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/privacy">
            Open privacy policy
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/ai-compliance-audit"
          >
            Open AI audit
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
