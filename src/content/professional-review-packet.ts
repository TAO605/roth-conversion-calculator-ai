export type ProfessionalReviewPacketSectionId =
  | "review-status"
  | "calculation-scope"
  | "not-modeled"
  | "source-data"
  | "seo-evidence"
  | "review-handoff";

export interface ProfessionalReviewPacketItem {
  label: string;
  evidence: string;
  detail: string;
}

export interface ProfessionalReviewPacketSection {
  id: ProfessionalReviewPacketSectionId;
  title: string;
  goal: string;
  items: ProfessionalReviewPacketItem[];
}

function item(label: string, evidence: string, detail: string): ProfessionalReviewPacketItem {
  return { label, evidence, detail };
}

export function buildProfessionalReviewPacketSections(): ProfessionalReviewPacketSection[] {
  return [
    {
      id: "review-status",
      title: "Professional Review Status",
      goal: "Keep the public boundary clear until a qualified tax professional completes review.",
      items: [
        item(
          "Current status",
          "Tax professional review pending",
          "The calculator is published as an educational tool. Professional tax review is still pending and must remain visible in health and review evidence.",
        ),
        item(
          "Review role",
          "CPA, EA, or qualified tax professional",
          "The reviewer should check source data, assumptions, model limits, and user-facing language. The reviewer should not be asked to approve personalized advice copy.",
        ),
      ],
    },
    {
      id: "calculation-scope",
      title: "Modeled Calculation Scope",
      goal: "Identify what the deterministic calculator currently models before asking for professional review.",
      items: [
        item(
          "Federal bracket estimate",
          "src/core/calculator/federal-tax.ts",
          "The calculator models federal ordinary income tax from user-provided taxable income, filing status, tax year, and conversion inputs.",
        ),
        item(
          "Pro-rata basis estimate",
          "src/core/calculator/roth-conversion.ts",
          "After-tax IRA basis and traditional IRA balance are used for simplified pro-rata taxable conversion modeling.",
        ),
        item(
          "State tax assumption",
          "User-provided marginal state tax rate",
          "State tax is modeled from the user-entered marginal rate, not a full state law engine.",
        ),
        item(
          "Payment method comparison",
          "src/features/tax-payment-comparison",
          "Outside-funds and IRA-withholding scenarios are compared as educational modeled scenarios, not recommendations.",
        ),
      ],
    },
    {
      id: "not-modeled",
      title: "Items Not Fully Modeled",
      goal: "Separate review warnings from complete tax calculations.",
      items: [
        item(
          "IRMAA",
          "Additional review required",
          "Medicare IRMAA premiums are flagged for review, but the calculator does not calculate premium changes.",
        ),
        item(
          "ACA premium tax credits",
          "Additional review required",
          "Marketplace subsidy effects are flagged for review, but the calculator does not calculate premium tax credit changes.",
        ),
        item(
          "NIIT, AMT, RMD, credits, and deductions",
          "Additional review required",
          "These items remain outside the deterministic model unless a dedicated rule engine and source review are added later.",
        ),
        item(
          "State-specific special rules",
          "Additional review required",
          "State pages explain assumptions, but the calculator does not model every state exclusion, credit, surcharge, or local rule.",
        ),
      ],
    },
    {
      id: "source-data",
      title: "Source Data and Freshness",
      goal: "Give the reviewer the tax-year evidence needed to verify source alignment.",
      items: [
        item(
          "Tax year",
          "2026",
          "The current public calculator and metadata are centered on 2026 tax-year assumptions.",
        ),
        item(
          "Tax data freshness page",
          "/tax-data-update",
          "Annual source update workflow records IRS-source review, update windows, validation, release notes, sitemap updates, and rollback boundaries.",
        ),
        item(
          "Methodology page",
          "/methodology",
          "Calculation formulas, assumptions, limitations, and tax data freshness notes are exposed for review.",
        ),
      ],
    },
    {
      id: "seo-evidence",
      title: "Production Evidence Package",
      goal: "Attach machine-readable proof that the live site remains crawlable, structured, and boundary-safe.",
      items: [
        item(
          "Production SEO artifact",
          "production-seo-evidence",
          "GitHub Actions retains smoke, GSC, DNS, security headers, health, crawl discovery, internal links, HTML quality, performance, structured data, blog discovery, professional UI, and review-packet evidence.",
        ),
        item(
          "Health endpoint",
          "/api/health",
          "The public health payload keeps status, tax year, content counts, feature counts, and pending professional-review status available for operations review.",
        ),
        item(
          "Review packet evidence",
          "professional-review-packet-evidence-result.json",
          "The evidence command verifies this page, sitemap inclusion, llms.txt discovery, and retained pending-review language.",
        ),
      ],
    },
    {
      id: "review-handoff",
      title: "Reviewer Handoff",
      goal: "Turn the website state into a concrete review packet rather than a loose set of links.",
      items: [
        item(
          "Calculator scenario packet",
          "Copy CPA packet / PDF report",
          "A user or reviewer can export a scenario with inputs, modeled outputs, assumptions, and review warnings.",
        ),
        item(
          "CPA checklist",
          "/cpa-review-checklist",
          "The checklist lists documents, basis records, account balances, payment method questions, model limits, and recordkeeping items.",
        ),
        item(
          "Stop condition",
          "Do not mark reviewed until completed",
          "Do not change public status from pending until a qualified reviewer and review date are recorded in source-controlled content.",
        ),
      ],
    },
  ];
}

export function getProfessionalReviewPacketSummary(sections: ProfessionalReviewPacketSection[]) {
  const items = sections.flatMap((section) => section.items);

  return {
    sectionCount: sections.length,
    itemCount: items.length,
    evidenceTypes: Array.from(new Set(items.map((entry) => entry.evidence))),
    pendingReviewRetained: items.some((entry) => entry.evidence.toLowerCase().includes("pending")),
  };
}
