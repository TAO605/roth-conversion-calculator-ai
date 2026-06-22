import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EVIDENCE_TYPE = "ga4-hostname-audit";
const ALLOWED_HOSTNAMES = new Set(["www.roth-conversion-calculator-ai.shop", "roth-conversion-calculator-ai.shop"]);
const LOCAL_DEV_HOSTNAMES = new Set(["127.0.0.1", "localhost"]);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseNumber(value) {
  const normalized = String(value || "").replace(/[%,$\s]/g, "");
  if (normalized === "") return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

function extractHostnameFromUrl(value) {
  const rawValue = String(value || "").trim();
  if (!/^https?:\/\//i.test(rawValue)) return "";

  try {
    return new URL(rawValue).hostname.toLowerCase();
  } catch {
    return normalizeHostname(rawValue);
  }
}

function isPlausibleHostname(value) {
  if (value === "(not set)") return true;
  if (value === "localhost") return true;
  if (value === "127.0.0.1") return true;
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

function parseHostnameExport(text) {
  const rows = [];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.startsWith("#")) continue;
    const cells = splitCsvLine(line);
    if (cells.length < 2) continue;

    const urlCellIndex = cells.findIndex((cell) => /^https?:\/\//i.test(String(cell || "").trim()));
    const rawHostname = urlCellIndex >= 0 ? cells[urlCellIndex] : cells[0];
    const hostname = urlCellIndex >= 0 ? extractHostnameFromUrl(rawHostname) : normalizeHostname(rawHostname);
    if (!hostname || hostname === "hostname" || /主机|host/i.test(hostname)) continue;
    if (/^\d/.test(hostname) && !LOCAL_DEV_HOSTNAMES.has(hostname)) continue;
    if (!isPlausibleHostname(hostname)) continue;

    rows.push({
      activeUsersOrSessions: selectActiveUsersMetric(cells, urlCellIndex),
      hostname,
      rawHostname,
    });
  }

  return rows;
}

function selectActiveUsersMetric(cells, hostnameCellIndex) {
  const metricCells = hostnameCellIndex >= 0 ? cells.slice(hostnameCellIndex + 1) : cells.slice(1);
  const metricCell = metricCells
    .slice()
    .reverse()
    .find((cell) => parseNumber(cell) > 0);

  return parseNumber(metricCell);
}

function summarizeRowsByHostname(rows) {
  const summary = new Map();

  for (const row of rows) {
    const current = summary.get(row.hostname) || {
      activeUsersOrSessions: 0,
      hostname: row.hostname,
      sampleRawHostnames: [],
    };
    current.activeUsersOrSessions += row.activeUsersOrSessions;
    if (current.sampleRawHostnames.length < 3 && !current.sampleRawHostnames.includes(row.rawHostname)) {
      current.sampleRawHostnames.push(row.rawHostname);
    }
    summary.set(row.hostname, current);
  }

  return Array.from(summary.values()).sort((left, right) => right.activeUsersOrSessions - left.activeUsersOrSessions);
}

function buildHostnameAudit(rows, sourcePath) {
  const allowedRows = rows.filter((row) => ALLOWED_HOSTNAMES.has(row.hostname));
  const localDevRows = rows.filter((row) => LOCAL_DEV_HOSTNAMES.has(row.hostname));
  const foreignRows = rows.filter((row) => !ALLOWED_HOSTNAMES.has(row.hostname) && !LOCAL_DEV_HOSTNAMES.has(row.hostname));
  const allowedUsersOrSessions = allowedRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const localDevUsersOrSessions = localDevRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const foreignUsersOrSessions = foreignRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const totalUsersOrSessions = rows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const foreignShare = totalUsersOrSessions > 0 ? foreignUsersOrSessions / totalUsersOrSessions : 0;
  const warnings = [];
  const recommendedActions = [];

  if (rows.length === 0) {
    warnings.push("no_hostname_rows");
    recommendedActions.push(
      "This file does not look like a Hostname export. Export GA4 with Hostname as the primary dimension, not City or Device category.",
    );
  }

  if (foreignRows.length > 0) {
    warnings.push("foreign_hostnames_detected");
    recommendedActions.push("Remove the Roth Calculator GA4 Measurement ID from every foreign hostname.");
    recommendedActions.push("If removal is not possible, create a clean GA4 property for Roth Calculator and update the site Measurement ID.");
  }

  if (localDevRows.length > 0) {
    warnings.push("local_dev_hostnames_detected");
    recommendedActions.push("Exclude local development traffic from GA4 reporting or use a separate debug Measurement ID for local testing.");
  }

  if (allowedRows.length === 0 && rows.length > 0) {
    warnings.push("canonical_hostname_missing");
    recommendedActions.push("Confirm the export is from the Roth Calculator GA4 property and includes the expected production date range.");
  }

  const dataQualityStatus =
    foreignRows.length > 0 || allowedRows.length === 0 ? "polluted" : warnings.length > 0 ? "needs-review" : "usable";

  return {
    allowedHostnames: Array.from(ALLOWED_HOSTNAMES),
    allowedRows,
    allowedUsersOrSessions,
    dataQualityStatus,
    decisionBoundary:
      "This audit only evaluates a local GA4 Hostname CSV export. It does not change GA4 settings or Measurement IDs.",
    evidenceType: EVIDENCE_TYPE,
    foreignRows,
    foreignShare: Number(foreignShare.toFixed(4)),
    foreignUsersOrSessions,
    hostnameSummary: summarizeRowsByHostname(rows),
    localDevHostnames: Array.from(LOCAL_DEV_HOSTNAMES),
    localDevRows,
    localDevUsersOrSessions,
    ok: dataQualityStatus === "usable",
    recommendedActions,
    rowCount: rows.length,
    sourcePath: path.resolve(sourcePath),
    totalUsersOrSessions,
    warnings,
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error("Usage: node scripts/ga4-hostname-audit.mjs <ga4-hostname-export.csv>");
  }

  const result = buildHostnameAudit(parseHostnameExport(readText(filePath)), filePath);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
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

export { buildHostnameAudit as buildGa4HostnameAudit, parseHostnameExport };
