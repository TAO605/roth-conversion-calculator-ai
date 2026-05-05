import Link from "next/link";
import { buildSiteIndexGroups, getSiteIndexSummary } from "@/content/site-index";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Site Index",
  description:
    "Browse every major Roth Conversion Calculator page, including calculator entries, guides, references, compliance pages, and launch operations resources.",
  alternates: { canonical: "/site-index" },
};

export default function SiteIndexPage() {
  const groups = buildSiteIndexGroups();
  const summary = getSiteIndexSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Site Index", path: "/site-index" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>{" "}
        / Site index
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Crawl map</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">Site Index</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A human-readable inventory of calculator, education, reference, compliance, and operations pages. This page
          supports launch review, internal linking, search discovery, and AI crawler orientation.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} groups
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalLinks} indexed links
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
                  {group.description}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.links.length} links
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.links.map((entry) => (
                <Link
                  className="rounded-[16px] border border-neutral-200 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-systemBlue hover:shadow-material dark:border-white/10 dark:bg-white/5"
                  href={entry.href}
                  key={`${group.id}-${entry.href}`}
                >
                  <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.description}</p>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
