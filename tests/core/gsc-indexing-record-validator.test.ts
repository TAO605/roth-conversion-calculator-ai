import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(process.cwd(), "scripts/validate-gsc-indexing-record.mjs");
const draftScriptPath = path.join(process.cwd(), "scripts/generate-gsc-indexing-record-draft.mjs");
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
    expect(template.evidenceType).toBe("search-console-indexing-record");
    expect(template.recordStatus).toBe("template");
    expect(template.notes).toContain("Do not infer private GSC state from site-side evidence");
    expect(output).toMatchObject({
      ok: true,
      recordStatus: "template",
      siteEvidenceLinked: true,
    });
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
