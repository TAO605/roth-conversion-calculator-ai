import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const EVIDENCE_TYPE = "privacy-evidence-sync-boundary";
const DEFAULT_OWNER = "TAO605";
const DEFAULT_REPO = "roth-conversion-calculator-ai";
const DEFAULT_BRANCH = "main";
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIR = path.join(PROJECT_ROOT, "docs", "evidence");
const ALLOWLIST_PATH = path.join(PROJECT_ROOT, "docs", "private-evidence-sync-allowlist.json");
const PRIVATE_IMAGE_PATTERN = /^docs\/evidence\/.*\.(png|jpg|jpeg)$/i;

function parseArgs(argv) {
  const args = {
    branch: process.env.PRIVACY_EVIDENCE_BRANCH || DEFAULT_BRANCH,
    owner: process.env.PRIVACY_EVIDENCE_OWNER || DEFAULT_OWNER,
    repo: process.env.PRIVACY_EVIDENCE_REPO || DEFAULT_REPO,
    skipRemote: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--owner") {
      args.owner = argv[++index];
    } else if (arg === "--repo") {
      args.repo = argv[++index];
    } else if (arg === "--branch") {
      args.branch = argv[++index];
    } else if (arg === "--skip-remote") {
      args.skipRemote = true;
    }
  }

  return args;
}

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function toRepoPath(filePath) {
  return path.relative(PROJECT_ROOT, filePath).replaceAll(path.sep, "/");
}

function scanLocalPrivateEvidence() {
  return walkFiles(EVIDENCE_DIR)
    .map(toRepoPath)
    .filter((repoPath) => PRIVATE_IMAGE_PATTERN.test(repoPath))
    .sort();
}

function validateGitignore() {
  const gitignorePath = path.join(PROJECT_ROOT, ".gitignore");
  const source = fs.readFileSync(gitignorePath, "utf8");

  return {
    jpegIgnored: source.includes("docs/evidence/*.jpeg"),
    jpgIgnored: source.includes("docs/evidence/*.jpg"),
    pngIgnored: source.includes("docs/evidence/*.png"),
  };
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

async function getGitHubToken() {
  const { stdout } = await execAsync("gh auth token", {
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  });

  return stdout.trim();
}

async function fetchRemoteTree({ branch, owner, repo }) {
  const token = await getGitHubToken();
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub tree request failed ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();

  return Array.isArray(payload.tree) ? payload.tree.map((entry) => entry.path).filter(Boolean) : [];
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const localPrivateEvidencePaths = scanLocalPrivateEvidence();
  const gitignore = validateGitignore();
  const allowlist = readAllowlist();
  const allowedRemotePaths = new Set(allowlist.allowedPaths);
  let remotePrivateEvidencePaths = [];
  let remoteError = "";

  if (!args.skipRemote) {
    try {
      const remotePaths = await fetchRemoteTree(args);
      remotePrivateEvidencePaths = remotePaths.filter((repoPath) => PRIVATE_IMAGE_PATTERN.test(repoPath)).sort();
    } catch (error) {
      remoteError = error instanceof Error ? error.message : String(error);
    }
  }

  const approvedRemotePrivateEvidencePaths = remotePrivateEvidencePaths.filter((repoPath) => allowedRemotePaths.has(repoPath));
  const unapprovedRemotePrivateEvidencePaths = remotePrivateEvidencePaths.filter(
    (repoPath) => !allowedRemotePaths.has(repoPath),
  );

  const checks = {
    allowlistPresent: allowlist.present,
    gitignoreRetainsPrivateEvidenceRules: gitignore.pngIgnored && gitignore.jpgIgnored && gitignore.jpegIgnored,
    remotePrivateEvidenceApprovedOnly: unapprovedRemotePrivateEvidencePaths.length === 0,
    remoteScanAvailable: args.skipRemote || remoteError === "",
  };

  const result = {
    branch: args.branch,
    checks,
    evidenceType: EVIDENCE_TYPE,
    fetchedAt: new Date().toISOString(),
    gitignore,
    allowlistPath: allowlist.path,
    approvedRemotePrivateEvidenceCount: approvedRemotePrivateEvidencePaths.length,
    approvedRemotePrivateEvidencePaths,
    localPrivateEvidenceCount: localPrivateEvidencePaths.length,
    localPrivateEvidenceSample: localPrivateEvidencePaths.slice(0, 5),
    ok: Object.values(checks).every(Boolean),
    privacyBoundary:
      "Local GSC screenshots may be kept for owner review, but account UI images must not be synced to GitHub or production evidence artifacts without explicit approval.",
    remoteError,
    remotePrivateEvidenceCount: remotePrivateEvidencePaths.length,
    remotePrivateEvidencePaths,
    unapprovedRemotePrivateEvidenceCount: unapprovedRemotePrivateEvidencePaths.length,
    unapprovedRemotePrivateEvidencePaths,
    repository: `${args.owner}/${args.repo}`,
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
