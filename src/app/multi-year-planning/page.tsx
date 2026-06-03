import Link from "next/link";
import { multiYearPlanningPages } from "@/content/multi-year-planning-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Multi-year Roth Conversion Planning",
  description:
    "Educational multi-year Roth conversion pages comparing lump-sum, 2-year, 3-year, and 5-year equal-split examples.",
  alternates: { canonical: "/multi-year-planning" },
};

export default function MultiYearPlanningIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Multi-year Planning", path: "/multi-year-planning" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Staged conversion examples</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Multi-year Roth Conversion Planning
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Compare educational equal-split schedules for a Roth conversion. These pages explain how the calculator's
          multi-year table works and do not recommend a specific conversion schedule.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {multiYearPlanningPages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/multi-year-planning/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">
              {page.years === 1 ? "Lump sum" : `${page.years}-year schedule`}
            </p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.summary}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open schedule page</span>
          </Link>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
