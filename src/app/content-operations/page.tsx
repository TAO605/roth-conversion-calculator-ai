import Link from "next/link";
import {
  buildContentOperationsGroups,
  getBlogFinalPublicationReview,
  getBlogDraftReviewWorkflow,
  getContentOperationsSummary,
} from "@/content/content-operations";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Content Operations Playbook",
  description:
    "Editorial and SEO content operations playbook for the Roth Conversion Calculator, covering keyword research, educational content production, compliance review, publishing, internal links, and content refreshes.",
  alternates: { canonical: "/content-operations" },
};

export default function ContentOperationsPage() {
  const groups = buildContentOperationsGroups();
  const summary = getContentOperationsSummary(groups);
  const blogDraftReview = getBlogDraftReviewWorkflow();
  const blogFinalReview = getBlogFinalPublicationReview();

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Content Operations Playbook", path: "/content-operations" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="flex flex-wrap gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>
        <span>/</span>
        <Link className="hover:text-systemBlue" href="/seo-monitoring">
          SEO monitoring
        </Link>
        <span>/ Content operations</span>
      </nav>

      <header className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-neutral-950">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Editorial operations</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          Content Operations Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A controlled workflow for growing the Google SEO content matrix without weakening compliance, duplicating
          search intent, or losing internal-link discipline.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} workflows
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalSteps} steps
          </span>
        </div>
      </header>

      <section className="grid gap-5">
        {groups.map((group) => (
          <article className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950" key={group.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{group.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {group.goal}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.steps.length} steps
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {group.steps.map((entry) => (
                <div
                  className="grid gap-3 rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950"
                  key={entry.label}
                >
                  <div>
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{entry.detail}</p>
                  </div>
                  <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                    Output: {entry.output}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <div className="grid gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Blog publishing gate</p>
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Blog Draft SEO Review</h2>
          <p className="max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {blogDraftReview.ownershipBoundary}
          </p>
          <code className="mt-2 overflow-x-auto rounded-md bg-neutral-950 px-4 py-3 text-sm leading-6 text-white">
            {blogDraftReview.command}
          </code>
          <code className="overflow-x-auto rounded-md bg-neutral-900 px-4 py-3 text-sm leading-6 text-white">
            {blogDraftReview.evidenceCommand}
          </code>
          <code className="overflow-x-auto rounded-md bg-neutral-800 px-4 py-3 text-sm leading-6 text-white">
            {blogDraftReview.readinessCommand}
          </code>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">Hard checks</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogDraftReview.hardChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">Manual review</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogDraftReview.manualReview.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">AI publication duties</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogDraftReview.publicationDuties.map((duty) => (
                <li key={duty}>{duty}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <div className="grid gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Final release gate</p>
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{blogFinalReview.title}</h2>
          <p className="max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {blogFinalReview.goal}
          </p>
          <code className="mt-2 overflow-x-auto rounded-md bg-neutral-950 px-4 py-3 text-sm leading-6 text-white">
            {blogFinalReview.validationCommand}
          </code>
          <code className="overflow-x-auto rounded-md bg-neutral-900 px-4 py-3 text-sm leading-6 text-white">
            {blogFinalReview.manifestCommand}
          </code>
          <code className="overflow-x-auto rounded-md bg-neutral-800 px-4 py-3 text-sm leading-6 text-white">
            {blogFinalReview.manifestValidationCommand}
          </code>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">Required evidence</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogFinalReview.requiredEvidence.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">Stop conditions</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogFinalReview.stopConditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <h3 className="font-semibold text-neutral-950 dark:text-white">Publish criteria</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {blogFinalReview.publishCriteria.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Operating Outputs</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.outputs.map((output) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={output}
            >
              {output}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/blog">
            Open guides
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/site-index"
          >
            Open site index
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
