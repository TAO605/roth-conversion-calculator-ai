import Link from "next/link";
import { glossaryTerms } from "@/content/glossary";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { definedTermSetJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Glossary",
  description: "Plain-English Roth conversion glossary covering IRA basis, tax brackets, penalties, and planning terms.",
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd(glossaryTerms)) }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Education hub</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">Roth Conversion Glossary</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-300">
          Short definitions for Roth conversion calculator inputs, tax concepts, and retirement-account terms.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {glossaryTerms.map((term) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/glossary/${term.slug}`}
            key={term.slug}
          >
            <h2 className="text-xl font-bold text-neutral-950 dark:text-white">{term.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{term.shortDefinition}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
