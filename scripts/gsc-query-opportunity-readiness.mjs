import fs from "node:fs";
import { validateGscQueryOpportunityRecord } from "./validate-gsc-query-opportunity-record.mjs";

const EVIDENCE_TYPE = "gsc-query-opportunity-readiness";

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
  const validation = validateGscQueryOpportunityRecord(record);
  const missingReviewerFields = [];
  const aiFillableFields = [
    {
      field: "matchedCluster",
      source: "AI from query opportunity matrix",
      action: "Map the query to an existing safe cluster after the observed query is supplied.",
    },
    {
      field: "intentSummary",
      source: "AI draft",
      action: "Summarize user intent in educational, non-advisory language after the query is supplied.",
    },
    {
      field: "targetSurface",
      source: "AI draft",
      action: "Suggest an existing page, metadata surface, internal-link update, or professional-review backlog target.",
    },
    {
      field: "recommendedAction",
      source: "AI draft",
      action: "Draft an educational action while avoiding personal tax advice and absolute-accuracy claims.",
    },
    {
      field: "reviewGate",
      source: "AI draft plus reviewer",
      action: "Draft the compliance or professional review gate; professional-risk records still need reviewer acceptance.",
    },
    {
      field: "evidence.productionSeoEvidenceRunId",
      source: "AI from downloaded production-seo-evidence",
      action: "Copy the latest GitHub Actions run id when the query record is tied to a production content change.",
    },
    {
      field: "evidence.productionSeoEvidenceCommitSha",
      source: "AI from downloaded production-seo-evidence",
      action: "Copy the latest source commit SHA when the query record is tied to a production content change.",
    },
  ];

  if (record.recordStatus !== "recorded") {
    addMissing(
      missingReviewerFields,
      "recordStatus",
      "Reviewer",
      "Change to recorded only after the real GSC query row or screenshot has been copied into the record.",
    );
  }

  if (!hasValue(record.source?.dateRange?.start)) {
    addMissing(
      missingReviewerFields,
      "source.dateRange.start",
      "GSC Performance report",
      "Copy the query export start date in YYYY-MM-DD format.",
    );
  }

  if (!hasValue(record.source?.dateRange?.end)) {
    addMissing(
      missingReviewerFields,
      "source.dateRange.end",
      "GSC Performance report",
      "Copy the query export end date in YYYY-MM-DD format.",
    );
  }

  if (!hasValue(record.query)) {
    addMissing(
      missingReviewerFields,
      "query",
      "GSC query row",
      "Copy the observed query from Search Console before AI maps intent or content action.",
    );
  }

  for (const field of ["matchedCluster", "intentSummary", "targetSurface", "recommendedAction", "reviewGate"]) {
    if (!hasValue(record[field])) {
      addMissing(
        missingReviewerFields,
        field,
        "AI draft and reviewer confirmation",
        "Fill this field before using the query observation for content operations.",
      );
    }
  }

  if (!hasValue(record.evidence?.screenshotOrExportPath)) {
    addMissing(
      missingReviewerFields,
      "evidence.screenshotOrExportPath",
      "GSC screenshot or export",
      "Attach the screenshot or export path that proves the query observation.",
    );
  }

  if (!hasValue(record.decision?.owner)) {
    addMissing(
      missingReviewerFields,
      "decision.owner",
      "Content operations",
      "Assign an owner before turning the query record into planned work.",
    );
  }

  if (record.decision?.status === "planned" && !hasValue(record.decision?.nextReviewDate)) {
    addMissing(
      missingReviewerFields,
      "decision.nextReviewDate",
      "Content operations",
      "Set a follow-up date for planned query-driven work.",
    );
  }

  const blockingValidatorFailures = validation.failures || [];

  return {
    aiFillableFieldCount: aiFillableFields.length,
    aiFillableFields,
    blockingValidatorFailures,
    decisionStatus: record.decision?.status || "unknown",
    evidenceType: EVIDENCE_TYPE,
    missingReviewerFieldCount: missingReviewerFields.length,
    missingReviewerFields,
    ok: blockingValidatorFailures.length === 0,
    query: record.query || "",
    readyForRecordedEvidence:
      record.recordStatus === "recorded" &&
      missingReviewerFields.length === 0 &&
      blockingValidatorFailures.length === 0,
    recordStatus: record.recordStatus || "unknown",
    reviewBoundary:
      "This readiness report names missing reviewer-supplied GSC query fields and AI-fillable planning fields; it does not fetch private Search Console data or create personal tax advice.",
    riskLevel: record.riskLevel || "unknown",
  };
}

function main() {
  const filePath = process.argv[2] || "docs/search-console-query-opportunity-template.json";
  const result = buildReadiness(readJson(filePath));

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && process.argv[1].endsWith("gsc-query-opportunity-readiness.mjs")) {
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

export { buildReadiness as buildGscQueryOpportunityReadiness };
