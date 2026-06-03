import Link from "next/link";
import { keywordLandingPages } from "@/content/keyword-landing-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Calculator Pages",
  description:
    "Browse high-intent Roth conversion calculator pages for tax estimates, break-even modeling, Roth IRA conversions, and 2026 assumptions.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorKeywordHubPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Calculator Pages", path: "/calculators" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Calculator pages</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Calculator Pages
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Choose the calculator entry page that best matches your search intent, then open the live calculator and
          adjust every assumption before using the output for professional review.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {keywordLandingPages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{page.keyword}</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.intent}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open page</span>
          </Link>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
