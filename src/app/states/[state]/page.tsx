import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildStateCalculatorHref, getStatePageBySlug, statePages } from "@/content/state-pages";
import { formatPercent } from "@/common/format/currency";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export async function generateStaticParams() {
  return statePages.map((page) => ({ state: page.slug }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const page = getStatePageBySlug(state);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/states/${page.slug}` },
  };
}

export default async function StateCalculatorPage({ params }: StatePageProps) {
  const { state } = await params;
  const page = getStatePageBySlug(state);

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
              { name: "States", path: "/states" },
              { name: page.stateName, path: `/states/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/states">
          States
        </Link>{" "}
        / {page.stateName}
      </nav>

      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">{page.stateCode} example</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="grid gap-4 rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">State tax assumption</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[16px] bg-blue-500/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">Example rate</p>
            <p className="mt-2 text-3xl font-bold">{formatPercent(page.stateTaxRateExample)}</p>
          </div>
          <div className="rounded-[16px] bg-white/70 p-4 dark:bg-white/10">
            <p className="text-sm leading-6">{page.stateTaxSummary}</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-systemOrange">{page.verificationNote}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the main calculator, choose {page.stateName} in the state tax shortcut, and adjust the rate if your
          actual marginal rate is different.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildStateCalculatorHref(page)}
        >
          Use this state rate
        </Link>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
