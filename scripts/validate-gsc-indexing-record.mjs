import fs from "node:fs";

const DEFAULT_RECORD_PATH = "docs/search-console-indexing-record-template.json";
const EVIDENCE_TYPE = "search-console-indexing-record";
const EXPECTED_HOST = "www.roth-conversion-calculator-ai.shop";
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const GITHUB_SHA_PATTERN = /^[a-f0-9]{40}$/i;
const GITHUB_RUN_ID_PATTERN = /^\d+$/;
const INDEXING_STATES = new Set([
  "indexed",
  "not_on_google",
  "discovered_not_indexed",
  "crawled_not_indexed",
  "duplicate_without_user_selected_canonical",
  "alternate_canonical",
  "blocked",
  "unknown",
]);
const LIVE_TEST_STATES = new Set(["can_be_indexed", "cannot_be_indexed", "not_run", "unknown"]);
const REQUEST_INDEXING_OUTCOMES = new Set([
  "submitted",
  "transient_error",
  "not_attempted",
  "quota_limited",
  "blocked",
  "unknown",
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").trim();

  assert(raw.startsWith("{") && raw.endsWith("}"), `${filePath} must contain a single JSON object`);

  return JSON.parse(raw);
}

function isPlaceholder(value) {
  return typeof value === "string" && value.startsWith("REPLACE_WITH_");
}

function parseUrl(value, label) {
  assert(typeof value === "string" && value.length > 0, `${label} must be a non-empty URL`);
  const url = new URL(value);

  assert(url.protocol === "https:", `${label} must use https`);
  assert(url.hostname === EXPECTED_HOST, `${label} must stay on ${EXPECTED_HOST}`);

  return url;
}

function validateBoolean(value, label) {
  assert(typeof value === "boolean", `${label} must be boolean`);
}

function validateTemplate(record) {
  assert(record.recordStatus === "template", "template record must keep recordStatus: template");
  assert(isPlaceholder(record.recordedAt), "template recordedAt must remain a replacement placeholder");
  assert(isPlaceholder(record.recordedBy), "template recordedBy must remain a replacement placeholder");
  assert(record.indexingState === "unknown", "template indexingState should start as unknown");
  assert(record.liveTestState === "not_run", "template liveTestState should start as not_run");
  assert(isPlaceholder(record.siteEvidence.productionSeoEvidenceRunId), "template run id must remain a replacement placeholder");
  assert(
    isPlaceholder(record.siteEvidence.productionSeoEvidenceCommitSha),
    "template commit sha must remain a replacement placeholder",
  );
}

function validateRecorded(record) {
  assert(record.recordStatus === "recorded", "real GSC indexing records must use recordStatus: recorded");
  assert(ISO_TIMESTAMP_PATTERN.test(record.recordedAt), "recordedAt must be an ISO timestamp");
  assert(typeof record.recordedBy === "string" && record.recordedBy.length >= 2, "recordedBy must identify the reviewer");
  assert(!isPlaceholder(record.recordedBy), "recordedBy must not be a template placeholder");
  assert(record.indexingState !== "unknown", "recorded indexingState must not be unknown");
  assert(!isPlaceholder(record.googleSelectedCanonical), "googleSelectedCanonical must not be a template placeholder");
  assert(
    GITHUB_RUN_ID_PATTERN.test(record.siteEvidence.productionSeoEvidenceRunId),
    "productionSeoEvidenceRunId must be numeric",
  );
  assert(
    GITHUB_SHA_PATTERN.test(record.siteEvidence.productionSeoEvidenceCommitSha),
    "productionSeoEvidenceCommitSha must be a 40-character SHA",
  );
  assert(
    record.screenshots.some((screenshot) => !isPlaceholder(screenshot.pathOrUrl)),
    "recorded GSC indexing records must include at least one real screenshot path or URL",
  );
  assert(typeof record.notes === "string" && record.notes.length >= 20, "notes must retain the observed GSC context");
  assert(!record.notes.includes("Replace this template"), "recorded notes must not keep template instructions");
}

function validateRecord(record) {
  assert(record.evidenceType === EVIDENCE_TYPE, "GSC indexing record evidenceType changed unexpectedly");
  assert(record.recordStatus === "template" || record.recordStatus === "recorded", "recordStatus must be template or recorded");
  assert(record.property?.type === "url-prefix" || record.property?.type === "domain", "property.type must be url-prefix or domain");
  parseUrl(record.property.url, "property.url");
  parseUrl(record.inspectedUrl, "inspectedUrl");
  assert(record.inspectionSource === "Google Search Console URL Inspection", "inspectionSource must be URL Inspection");
  assert(INDEXING_STATES.has(record.indexingState), "indexingState is not an allowed value");
  assert(LIVE_TEST_STATES.has(record.liveTestState), "liveTestState is not an allowed value");
  assert(
    record.googleSelectedCanonical === "" ||
      isPlaceholder(record.googleSelectedCanonical) ||
      new URL(record.googleSelectedCanonical).protocol === "https:",
    "googleSelectedCanonical must be empty, a placeholder, or an https URL",
  );
  parseUrl(record.userDeclaredCanonical, "userDeclaredCanonical");
  assert(
    record.lastCrawlAt === null || ISO_TIMESTAMP_PATTERN.test(record.lastCrawlAt),
    "lastCrawlAt must be null or an ISO timestamp",
  );
  validateBoolean(record.requestIndexing?.attempted, "requestIndexing.attempted");
  assert(
    record.requestIndexing.attemptedAt === null || ISO_TIMESTAMP_PATTERN.test(record.requestIndexing.attemptedAt),
    "requestIndexing.attemptedAt must be null or an ISO timestamp",
  );
  assert(REQUEST_INDEXING_OUTCOMES.has(record.requestIndexing.outcome), "requestIndexing.outcome is not allowed");
  assert(
    typeof record.requestIndexing.exactMessage === "string",
    "requestIndexing.exactMessage must be retained as a string",
  );
  for (const field of [
    "gscEvidenceOk",
    "searchConsoleVerificationOk",
    "internalLinkEvidenceOk",
    "htmlQualityEvidenceOk",
  ]) {
    validateBoolean(record.siteEvidence?.[field], `siteEvidence.${field}`);
  }
  assert(Array.isArray(record.screenshots), "screenshots must be an array");
  assert(record.screenshots.length >= 1, "screenshots must include at least one item");
  for (const screenshot of record.screenshots) {
    assert(typeof screenshot.label === "string" && screenshot.label.length > 0, "screenshot.label is required");
    assert(typeof screenshot.pathOrUrl === "string" && screenshot.pathOrUrl.length > 0, "screenshot.pathOrUrl is required");
  }

  if (record.recordStatus === "template") {
    validateTemplate(record);
  } else {
    validateRecorded(record);
  }
}

try {
  const recordPath = process.argv[2] || DEFAULT_RECORD_PATH;
  const record = readJson(recordPath);

  validateRecord(record);

  console.log(
    JSON.stringify(
      {
        evidenceType: EVIDENCE_TYPE,
        inspectedUrl: record.inspectedUrl,
        indexingState: record.indexingState,
        liveTestState: record.liveTestState,
        ok: true,
        recordPath,
        recordStatus: record.recordStatus,
        requestIndexingOutcome: record.requestIndexing.outcome,
        screenshotCount: record.screenshots.length,
        siteEvidenceLinked:
          record.siteEvidence.gscEvidenceOk === true &&
          record.siteEvidence.searchConsoleVerificationOk === true &&
          record.siteEvidence.internalLinkEvidenceOk === true &&
          record.siteEvidence.htmlQualityEvidenceOk === true,
      },
      null,
      2,
    ),
  );
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
