import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const DEFAULT_TEMPLATE_PATH = path.join(path.dirname(__filename), "..", "docs", "cpa-review-evidence-template.json");
const ALLOWED_CREDENTIALS = new Set(["CPA", "EA", "TAX_ATTORNEY"]);
const ALLOWED_DECISIONS = new Set(["approved", "changes_requested", "rejected"]);

const PRIVATE_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/i,
  /\bssn\b/i,
  /\bitin\b/i,
  /\bapi[_-]?key\b/i,
  /\bsecret\b/i,
  /\bbearer\s+[a-z0-9._-]+/i,
  /\boauth\b/i,
  /\bcookie\b/i,
  /\bsk-[a-z0-9_-]{10,}/i,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\b(?:\d[ -]*?){13,16}\b/,
];

function isIsoDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isIsoTimestamp(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);
}

function addFailure(failures, field, message) {
  failures.push({ field, message });
}

function containsPrivateText(value) {
  const scanValue =
    value && typeof value === "object" ? { ...value, privacyBoundary: undefined } : value;
  const text = JSON.stringify(scanValue ?? "");
  return PRIVATE_PATTERNS.some((pattern) => pattern.test(text));
}

export function validateCpaReviewEvidence(record) {
  const failures = [];

  if (record?.evidenceType !== "cpa-review-evidence") {
    addFailure(failures, "evidenceType", "Record must use evidenceType cpa-review-evidence.");
  }

  if (!["template", "recorded"].includes(record?.recordStatus)) {
    addFailure(failures, "recordStatus", "recordStatus must be template or recorded.");
  }

  const credential = String(record?.reviewer?.credential ?? "").trim().toUpperCase();
  const decision = String(record?.review?.decision ?? "").trim().toLowerCase();

  if (record?.recordStatus === "recorded") {
    if (!record?.reviewer?.name || /REPLACE_|AI|MODEL|CHATGPT|CLAUDE/i.test(record.reviewer.name)) {
      addFailure(failures, "reviewer.name", "Recorded review requires a human reviewer name and must not name an AI model.");
    }

    if (!ALLOWED_CREDENTIALS.has(credential)) {
      addFailure(failures, "reviewer.credential", "Recorded review requires CPA, EA, or TAX_ATTORNEY credential.");
    }

    if (!record?.reviewer?.jurisdiction || /REPLACE_/i.test(record.reviewer.jurisdiction)) {
      addFailure(failures, "reviewer.jurisdiction", "Recorded review requires a US jurisdiction or federal EA status.");
    }

    if (!isIsoDate(record?.review?.reviewedAt)) {
      addFailure(failures, "review.reviewedAt", "reviewedAt must be an ISO date such as 2026-06-10.");
    }

    if (record?.review?.taxYear !== 2026) {
      addFailure(failures, "review.taxYear", "Recorded review must explicitly cover taxYear 2026.");
    }

    if (!ALLOWED_DECISIONS.has(decision)) {
      addFailure(failures, "review.decision", "Recorded review decision must be approved, changes_requested, or rejected.");
    }

    if (!record?.evidence?.reviewLetterPath || /REPLACE_/i.test(record.evidence.reviewLetterPath)) {
      addFailure(failures, "evidence.reviewLetterPath", "Recorded review requires a redacted review letter or equivalent evidence path.");
    }

    if (!isIsoTimestamp(record?.evidence?.capturedAt)) {
      addFailure(failures, "evidence.capturedAt", "capturedAt must be an ISO timestamp.");
    }
  }

  if (!Array.isArray(record?.privacyBoundary) || record.privacyBoundary.length < 2) {
    addFailure(failures, "privacyBoundary", "Record must retain a privacy boundary.");
  }

  if (containsPrivateText(record)) {
    addFailure(failures, "privacyBoundary", "Record must not contain secrets, tokens, payment data, SSNs, or unredacted private taxpayer data.");
  }

  return {
    credential: credential || "missing",
    decision: decision || "missing",
    evidenceType: "cpa-review-evidence-validation",
    failures,
    ok: failures.length === 0,
    recordStatus: record?.recordStatus ?? "missing",
    reviewBoundary:
      "AI model cross-checks can support preparation, but this validator only accepts a recorded human CPA, EA, or tax attorney review.",
  };
}

function main() {
  const targetPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_TEMPLATE_PATH;
  const record = JSON.parse(fs.readFileSync(targetPath, "utf8"));
  const result = validateCpaReviewEvidence(record);

  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] === __filename) {
  main();
}
