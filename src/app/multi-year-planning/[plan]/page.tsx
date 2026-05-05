import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildMultiYearPlanningCalculatorHref,
  getMultiYearPlanningPageBySlug,
  multiYearPlanningPages,
} from "@/content/multi-year-planning-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

interface MultiYearPlanningPageProps {
  params: Promise<{ plan: string }>;
}

export async function generateStaticParams() {
  return multiYearPlanningPages.map((page) => ({ plan: page.slug }));
}

export async function generateMetadata({ params }: MultiYearPlanningPageProps): Promise<Metadata> {
  const { plan } = await params;
  const page = getMultiYearPlanningPageBySlug(plan);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/multi-year-planning/${page.slug}` },
  };
}

export default async function MultiYearPlanningDetailPage({ params }: MultiYearPlanningPageProps) {
  const { plan } = await params;
  const page = getMultiYearPlanningPageBySlug(plan);

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
              { name: "Multi-year Planning", path: "/multi-year-planning" },
              { name: page.title, path: `/multi-year-planning/${page.slug}` },
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
        <Link className="hover:text-systemBlue" href="/multi-year-planning">
          Multi-year planning
        </Link>{" "}
        / {page.title}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
          {page.years === 1 ? "Lump-sum example" : `${page.years}-year example`}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Example annual conversion</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.annualConversionLabel}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the calculator with a $60,000 example conversion, then review the multi-year conversion schedule table in
          the results area.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildMultiYearPlanningCalculatorHref(page)}
        >
          Open the calculator
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.complianceNote}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
