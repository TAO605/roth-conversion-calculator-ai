import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGlossaryTermBySlug, glossaryTerms } from "@/content/glossary";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface GlossaryTermPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return {};
  }

  return {
    title: `${term.title} | Roth Conversion Glossary`,
    description: term.shortDefinition,
    alternates: { canonical: `/glossary/${term.slug}` },
  };
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms = term.relatedSlugs
    .map((relatedSlug) => getGlossaryTermBySlug(relatedSlug))
    .filter((relatedTerm): relatedTerm is NonNullable<typeof relatedTerm> => Boolean(relatedTerm));

  return (
    <main className="mx-auto grid max-w-3xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Glossary", path: "/glossary" },
              { name: term.title, path: `/glossary/${term.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/glossary">
          Glossary
        </Link>{" "}
        / {term.title}
      </nav>
      <header>
        <h1 className="text-4xl font-bold text-neutral-950 dark:text-white">{term.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{term.shortDefinition}</p>
      </header>
      <article className="rounded-[20px] bg-white/75 p-5 text-base leading-8 text-neutral-700 shadow-material dark:bg-white/10 dark:text-neutral-200">
        {term.definition}
      </article>
      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Related terms</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {relatedTerms.map((relatedTerm) => (
            <Link
              className="rounded-[14px] bg-blue-500/10 px-3 py-2 text-sm font-semibold text-systemBlue"
              href={`/glossary/${relatedTerm.slug}`}
              key={relatedTerm.slug}
            >
              {relatedTerm.title}
            </Link>
          ))}
        </div>
      </section>
      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the Roth Conversion Calculator to see how this term appears in educational scenario modeling.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href="/#calculator"
        >
          Open the calculator
        </Link>
      </section>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
