import Link from "next/link";
import { ageScenarioPages } from "@/content/age-scenario-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Calculator by Age",
  description:
    "Choose an age-based Roth conversion calculator scenario for educational modeling around 59 1/2, retirement timing, and tax assumptions.",
  alternates: { canonical: "/age-scenarios" },
};

export default function AgeScenariosIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Age Scenarios", path: "/age-scenarios" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Age scenarios</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Calculator by Age
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Explore age-based educational scenarios for Roth conversion modeling. These pages connect the calculator age,
          retirement age, and tax-payment assumptions to common planning contexts.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {ageScenarioPages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/age-scenarios/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{page.label}</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.penaltyNote}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open age scenario</span>
          </Link>
        ))}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">How age affects the model</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          The calculator uses age to model whether an early distribution penalty assumption may apply when taxes are
          paid from IRA withholding. It also uses age and retirement age to estimate the compounding window for Roth and
          traditional account comparisons.
        </p>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
