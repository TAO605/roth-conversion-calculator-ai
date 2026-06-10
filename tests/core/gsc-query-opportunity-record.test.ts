import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildGscQueryOpportunityBacklogSummary } from "../../scripts/gsc-query-opportunity-backlog-summary.mjs";
import { buildGscQueryOpportunityDraft, pickGscQueryOpportunityCluster } from "../../scripts/generate-gsc-query-opportunity-draft.mjs";
import { buildGscQueryOpportunityImport } from "../../scripts/import-gsc-query-opportunities.mjs";
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

  it("summarizes query opportunity records into a review-gated backlog", () => {
    const { draft } = buildGscQueryOpportunityDraft({
      averagePosition: "12.3",
      clicks: "1",
      ctr: "5",
      dateEnd: "2026-06-05",
      dateStart: "2026-06-01",
      evidencePath: "docs/evidence/gsc-query-state-tax.png",
      impressions: "20",
      owner: "SEO/content",
      query: "roth conversion state tax calculator",
      sourceType: "gsc_screenshot",
      templatePath: "docs/search-console-query-opportunity-template.json",
    });
    const template = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "docs/search-console-query-opportunity-template.json"), "utf8"),
    );
    const summary = buildGscQueryOpportunityBacklogSummary([template, draft]);

    expect(summary).toMatchObject({
      ok: true,
      recordCount: 2,
      actionableCount: 1,
      byRecordStatus: { template: 1, draft: 1 },
      byRiskLevel: { review: 1, professional: 1 },
      templateOnly: false,
    });
    expect(summary.actionableRecords[0]).toMatchObject({
      matchedCluster: "State and filing-status questions",
      query: "roth conversion state tax calculator",
      readyForRecordedEvidence: false,
    });
  });

  it("imports a GSC Performance CSV export into safe query opportunity records", () => {
    const tmpDir = path.join(process.cwd(), "test-results", "gsc-query-import");
    const csvPath = path.join(tmpDir, "performance.csv");

    fs.rmSync(tmpDir, { force: true, recursive: true });
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(
      csvPath,
      [
        "Query,Clicks,Impressions,CTR,Position",
        '"roth conversion irmaa impact",2,44,4.5%,9.4',
        '"roth conversion state tax calculator",1,20,5%,12.3',
        '"tiny one-off query",0,0,0%,0',
      ].join("\n"),
      "utf8",
    );

    const result = buildGscQueryOpportunityImport({
      csvPath,
      dateEnd: "2026-06-09",
      dateStart: "2026-06-01",
      exportedAt: "2026-06-09T13:45:00.000Z",
      limit: "10",
      minImpressions: "1",
      outputDir: tmpDir,
      owner: "SEO/content",
    });

    expect(result).toMatchObject({
      ok: true,
      evidenceType: "gsc-query-opportunity-import",
      importedCount: 2,
      actionableCount: 2,
      rowCount: 3,
    });
    expect(result.privacyBoundary).toContain("does not control Search Console");
    expect(result.records.map((record) => record.matchedCluster)).toEqual(
      expect.arrayContaining(["Hidden tax interaction questions", "State and filing-status questions"]),
    );
    expect(result.backlog.templateOnly).toBe(false);
    expect(result.backlog.actionableRecords.map((record) => record.query)).toEqual(
      expect.arrayContaining(["roth conversion irmaa impact", "roth conversion state tax calculator"]),
    );

    for (const record of result.records) {
      const parsed = JSON.parse(fs.readFileSync(record.filePath, "utf8"));
      expect(validateGscQueryOpportunityRecord(parsed).ok).toBe(true);
      expect(parsed.evidence.screenshotOrExportPath).toBe(csvPath);
    }
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
