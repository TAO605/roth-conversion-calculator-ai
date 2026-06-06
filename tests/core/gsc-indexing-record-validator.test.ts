import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(process.cwd(), "scripts/validate-gsc-indexing-record.mjs");
const draftScriptPath = path.join(process.cwd(), "scripts/generate-gsc-indexing-record-draft.mjs");
const readinessScriptPath = path.join(process.cwd(), "scripts/gsc-indexing-record-readiness.mjs");
const summaryScriptPath = path.join(process.cwd(), "scripts/gsc-indexing-record-summary.mjs");
const manifestScriptPath = path.join(process.cwd(), "scripts/generate-gsc-indexing-records-manifest.mjs");
const templatePath = path.join(process.cwd(), "docs/search-console-indexing-record-template.json");

function runValidator(recordPath: string) {
  return execFileSync("node", [scriptPath, recordPath], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

describe("GSC indexing record validator", () => {
  it("validates the shipped template without claiming private GSC state", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const template = JSON.parse(fs.readFileSync(templatePath, "utf8")) as {
      evidenceType: string;
      recordStatus: string;
      notes: string;
    };
    const output = JSON.parse(runValidator(templatePath)) as {
      ok: boolean;
      recordStatus: string;
      siteEvidenceLinked: boolean;
    };

    expect(packageJson.scripts["seo:gsc-indexing-record-validate"]).toBe(
      "node scripts/validate-gsc-indexing-record.mjs",
    );
    expect(packageJson.scripts["seo:gsc-indexing-record-draft"]).toBe(
      "node scripts/generate-gsc-indexing-record-draft.mjs",
    );
    expect(packageJson.scripts["seo:gsc-indexing-record-ready"]).toBe(
      "node scripts/gsc-indexing-record-readiness.mjs",
    );
    expect(packageJson.scripts["seo:gsc-indexing-record-summary"]).toBe(
      "node scripts/gsc-indexing-record-summary.mjs",
    );
    expect(packageJson.scripts["seo:gsc-indexing-records-manifest"]).toBe(
      "node scripts/generate-gsc-indexing-records-manifest.mjs",
    );
    expect(template.evidenceType).toBe("search-console-indexing-record");
    expect(template.recordStatus).toBe("template");
    expect(template.notes).toContain("Do not infer private GSC state from site-side evidence");
    expect(output).toMatchObject({
      ok: true,
      recordStatus: "template",
      siteEvidenceLinked: true,
    });
  });

  it("reports reviewer-supplied fields still missing from an AI-assisted draft", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-ready-draft-"));
    const recordPath = path.join(tempDir, "draft.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "draft";
    record.recordedAt = "2026-06-05T11:44:20.919Z";
    record.recordedBy = "AI-assisted draft";
    record.siteEvidence.productionSeoEvidenceRunId = "27013209297";
    record.siteEvidence.productionSeoEvidenceCommitSha = "527d16e2e052bee496a679f6112a00445e9fb279";
    record.requestIndexing.exactMessage = "REPLACE_WITH_EXACT_GSC_REQUEST_INDEXING_MESSAGE_OR_EMPTY";
    record.notes =
      "AI filled public site evidence from the production SEO artifact when available. Copy private GSC fields before recording.";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(
      execFileSync("node", [readinessScriptPath, recordPath], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ) as {
      missingReviewerFieldCount: number;
      missingReviewerFields: Array<{ field: string }>;
      ok: boolean;
      readyForRecordedEvidence: boolean;
    };
    const fields = output.missingReviewerFields.map((item) => item.field);

    expect(output.ok).toBe(true);
    expect(output.readyForRecordedEvidence).toBe(false);
    expect(output.missingReviewerFieldCount).toBeGreaterThanOrEqual(5);
    expect(fields).toEqual(
      expect.arrayContaining([
        "recordedBy",
        "indexingState",
        "liveTestState",
        "googleSelectedCanonical",
        "requestIndexing.exactMessage",
        "screenshots.pathOrUrl",
      ]),
    );
  });

  it("marks a fully recorded URL Inspection record ready for archive", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-ready-recorded-"));
    const recordPath = path.join(tempDir, "recorded.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "recorded";
    record.recordedAt = "2026-06-05T12:10:00.000Z";
    record.recordedBy = "Codex assisted reviewer";
    record.indexingState = "indexed";
    record.liveTestState = "can_be_indexed";
    record.googleSelectedCanonical = "https://www.roth-conversion-calculator-ai.shop/seo-monitoring";
    record.requestIndexing = {
      attempted: true,
      attemptedAt: "2026-06-05T12:11:00.000Z",
      exactMessage: "Request indexing submitted.",
      outcome: "submitted",
    };
    record.siteEvidence.productionSeoEvidenceRunId = "27013209297";
    record.siteEvidence.productionSeoEvidenceCommitSha = "527d16e2e052bee496a679f6112a00445e9fb279";
    record.screenshots = [
      {
        label: "URL Inspection result",
        pathOrUrl: "C:/Users/86189/Documents/gsc-url-inspection-seo-monitoring.png",
      },
    ];
    record.notes = "GSC URL Inspection was manually reviewed and the result was copied into this record.";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(
      execFileSync("node", [readinessScriptPath, recordPath], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ) as {
      missingReviewerFieldCount: number;
      ok: boolean;
      readyForRecordedEvidence: boolean;
    };

    expect(output).toMatchObject({
      missingReviewerFieldCount: 0,
      ok: true,
      readyForRecordedEvidence: true,
    });
  });

  it("summarizes a recorded URL Inspection record for archive handoff", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-summary-"));
    const recordPath = path.join(tempDir, "recorded.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "recorded";
    record.recordedAt = "2026-06-06T01:50:00.000Z";
    record.recordedBy = "Codex assisted reviewer";
    record.indexingState = "indexed";
    record.liveTestState = "can_be_indexed";
    record.googleSelectedCanonical = "https://www.roth-conversion-calculator-ai.shop/seo-monitoring";
    record.requestIndexing = {
      attempted: true,
      attemptedAt: "2026-06-06T01:51:00.000Z",
      exactMessage: "Request indexing submitted.",
      outcome: "submitted",
    };
    record.siteEvidence.productionSeoEvidenceRunId = "27049063159";
    record.siteEvidence.productionSeoEvidenceCommitSha = "15f717e77e785e5aed95d044eec2b731abae568b";
    record.screenshots = [
      {
        label: "URL Inspection result",
        pathOrUrl: "C:/Users/86189/Documents/gsc-url-inspection-seo-monitoring.png",
      },
    ];
    record.notes = "GSC URL Inspection was manually reviewed and copied for archive handoff.";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(
      execFileSync("node", [summaryScriptPath, recordPath], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ) as {
      blockingFields: string[];
      ok: boolean;
      readyForHandoff: boolean;
      summaryMarkdown: string;
    };

    expect(output).toMatchObject({
      blockingFields: [],
      ok: true,
      readyForHandoff: true,
    });
    expect(output.summaryMarkdown).toContain("GSC indexing record for https://www.roth-conversion-calculator-ai.shop/seo-monitoring is ready");
    expect(output.summaryMarkdown).toContain("Status: indexed; live test: can_be_indexed");
    expect(output.summaryMarkdown).toContain("run 27049063159");
    expect(output.summaryMarkdown).not.toMatch(/inferred|guaranteed|100% accurate/i);
  });

  it("keeps draft summaries marked as not ready without inferring GSC status", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-summary-draft-"));
    const recordPath = path.join(tempDir, "draft.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "draft";
    record.recordedAt = "2026-06-06T01:50:00.000Z";
    record.recordedBy = "AI-assisted draft";
    record.siteEvidence.productionSeoEvidenceRunId = "27049063159";
    record.siteEvidence.productionSeoEvidenceCommitSha = "15f717e77e785e5aed95d044eec2b731abae568b";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(
      execFileSync("node", [summaryScriptPath, recordPath], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ) as {
      blockingFields: string[];
      readyForHandoff: boolean;
      summaryMarkdown: string;
    };

    expect(output.readyForHandoff).toBe(false);
    expect(output.blockingFields).toEqual(expect.arrayContaining(["recordStatus", "indexingState"]));
    expect(output.summaryMarkdown).toContain("not ready for archive");
    expect(output.summaryMarkdown).toContain("Blocking fields:");
  });

  it("generates a manifest for archived recorded GSC indexing records and screenshots", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-records-manifest-"));
    const docsDir = path.join(tempDir, "docs");
    const evidenceDir = path.join(docsDir, "evidence");
    const recordPath = path.join(docsDir, "search-console-indexing-record-homepage-recorded.json");
    const screenshotPath = path.join(evidenceDir, "gsc-homepage-indexed-result.png");
    const outputPath = path.join(docsDir, "gsc-indexing-records-manifest.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    fs.mkdirSync(evidenceDir, { recursive: true });
    fs.writeFileSync(screenshotPath, Buffer.from("fake screenshot bytes"));

    record.recordStatus = "recorded";
    record.recordedAt = "2026-06-06T02:30:00.000Z";
    record.recordedBy = "Codex assisted reviewer";
    record.indexingState = "indexed";
    record.liveTestState = "can_be_indexed";
    record.googleSelectedCanonical = "";
    record.requestIndexing = {
      attempted: false,
      attemptedAt: null,
      exactMessage: "",
      outcome: "not_attempted",
    };
    record.siteEvidence.productionSeoEvidenceRunId = "27049420213";
    record.siteEvidence.productionSeoEvidenceCommitSha = "d03dc7802e424b202c636e556237ad99fa3ca638";
    record.screenshots = [
      {
        label: "URL Inspection result",
        pathOrUrl: path.relative(process.cwd(), screenshotPath).replace(/\\/g, "/"),
      },
    ];
    record.notes = "GSC URL Inspection screenshot was archived for homepage indexing evidence.";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(
      execFileSync(
        "node",
        [manifestScriptPath, "--docsDir", docsDir, "--out", outputPath],
        {
          cwd: process.cwd(),
          encoding: "utf8",
        },
      ),
    ) as {
      ok: boolean;
      recordCount: number;
      records: Array<{
        inspectedUrl: string;
        ok: boolean;
        recordStatus: string;
        screenshotsOk: boolean;
        screenshots: Array<{ exists: boolean; sha256: string }>;
      }>;
    };

    expect(output.ok).toBe(true);
    expect(output.recordCount).toBe(1);
    expect(output.records[0]).toMatchObject({
      inspectedUrl: "https://www.roth-conversion-calculator-ai.shop/seo-monitoring",
      ok: true,
      recordStatus: "recorded",
      screenshotsOk: true,
    });
    expect(output.records[0].screenshots[0].exists).toBe(true);
    expect(output.records[0].screenshots[0].sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it("generates and validates an AI-assisted draft from a production SEO artifact", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-draft-"));
    const artifactDir = path.join(tempDir, "artifact");
    const recordPath = path.join(tempDir, "draft.json");

    fs.mkdirSync(artifactDir);
    fs.writeFileSync(
      path.join(artifactDir, "seo-evidence-manifest.json"),
      JSON.stringify(
        {
          gitHubRunId: "27010627659",
          gitHubSha: "c8d1be09a42468cd2088d3206b4b2cf417e8869b",
        },
        null,
        2,
      ),
      "utf8",
    );
    fs.writeFileSync(
      path.join(artifactDir, "seo-evidence-validation-result.json"),
      JSON.stringify(
        {
          gscPriorityUrlCount: 6,
          htmlQualityPageCount: 121,
          internalLinkCheckedUrlCount: 121,
          ok: true,
          searchConsoleVerificationOk: true,
        },
        null,
        2,
      ),
      "utf8",
    );
    fs.writeFileSync(
      path.join(artifactDir, "seo-evidence-manifest-validation-result.json"),
      JSON.stringify({ ok: true }, null, 2),
      "utf8",
    );

    const draftOutput = execFileSync(
      "node",
      [
        draftScriptPath,
        "--url",
        "https://www.roth-conversion-calculator-ai.shop/seo-monitoring",
        "--artifact",
        artifactDir,
        "--out",
        recordPath,
      ],
      {
        cwd: process.cwd(),
        encoding: "utf8",
      },
    );
    const draft = JSON.parse(draftOutput) as {
      googleSelectedCanonical: string;
      notes: string;
      recordStatus: string;
      siteEvidence: {
        productionSeoEvidenceRunId: string;
        productionSeoEvidenceCommitSha: string;
        searchConsoleVerificationOk: boolean;
      };
    };
    const validationOutput = JSON.parse(runValidator(recordPath)) as {
      ok: boolean;
      recordStatus: string;
      siteEvidenceLinked: boolean;
    };

    expect(draft.recordStatus).toBe("draft");
    expect(draft.googleSelectedCanonical).toBe("REPLACE_WITH_GSC_VALUE_OR_EMPTY");
    expect(draft.notes).toContain("AI filled public site evidence");
    expect(draft.siteEvidence).toMatchObject({
      productionSeoEvidenceRunId: "27010627659",
      productionSeoEvidenceCommitSha: "c8d1be09a42468cd2088d3206b4b2cf417e8869b",
      searchConsoleVerificationOk: true,
    });
    expect(validationOutput).toMatchObject({
      ok: true,
      recordStatus: "draft",
      siteEvidenceLinked: true,
    });
  });

  it("accepts a filled recorded URL Inspection record", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-"));
    const recordPath = path.join(tempDir, "record.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "recorded";
    record.recordedAt = "2026-06-05T05:55:00.000Z";
    record.recordedBy = "Codex assisted reviewer";
    record.indexingState = "discovered_not_indexed";
    record.liveTestState = "can_be_indexed";
    record.googleSelectedCanonical = "https://www.roth-conversion-calculator-ai.shop/seo-monitoring";
    record.lastCrawlAt = "2026-06-05T05:50:00.000Z";
    record.requestIndexing = {
      attempted: true,
      attemptedAt: "2026-06-05T05:56:00.000Z",
      exactMessage: "Request indexing returned a transient Google submission error.",
      outcome: "transient_error",
    };
    record.siteEvidence.productionSeoEvidenceRunId = "26997990436";
    record.siteEvidence.productionSeoEvidenceCommitSha = "6f16ae0ec251b376176e39b1e4875a794988722f";
    record.screenshots = [
      {
        label: "URL Inspection result",
        pathOrUrl: "C:/Users/86189/Documents/gsc-url-inspection-seo-monitoring.png",
      },
    ];
    record.notes =
      "URL Inspection was manually reviewed in the verified URL-prefix property; the live test was indexable and the request-indexing response was transient.";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    const output = JSON.parse(runValidator(recordPath)) as {
      indexingState: string;
      ok: boolean;
      recordStatus: string;
      requestIndexingOutcome: string;
    };

    expect(output).toMatchObject({
      indexingState: "discovered_not_indexed",
      ok: true,
      recordStatus: "recorded",
      requestIndexingOutcome: "transient_error",
    });
  });

  it("rejects recorded entries that keep template placeholders", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-indexing-record-bad-"));
    const recordPath = path.join(tempDir, "record.json");
    const record = JSON.parse(fs.readFileSync(templatePath, "utf8"));

    record.recordStatus = "recorded";
    fs.writeFileSync(recordPath, JSON.stringify(record, null, 2), "utf8");

    expect(() => runValidator(recordPath)).toThrow(/recordedAt must be an ISO timestamp/);
  });
});
