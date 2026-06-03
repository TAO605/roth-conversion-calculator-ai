import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildTaxPaymentMethodCalculatorHref,
  getTaxPaymentMethodPageBySlug,
  taxPaymentMethodPages,
} from "@/content/tax-payment-method-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface TaxPaymentMethodPageProps {
  params: Promise<{ method: string }>;
}

export async function generateStaticParams() {
  return taxPaymentMethodPages.map((page) => ({ method: page.slug }));
}

export async function generateMetadata({ params }: TaxPaymentMethodPageProps): Promise<Metadata> {
  const { method } = await params;
  const page = getTaxPaymentMethodPageBySlug(method);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/tax-payment-methods/${page.slug}` },
  };
}

export default async function TaxPaymentMethodPage({ params }: TaxPaymentMethodPageProps) {
  const { method } = await params;
  const page = getTaxPaymentMethodPageBySlug(method);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto grid max-w-4xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Tax Payment Methods", path: "/tax-payment-methods" },
              { name: page.label, path: `/tax-payment-methods/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/tax-payment-methods">
          Tax payment methods
        </Link>{" "}
        / {page.label}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Tax payment method</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Penalty modeling note</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.penaltyNote}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator with this tax payment method prefilled, then adjust withheld amount, age, penalty exception,
          income, basis, and conversion amount.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildTaxPaymentMethodCalculatorHref(page)}
        >
          Open the calculator
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.complianceNote}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
