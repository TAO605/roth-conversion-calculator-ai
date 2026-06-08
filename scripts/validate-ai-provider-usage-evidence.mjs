import fs from "node:fs";

const EVIDENCE_TYPE = "ai-provider-usage-evidence-validation";
const ALLOWED_PROVIDERS = new Set(["openai", "anthropic", "other"]);
const ALLOWED_SOURCE_TYPES = new Set(["usage_console", "billing_console", "usage_export", "manual_review"]);
const ALLOWED_RECORD_STATUSES = new Set(["template", "draft", "recorded"]);
const ALLOWED_DECISION_STATUSES = new Set(["needs_review", "normal", "investigate", "rotate_key", "disabled", "resolved"]);
const SECRET_PATTERNS = [
  /sk-[A-Za-z0-9_-]{12,}/,
  /Bearer\s+[A-Za-z0-9._-]{8,}/i,
  /api[_-]?key\s*[:=]/i,
  /authorization\s*[:=]/i,
  /cookie\s*[:=]/i,
  /password\s*[:=]/i,
  /card\s*number/i,
  /\b\d{13,19}\b/,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasValue(value) {
  return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
}

function addFailure(failures, field, message) {
  failures.push({ field, message });
}

function validateIsoDateOrEmpty(failures, field, value) {
  if (value === "") return;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    addFailure(failures, field, "Use YYYY-MM-DD or an empty string until real provider evidence is copied.");
  }
}

function validateIsoTimestampOrEmpty(failures, field, value) {
  if (value === "") return;
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    addFailure(failures, field, "Use an ISO timestamp or an empty string.");
  }
}

function validateNumberOrNull(failures, field, value) {
  if (value === null) return;
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    addFailure(failures, field, "Use a non-negative number or null when the provider metric was not exported.");
  }
}

function validateNoSecrets(failures, record) {
  const serialized = JSON.stringify(record);
  const matched = SECRET_PATTERNS.filter((pattern) => pattern.test(serialized)).map((pattern) => pattern.source);

  if (matched.length > 0) {
    addFailure(
      failures,
      "privacyBoundary",
      `Remove secrets or private payment/account data before recording provider usage evidence: ${matched.join(", ")}`,
    );
  }
}

function normalizeProviderName(name) {
  return String(name || "").trim().toLowerCase();
}

export function validateAiProviderUsageEvidence(record) {
  const failures = [];

  if (!isObject(record)) {
    return {
      evidenceType: EVIDENCE_TYPE,
      ok: false,
      failures: [{ field: "record", message: "Record must be a JSON object." }],
    };
  }

  if (record.evidenceType !== "ai-provider-usage-evidence") {
    addFailure(failures, "evidenceType", "Use ai-provider-usage-evidence.");
  }

  if (!ALLOWED_RECORD_STATUSES.has(record.recordStatus)) {
    addFailure(failures, "recordStatus", "Use template, draft, or recorded.");
  }

  if (!isObject(record.site)) {
    addFailure(failures, "site", "Site metadata is required.");
  } else {
    if (record.site.domain !== "https://www.roth-conversion-calculator-ai.shop") {
      addFailure(failures, "site.domain", "Use the canonical production domain.");
    }
    if (record.site.relatedEndpoint !== "/api/ai/explain") {
      addFailure(failures, "site.relatedEndpoint", "Use /api/ai/explain for this provider usage evidence.");
    }
  }

  if (!isObject(record.provider)) {
    addFailure(failures, "provider", "Provider metadata is required.");
  } else {
    const providerName = normalizeProviderName(record.provider.name);
    if (record.recordStatus !== "template" && !ALLOWED_PROVIDERS.has(providerName)) {
      addFailure(failures, "provider.name", "Use openai, anthropic, or other.");
    }
    if (!ALLOWED_SOURCE_TYPES.has(record.provider.sourceType)) {
      addFailure(failures, "provider.sourceType", "Use usage_console, billing_console, usage_export, or manual_review.");
    }
    if (!isObject(record.provider.observedDateRange)) {
      addFailure(failures, "provider.observedDateRange", "Date range is required.");
    } else {
      validateIsoDateOrEmpty(failures, "provider.observedDateRange.start", record.provider.observedDateRange.start);
      validateIsoDateOrEmpty(failures, "provider.observedDateRange.end", record.provider.observedDateRange.end);
    }
  }

  if (!isObject(record.usage)) {
    addFailure(failures, "usage", "Usage metrics are required.");
  } else {
    for (const field of [
      "totalRequests",
      "totalInputTokens",
      "totalOutputTokens",
      "totalCostUsd",
      "largestDailyCostUsd",
      "largestDailyRequestCount",
    ]) {
      validateNumberOrNull(failures, `usage.${field}`, record.usage[field]);
    }
  }

  if (!Array.isArray(record.models)) {
    addFailure(failures, "models", "Models must be an array.");
  } else {
    for (const [index, model] of record.models.entries()) {
      if (!isObject(model)) {
        addFailure(failures, `models.${index}`, "Each model entry must be an object.");
        continue;
      }
      if (record.recordStatus === "recorded" && !hasValue(model.name)) {
        addFailure(failures, `models.${index}.name`, "Recorded model entries need a model name.");
      }
      validateNumberOrNull(failures, `models.${index}.requests`, model.requests ?? null);
      validateNumberOrNull(failures, `models.${index}.costUsd`, model.costUsd ?? null);
    }
  }

  if (!isObject(record.suspiciousSignals)) {
    addFailure(failures, "suspiciousSignals", "Suspicious signal fields are required.");
  } else {
    for (const field of [
      "unexpectedSpend",
      "unexpectedModel",
      "unexpectedRequestSpike",
      "requestsAfterPaidModelDisabled",
    ]) {
      if (typeof record.suspiciousSignals[field] !== "boolean") {
        addFailure(failures, `suspiciousSignals.${field}`, "Use true or false.");
      }
    }
  }

  if (!isObject(record.evidence)) {
    addFailure(failures, "evidence", "Evidence metadata is required.");
  } else {
    validateIsoTimestampOrEmpty(failures, "evidence.capturedAt", record.evidence.capturedAt);
    if (record.recordStatus === "recorded" && !hasValue(record.evidence.screenshotOrExportPath)) {
      addFailure(failures, "evidence.screenshotOrExportPath", "Recorded evidence needs a screenshot or export path.");
    }
  }

  if (!isObject(record.decision)) {
    addFailure(failures, "decision", "Decision metadata is required.");
  } else {
    if (!ALLOWED_DECISION_STATUSES.has(record.decision.status)) {
      addFailure(failures, "decision.status", "Use needs_review, normal, investigate, rotate_key, disabled, or resolved.");
    }
    validateIsoDateOrEmpty(failures, "decision.nextReviewDate", record.decision.nextReviewDate || "");
  }

  validateNoSecrets(failures, record);

  const providerName = normalizeProviderName(record.provider?.name);
  const suspiciousSignalCount = isObject(record.suspiciousSignals)
    ? [
        record.suspiciousSignals.unexpectedSpend,
        record.suspiciousSignals.unexpectedModel,
        record.suspiciousSignals.unexpectedRequestSpike,
        record.suspiciousSignals.requestsAfterPaidModelDisabled,
      ].filter(Boolean).length
    : 0;

  return {
    decisionStatus: record.decision?.status || "unknown",
    evidenceType: EVIDENCE_TYPE,
    failures,
    ok: failures.length === 0,
    providerName: providerName || "unknown",
    recordStatus: record.recordStatus || "unknown",
    reviewBoundary:
      "This validator checks sanitized provider usage evidence; it does not fetch OpenAI or Anthropic account data and must not contain API keys.",
    suspiciousSignalCount,
    totalCostUsd: record.usage?.totalCostUsd ?? null,
    totalRequests: record.usage?.totalRequests ?? null,
  };
}

function main() {
  const filePath = process.argv[2] || "docs/ai-provider-usage-evidence-template.json";
  const result = validateAiProviderUsageEvidence(readJson(filePath));

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("validate-ai-provider-usage-evidence.mjs")) {
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
