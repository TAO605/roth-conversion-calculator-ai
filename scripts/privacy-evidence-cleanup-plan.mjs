import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const EVIDENCE_TYPE = "privacy-evidence-cleanup-plan";
const DEFAULT_OWNER = "TAO605";
const DEFAULT_REPO = "roth-conversion-calculator-ai";
const DEFAULT_BRANCH = "main";
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ALLOWLIST_PATH = path.join(PROJECT_ROOT, "docs", "private-evidence-sync-allowlist.json");
const PRIVATE_IMAGE_PATTERN = /^docs\/evidence\/.*\.(png|jpg|jpeg)$/i;

function parseArgs(argv) {
  const args = {
    branch: process.env.PRIVACY_EVIDENCE_BRANCH || DEFAULT_BRANCH,
    owner: process.env.PRIVACY_EVIDENCE_OWNER || DEFAULT_OWNER,
    repo: process.env.PRIVACY_EVIDENCE_REPO || DEFAULT_REPO,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--owner") {
      args.owner = argv[++index];
    } else if (arg === "--repo") {
      args.repo = argv[++index];
    } else if (arg === "--branch") {
      args.branch = argv[++index];
    }
  }

  return args;
}

function toRepoPath(filePath) {
  return path.relative(PROJECT_ROOT, filePath).replaceAll(path.sep, "/");
}

function readAllowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) {
    return {
      allowedPaths: [],
      path: toRepoPath(ALLOWLIST_PATH),
      present: false,
    };
  }

  const allowlist = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, "utf8").replace(/^\uFEFF/, ""));
  const allowedPaths = Array.isArray(allowlist.allowedPaths)
    ? allowlist.allowedPaths.map((entry) => entry.path).filter(Boolean).sort()
    : [];

  return {
    allowedPaths,
    path: toRepoPath(ALLOWLIST_PATH),
    present: true,
  };
}

async function runGitHubApi(apiPath) {
  const command = `gh api ${apiPath}`;
  const { stdout } = await execAsync(command, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  return JSON.parse(stdout);
}

async function fetchRemoteTree({ branch, owner, repo }) {
  const payload = await runGitHubApi(`repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  return Array.isArray(payload.tree) ? payload.tree.filter((entry) => entry.path && entry.type === "blob") : [];
}

async function fetchContents({ branch, owner, path: repoPath, repo }) {
  return runGitHubApi(`repos/${owner}/${repo}/contents/${repoPath}?ref=${branch}`);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const allowlist = readAllowlist();
  const allowedRemotePaths = new Set(allowlist.allowedPaths);
  const remoteTree = await fetchRemoteTree(args);
  const remotePrivateEvidencePaths = remoteTree
    .map((entry) => entry.path)
    .filter((repoPath) => PRIVATE_IMAGE_PATTERN.test(repoPath))
    .sort();

  const cleanupCandidatePaths = remotePrivateEvidencePaths.filter((repoPath) => !allowedRemotePaths.has(repoPath));
  const retainedApprovedPaths = remotePrivateEvidencePaths.filter((repoPath) => allowedRemotePaths.has(repoPath));
  const cleanupCandidates = [];

  for (const repoPath of cleanupCandidatePaths) {
    const content = await fetchContents({ ...args, path: repoPath });
    cleanupCandidates.push({
      path: repoPath,
      sha: content.sha || "",
      size: content.size || 0,
    });
  }

  const result = {
    actionRequired:
      "Explicit user confirmation is required before deleting public GitHub files. This command is dry-run only.",
    allowlistPath: allowlist.path,
    allowlistPresent: allowlist.present,
    branch: args.branch,
    cleanupComplete: cleanupCandidates.length === 0,
    cleanupCandidateCount: cleanupCandidates.length,
    cleanupCandidates,
    dryRunOnly: true,
    evidenceType: EVIDENCE_TYPE,
    fetchedAt: new Date().toISOString(),
    ok: allowlist.present,
    repository: `${args.owner}/${args.repo}`,
    retainedApprovedCount: retainedApprovedPaths.length,
    retainedApprovedPaths,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

run().catch((error) => {
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
});
