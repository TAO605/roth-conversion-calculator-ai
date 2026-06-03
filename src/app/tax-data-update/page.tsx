import Link from "next/link";
import { buildTaxDataUpdateGroups, getTaxDataUpdateSummary } from "@/content/tax-data-update";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Tax Data Update Playbook",
  description:
    "Annual IRS tax-data update workflow for the Roth Conversion Calculator, covering source review, bracket updates, validation, release notes, sitemap submission, and rollback.",
  alternates: { canonical: "/tax-data-update" },
};

export default function TaxDataUpdatePage() {
  const groups = buildTaxDataUpdateGroups();
  const summary = getTaxDataUpdateSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Tax Data Update Playbook", path: "/tax-data-update" },
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
        <Link className="hover:text-systemBlue" href="/methodology">
          Methodology
        </Link>
        <span>/ Tax data update</span>
      </nav>

      <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Annual tax data governance</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Tax Data Update Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A controlled workflow for updating IRS tax-year data without weakening calculation accuracy, compliance
          boundaries, SEO trust signals, or rollback readiness.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} phases
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalSteps} steps
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
                {group.steps.length} steps
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {group.steps.map((entry) => (
                <div
                  className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  key={entry.label}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                      Evidence: {entry.evidence}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Evidence Required</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.evidenceTypes.map((evidence) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={evidence}
            >
              {evidence}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/methodology">
            Open methodology
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/release-notes"
          >
            Review release notes
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
