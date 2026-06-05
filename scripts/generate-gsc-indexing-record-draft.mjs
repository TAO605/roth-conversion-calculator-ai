import fs from "node:fs";
import path from "node:path";

const DEFAULT_TEMPLATE_PATH = "docs/search-console-indexing-record-template.json";
const DEFAULT_URL = "https://www.roth-conversion-calculator-ai.shop/seo-monitoring";
const DEFAULT_PROPERTY_URL = "https://www.roth-conversion-calculator-ai.shop/";
const EXPECTED_HOST = "www.roth-conversion-calculator-ai.shop";

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

function readJsonIfExists(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function requireSiteUrl(value, label) {
  const url = new URL(value);

  if (url.protocol !== "https:" || url.hostname !== EXPECTED_HOST) {
    throw new Error(`${label} must be an https URL on ${EXPECTED_HOST}`);
  }

  return url.toString();
}

function loadArtifactEvidence(artifactDir) {
  if (!artifactDir) {
    return {};
  }

  const manifest = readJsonIfExists(path.join(artifactDir, "seo-evidence-manifest.json"));
  const validation = readJsonIfExists(path.join(artifactDir, "seo-evidence-validation-result.json"));
  const manifestValidation = readJsonIfExists(
    path.join(artifactDir, "seo-evidence-manifest-validation-result.json"),
  );

  return { manifest, validation, manifestValidation };
}

function buildSiteEvidence({ manifest, validation, manifestValidation }) {
  return {
    productionSeoEvidenceRunId: manifest?.gitHubRunId || "REPLACE_WITH_GITHUB_ACTIONS_RUN_ID",
    productionSeoEvidenceCommitSha: manifest?.gitHubSha || "REPLACE_WITH_40_CHAR_COMMIT_SHA",
    gscEvidenceOk: validation?.ok === true && (validation?.gscPriorityUrlCount ?? 0) > 0,
    searchConsoleVerificationOk: validation?.searchConsoleVerificationOk === true,
    internalLinkEvidenceOk:
      validation?.internalLinkCheckedUrlCount > 0 && manifestValidation?.ok === true,
    htmlQualityEvidenceOk: validation?.htmlQualityPageCount > 0 && manifestValidation?.ok === true,
  };
}

function buildDraft({ artifactDir, inspectedUrl, templatePath }) {
  const template = readJsonIfExists(templatePath);

  if (!template) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const normalizedInspectedUrl = requireSiteUrl(inspectedUrl, "inspectedUrl");
  const evidence = loadArtifactEvidence(artifactDir);
  const siteEvidence = buildSiteEvidence(evidence);

  return {
    ...template,
    recordStatus: "draft",
    recordedAt: new Date().toISOString(),
    recordedBy: "AI-assisted draft",
    property: {
      type: "url-prefix",
      url: DEFAULT_PROPERTY_URL,
    },
    inspectedUrl: normalizedInspectedUrl,
    indexingState: "unknown",
    liveTestState: "not_run",
    googleSelectedCanonical: "REPLACE_WITH_GSC_VALUE_OR_EMPTY",
    userDeclaredCanonical: normalizedInspectedUrl,
    lastCrawlAt: null,
    requestIndexing: {
      attempted: false,
      attemptedAt: null,
      outcome: "not_attempted",
      exactMessage: "REPLACE_WITH_EXACT_GSC_REQUEST_INDEXING_MESSAGE_OR_EMPTY",
    },
    siteEvidence,
    screenshots: [
      {
        label: "URL Inspection result",
        pathOrUrl: "REPLACE_WITH_SCREENSHOT_PATH_OR_URL",
      },
    ],
    notes:
      "AI filled public site evidence from the production SEO artifact when available. Copy the private GSC URL Inspection status, Google-selected canonical, request-indexing result, last crawl date if shown, and screenshot path before changing recordStatus to recorded.",
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const draft = buildDraft({
    artifactDir: args.artifact,
    inspectedUrl: args.url || DEFAULT_URL,
    templatePath: args.template || DEFAULT_TEMPLATE_PATH,
  });
  const output = `${JSON.stringify(draft, null, 2)}\n`;

  if (args.out) {
    fs.writeFileSync(args.out, output, "utf8");
  }

  process.stdout.write(output);
}

try {
  main();
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
