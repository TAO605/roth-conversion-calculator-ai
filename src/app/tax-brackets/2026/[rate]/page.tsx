import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency, formatPercent } from "@/common/format/currency";
import {
  buildBracketRateCalculatorHref,
  getTaxBracketRatePageBySlug,
  taxBracketRatePages,
} from "@/content/tax-bracket-rate-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface TaxBracketRatePageProps {
  params: Promise<{ rate: string }>;
}

export async function generateStaticParams() {
  return taxBracketRatePages.map((page) => ({ rate: page.slug }));
}

export async function generateMetadata({ params }: TaxBracketRatePageProps): Promise<Metadata> {
  const { rate } = await params;
  const page = getTaxBracketRatePageBySlug(rate);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/tax-brackets/2026/${page.slug}` },
  };
}

export default async function TaxBracketRatePage({ params }: TaxBracketRatePageProps) {
  const { rate } = await params;
  const page = getTaxBracketRatePageBySlug(rate);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "2026 Tax Brackets", path: "/tax-brackets/2026" },
              { name: `${formatPercent(page.rate)} bracket`, path: `/tax-brackets/2026/${page.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>{" "}
        /{" "}
        <Link className="hover:text-systemBlue" href="/tax-brackets/2026">
          2026 tax brackets
        </Link>{" "}
        / {formatPercent(page.rate)} bracket
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">2026 federal bracket</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Taxable income range</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.summary}</p>
        <div className="mt-4 overflow-x-auto rounded-md border border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-950">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Filing status</th>
                <th className="px-4 py-3 font-semibold">Taxable income range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
              {page.ranges.map((range) => (
                <tr key={range.filingStatus}>
                  <td className="px-4 py-3 font-semibold text-neutral-950 dark:text-white">{range.label}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(range.min)} - {range.max === null ? "No cap" : formatCurrency(range.max)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator to estimate how a Roth conversion amount may pass through this bracket after adding to
          current taxable income.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildBracketRateCalculatorHref(page)}
        >
          Open the calculator
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.disclaimer}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
