import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const scriptPath = path.join(process.cwd(), "scripts/validate-gsc-indexing-record.mjs");
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
    expect(template.evidenceType).toBe("search-console-indexing-record");
    expect(template.recordStatus).toBe("template");
    expect(template.notes).toContain("Do not infer private GSC state from site-side evidence");
    expect(output).toMatchObject({
      ok: true,
      recordStatus: "template",
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
