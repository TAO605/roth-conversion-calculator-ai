import Link from "next/link";
import { buildTaxFormsGuideGroups, getTaxFormsGuideSummary } from "@/content/tax-forms-guide";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd, contentWebPageJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Tax Forms Guide",
  description:
    "Educational guide to Roth conversion tax forms and records, including Form 1099-R, Form 5498, Form 8606, IRA statements, basis records, withholding confirmation, and CPA review packages.",
  alternates: { canonical: "/roth-conversion-tax-forms" },
};

export default function RothConversionTaxFormsPage() {
  const groups = buildTaxFormsGuideGroups();
  const summary = getTaxFormsGuideSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Roth Conversion Tax Forms Guide", path: "/roth-conversion-tax-forms" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            contentWebPageJsonLd({
              path: "/roth-conversion-tax-forms",
              name: metadata.title,
              description: metadata.description,
              about: [
                "Roth conversion tax forms",
                "Form 1099-R review",
                "Form 8606 review",
                "Professional tax records",
              ],
            }),
          ),
        }}
        type="application/ld+json"
      />      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/ Tax forms guide</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Tax record education</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Roth Conversion Tax Forms Guide
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Educational guide to forms and records commonly used when reviewing a Roth conversion estimate. Use it to
          prepare a CPA review package, not as tax filing instructions.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} record groups
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalForms} records
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
                  {group.goal}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.forms.length} items
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.forms.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.purpose}</p>
                  </div>
                  <p className="rounded-[14px] bg-amber-500/10 p-3 text-sm leading-6 text-amber-800 dark:text-amber-200">
                    Review note: {entry.reviewNote}
                  </p>
                  <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                    Calculator link: {entry.calculatorConnection}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Calculator Connections</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.calculatorConnections.map((connection) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={connection}
            >
              {connection}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/cpa-review-checklist"
          >
            Open CPA checklist
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
