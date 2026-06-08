import fs from "node:fs";
import { validateAiProviderUsageEvidence } from "./validate-ai-provider-usage-evidence.mjs";

const EVIDENCE_TYPE = "ai-provider-usage-readiness";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function hasValue(value) {
  return typeof value === "string" ? value.trim().length > 0 : value !== null && value !== undefined;
}

function addMissing(list, field, source, action) {
  list.push({ field, source, action });
}

function buildReadiness(record) {
  const validation = validateAiProviderUsageEvidence(record);
  const missingReviewerFields = [];
  const aiFillableFields = [
    {
      field: "suspiciousSignals.notes",
      source: "AI after provider metrics are supplied",
      action: "Summarize whether spend, model names, or request spikes look unusual relative to site-side evidence.",
    },
    {
      field: "decision.nextAction",
      source: "AI draft plus owner confirmation",
      action: "Suggest normal monitoring, investigate, rotate key, keep paid model disabled, or resolve after real usage evidence is supplied.",
    },
    {
      field: "decision.nextReviewDate",
      source: "AI draft plus owner confirmation",
      action: "Suggest a follow-up date when the record remains under review.",
    },
  ];

  if (record.recordStatus !== "recorded") {
    addMissing(
      missingReviewerFields,
      "recordStatus",
      "Provider account reviewer",
      "Change to recorded only after real OpenAI, Anthropic, or other provider usage evidence is copied into the record.",
    );
  }

  if (!hasValue(record.provider?.name)) {
    addMissing(
      missingReviewerFields,
      "provider.name",
      "Provider usage console",
      "Use openai, anthropic, or other after selecting the account evidence source.",
    );
  }

  if (!hasValue(record.provider?.observedDateRange?.start)) {
    addMissing(
      missingReviewerFields,
      "provider.observedDateRange.start",
      "Provider usage or billing console",
      "Copy the observed usage start date in YYYY-MM-DD format.",
    );
  }

  if (!hasValue(record.provider?.observedDateRange?.end)) {
    addMissing(
      missingReviewerFields,
      "provider.observedDateRange.end",
      "Provider usage or billing console",
      "Copy the observed usage end date in YYYY-MM-DD format.",
    );
  }

  for (const field of ["totalRequests", "totalCostUsd"]) {
    if (!hasValue(record.usage?.[field])) {
      addMissing(
        missingReviewerFields,
        `usage.${field}`,
        "Provider usage or billing console",
        `Copy ${field} from provider evidence, or use 0 if the console proves zero usage.`,
      );
    }
  }

  if (!Array.isArray(record.models) || record.models.length === 0) {
    addMissing(
      missingReviewerFields,
      "models",
      "Provider usage or billing console",
      "Copy model-level usage rows when available; otherwise record an empty array only when the console proves no usage.",
    );
  }

  if (!hasValue(record.evidence?.screenshotOrExportPath)) {
    addMissing(
      missingReviewerFields,
      "evidence.screenshotOrExportPath",
      "Provider screenshot or export",
      "Attach a sanitized screenshot/export path. Do not include API keys, tokens, cookies, card numbers, or account-private identifiers.",
    );
  }

  if (!hasValue(record.evidence?.capturedBy)) {
    addMissing(
      missingReviewerFields,
      "evidence.capturedBy",
      "Provider account reviewer",
      "Record who captured the sanitized evidence.",
    );
  }

  if (!hasValue(record.evidence?.capturedAt)) {
    addMissing(
      missingReviewerFields,
      "evidence.capturedAt",
      "Provider account reviewer",
      "Record the capture timestamp in ISO format.",
    );
  }

  if (!hasValue(record.decision?.owner)) {
    addMissing(
      missingReviewerFields,
      "decision.owner",
      "Site owner",
      "Assign an owner for normal monitoring, investigation, key rotation, or resolution.",
    );
  }

  return {
    aiFillableFieldCount: aiFillableFields.length,
    aiFillableFields,
    blockingValidatorFailures: validation.failures || [],
    decisionStatus: record.decision?.status || "unknown",
    evidenceType: EVIDENCE_TYPE,
    missingReviewerFieldCount: missingReviewerFields.length,
    missingReviewerFields,
    ok: validation.ok,
    providerName: validation.providerName,
    readyForRecordedEvidence:
      record.recordStatus === "recorded" &&
      missingReviewerFields.length === 0 &&
      validation.ok,
    recordStatus: record.recordStatus || "unknown",
    reviewBoundary:
      "This readiness report names provider-account fields that require owner-supplied usage evidence. It does not fetch account data, change billing, rotate keys, or ask for secrets.",
    suspiciousSignalCount: validation.suspiciousSignalCount,
  };
}

function main() {
  const filePath = process.argv[2] || "docs/ai-provider-usage-evidence-template.json";
  const result = buildReadiness(readJson(filePath));

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && process.argv[1].endsWith("ai-provider-usage-readiness.mjs")) {
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
