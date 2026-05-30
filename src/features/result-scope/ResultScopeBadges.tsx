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
          className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 ring-1 ring-black/5 dark:bg-white/10 dark:text-neutral-200 dark:ring-white/10"
          key={badge}
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
