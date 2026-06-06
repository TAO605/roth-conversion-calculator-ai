import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { validateGscQueryOpportunityRecord } from "../../scripts/validate-gsc-query-opportunity-record.mjs";

describe("GSC query opportunity record validator", () => {
  it("accepts the shipped template without private GSC data", () => {
    const template = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "docs/search-console-query-opportunity-template.json"), "utf8"),
    );
    const result = validateGscQueryOpportunityRecord(template);

    expect(result).toMatchObject({
      ok: true,
      recordStatus: "template",
      riskLevel: "review",
      reviewBoundary:
        "This validator checks query-opportunity records and YMYL boundaries; it does not fetch private Google Search Console data.",
    });
  });

  it("accepts a recorded professional-risk query with evidence and review gate", () => {
    const result = validateGscQueryOpportunityRecord({
      recordStatus: "recorded",
      source: {
        property: "https://www.roth-conversion-calculator-ai.shop/",
        dateRange: { start: "2026-06-01", end: "2026-06-05" },
        exportedAt: "2026-06-06T03:30:00Z",
        sourceType: "gsc_performance_export",
      },
      query: "roth conversion state tax calculator",
      metrics: { clicks: 1, impressions: 20, ctr: 0.05, averagePosition: 12.3 },
      matchedCluster: "State and filing-status questions",
      intentSummary: "User wants state-rate assumptions reflected without full state-law modeling.",
      targetSurface: "/states and calculator state tax input",
      recommendedAction: "Refresh educational state assumption copy and link to professional review where needed.",
      riskLevel: "professional",
      reviewGate: "Professional review required before adding state-specific deductions or exclusions.",
      evidence: {
        screenshotOrExportPath: "docs/evidence/gsc-query-state-tax.csv",
        productionSeoEvidenceRunId: "27051002027",
        productionSeoEvidenceCommitSha: "9e8782d477704737d70fefbf775ecffaa0418df1",
      },
      decision: {
        status: "planned",
        owner: "SEO/content",
        nextReviewDate: "2026-06-12",
        notes: "Keep the action educational and assumption-based.",
      },
      guardrails: [
        "Do not turn a query into personal tax advice.",
        "Use professional review before state-specific modeling changes.",
      ],
    });

    expect(result).toMatchObject({
      ok: true,
      recordStatus: "recorded",
      query: "roth conversion state tax calculator",
      riskLevel: "professional",
      decisionStatus: "planned",
    });
  });

  it("blocks recorded query actions that sound like personal tax recommendations", () => {
    const result = validateGscQueryOpportunityRecord({
      recordStatus: "recorded",
      source: {
        property: "https://www.roth-conversion-calculator-ai.shop/",
        dateRange: { start: "2026-06-01", end: "2026-06-05" },
        exportedAt: "",
        sourceType: "manual_gsc_review",
      },
      query: "how much should I convert",
      metrics: { clicks: 0, impressions: 5, ctr: null, averagePosition: null },
      matchedCluster: "Bracket room questions",
      intentSummary: "User is asking for exact planning guidance.",
      targetSurface: "Homepage result summary",
      recommendedAction: "Tell the user the best amount they should convert.",
      riskLevel: "professional",
      reviewGate: "Professional review required before adding new formulas.",
      evidence: {
        screenshotOrExportPath: "docs/evidence/gsc-query-example.png",
        productionSeoEvidenceRunId: "",
        productionSeoEvidenceCommitSha: "",
      },
      decision: { status: "needs_review", owner: "", nextReviewDate: "", notes: "" },
      guardrails: ["Do not turn a query into personal tax advice.", "Keep review gates."],
    });

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.field)).toContain("ymylLanguage");
  });
});
