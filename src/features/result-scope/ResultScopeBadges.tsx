import type { TaxYear } from "@/core/calculator/types";

interface ResultScopeBadgesProps {
  taxYear: TaxYear;
}

export function ResultScopeBadges({ taxYear }: ResultScopeBadgesProps) {
  const badges = [`${taxYear} tax year`, "Educational estimate", "Based on your inputs", "Not tax advice"];

  return (
    <div
      aria-label="Result scope"
      className="mb-4 flex flex-wrap gap-2"
      data-testid="result-scope-badges"
    >
      {badges.map((badge) => (
        <span
          className="rounded border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200"
          key={badge}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
