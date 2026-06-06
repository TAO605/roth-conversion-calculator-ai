import fs from "node:fs";

const DEFAULT_RECORD_PATH = "docs/evidence/gsc-discovered-validation-final-2026-06-06.json";
const EVIDENCE_TYPE = "gsc-indexing-validation-action";
const EXPECTED_HOST = "www.roth-conversion-calculator-ai.shop";
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN_PRIVATE_PATTERNS = [
  /cookie=/i,
  /session/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /password/i,
  /authorization/i,
  /taoqi/i,
  /gmail/i,
  /Google \u8d26\u53f7/i,
];

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

function parseExpectedUrl(value, label) {
  assert(typeof value === "string" && value.length > 0, `${label} must be a non-empty URL`);
  const url = new URL(value);

  assert(url.protocol === "https:", `${label} must use https`);
  assert(url.hostname === EXPECTED_HOST, `${label} must stay on ${EXPECTED_HOST}`);

  return url;
}

function validateNoPrivatePayload(record) {
  const serialized = JSON.stringify(record);

  for (const pattern of FORBIDDEN_PRIVATE_PATTERNS) {
    assert(!pattern.test(serialized), `GSC validation action record must not include private account/session text: ${pattern}`);
  }

  assert(!("textExcerpt" in record), "GSC validation action record must not retain raw private GSC UI text");
  assert(!("screenshotPath" in record), "Public GSC validation action record must not include screenshot paths");
}

function validateRecord(record) {
  assert(record.ok === true, "GSC validation action record must be ok");
  assert(record.evidenceType === EVIDENCE_TYPE, "GSC validation action evidenceType changed unexpectedly");
  assert(record.action === "validate_fix_started", "GSC validation action must record validate_fix_started");
  assert(ISO_TIMESTAMP_PATTERN.test(record.checkedAt), "checkedAt must be an ISO timestamp");
  parseExpectedUrl(record.propertyUrl, "propertyUrl");

  assert(record.issue?.state === "discovered_not_indexed", "issue.state must be discovered_not_indexed");
  assert(record.issue?.label === "Discovered - currently not indexed", "issue.label changed unexpectedly");
  assert(record.issue?.affectedUrlCount >= 1, "issue.affectedUrlCount must be retained");
  assert(DATE_PATTERN.test(record.issue?.firstDetectedDate || ""), "issue.firstDetectedDate must be YYYY-MM-DD");
  assert(DATE_PATTERN.test(record.issue?.lastUpdatedDate || ""), "issue.lastUpdatedDate must be YYYY-MM-DD");

  assert(record.gscResult?.validationStarted === true, "gscResult.validationStarted must be true");
  assert(DATE_PATTERN.test(record.gscResult?.validationStartDate || ""), "gscResult.validationStartDate must be YYYY-MM-DD");
  assert(record.gscResult?.visibleStatusText === "Validation started", "visibleStatusText must be normalized");

  assert(Array.isArray(record.sampleUrlsObserved), "sampleUrlsObserved must be an array");
  assert(record.sampleUrlsObserved.length >= 1, "sampleUrlsObserved must retain at least one observed URL");
  for (const [index, sampleUrl] of record.sampleUrlsObserved.entries()) {
    parseExpectedUrl(sampleUrl, `sampleUrlsObserved[${index}]`);
  }

  assert(
    record.siteEvidenceLinked?.gscDiscoveredSampleEvidence ===
      "docs/evidence/gsc-discovered-sample-evidence-2026-06-06.json",
    "siteEvidenceLinked.gscDiscoveredSampleEvidence changed unexpectedly",
  );
  assert(record.siteEvidenceLinked?.sampleTechnicalEvidenceOk === true, "sample technical evidence must be linked");
  assert(
    record.siteEvidenceLinked?.sampleCount === record.sampleUrlsObserved.length,
    "sample count must match observed sample URLs",
  );
  assert(
    record.siteEvidenceLinked?.siteIndexLinkedSampleCount === record.sampleUrlsObserved.length,
    "site-index linked sample count must match observed sample URLs",
  );
  assert(
    typeof record.privacyBoundary === "string" &&
      record.privacyBoundary.includes("excludes account identifiers") &&
      record.privacyBoundary.includes("cookies") &&
      record.privacyBoundary.includes("tokens"),
    "privacyBoundary must explain account/session exclusion",
  );

  validateNoPrivatePayload(record);
}

try {
  const recordPath = process.argv[2] || DEFAULT_RECORD_PATH;
  const record = readJson(recordPath);

  validateRecord(record);

  console.log(
    JSON.stringify(
      {
        action: record.action,
        affectedUrlCount: record.issue.affectedUrlCount,
        evidenceType: EVIDENCE_TYPE,
        ok: true,
        privacyBoundaryRetained: true,
        recordPath,
        sampleCount: record.sampleUrlsObserved.length,
        siteEvidenceLinked: true,
        validationStartDate: record.gscResult.validationStartDate,
        validationStarted: record.gscResult.validationStarted,
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
