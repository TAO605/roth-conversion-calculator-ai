import Link from "next/link";
import { basisPlanningPages } from "@/content/basis-planning-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Basis and Pro-Rata Rule",
  description:
    "Educational pages for after-tax basis, the pro-rata rule, and Form 8606 assumptions used by the Roth Conversion Calculator.",
  alternates: { canonical: "/basis" },
};

export default function BasisPlanningIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Basis", path: "/basis" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Basis modeling</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Basis and Pro-Rata Rule
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Learn how after-tax basis, pro-rata assumptions, and Form 8606 concepts connect to the calculator's taxable
          conversion estimate.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {basisPlanningPages.map((page) => (
          <Link
            className="rounded-[20px] bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-material dark:bg-white/10"
            href={`/basis/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">Basis topic</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.summary}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open basis page</span>
          </Link>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
