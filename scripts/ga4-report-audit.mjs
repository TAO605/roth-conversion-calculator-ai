import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EVIDENCE_TYPE = "ga4-report-audit";
const DEFAULT_ALLOWED_TITLE_PATTERNS = [
  /roth/i,
  /calculator assumptions/i,
  /cpa review/i,
  /site index/i,
  /release notes/i,
  /seo monitoring/i,
  /tax data update/i,
  /privacy/i,
  /terms/i,
  /editorial policy/i,
  /methodology/i,
  /罗斯|羅斯|个人退休|個人退休|退休账户|退休帳戶|转换|轉換|计算器|計算器|税负|稅負|盈亏|盈虧|平衡/,
];
const KNOWN_FOREIGN_TITLE_PATTERNS = [
  /heshengxin/i,
  /pool/i,
  /robot/i,
  /cordless/i,
  /kabellos/i,
  /reinigungsroboter/i,
  /hersteller/i,
  /lieferanten/i,
  /lösungen/i,
  /ueber uns|über uns/i,
  /teamzusammenarbeitsvereinbarung/i,
  /r&d capability/i,
  /anbieterverzeichnis/i,
];

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

function looksLikeSourceMediumSection(rows) {
  return rows.some((row) => /\s\/\s/.test(row.sourceMedium));
}

function parseGa4OverviewExport(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const overview = {
    activeUsers: 0,
    averageEngagementSecondsPerActiveUser: 0,
    eventCount: 0,
    newUsers: 0,
  };
  const pageRows = [];
  const acquisitionSections = [];
  const cityRows = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("#")) continue;

    const cells = splitCsvLine(line);
    const nextCells = splitCsvLine(lines[index + 1] || "");

    if (cells.length === 4 && nextCells.length === 4 && nextCells.every((cell) => /^-?\d/.test(cell))) {
      overview.activeUsers = parseNumber(nextCells[0]);
      overview.newUsers = parseNumber(nextCells[1]);
      overview.averageEngagementSecondsPerActiveUser = parseNumber(nextCells[2]);
      overview.eventCount = parseNumber(nextCells[3]);
      index += 1;
      continue;
    }

    if (cells.length === 5) {
      index += 1;
      while (index < lines.length && !lines[index].startsWith("#") && splitCsvLine(lines[index]).length >= 5) {
        const row = splitCsvLine(lines[index]);
        pageRows.push({
          activeUsers: parseNumber(row[2]),
          bounceRate: parseNumber(row[4]),
          eventCount: parseNumber(row[3]),
          title: row[0],
          views: parseNumber(row[1]),
        });
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (cells.length === 2 && /city|城市|鍩庡競/i.test(line)) {
      index += 1;
      while (index < lines.length && !lines[index].startsWith("#") && splitCsvLine(lines[index]).length >= 2) {
        const row = splitCsvLine(lines[index]);
        cityRows.push({
          activeUsers: parseNumber(row[1]),
          city: row[0],
        });
        index += 1;
      }
      index -= 1;
      continue;
    }

    if (cells.length === 2 && !/audience|platform|受众|平台/i.test(line)) {
      const rows = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("#") && splitCsvLine(lines[index]).length >= 2) {
        const row = splitCsvLine(lines[index]);
        rows.push({
          activeUsersOrSessions: parseNumber(row[1]),
          sourceMedium: row[0],
        });
        index += 1;
      }
      if (looksLikeSourceMediumSection(rows)) {
        acquisitionSections.push({
          header: line,
          rows,
          sectionIndex: acquisitionSections.length,
        });
      }
      index -= 1;
    }
  }

  return { acquisitionSections, cityRows, overview, pageRows };
}

function classifyTitle(title) {
  const isKnownForeign = KNOWN_FOREIGN_TITLE_PATTERNS.some((pattern) => pattern.test(title));
  const isAllowed = DEFAULT_ALLOWED_TITLE_PATTERNS.some((pattern) => pattern.test(title));

  if (isKnownForeign) return "foreign-site-suspected";
  if (isAllowed) return "site-relevant";
  return "unknown-or-needs-hostname";
}

function buildAudit(parsed, sourcePath) {
  const pageRows = parsed.pageRows.map((row) => ({ ...row, classification: classifyTitle(row.title) }));
  const foreignRows = pageRows.filter((row) => row.classification === "foreign-site-suspected");
  const unknownRows = pageRows.filter((row) => row.classification === "unknown-or-needs-hostname");
  const primaryAcquisitionRows = parsed.acquisitionSections[0]?.rows || [];
  const directRows = primaryAcquisitionRows.filter((row) => /\(direct\)\s*\/\s*\(none\)/i.test(row.sourceMedium));
  const organicRows = primaryAcquisitionRows.filter((row) => /google\s*\/\s*organic/i.test(row.sourceMedium));
  const directUsersOrSessions = directRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const organicUsersOrSessions = organicRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const totalKnownAcquisition = primaryAcquisitionRows.reduce((sum, row) => sum + row.activeUsersOrSessions, 0);
  const directShare = totalKnownAcquisition > 0 ? directUsersOrSessions / totalKnownAcquisition : 0;
  const foreignViews = foreignRows.reduce((sum, row) => sum + row.views, 0);
  const totalViews = pageRows.reduce((sum, row) => sum + row.views, 0);
  const warnings = [];
  const recommendedActions = [];

  if (foreignRows.length > 0) {
    warnings.push("foreign_page_titles_detected");
    recommendedActions.push(
      "In GA4, add Hostname to the report or Exploration and confirm whether a different domain is sending events to this property.",
    );
    recommendedActions.push(
      "If the foreign titles come from another site, remove this Measurement ID from that site or move Roth Calculator to a clean GA4 property.",
    );
  }

  if (unknownRows.length > 0) {
    warnings.push("unknown_page_titles_need_hostname_review");
    recommendedActions.push("Review unknown page titles with a Hostname dimension before using the export for SEO decisions.");
  }

  if (
    parsed.overview.averageEngagementSecondsPerActiveUser > 0 &&
    parsed.overview.averageEngagementSecondsPerActiveUser < 5
  ) {
    warnings.push("very_low_average_engagement_time");
    recommendedActions.push(
      "Do not treat engagement metrics as reliable product-quality evidence until internal tests, bots, and foreign-host traffic are filtered.",
    );
  }

  if (organicUsersOrSessions < 10) {
    warnings.push("low_google_organic_sample");
    recommendedActions.push("Keep GSC/GA4 query-driven content work in observation mode until organic search has a larger sample.");
  }

  if (directShare > 0.9) {
    warnings.push("direct_traffic_dominates");
    recommendedActions.push("Separate owner/testing/direct traffic from organic acquisition before using GA4 for pSEO scoring.");
  }

  const dataQualityStatus = warnings.includes("foreign_page_titles_detected")
    ? "polluted"
    : warnings.length > 0
      ? "needs-review"
      : "usable";

  return {
    acquisitionSummary: {
      acquisitionSectionCount: parsed.acquisitionSections.length,
      directShare: Number(directShare.toFixed(4)),
      directUsersOrSessions,
      googleOrganicUsersOrSessions: organicUsersOrSessions,
      primaryRows: primaryAcquisitionRows,
      sections: parsed.acquisitionSections,
      totalKnownAcquisition,
    },
    citySummary: {
      topCities: parsed.cityRows.slice(0, 10),
    },
    dataQualityStatus,
    decisionBoundary:
      "This audit only evaluates a local GA4 CSV export. It does not change GA4 settings, fetch private Analytics data, or approve pSEO publication.",
    evidenceType: EVIDENCE_TYPE,
    hostnameReviewRequired: foreignRows.length > 0 || unknownRows.length > 0,
    measuredSite: "https://www.roth-conversion-calculator-ai.shop",
    ok: dataQualityStatus !== "polluted",
    overview: parsed.overview,
    pageSummary: {
      foreignPageRowCount: foreignRows.length,
      foreignRows,
      foreignViews,
      topRows: pageRows.slice(0, 10),
      totalPageRows: pageRows.length,
      totalViews,
      unknownPageRowCount: unknownRows.length,
    },
    recommendedActions,
    sourcePath: path.resolve(sourcePath),
    warnings,
  };
}

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    throw new Error("Usage: node scripts/ga4-report-audit.mjs <ga4-overview-export.csv>");
  }

  const result = buildAudit(parseGa4OverviewExport(readText(filePath)), filePath);
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

export { buildAudit as buildGa4ReportAudit, parseGa4OverviewExport };
