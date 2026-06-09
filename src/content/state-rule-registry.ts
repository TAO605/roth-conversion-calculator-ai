import { statePages } from "@/content/state-pages";

export type StateRuleStatus = "manual-only" | "no-income-tax" | "needs-review";

export interface StateRuleRegistryEntry {
  slug: string;
  status: StateRuleStatus;
  statusLabel: string;
  boundaryNote: string;
}

export const manualStateRuleRegistryEntry: StateRuleRegistryEntry = {
  boundaryNote:
    "No supported state example is selected. The calculator is using only the manually entered state marginal rate, so residency and state-law rules still need separate review.",
  slug: "manual",
  status: "manual-only",
  statusLabel: "Manual rate only",
};

export const stateRuleRegistry: StateRuleRegistryEntry[] = [
  {
    boundaryNote:
      "California has a state individual income tax and state-specific income, deduction, credit, surcharge, and residency rules can affect the final amount.",
    slug: "california",
    status: "needs-review",
    statusLabel: "Needs state review",
  },
  {
    boundaryNote:
      "Texas is treated as a no broad state individual income tax example for this calculator, but residency, entity, franchise, local, and multi-state facts still need review.",
    slug: "texas",
    status: "no-income-tax",
    statusLabel: "No broad individual income tax",
  },
  {
    boundaryNote:
      "Florida is treated as a no personal income tax example for this calculator, but residency, source-income, entity, and multi-state facts still need review.",
    slug: "florida",
    status: "no-income-tax",
    statusLabel: "No broad individual income tax",
  },
  {
    boundaryNote:
      "New York has state individual income tax, and local tax, residency, deductions, credits, and allocation rules can affect the final amount.",
    slug: "new-york",
    status: "needs-review",
    statusLabel: "Needs state review",
  },
  {
    boundaryNote:
      "Washington is treated as a no broad individual income tax example for Roth conversion wage/ordinary-income modeling, but capital-gains excise tax, other state taxes, income classification, and future law changes still need review.",
    slug: "washington",
    status: "no-income-tax",
    statusLabel: "No broad individual income tax",
  },
  {
    boundaryNote:
      "New Jersey has state individual income tax and state-specific basis, pension, exclusion, credit, and residency rules can affect the final amount.",
    slug: "new-jersey",
    status: "needs-review",
    statusLabel: "Needs state review",
  },
];

export function getStateRuleRegistryEntry(slug: string | null | undefined): StateRuleRegistryEntry {
  if (!slug) {
    return manualStateRuleRegistryEntry;
  }

  return stateRuleRegistry.find((entry) => entry.slug === slug) ?? manualStateRuleRegistryEntry;
}

export function stateRuleRegistryHasAllStatePages(): boolean {
  const registrySlugs = new Set(stateRuleRegistry.map((entry) => entry.slug));

  return statePages.every((page) => registrySlugs.has(page.slug));
}
