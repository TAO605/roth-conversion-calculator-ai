import fs from "node:fs";

const DEFAULT_RECORD_PATH = "docs/search-console-indexing-record-template.json";
const EVIDENCE_TYPE = "search-console-indexing-record-readiness";
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

function addMissing(missing, field, source, action) {
  missing.push({ action, field, source });
}

function collectMissingReviewerFields(record) {
  const missing = [];

  if (!record.recordStatus || record.recordStatus === "template") {
    addMissing(missing, "recordStatus", "Reviewer", "Generate a draft or mark as recorded only after copying real GSC values.");
  }

  if (!ISO_TIMESTAMP_PATTERN.test(record.recordedAt || "")) {
    addMissing(missing, "recordedAt", "Reviewer", "Use the capture timestamp in ISO format.");
  }

  if (!record.recordedBy || isPlaceholder(record.recordedBy) || record.recordedBy === "AI-assisted draft") {
    addMissing(missing, "recordedBy", "Reviewer", "Identify the human reviewer or approved review role.");
  }

  if (!record.indexingState || record.indexingState === "unknown") {
    addMissing(missing, "indexingState", "GSC URL Inspection", "Copy the exact observed indexing state.");
  }

  if (!record.liveTestState || record.liveTestState === "not_run" || record.liveTestState === "unknown") {
    addMissing(missing, "liveTestState", "GSC live test", "Run or record the live-test state when available.");
  }

  if (isPlaceholder(record.googleSelectedCanonical)) {
    addMissing(
      missing,
      "googleSelectedCanonical",
      "GSC URL Inspection canonical panel",
      "Copy Google's selected canonical or use an empty string only when GSC shows none.",
    );
  }

  if (record.requestIndexing?.attempted && !ISO_TIMESTAMP_PATTERN.test(record.requestIndexing.attemptedAt || "")) {
    addMissing(missing, "requestIndexing.attemptedAt", "Request indexing action", "Record the request timestamp.");
  }

  if (isPlaceholder(record.requestIndexing?.exactMessage)) {
    addMissing(
      missing,
      "requestIndexing.exactMessage",
      "Request indexing action",
      "Copy the exact GSC message or use an empty string if no request was attempted.",
    );
  }

  if (!GITHUB_RUN_ID_PATTERN.test(record.siteEvidence?.productionSeoEvidenceRunId || "")) {
    addMissing(missing, "siteEvidence.productionSeoEvidenceRunId", "Production SEO artifact", "Link the GitHub Actions run id.");
  }

  if (!GITHUB_SHA_PATTERN.test(record.siteEvidence?.productionSeoEvidenceCommitSha || "")) {
    addMissing(missing, "siteEvidence.productionSeoEvidenceCommitSha", "Production SEO artifact", "Link the 40-character commit SHA.");
  }

  if (!record.screenshots?.some((screenshot) => !isPlaceholder(screenshot.pathOrUrl))) {
    addMissing(missing, "screenshots.pathOrUrl", "GSC screenshot", "Attach at least one real screenshot path or URL.");
  }

  if (!record.notes || record.notes.length < 20 || record.notes.includes("Replace this template")) {
    addMissing(missing, "notes", "Reviewer", "Record the observed context and any retry outcome.");
  }

  return missing;
}

function main() {
  const recordPath = process.argv[2] || DEFAULT_RECORD_PATH;
  const record = readJson(recordPath);
  const missingReviewerFields = collectMissingReviewerFields(record);
  const readyForRecordedEvidence = record.recordStatus === "recorded" && missingReviewerFields.length === 0;

  console.log(
    JSON.stringify(
      {
        evidenceType: EVIDENCE_TYPE,
        inspectedUrl: record.inspectedUrl,
        missingReviewerFieldCount: missingReviewerFields.length,
        missingReviewerFields,
        ok: true,
        readyForRecordedEvidence,
        recordPath,
        recordStatus: record.recordStatus,
        reviewBoundary:
          "This readiness report identifies missing reviewer-supplied GSC fields; it does not infer private Search Console status from site-side evidence.",
      },
      null,
      2,
    ),
  );
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
