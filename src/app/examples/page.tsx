import Link from "next/link";
import { exampleScenarioPages } from "@/content/example-scenario-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Calculator Examples",
  description:
    "Educational Roth conversion calculator examples for young professionals, near-retirement users, and estate planning scenarios.",
  alternates: { canonical: "/examples" },
};

export default function ExamplesIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Examples", path: "/examples" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Calculator examples</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Calculator Examples
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Start from an educational example, open the calculator with the scenario prefilled, then replace every input
          with your own assumptions before discussing results with a qualified professional.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {exampleScenarioPages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/examples/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{page.label}</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.useCase}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open example</span>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">How to use examples</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Examples are not recommended actions. They are fixed input sets that make the calculator easier to learn and
          easier to compare. Use them as a starting point, then adjust conversion amount, income, state tax, basis, age,
          tax payment method, and future assumptions.
        </p>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
