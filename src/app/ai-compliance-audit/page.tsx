import Link from "next/link";
import { buildAiComplianceAuditGroups, getAiComplianceAuditSummary } from "@/content/ai-compliance-audit";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "AI Compliance Audit Playbook",
  description:
    "AI compliance audit playbook for Roth conversion explanations, covering no-advice boundaries, required disclaimers, sensitive data blocking, model upgrades, fallback mode, and audit trails.",
  alternates: { canonical: "/ai-compliance-audit" },
};

export default function AiComplianceAuditPage() {
  const groups = buildAiComplianceAuditGroups();
  const summary = getAiComplianceAuditSummary(groups);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "AI Compliance Audit Playbook", path: "/ai-compliance-audit" },
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
        <Link className="hover:text-systemBlue" href="/disclaimer">
          Disclaimer
        </Link>
        <span>/ AI compliance audit</span>
      </nav>

      <header className="rounded-[22px] bg-white/75 p-6 shadow-material backdrop-blur-xl dark:bg-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">AI governance</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-neutral-950 dark:text-white">
          AI Compliance Audit Playbook
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          A compliance review workflow for AI-assisted Roth conversion explanations. It verifies refusal behavior,
          required disclaimers, sensitive data handling, model upgrade regression, and fallback controls.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 font-semibold text-systemBlue">
            {summary.totalGroups} control areas
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
            {summary.totalChecks} checks
          </span>
        </div>
      </header>

      <section className="grid gap-5">
        {groups.map((group) => (
          <article className="rounded-[20px] bg-white/75 p-5 shadow-sm dark:bg-white/10" key={group.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">{group.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {group.goal}
                </p>
              </div>
              <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-neutral-950">
                {group.checks.length} checks
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {group.checks.map((entry) => (
                <div
                  className="grid gap-3 rounded-[16px] border border-neutral-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                  key={entry.label}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-neutral-950 dark:text-white">{entry.label}</h3>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                      {entry.riskControl}
                    </span>
                  </div>
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    <strong>Test prompt:</strong> {entry.testPrompt}
                  </p>
                  <p className="rounded-[14px] bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-800 dark:text-emerald-200">
                    Expected behavior: {entry.expectedBehavior}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Risk Controls</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {summary.riskControls.map((control) => (
            <span
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200"
              key={control}
            >
              {control}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="rounded-full bg-systemBlue px-4 py-2 text-sm font-semibold text-white" href="/#calculator">
            Open calculator
          </Link>
          <Link
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-systemBlue dark:border-white/15 dark:text-neutral-200"
            href="/disclaimer"
          >
            Review disclaimer
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
