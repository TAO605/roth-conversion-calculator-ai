import { statePages } from "@/content/state-pages";

export type StateRuleStatus = "manual-only" | "no-income-tax" | "needs-review";

export interface StateRuleRegistryEntry {
  slug: string;
  status: StateRuleStatus;
  statusLabel: string;
  boundaryNote: string;
  amountReadiness?: StateRuleAmountReadiness;
}

export interface StateRuleAmountReadiness {
  status: "state_specific_inputs_missing";
  worksheetTitle: string;
  summary: string;
  officialChecklist: string[];
  missingInputs: string[];
  officialReferences: { label: string; href: string }[];
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
    amountReadiness: {
      missingInputs: [
        "Full-year, part-year, or nonresident filing position and whether Form 540 or Form 540NR applies.",
        "California Schedule CA adjustment detail for the IRA distribution or Roth conversion amount included in federal AGI.",
        "California IRA basis records, including nondeductible contributions, pre-1987 basis, and former-nonresident basis where applicable.",
        "Whether any California additional tax on early distributions or Form FTB 3805P exception review applies.",
      ],
      officialChecklist: [
        "Check California residency and source-income treatment before using the state example rate.",
        "Compare the federal taxable IRA distribution with California taxable IRA distribution rules in FTB Pub. 1005.",
        "Review California Schedule CA adjustments and any FTB 3805P early-distribution item before relying on a state amount.",
      ],
      officialReferences: [
        {
          href: "https://www.ftb.ca.gov/forms/2025/2025-1005-publication.pdf",
          label: "California FTB Publication 1005 Pension and Annuity Guidelines",
        },
        {
          href: "https://www.ftb.ca.gov/file/personal/income-types/early-distributions.html",
          label: "California FTB early distributions",
        },
        {
          href: "https://www.ftb.ca.gov/forms/misc/1100.html",
          label: "California FTB Publication 1100 residency changes",
        },
      ],
      status: "state_specific_inputs_missing",
      summary:
        "California amount review needs residency, Schedule CA, IRA basis, and any early-distribution additional-tax context before a state-specific amount can be reviewed.",
      worksheetTitle: "California State Amount Readiness",
    },
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
    amountReadiness: {
      missingInputs: [
        "New York resident, part-year resident, or nonresident status, including domicile and permanent-place-of-abode facts.",
        "Whether New York City or Yonkers tax applies to the taxpayer's filing facts.",
        "Whether the conversion or related retirement income qualifies for New York pension, annuity, government pension, or nonresident pension treatment.",
        "New York modification forms and filing lines needed to reconcile federal AGI to New York adjusted gross income.",
      ],
      officialChecklist: [
        "Verify New York residency status before applying the state example rate.",
        "Review whether pension and annuity subtraction modifications or the age-59 1/2 pension exclusion affect the state amount.",
        "Check New York City, Yonkers, nonresident, and part-year resident treatment before relying on any amount.",
      ],
      officialReferences: [
        {
          href: "https://www.tax.ny.gov/pit/file/information_for_seniors.htm",
          label: "New York Tax Department information for retired persons",
        },
        {
          href: "https://www.tax.ny.gov/pit/file/it225.htm",
          label: "New York Form IT-225 modifications",
        },
        {
          href: "https://www.tax.ny.gov/pit/file/nonresident-faqs.htm",
          label: "New York nonresident filing FAQs",
        },
      ],
      status: "state_specific_inputs_missing",
      summary:
        "New York amount review needs residency, local tax, pension or annuity modification, and nonresident or part-year treatment before a state-specific amount can be reviewed.",
      worksheetTitle: "New York State Amount Readiness",
    },
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
    amountReadiness: {
      missingInputs: [
        "New Jersey resident or nonresident filing position and whether Form NJ-1040 or NJ-1040NR applies.",
        "New Jersey taxable and excludable IRA distribution amounts, which may differ from the federal taxable amount.",
        "New Jersey IRA contribution and basis records, including amounts already taxed by New Jersey.",
        "Credit for taxes paid to other jurisdictions, reciprocal agreement, and local wage-tax facts where relevant.",
      ],
      officialChecklist: [
        "Verify whether the taxpayer is reporting as a New Jersey resident or nonresident before using the state example rate.",
        "Calculate New Jersey taxable and excludable IRA distribution amounts separately from the federal amount.",
        "Review other-jurisdiction credits, reciprocal agreements, and New Jersey gross income categories before relying on any amount.",
      ],
      officialReferences: [
        {
          href: "https://nj.gov/treasury/taxation/git_over.shtml",
          label: "New Jersey Gross Income Tax overview",
        },
        {
          href: "https://nj.gov/njbonds/treasury/taxation/njit6.shtml",
          label: "New Jersey retirement income guidance",
        },
        {
          href: "https://www.nj.gov/treasury/taxation/njit14.shtml",
          label: "New Jersey credit for taxes paid to other jurisdictions",
        },
      ],
      status: "state_specific_inputs_missing",
      summary:
        "New Jersey amount review needs NJ taxable IRA distribution, excludable portion, resident or nonresident return, and other-jurisdiction credit context before a state-specific amount can be reviewed.",
      worksheetTitle: "New Jersey State Amount Readiness",
    },
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
