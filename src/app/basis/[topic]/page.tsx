import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  basisPlanningPages,
  buildBasisPlanningCalculatorHref,
  getBasisPlanningPageBySlug,
} from "@/content/basis-planning-pages";
import { formatCurrency } from "@/common/format/currency";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface BasisPlanningPageProps {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return basisPlanningPages.map((page) => ({ topic: page.slug }));
}

export async function generateMetadata({ params }: BasisPlanningPageProps): Promise<Metadata> {
  const { topic } = await params;
  const page = getBasisPlanningPageBySlug(topic);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/basis/${page.slug}` },
  };
}

export default async function BasisPlanningTopicPage({ params }: BasisPlanningPageProps) {
  const { topic } = await params;
  const page = getBasisPlanningPageBySlug(topic);

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
              { name: "Basis", path: "/basis" },
              { name: page.title, path: `/basis/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/basis">
          Basis
        </Link>{" "}
        / {page.title}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Basis topic</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Calculator example</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          The prefilled calculator example uses {formatCurrency(page.basis)} of basis and{" "}
          {formatCurrency(page.traditionalIraBalance)} of traditional IRA balance to demonstrate how basis can affect a
          taxable conversion estimate.
        </p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator with basis and IRA balance example assumptions prefilled, then replace them with verified
          records before relying on the output.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildBasisPlanningCalculatorHref(page)}
        >
          Open the calculator
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.complianceNote}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
