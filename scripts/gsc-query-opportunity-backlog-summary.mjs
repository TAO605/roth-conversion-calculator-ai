import fs from "node:fs";
import path from "node:path";
import { buildGscQueryOpportunityReadiness } from "./gsc-query-opportunity-readiness.mjs";
import { validateGscQueryOpportunityRecord } from "./validate-gsc-query-opportunity-record.mjs";

const DEFAULT_RECORD_DIR = "docs";
const DEFAULT_PATTERN = /^search-console-query-opportunity.*\.json$/;
const DEFAULT_NESTED_RECORD_DIR = path.join("docs", "gsc-query-opportunities");
const EVIDENCE_TYPE = "gsc-query-opportunity-backlog-summary";

function parseArgs(argv) {
  const args = { files: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      args.files.push(current);
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function discoverRecordFiles(recordDir) {
  if (!fs.existsSync(recordDir)) {
    return [];
  }

  const discovered = [];

  for (const entry of fs.readdirSync(recordDir, { withFileTypes: true })) {
    const entryPath = path.join(recordDir, entry.name);

    if (entry.isDirectory()) {
      discovered.push(...discoverRecordFiles(entryPath));
      continue;
    }

    if (entry.isFile() && DEFAULT_PATTERN.test(entry.name)) {
      discovered.push(entryPath);
    }
  }

  return discovered.sort();
}

function discoverDefaultRecordFiles() {
  const files = new Set(discoverRecordFiles(DEFAULT_RECORD_DIR));

  for (const filePath of discoverRecordFiles(DEFAULT_NESTED_RECORD_DIR)) {
    files.add(filePath);
  }

  return [...files].sort();
}

function increment(map, key) {
  const normalized = key || "unknown";
  map[normalized] = (map[normalized] || 0) + 1;
}

function scoreRecord(record) {
  const impressions = Number(record.metrics?.impressions || 0);
  const clicks = Number(record.metrics?.clicks || 0);
  const averagePosition = Number(record.metrics?.averagePosition || 0);
  const ctr = Number(record.metrics?.ctr || 0);
  const riskWeight = record.riskLevel === "professional" ? 3 : record.riskLevel === "review" ? 2 : 1;
  const positionOpportunity = averagePosition > 3 ? Math.min(20, averagePosition) : 0;
  const ctrOpportunity = impressions > 0 && ctr < 0.05 ? 5 : 0;

  return Math.round(impressions + clicks * 10 + positionOpportunity * 2 + ctrOpportunity + riskWeight);
}

function loadRecord(input) {
  if (typeof input === "string") {
    return {
      filePath: input,
      record: readJson(input),
    };
  }

  return {
    filePath: input?.filePath || "memory",
    record: input,
  };
}

function buildRecordSummary(input) {
  const { filePath, record } = loadRecord(input);
  const validation = validateGscQueryOpportunityRecord(record);
  const readiness = buildGscQueryOpportunityReadiness(record);

  return {
    blockingValidatorFailureCount: validation.failures?.length || 0,
    decisionStatus: record.decision?.status || "unknown",
    filePath,
    matchedCluster: record.matchedCluster || "",
    missingReviewerFieldCount: readiness.missingReviewerFieldCount,
    nextAction:
      readiness.readyForRecordedEvidence
        ? "Ready for content-operations review; keep YMYL and professional review gates attached."
        : "Complete reviewer-supplied GSC fields before content work.",
    priorityScore: scoreRecord(record),
    query: record.query || "",
    readyForRecordedEvidence: readiness.readyForRecordedEvidence,
    recordStatus: record.recordStatus || "unknown",
    riskLevel: record.riskLevel || "unknown",
    targetSurface: record.targetSurface || "",
  };
}

function buildBacklogSummary(filePaths) {
  const records = filePaths.map(buildRecordSummary);
  const byRecordStatus = {};
  const byRiskLevel = {};
  const byDecisionStatus = {};
  const byCluster = {};

  for (const record of records) {
    increment(byRecordStatus, record.recordStatus);
    increment(byRiskLevel, record.riskLevel);
    increment(byDecisionStatus, record.decisionStatus);
    increment(byCluster, record.matchedCluster || "unmapped");
  }

  const actionableRecords = records
    .filter((record) => record.recordStatus !== "template")
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    actionableCount: actionableRecords.length,
    actionableRecords,
    byCluster,
    byDecisionStatus,
    byRecordStatus,
    byRiskLevel,
    evidenceType: EVIDENCE_TYPE,
    ok: records.every((record) => record.blockingValidatorFailureCount === 0),
    recordCount: records.length,
    records,
    reviewBoundary:
      "This backlog summary inventories local query opportunity records only; it does not fetch private Google Search Console data or authorize content publication.",
    templateOnly: records.length > 0 && records.every((record) => record.recordStatus === "template"),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.files.length > 0 ? args.files : args.dir ? discoverRecordFiles(args.dir) : discoverDefaultRecordFiles();
  const result = buildBacklogSummary(files);
  const output = `${JSON.stringify(result, null, 2)}\n`;

  if (args.out) {
    fs.writeFileSync(args.out, output, "utf8");
  }

  process.stdout.write(output);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("gsc-query-opportunity-backlog-summary.mjs")) {
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
}

export { buildBacklogSummary as buildGscQueryOpportunityBacklogSummary };
