import fs from "node:fs";

const DEFAULT_RECORD_PATH = "docs/evidence/gsc-discovered-validation-follow-up-2026-06-06.json";
const EXPECTED_EVIDENCE_TYPE = "gsc-indexing-validation-follow-up";
const EXPECTED_HOST = "www.roth-conversion-calculator-ai.shop";
const EXPECTED_ACTION_RECORD = "docs/evidence/gsc-discovered-validation-final-2026-06-06.json";
const EXPECTED_SAMPLE_RECORD = "docs/evidence/gsc-discovered-sample-evidence-2026-06-06.json";
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN_PRIVATE_PATTERNS = [
  /cookie=/i,
  /\bsession[_-]?(id|token)?\s*[:=]/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /password/i,
  /authorization/i,
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
}

function validateNoPrivatePayload(record) {
  const serialized = JSON.stringify(record);

  for (const pattern of FORBIDDEN_PRIVATE_PATTERNS) {
    assert(!pattern.test(serialized), `GSC follow-up record must not include private account/session text: ${pattern}`);
  }

  assert(!("textExcerpt" in record), "GSC follow-up record must not retain raw private GSC UI text");
  assert(!("screenshotPath" in record), "GSC follow-up record must not include screenshot paths");
}

function validateRecord(record) {
  assert(record.ok === true, "GSC follow-up record must be ok");
  assert(record.evidenceType === EXPECTED_EVIDENCE_TYPE, "GSC follow-up evidenceType changed unexpectedly");
  assert(record.sourceValidationAction === EXPECTED_ACTION_RECORD, "sourceValidationAction changed unexpectedly");
  assert(ISO_TIMESTAMP_PATTERN.test(record.createdAt), "createdAt must be an ISO timestamp");
  parseExpectedUrl(record.propertyUrl, "propertyUrl");

  assert(record.issue?.state === "discovered_not_indexed", "issue.state must be discovered_not_indexed");
  assert(record.issue?.label === "Discovered - currently not indexed", "issue.label changed unexpectedly");
  assert(record.issue?.affectedUrlCountAtValidationStart >= 1, "affectedUrlCountAtValidationStart must be retained");

  assert(record.validation?.started === true, "validation.started must be true");
  assert(DATE_PATTERN.test(record.validation?.startDate || ""), "validation.startDate must be YYYY-MM-DD");
  assert(record.validation?.initialStatusText === "Validation started", "initialStatusText must be normalized");

  assert(DATE_PATTERN.test(record.followUpPlan?.firstReviewDate || ""), "firstReviewDate must be YYYY-MM-DD");
  assert(DATE_PATTERN.test(record.followUpPlan?.secondReviewDate || ""), "secondReviewDate must be YYYY-MM-DD");
  assert(
    record.followUpPlan.firstReviewDate > record.validation.startDate,
    "firstReviewDate must be after validation startDate",
  );
  assert(
    record.followUpPlan.secondReviewDate > record.followUpPlan.firstReviewDate,
    "secondReviewDate must be after firstReviewDate",
  );

  assert(Array.isArray(record.reviewChecklist) && record.reviewChecklist.length >= 5, "reviewChecklist must retain review steps");
  assert(
    record.reviewChecklist.some((item) => item.includes("rerun seo:gsc-discovered-samples")),
    "reviewChecklist must require rerunning discovered sample evidence when sample URLs change",
  );
  assert(
    Array.isArray(record.allowedOutcomes) &&
      ["validation_started", "validation_passed", "validation_failed", "validation_waiting", "not_enough_data"].every(
        (outcome) => record.allowedOutcomes.includes(outcome),
      ),
    "allowedOutcomes must retain all expected GSC follow-up states",
  );
  assert(
    Array.isArray(record.blockedActions) &&
      record.blockedActions.some((action) => action.includes("Do not repeatedly click Validate fix")),
    "blockedActions must prevent repeated Validate fix clicks",
  );
  assert(
    record.siteEvidenceRequired?.technicalSampleEvidence === EXPECTED_SAMPLE_RECORD,
    "technicalSampleEvidence changed unexpectedly",
  );
  assert(record.siteEvidenceRequired?.validationActionEvidence === EXPECTED_ACTION_RECORD, "validationActionEvidence changed unexpectedly");
  assert(record.siteEvidenceRequired?.technicalSampleEvidenceOk === true, "technical sample evidence must be ok");
  assert(record.siteEvidenceRequired?.validationActionEvidenceOk === true, "validation action evidence must be ok");
  assert(
    typeof record.nextEngineeringAction === "string" &&
      record.nextEngineeringAction.includes("seo:gsc-validation-follow-up-validate"),
    "nextEngineeringAction must name the follow-up validator command",
  );
  assert(
    typeof record.privacyBoundary === "string" &&
      record.privacyBoundary.includes("account identifiers") &&
      record.privacyBoundary.includes("cookies") &&
      record.privacyBoundary.includes("tokens") &&
      record.privacyBoundary.includes("screenshot paths"),
    "privacyBoundary must explain private account/session exclusion",
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
        evidenceType: EXPECTED_EVIDENCE_TYPE,
        ok: true,
        recordPath,
        validationStartDate: record.validation.startDate,
        firstReviewDate: record.followUpPlan.firstReviewDate,
        secondReviewDate: record.followUpPlan.secondReviewDate,
        allowedOutcomeCount: record.allowedOutcomes.length,
        blockedActionCount: record.blockedActions.length,
        privacyBoundaryRetained: true,
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
        evidenceType: EXPECTED_EVIDENCE_TYPE,
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
