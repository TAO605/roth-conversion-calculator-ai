import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTaxInteractionPageBySlug, taxInteractionPages } from "@/content/tax-interaction-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface TaxInteractionPageProps {
  params: Promise<{ interaction: string }>;
}

export async function generateStaticParams() {
  return taxInteractionPages.map((page) => ({ interaction: page.slug }));
}

export async function generateMetadata({ params }: TaxInteractionPageProps): Promise<Metadata> {
  const { interaction } = await params;
  const page = getTaxInteractionPageBySlug(interaction);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/tax-interactions/${page.slug}` },
  };
}

export default async function TaxInteractionDetailPage({ params }: TaxInteractionPageProps) {
  const { interaction } = await params;
  const page = getTaxInteractionPageBySlug(interaction);

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
              { name: "Tax Interactions", path: "/tax-interactions" },
              { name: page.title, path: `/tax-interactions/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/tax-interactions">
          Tax interactions
        </Link>{" "}
        / {page.title}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Not modeled</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Calculator limit</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.modelingStatus}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Official reference</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Review the official source and then discuss the interaction with a qualified professional.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={page.officialSourceUrl}
        >
          {page.officialSourceLabel}
        </Link>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
