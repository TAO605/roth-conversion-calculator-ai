import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildKeywordLandingCalculatorHref,
  getKeywordLandingPageBySlug,
  keywordLandingPages,
} from "@/content/keyword-landing-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface KeywordLandingPageProps {
  params: Promise<{ keyword: string }>;
}

export async function generateStaticParams() {
  return keywordLandingPages.map((page) => ({ keyword: page.slug }));
}

export async function generateMetadata({ params }: KeywordLandingPageProps): Promise<Metadata> {
  const { keyword } = await params;
  const page = getKeywordLandingPageBySlug(keyword);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function KeywordLandingPage({ params }: KeywordLandingPageProps) {
  const { keyword } = await params;
  const page = getKeywordLandingPageBySlug(keyword);

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
              { name: "Calculator Pages", path: "/calculators" },
              { name: page.keyword, path: `/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/calculators">
          Calculator pages
        </Link>{" "}
        / {page.keyword}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">{page.keyword}</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Search intent</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.intent}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the live calculator, enter your own assumptions, and use the output only as an educational worksheet for
          professional review.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildKeywordLandingCalculatorHref(page)}
        >
          {page.primaryCta}
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.disclaimer}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
