import Link from "next/link";
import { taxInteractionPages } from "@/content/tax-interaction-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Tax Interactions Not Modeled",
  description:
    "Educational pages explaining Roth conversion tax interactions that require separate review, including IRMAA, ACA subsidies, NIIT, and RMDs.",
  alternates: { canonical: "/tax-interactions" },
};

export default function TaxInteractionsIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Tax Interactions", path: "/tax-interactions" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Model limits</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Tax Interactions
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          The calculator is intentionally transparent about what it does not model. These pages explain common tax and
          benefit interactions that may require separate professional review.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {taxInteractionPages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/tax-interactions/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">Not modeled</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.modelingStatus}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open interaction page</span>
          </Link>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
