import fs from "node:fs";

const DEFAULT_RECORD_PATH = "docs/search-console-indexing-record-template.json";
const EVIDENCE_TYPE = "search-console-indexing-record-summary";
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const GITHUB_SHA_PATTERN = /^[a-f0-9]{40}$/i;
const GITHUB_RUN_ID_PATTERN = /^\d+$/;

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();

  if (!raw.startsWith("{") || !raw.endsWith("}")) {
    throw new Error(`${filePath} must contain a single JSON object`);
  }

  return JSON.parse(raw);
}

function isPlaceholder(value) {
  return typeof value === "string" && value.startsWith("REPLACE_WITH_");
}

function collectBlockingFields(record) {
  const missing = [];

  if (record.recordStatus !== "recorded") missing.push("recordStatus");
  if (!ISO_TIMESTAMP_PATTERN.test(record.recordedAt || "")) missing.push("recordedAt");
  if (!record.recordedBy || isPlaceholder(record.recordedBy) || record.recordedBy === "AI-assisted draft") {
    missing.push("recordedBy");
  }
  if (!record.indexingState || record.indexingState === "unknown") missing.push("indexingState");
  if (!record.liveTestState || record.liveTestState === "not_run" || record.liveTestState === "unknown") {
    missing.push("liveTestState");
  }
  if (isPlaceholder(record.googleSelectedCanonical)) missing.push("googleSelectedCanonical");
  if (isPlaceholder(record.requestIndexing?.exactMessage)) missing.push("requestIndexing.exactMessage");
  if (!GITHUB_RUN_ID_PATTERN.test(record.siteEvidence?.productionSeoEvidenceRunId || "")) {
    missing.push("siteEvidence.productionSeoEvidenceRunId");
  }
  if (!GITHUB_SHA_PATTERN.test(record.siteEvidence?.productionSeoEvidenceCommitSha || "")) {
    missing.push("siteEvidence.productionSeoEvidenceCommitSha");
  }
  if (!record.screenshots?.some((screenshot) => !isPlaceholder(screenshot.pathOrUrl))) {
    missing.push("screenshots.pathOrUrl");
  }
  if (!record.notes || record.notes.length < 20 || record.notes.includes("Replace this template")) missing.push("notes");

  return missing;
}

function buildSummary(record, recordPath) {
  const blockingFields = collectBlockingFields(record);
  const readyForHandoff = blockingFields.length === 0;
  const request = record.requestIndexing || {};
  const siteEvidence = record.siteEvidence || {};
  const firstScreenshot = record.screenshots?.find((screenshot) => !isPlaceholder(screenshot.pathOrUrl));
  const summaryLines = [
    `GSC indexing record for ${record.inspectedUrl || "unknown URL"} is ${readyForHandoff ? "ready" : "not ready"} for archive.`,
    `Status: ${record.indexingState || "unknown"}; live test: ${record.liveTestState || "unknown"}; Google-selected canonical: ${record.googleSelectedCanonical || ""}.`,
    `Request indexing: ${request.outcome || "unknown"}${request.attemptedAt ? ` at ${request.attemptedAt}` : ""}.`,
    `Production evidence: run ${siteEvidence.productionSeoEvidenceRunId || "missing"}, commit ${siteEvidence.productionSeoEvidenceCommitSha || "missing"}.`,
    `Screenshot: ${firstScreenshot?.pathOrUrl || "missing"}.`,
  ];

  if (!readyForHandoff) {
    summaryLines.push(`Blocking fields: ${blockingFields.join(", ")}.`);
  }

  return {
    blockingFields,
    evidenceType: EVIDENCE_TYPE,
    inspectedUrl: record.inspectedUrl,
    ok: true,
    readyForHandoff,
    recordPath,
    recordStatus: record.recordStatus,
    reviewBoundary:
      "This summary only restates fields present in the GSC indexing record; it does not infer private Search Console status from site-side evidence.",
    summaryMarkdown: summaryLines.map((line) => `- ${line}`).join("\n"),
  };
}

function main() {
  const recordPath = process.argv[2] || DEFAULT_RECORD_PATH;
  const record = readJson(recordPath);

  console.log(JSON.stringify(buildSummary(record, recordPath), null, 2));
}

try {
  main();
} catch (error) {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        evidenceType: EVIDENCE_TYPE,
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
