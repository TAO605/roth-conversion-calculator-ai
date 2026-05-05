import Link from "next/link";
import { filingStatusPages } from "@/content/filing-status-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Calculator by Filing Status",
  description:
    "Choose a filing status page for educational Roth conversion tax modeling using 2026 federal bracket assumptions.",
  alternates: { canonical: "/filing-status" },
};

export default function FilingStatusIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Filing Status", path: "/filing-status" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Filing status guide</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Calculator by Filing Status
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Select the filing status that matches your tax scenario to open an educational page with bracket context,
          calculator prefill links, and compliance notes for Roth conversion modeling.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {filingStatusPages.map((page) => (
          <Link
            className="rounded-[20px] bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-material dark:bg-white/10"
            href={`/filing-status/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">2026 brackets</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.label}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.bracketNote}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open filing status page</span>
          </Link>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Why filing status matters</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          A Roth conversion adds taxable income in the year of conversion. Filing status affects the federal bracket
          ranges used to estimate incremental federal tax, so the same conversion amount can produce different
          educational estimates for single, joint, separate, and head-of-household filers.
        </p>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
