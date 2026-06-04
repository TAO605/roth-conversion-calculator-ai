import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_MANIFEST_PATH = "seo-evidence-manifest.json";
const EXPECTED_ARTIFACT_NAME = "production-seo-evidence";
const EXPECTED_SOURCE_FILES = [
  "seo-smoke-result.json",
  "gsc-evidence-result.json",
  "performance-evidence-result.json",
  "structured-data-evidence-result.json",
  "blog-discovery-evidence-result.json",
  "professional-ui-evidence-result.json",
  "seo-evidence-validation-result.json",
];
const SELF_FILE = "seo-evidence-manifest.json";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readText(filePath) {
  const bytes = fs.readFileSync(filePath);
  const hasUtf16Bom = bytes[0] === 0xff && bytes[1] === 0xfe;
  const hasUtf16Nulls = bytes.length > 5 && bytes[3] === 0 && bytes[5] === 0;

  return bytes.toString(hasUtf16Bom || hasUtf16Nulls ? "utf16le" : "utf8").replace(/^\uFEFF/, "");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function parseArgs(argv) {
  const manifestFlagIndex = argv.indexOf("--manifest");

  if (manifestFlagIndex >= 0) {
    assert(argv[manifestFlagIndex + 1], "--manifest requires a file path");
    return argv[manifestFlagIndex + 1];
  }

  return argv[0] || DEFAULT_MANIFEST_PATH;
}

function hashFile(filePath) {
  const bytes = fs.readFileSync(filePath);

  return {
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

function validateSeoEvidenceManifest(manifestPath) {
  const manifest = readJson(manifestPath);
  const manifestDir = path.dirname(path.resolve(manifestPath));

  assert(manifest.ok === true, "SEO evidence manifest must be ok");
  assert(manifest.artifactName === EXPECTED_ARTIFACT_NAME, "SEO evidence manifest artifactName changed unexpectedly");
  assert(manifest.baseUrl === "https://www.roth-conversion-calculator-ai.shop", "SEO evidence manifest baseUrl changed unexpectedly");
  assert(manifest.retentionDays === 30, "SEO evidence manifest retentionDays must be 30");
  assert(Array.isArray(manifest.files), "SEO evidence manifest files must be an array");

  const records = new Map(manifest.files.map((file) => [file.name, file]));

  for (const fileName of EXPECTED_SOURCE_FILES) {
    const record = records.get(fileName);
    assert(record, `SEO evidence manifest missing ${fileName}`);
    assert(typeof record.bytes === "number" && record.bytes > 0, `${fileName} bytes must be a positive number`);
    assert(typeof record.sha256 === "string" && /^[a-f0-9]{64}$/i.test(record.sha256), `${fileName} sha256 is invalid`);

    const actual = hashFile(path.join(manifestDir, fileName));
    assert(actual.bytes === record.bytes, `${fileName} byte count mismatch`);
    assert(actual.sha256 === record.sha256, `${fileName} sha256 mismatch`);
  }

  const selfRecord = records.get(SELF_FILE);
  assert(selfRecord, "SEO evidence manifest must include its self entry");
  assert(selfRecord.selfDescribing === true, "SEO evidence manifest self entry must be selfDescribing");
  assert(selfRecord.bytes === null, "SEO evidence manifest self entry must not record a byte count");
  assert(selfRecord.sha256 === undefined, "SEO evidence manifest self entry must not hash itself");

  return {
    artifactName: manifest.artifactName,
    checkedFileCount: EXPECTED_SOURCE_FILES.length,
    manifestFileCount: manifest.files.length,
    ok: true,
    selfDescribing: true,
    sha256CheckedCount: EXPECTED_SOURCE_FILES.length,
  };
}

try {
  const manifestPath = parseArgs(process.argv.slice(2));
  console.log(JSON.stringify(validateSeoEvidenceManifest(manifestPath), null, 2));
} catch (error) {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
