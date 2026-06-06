import fs from "node:fs";

const EVIDENCE_TYPE = "gsc-query-opportunity-record-validation";
const ALLOWED_RECORD_STATUSES = new Set(["template", "draft", "recorded"]);
const ALLOWED_SOURCE_TYPES = new Set(["gsc_performance_export", "gsc_screenshot", "manual_gsc_review"]);
const ALLOWED_RISK_LEVELS = new Set(["low", "review", "professional"]);
const ALLOWED_DECISION_STATUSES = new Set(["needs_review", "planned", "published", "deferred", "rejected"]);
const FORBIDDEN_PHRASES = [
  /best amount/i,
  /should convert/i,
  /guaranteed/i,
  /100%\s*accurate/i,
  /optimal conversion/i,
  /convert exactly/i,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function addFailure(failures, field, message) {
  failures.push({ field, message });
}

function hasValue(value) {
  return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
}

function validateNumberOrNull(failures, field, value) {
  if (value === null) return;
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    addFailure(failures, field, "Use a non-negative number or null when the GSC metric was not exported.");
  }
}

function validateIsoDateOrEmpty(failures, field, value) {
  if (value === "") return;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    addFailure(failures, field, "Use YYYY-MM-DD or an empty string for unknown private GSC dates.");
  }
}

function validateNoForbiddenPhrases(failures, record) {
  const text = [
    record.query,
    record.intentSummary,
    record.targetSurface,
    record.recommendedAction,
    record.reviewGate,
    record.decision?.notes,
  ]
    .filter(Boolean)
    .join(" ");

  const matched = FORBIDDEN_PHRASES.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);

  if (matched.length > 0) {
    addFailure(
      failures,
      "ymylLanguage",
      `Remove recommendation or absolute-accuracy phrasing before using this query record: ${matched.join(", ")}`,
    );
  }
}

export function validateGscQueryOpportunityRecord(record) {
  const failures = [];

  if (!isObject(record)) {
    return {
      evidenceType: EVIDENCE_TYPE,
      ok: false,
      failures: [{ field: "record", message: "Record must be a JSON object." }],
    };
  }

  if (!ALLOWED_RECORD_STATUSES.has(record.recordStatus)) {
    addFailure(failures, "recordStatus", "Use template, draft, or recorded.");
  }

  if (!isObject(record.source)) {
    addFailure(failures, "source", "Source must describe the Search Console property, date range, and export type.");
  } else {
    if (!String(record.source.property || "").startsWith("https://www.roth-conversion-calculator-ai.shop/")) {
      addFailure(failures, "source.property", "Use the verified canonical https://www URL-prefix property.");
    }
    if (!isObject(record.source.dateRange)) {
      addFailure(failures, "source.dateRange", "Date range must be an object.");
    } else {
      validateIsoDateOrEmpty(failures, "source.dateRange.start", record.source.dateRange.start);
      validateIsoDateOrEmpty(failures, "source.dateRange.end", record.source.dateRange.end);
    }
    if (!ALLOWED_SOURCE_TYPES.has(record.source.sourceType)) {
      addFailure(failures, "source.sourceType", "Use gsc_performance_export, gsc_screenshot, or manual_gsc_review.");
    }
  }

  if (record.recordStatus !== "template" && !hasValue(record.query)) {
    addFailure(failures, "query", "Draft or recorded query opportunities must include the observed GSC query.");
  }

  if (!isObject(record.metrics)) {
    addFailure(failures, "metrics", "Metrics must include clicks, impressions, ctr, and averagePosition.");
  } else {
    validateNumberOrNull(failures, "metrics.clicks", record.metrics.clicks);
    validateNumberOrNull(failures, "metrics.impressions", record.metrics.impressions);
    validateNumberOrNull(failures, "metrics.ctr", record.metrics.ctr);
    validateNumberOrNull(failures, "metrics.averagePosition", record.metrics.averagePosition);
  }

  if (!ALLOWED_RISK_LEVELS.has(record.riskLevel)) {
    addFailure(failures, "riskLevel", "Use low, review, or professional.");
  }

  if (record.recordStatus === "recorded") {
    for (const field of ["matchedCluster", "intentSummary", "targetSurface", "recommendedAction", "reviewGate"]) {
      if (!hasValue(record[field])) {
        addFailure(failures, field, "Recorded query opportunities need this field before content work begins.");
      }
    }

    if (!isObject(record.evidence) || !hasValue(record.evidence.screenshotOrExportPath)) {
      addFailure(failures, "evidence.screenshotOrExportPath", "Recorded opportunities need a screenshot or export path.");
    }

    if (!isObject(record.decision) || !ALLOWED_DECISION_STATUSES.has(record.decision.status)) {
      addFailure(failures, "decision.status", "Use needs_review, planned, published, deferred, or rejected.");
    }

    if (record.riskLevel === "professional" && !/professional review/i.test(record.reviewGate || "")) {
      addFailure(failures, "reviewGate", "Professional-risk query opportunities must explicitly retain professional review.");
    }
  }

  if (!Array.isArray(record.guardrails) || record.guardrails.length < 2) {
    addFailure(failures, "guardrails", "Keep at least two YMYL guardrails attached to the query opportunity.");
  }

  validateNoForbiddenPhrases(failures, record);

  return {
    evidenceType: EVIDENCE_TYPE,
    ok: failures.length === 0,
    failures,
    recordStatus: record.recordStatus || "unknown",
    query: record.query || "",
    riskLevel: record.riskLevel || "unknown",
    decisionStatus: record.decision?.status || "unknown",
    reviewBoundary:
      "This validator checks query-opportunity records and YMYL boundaries; it does not fetch private Google Search Console data.",
  };
}

function main() {
  const filePath = process.argv[2] || "docs/search-console-query-opportunity-template.json";
  const result = validateGscQueryOpportunityRecord(readJson(filePath));

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("validate-gsc-query-opportunity-record.mjs")) {
  try {
    main();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          evidenceType: EVIDENCE_TYPE,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
