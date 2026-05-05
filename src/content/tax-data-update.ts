export interface TaxDataUpdateStep {
  label: string;
  evidence: string;
  detail: string;
}

export interface TaxDataUpdateGroup {
  id: string;
  title: string;
  goal: string;
  steps: TaxDataUpdateStep[];
}

function step(label: string, evidence: string, detail: string): TaxDataUpdateStep {
  return { label, evidence, detail };
}

export function buildTaxDataUpdateGroups(): TaxDataUpdateGroup[] {
  return [
    {
      id: "source-review",
      title: "Source Review",
      goal: "Confirm the official tax-year inputs before any calculator code or content changes are made.",
      steps: [
        step(
          "Confirm IRS source documents",
          "IRS source URL",
          "Collect IRS inflation adjustment releases, bracket tables, standard deduction context, and relevant Publication 590 references.",
        ),
        step(
          "Record data scope",
          "Source scope note",
          "Document which values enter the calculator and which items remain outside scope, such as IRMAA, ACA credits, NIIT, AMT, and state-specific rules.",
        ),
        step(
          "Open professional review ticket",
          "CPA review note",
          "Route tax-sensitive assumptions to a qualified US tax professional before changing public tax-year messaging.",
        ),
      ],
    },
    {
      id: "implementation",
      title: "Implementation",
      goal: "Update the smallest possible tax-data surface while preserving the locked calculator architecture.",
      steps: [
        step(
          "Update federal bracket tables",
          "Tax table diff",
          "Change bracket data in the tax-data module and keep calculation functions isolated from content-only updates.",
        ),
        step(
          "Update tax-year freshness messaging",
          "Content diff",
          "Refresh methodology, homepage freshness cards, launch pages, and blog references that name the active tax year.",
        ),
        step(
          "Update AI knowledge boundary",
          "Prompt diff",
          "Refresh AI educational context so model responses cite the active tax year without giving personalized advice.",
        ),
      ],
    },
    {
      id: "validation",
      title: "Validation",
      goal: "Prove the new tax data produces expected results before it reaches production traffic.",
      steps: [
        step(
          "Run calculation regression tests",
          "Test output",
          "Run unit tests for all filing statuses, bracket thresholds, state tax assumptions, basis, penalty, and projection paths.",
        ),
        step(
          "Cross-check sample calculations",
          "Spreadsheet check",
          "Compare representative calculator scenarios against an independent spreadsheet or CPA-reviewed worksheet.",
        ),
        step(
          "Review compliance language",
          "Compliance review note",
          "Confirm updated pages still say educational and illustrative only and avoid tax-decision recommendations.",
        ),
      ],
    },
    {
      id: "release",
      title: "Release",
      goal: "Ship the annual tax-data update with clear public traceability.",
      steps: [
        step(
          "Create tax-data release note",
          "Release note",
          "Record tax year, affected modules, source documents, validation evidence, and rollback path.",
        ),
        step(
          "Run production build",
          "Build output",
          "Confirm all static pages generate and sitemap/llms/feed files point to the production domain.",
        ),
        step(
          "Submit updated sitemap",
          "GSC sitemap",
          "After deployment, resubmit sitemap.xml in Google Search Console and monitor crawl activity.",
        ),
      ],
    },
    {
      id: "rollback",
      title: "Rollback",
      goal: "Keep a clear recovery route if tax data, content, or validation evidence is wrong.",
      steps: [
        step(
          "Prepare rollback path",
          "Rollback plan",
          "Identify the prior stable deployment, previous tax-data commit, and feature registry impact before release.",
        ),
        step(
          "Freeze dependent content",
          "Content freeze note",
          "Pause new tax-year articles and AI context updates if a source discrepancy is found.",
        ),
        step(
          "Archive correction evidence",
          "Correction log",
          "Record what was wrong, which URLs were affected, how it was corrected, and which tests now cover it.",
        ),
      ],
    },
  ];
}

export function getTaxDataUpdateSummary(groups: TaxDataUpdateGroup[]) {
  const steps = groups.flatMap((group) => group.steps);

  return {
    totalGroups: groups.length,
    totalSteps: steps.length,
    evidenceTypes: Array.from(new Set(steps.map((step) => step.evidence))),
  };
}
