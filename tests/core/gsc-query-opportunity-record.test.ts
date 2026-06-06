import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildGscQueryOpportunityDraft, pickGscQueryOpportunityCluster } from "../../scripts/generate-gsc-query-opportunity-draft.mjs";
import { buildGscQueryOpportunityReadiness } from "../../scripts/gsc-query-opportunity-readiness.mjs";
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

  it("reports missing reviewer fields for the shipped template", () => {
    const template = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "docs/search-console-query-opportunity-template.json"), "utf8"),
    );
    const readiness = buildGscQueryOpportunityReadiness(template);

    expect(readiness).toMatchObject({
      ok: true,
      readyForRecordedEvidence: false,
      recordStatus: "template",
      aiFillableFieldCount: 7,
    });
    expect(readiness.missingReviewerFieldCount).toBeGreaterThanOrEqual(9);
    expect(readiness.missingReviewerFields.map((field) => field.field)).toEqual(
      expect.arrayContaining([
        "recordStatus",
        "source.dateRange.start",
        "source.dateRange.end",
        "query",
        "matchedCluster",
        "intentSummary",
        "targetSurface",
        "recommendedAction",
        "reviewGate",
        "evidence.screenshotOrExportPath",
        "decision.owner",
      ]),
    );
  });

  it("generates an AI-assisted draft from a reviewer-supplied GSC query row", () => {
    const { draft, generationEvidence } = buildGscQueryOpportunityDraft({
      averagePosition: "9.4",
      clicks: "2",
      ctr: "4.5",
      dateEnd: "2026-06-05",
      dateStart: "2026-06-01",
      evidencePath: "docs/evidence/gsc-query-irmaa.png",
      impressions: "44",
      owner: "SEO/content",
      query: "roth conversion irmaa impact",
      sourceType: "gsc_screenshot",
      templatePath: "docs/search-console-query-opportunity-template.json",
    });

    expect(draft).toMatchObject({
      recordStatus: "draft",
      query: "roth conversion irmaa impact",
      matchedCluster: "Hidden tax interaction questions",
      riskLevel: "professional",
      decision: { status: "needs_review", owner: "SEO/content" },
      metrics: { clicks: 2, impressions: 44, ctr: 0.045, averagePosition: 9.4 },
    });
    expect(draft.recommendedAction).not.toMatch(/should convert|best amount|guaranteed|100% accurate/i);
    expect(generationEvidence).toMatchObject({
      ok: true,
      evidenceType: "gsc-query-opportunity-draft-generation",
      matchedCluster: "Hidden tax interaction questions",
    });
    expect(validateGscQueryOpportunityRecord(draft).ok).toBe(true);
    expect(buildGscQueryOpportunityReadiness(draft).readyForRecordedEvidence).toBe(false);
  });

  it("maps observed queries to the nearest safe opportunity cluster", () => {
    expect(pickGscQueryOpportunityCluster("pay roth conversion tax with outside funds").cluster).toBe(
      "Payment and withholding questions",
    );
    expect(pickGscQueryOpportunityCluster("roth conversion married filing jointly").cluster).toBe(
      "State and filing-status questions",
    );
    expect(pickGscQueryOpportunityCluster("roth conversion state tax calculator").cluster).toBe(
      "State and filing-status questions",
    );
    expect(pickGscQueryOpportunityCluster("form 8606 roth conversion").cluster).toBe(
      "Process, forms, and CPA handoff questions",
    );
  });

  it("accepts a recorded professional-risk query with evidence and review gate", () => {
    const record = {
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
    };
    const result = validateGscQueryOpportunityRecord(record);
    const readiness = buildGscQueryOpportunityReadiness(record);

    expect(result).toMatchObject({
      ok: true,
      recordStatus: "recorded",
      query: "roth conversion state tax calculator",
      riskLevel: "professional",
      decisionStatus: "planned",
    });
    expect(readiness).toMatchObject({
      ok: true,
      readyForRecordedEvidence: true,
      missingReviewerFieldCount: 0,
      recordStatus: "recorded",
    });
  });

  it("blocks recorded query actions that sound like personal tax recommendations", () => {
    const record = {
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
    };
    const result = validateGscQueryOpportunityRecord(record);

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.field)).toContain("ymylLanguage");
    expect(buildGscQueryOpportunityReadiness(record).readyForRecordedEvidence).toBe(false);
  });
});
