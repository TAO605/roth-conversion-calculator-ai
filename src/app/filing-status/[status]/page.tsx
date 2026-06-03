import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildFilingStatusCalculatorHref,
  filingStatusPages,
  getFilingStatusPageBySlug,
} from "@/content/filing-status-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface FilingStatusPageProps {
  params: Promise<{ status: string }>;
}

export async function generateStaticParams() {
  return filingStatusPages.map((page) => ({ status: page.slug }));
}

export async function generateMetadata({ params }: FilingStatusPageProps): Promise<Metadata> {
  const { status } = await params;
  const page = getFilingStatusPageBySlug(status);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/filing-status/${page.slug}` },
  };
}

export default async function FilingStatusCalculatorPage({ params }: FilingStatusPageProps) {
  const { status } = await params;
  const page = getFilingStatusPageBySlug(status);

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
              { name: "Filing Status", path: "/tax-brackets/2026" },
              { name: page.label, path: `/filing-status/${page.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>{" "}
        / {page.label}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Filing status</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>
      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Bracket note</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.bracketNote}</p>
      </section>
      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator with {page.label} selected, then adjust income, state tax, basis, and conversion amount.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildFilingStatusCalculatorHref(page)}
        >
          Open the calculator
        </Link>
      </section>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
