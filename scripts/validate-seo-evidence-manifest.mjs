import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_MANIFEST_PATH = "seo-evidence-manifest.json";
const EXPECTED_ARTIFACT_NAME = "production-seo-evidence";
const EXPECTED_ARTIFACT_SCHEMA_VERSION = "2026-06-04.1";
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
const MANIFEST_VALIDATION_RESULT_FILE = "seo-evidence-manifest-validation-result.json";
const GITHUB_RUN_URL_PATTERN = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/actions\/runs\/\d+$/;
const GITHUB_COMMIT_URL_PATTERN = /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/commit\/[a-f0-9]{40}$/i;
const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const GITHUB_SHA_PATTERN = /^[a-f0-9]{40}$/i;
const GITHUB_RUN_ID_PATTERN = /^\d+$/;

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

function validateGitHubProvenance(manifest) {
  if (manifest.gitHubRunId !== "" || manifest.gitHubRunUrl !== "") {
    assert(GITHUB_RUN_ID_PATTERN.test(manifest.gitHubRunId), "SEO evidence manifest gitHubRunId must be numeric when retained");
    assert(
      manifest.gitHubRunUrl.endsWith(`/actions/runs/${manifest.gitHubRunId}`),
      "SEO evidence manifest gitHubRunUrl must match gitHubRunId",
    );
  }

  if (manifest.gitHubSha !== "" || manifest.gitHubCommitUrl !== "") {
    assert(GITHUB_SHA_PATTERN.test(manifest.gitHubSha), "SEO evidence manifest gitHubSha must be a 40-character commit SHA when retained");
    assert(
      manifest.gitHubCommitUrl.toLowerCase().endsWith(`/commit/${manifest.gitHubSha.toLowerCase()}`),
      "SEO evidence manifest gitHubCommitUrl must match gitHubSha",
    );
  }
}

function validateSeoEvidenceManifest(manifestPath) {
  const manifest = readJson(manifestPath);
  const manifestDir = path.dirname(path.resolve(manifestPath));

  assert(manifest.ok === true, "SEO evidence manifest must be ok");
  assert(manifest.artifactName === EXPECTED_ARTIFACT_NAME, "SEO evidence manifest artifactName changed unexpectedly");
  assert(
    manifest.artifactSchemaVersion === EXPECTED_ARTIFACT_SCHEMA_VERSION,
    "SEO evidence manifest artifactSchemaVersion changed unexpectedly",
  );
  assert(
    typeof manifest.generatedAt === "string" &&
      ISO_TIMESTAMP_PATTERN.test(manifest.generatedAt) &&
      !Number.isNaN(Date.parse(manifest.generatedAt)),
    "SEO evidence manifest generatedAt must be an ISO timestamp",
  );
  assert(manifest.baseUrl === "https://www.roth-conversion-calculator-ai.shop", "SEO evidence manifest baseUrl changed unexpectedly");
  assert(manifest.retentionDays === 30, "SEO evidence manifest retentionDays must be 30");
  assert(
    manifest.gitHubRunUrl === "" || GITHUB_RUN_URL_PATTERN.test(manifest.gitHubRunUrl),
    "SEO evidence manifest gitHubRunUrl must be empty locally or a GitHub Actions run URL",
  );
  assert(
    manifest.gitHubCommitUrl === "" || GITHUB_COMMIT_URL_PATTERN.test(manifest.gitHubCommitUrl),
    "SEO evidence manifest gitHubCommitUrl must be empty locally or a GitHub commit URL",
  );
  validateGitHubProvenance(manifest);
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

  const manifestValidationRecord = records.get(MANIFEST_VALIDATION_RESULT_FILE);
  assert(manifestValidationRecord, "SEO evidence manifest must include its manifest-validation result entry");
  assert(
    manifestValidationRecord.postManifestValidation === true,
    "SEO evidence manifest validation result entry must be marked postManifestValidation",
  );
  assert(
    manifestValidationRecord.generatedBy === "scripts/validate-seo-evidence-manifest.mjs",
    "SEO evidence manifest validation result entry must record its generator",
  );
  assert(manifestValidationRecord.bytes === null, "SEO evidence manifest validation result entry must not record a byte count");
  assert(
    manifestValidationRecord.sha256 === undefined,
    "SEO evidence manifest validation result entry must not record a pre-validation sha256",
  );

  return {
    artifactName: manifest.artifactName,
    artifactSchemaVersion: manifest.artifactSchemaVersion,
    checkedFileCount: EXPECTED_SOURCE_FILES.length,
    generatedAt: manifest.generatedAt,
    generatedAtRetained: true,
    gitHubProvenanceConsistent:
      (manifest.gitHubRunId === "" || manifest.gitHubRunUrl.endsWith(`/actions/runs/${manifest.gitHubRunId}`)) &&
      (manifest.gitHubSha === "" || manifest.gitHubCommitUrl.toLowerCase().endsWith(`/commit/${manifest.gitHubSha.toLowerCase()}`)),
    manifestFileCount: manifest.files.length,
    manifestValidationResultRetained: true,
    ok: true,
    runUrlRetained: manifest.gitHubRunUrl !== "",
    commitUrlRetained: manifest.gitHubCommitUrl !== "",
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
