import Link from "next/link";
import { buildLaunchReadinessGroups, getLaunchReadinessSummary } from "@/content/launch-readiness";

export const metadata = {
  title: "Launch Readiness Checklist",
  description:
    "Production launch checklist for domain, Google Search Console, analytics, SEO discovery, compliance review, testing, and rollback readiness.",
  alternates: {
    canonical: "/launch-readiness",
  },
};

export default function LaunchReadinessPage() {
  const groups = buildLaunchReadinessGroups();
  const summary = getLaunchReadinessSummary(groups);

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10">
      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/</span>
        <Link className="hover:text-systemBlue" href="/release-notes">
          Release notes
        </Link>
        <span>/ Launch readiness</span>
      </nav>

      <header className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Production handoff</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
            Launch Readiness Checklist
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
            A focused checklist for moving the Roth Conversion Calculator from local development to a public Google
            SEO tool site. Items stay pending until production domain, search, analytics, compliance, test, and
            operations evidence is available.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-neutral-900 bg-neutral-950 p-4 text-white dark:border-white/10 dark:bg-white dark:text-neutral-950">
            <p className="text-sm opacity-70">Total items</p>
            <p className="mt-2 text-3xl font-bold">{summary.total}</p>
          </div>
          <div className="rounded-md border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <p className="text-sm font-medium">Complete</p>
            <p className="mt-2 text-3xl font-bold">{summary.completed}</p>
          </div>
          <div className="rounded-md border border-amber-100 bg-amber-50 p-4 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300">
            <p className="text-sm font-medium">Pending</p>
            <p className="mt-2 text-3xl font-bold">{summary.pending}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => (
          <article className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950" key={group.id}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{group.title}</h2>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                {group.items.length} checks
              </span>
            </div>
            <ul className="mt-5 grid gap-4">
              {group.items.map((item) => (
                <li className="grid gap-2 border-t border-neutral-200 pt-4 dark:border-white/10" key={item.label}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{item.label}</h3>
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-700 dark:text-amber-300">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 text-sm leading-7 text-neutral-600 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Delivery Notes</h2>
        <p className="mt-3">
          Production domain and Google Search Console verification must be completed after the final domain is connected.
          Compliance review should be performed before public traffic is sent to AI-assisted explanations or calculator
          result pages.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/api/health"
          >
            Check health endpoint
          </Link>
        </div>
      </section>
    </main>
  );
}
