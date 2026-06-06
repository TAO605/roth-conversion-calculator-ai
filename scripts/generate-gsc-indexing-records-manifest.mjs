import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_DOCS_DIR = "docs";
const DEFAULT_OUTPUT_PATH = "docs/gsc-indexing-records-manifest.json";
const EVIDENCE_TYPE = "gsc-indexing-records-manifest";
const RECORD_PATTERN = /^search-console-indexing-record-.+-recorded\.json$/;

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) continue;

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

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function buildManifest({ docsDir }) {
  const recordFiles = fs
    .readdirSync(docsDir)
    .filter((name) => RECORD_PATTERN.test(name))
    .sort()
    .map((name) => path.join(docsDir, name));
  const records = recordFiles.map((recordFile) => {
    const record = readJson(recordFile);
    const screenshots = (record.screenshots || []).map((screenshot) => {
      const screenshotPath = screenshot.pathOrUrl;
      const resolvedPath = path.resolve(process.cwd(), screenshotPath);
      const exists = fs.existsSync(resolvedPath);

      return {
        bytes: exists ? fs.statSync(resolvedPath).size : null,
        exists,
        label: screenshot.label,
        pathOrUrl: normalizePath(screenshotPath),
        sha256: exists ? sha256(resolvedPath) : "",
      };
    });
    const screenshotsOk = screenshots.length > 0 && screenshots.every((screenshot) => screenshot.exists);

    return {
      file: normalizePath(recordFile),
      inspectedUrl: record.inspectedUrl,
      indexingState: record.indexingState,
      liveTestState: record.liveTestState,
      ok:
        record.recordStatus === "recorded" &&
        record.indexingState !== "unknown" &&
        record.liveTestState !== "not_run" &&
        screenshotsOk,
      recordSha256: sha256(recordFile),
      recordStatus: record.recordStatus,
      requestIndexingOutcome: record.requestIndexing?.outcome || "unknown",
      screenshots,
      screenshotsOk,
      siteEvidence: record.siteEvidence,
    };
  });

  return {
    evidenceType: EVIDENCE_TYPE,
    generatedAt: new Date().toISOString(),
    ok: records.length > 0 && records.every((record) => record.ok),
    recordCount: records.length,
    records,
    reviewBoundary:
      "This manifest inventories archived GSC indexing records and screenshot files; it does not infer private Search Console status beyond the recorded evidence.",
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = buildManifest({
    docsDir: args.docsDir || DEFAULT_DOCS_DIR,
  });
  const outputPath = args.out || DEFAULT_OUTPUT_PATH;
  const output = `${JSON.stringify(manifest, null, 2)}\n`;

  fs.writeFileSync(outputPath, output, "utf8");
  process.stdout.write(output);

  if (!manifest.ok) {
    process.exitCode = 1;
  }
}

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
