import crypto from "node:crypto";
import fs from "node:fs";

const DEFAULT_FILES = [
  "seo-smoke-result.json",
  "gsc-evidence-result.json",
  "performance-evidence-result.json",
  "structured-data-evidence-result.json",
  "blog-discovery-evidence-result.json",
  "professional-ui-evidence-result.json",
  "seo-evidence-validation-result.json",
  "seo-evidence-manifest.json",
  "seo-evidence-manifest-validation-result.json",
];

function fileRecord(filePath) {
  if (filePath === "seo-evidence-manifest.json") {
    return {
      bytes: null,
      generatedBy: "scripts/generate-seo-evidence-manifest.mjs",
      name: filePath,
      selfDescribing: true,
    };
  }

  if (filePath === "seo-evidence-manifest-validation-result.json") {
    return {
      bytes: null,
      generatedBy: "scripts/validate-seo-evidence-manifest.mjs",
      name: filePath,
      postManifestValidation: true,
    };
  }

  const bytes = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  return {
    bytes: stats.size,
    name: filePath,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
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

function gitHubRunUrl() {
  const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repository = process.env.GITHUB_REPOSITORY || "";
  const runId = process.env.GITHUB_RUN_ID || "";

  return repository && runId ? `${serverUrl}/${repository}/actions/runs/${runId}` : "";
}

function gitHubCommitUrl() {
  const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repository = process.env.GITHUB_REPOSITORY || "";
  const sha = process.env.GITHUB_SHA || "";

  return repository && sha ? `${serverUrl}/${repository}/commit/${sha}` : "";
}

function run() {
  const smoke = readJson("seo-smoke-result.json");
  const validation = readJson("seo-evidence-validation-result.json");
  const files = DEFAULT_FILES.map(fileRecord);

  const manifest = {
    artifactName: "production-seo-evidence",
    baseUrl: smoke.baseUrl,
    eventName: process.env.GITHUB_EVENT_NAME || "local",
    files,
    generatedAt: new Date().toISOString(),
    gitHubCommitUrl: gitHubCommitUrl(),
    gitHubRunAttempt: process.env.GITHUB_RUN_ATTEMPT || "",
    gitHubRunId: process.env.GITHUB_RUN_ID || "",
    gitHubRunUrl: gitHubRunUrl(),
    gitHubServerUrl: process.env.GITHUB_SERVER_URL || "https://github.com",
    gitHubSha: process.env.GITHUB_SHA || "",
    gitHubWorkflow: process.env.GITHUB_WORKFLOW || "",
    ok: validation.ok === true,
    retentionDays: 30,
  };

  console.log(JSON.stringify(manifest, null, 2));
}

try {
  run();
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
