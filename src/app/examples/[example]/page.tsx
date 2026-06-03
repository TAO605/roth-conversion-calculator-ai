import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildExampleScenarioCalculatorHref,
  exampleScenarioPages,
  getExampleScenarioPageBySlug,
} from "@/content/example-scenario-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface ExampleScenarioPageProps {
  params: Promise<{ example: string }>;
}

export async function generateStaticParams() {
  return exampleScenarioPages.map((page) => ({ example: page.slug }));
}

export async function generateMetadata({ params }: ExampleScenarioPageProps): Promise<Metadata> {
  const { example } = await params;
  const page = getExampleScenarioPageBySlug(example);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/examples/${page.slug}` },
  };
}

export default async function ExampleScenarioPage({ params }: ExampleScenarioPageProps) {
  const { example } = await params;
  const page = getExampleScenarioPageBySlug(example);

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
              { name: "Examples", path: "/examples" },
              { name: page.label, path: `/examples/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/examples">
          Examples
        </Link>{" "}
        / {page.label}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Example scenario</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Scenario assumptions</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.useCase}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Open the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Load this example in the calculator, then edit the assumptions before using the result for any discussion with
          a CPA, financial advisor, or tax professional.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildExampleScenarioCalculatorHref(page)}
        >
          Open prefilled calculator
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.disclaimer}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
