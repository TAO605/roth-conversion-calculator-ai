import fs from "node:fs";
import path from "node:path";
import { buildGscQueryOpportunityBacklogSummary } from "./gsc-query-opportunity-backlog-summary.mjs";
import { buildGscQueryOpportunityDraft } from "./generate-gsc-query-opportunity-draft.mjs";

const EVIDENCE_TYPE = "gsc-query-opportunity-import";
const DEFAULT_OUTPUT_DIR = "docs/gsc-query-opportunities";
const DEFAULT_OWNER = "SEO/content";

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => item.trim().length > 0));
}

function normalizeHeader(header) {
  return header
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[%]/g, " percent")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizeMetric(value) {
  return String(value || "").replace(/[%,$\s]/g, "");
}

function getField(record, aliases) {
  for (const alias of aliases) {
    const value = record[alias];
    if (value !== undefined) {
      return value;
    }
  }

  return "";
}

function slugifyQuery(query) {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function rowsFromCsv(csvText) {
  const parsed = parseCsv(csvText);
  if (parsed.length < 2) {
    return [];
  }

  const headers = parsed[0].map(normalizeHeader);

  return parsed.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || "";
    });
    return record;
  });
}

function buildImport({
  artifactDir,
  csvPath,
  dateEnd,
  dateStart,
  exportedAt,
  limit,
  minImpressions,
  outputDir,
  owner,
}) {
  if (!csvPath) {
    throw new Error("Provide --csv with a Google Search Console Performance CSV export.");
  }

  const rows = rowsFromCsv(fs.readFileSync(csvPath, "utf8"));
  const maxRecords = Number(limit || 20);
  const impressionFloor = Number(minImpressions || 1);
  const selectedRows = rows
    .map((row) => {
      const query = getField(row, ["query", "queries", "top queries"]);
      const clicks = normalizeMetric(getField(row, ["clicks"]));
      const impressions = normalizeMetric(getField(row, ["impressions"]));
      const ctr = normalizeMetric(getField(row, ["ctr", "ctr percent"]));
      const position = normalizeMetric(getField(row, ["position", "average position", "avg position"]));

      return {
        clicks,
        ctr,
        impressions,
        position,
        query,
        sortImpressions: Number(impressions || 0),
      };
    })
    .filter((row) => row.query.trim().length > 0)
    .filter((row) => row.sortImpressions >= impressionFloor)
    .sort((a, b) => b.sortImpressions - a.sortImpressions)
    .slice(0, Number.isFinite(maxRecords) && maxRecords > 0 ? maxRecords : 20);

  fs.mkdirSync(outputDir, { recursive: true });

  const records = selectedRows.map((row, index) => {
    const fileName = `search-console-query-opportunity-${String(index + 1).padStart(2, "0")}-${slugifyQuery(
      row.query,
    )}.json`;
    const outputPath = path.join(outputDir, fileName);
    const { draft, generationEvidence } = buildGscQueryOpportunityDraft({
      artifactDir,
      averagePosition: row.position,
      clicks: row.clicks,
      ctr: row.ctr,
      dateEnd,
      dateStart,
      evidencePath: csvPath,
      exportedAt,
      impressions: row.impressions,
      owner,
      query: row.query,
      sourceType: "gsc_performance_export",
      templatePath: "docs/search-console-query-opportunity-template.json",
    });

    fs.writeFileSync(outputPath, `${JSON.stringify(draft, null, 2)}\n`, "utf8");

    return {
      filePath: outputPath,
      generationEvidence,
      query: draft.query,
      riskLevel: draft.riskLevel,
      matchedCluster: draft.matchedCluster,
      impressions: draft.metrics.impressions,
      clicks: draft.metrics.clicks,
    };
  });

  const backlog = buildGscQueryOpportunityBacklogSummary(records.map((record) => record.filePath));

  return {
    actionableCount: backlog.actionableCount,
    backlog,
    csvPath,
    evidenceType: EVIDENCE_TYPE,
    importedCount: records.length,
    ok: records.every((record) => record.generationEvidence.ok) && backlog.ok,
    outputDir,
    privacyBoundary:
      "This importer reads a user-provided GSC Performance CSV export only. It does not control Search Console, fetch private account data, store cookies, or authorize content publication.",
    records,
    rowCount: rows.length,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = buildImport({
    artifactDir: args.artifact,
    csvPath: args.csv,
    dateEnd: args.end,
    dateStart: args.start,
    exportedAt: args.exportedAt,
    limit: args.limit,
    minImpressions: args.minImpressions,
    outputDir: args.outDir || DEFAULT_OUTPUT_DIR,
    owner: args.owner || DEFAULT_OWNER,
  });
  const output = `${JSON.stringify(result, null, 2)}\n`;

  if (args.out) {
    fs.writeFileSync(args.out, output, "utf8");
  }

  process.stdout.write(output);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("import-gsc-query-opportunities.mjs")) {
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

export { buildImport as buildGscQueryOpportunityImport, parseCsv as parseGscPerformanceCsv };
