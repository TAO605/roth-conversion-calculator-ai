import crypto from "node:crypto";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const DEFAULT_MANIFEST_PATH = "blog-publication-manifest.json";
const REQUIRED_ROLES = ["readiness", "final-publication-validation", "seo-smoke", "structured-data", "blog-discovery"];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseArgs(argv) {
  const args = {
    manifestPath: DEFAULT_MANIFEST_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--manifest") {
      args.manifestPath = next;
      index += 1;
    }
  }

  return args;
}

function readText(filePath) {
  const bytes = fs.readFileSync(filePath);
  const hasUtf16Bom = bytes[0] === 0xff && bytes[1] === 0xfe;
  const hasUtf16Nulls = bytes.length > 5 && bytes[3] === 0 && bytes[5] === 0;

  return bytes.toString(hasUtf16Bom || hasUtf16Nulls ? "utf16le" : "utf8").replace(/^\uFEFF/, "");
}

function readJson(filePath) {
  const raw = readText(filePath).trim();

  assert(raw.startsWith("{") && raw.endsWith("}"), `${filePath} must contain a single JSON object`);

  return JSON.parse(raw);
}

function fileHash(filePath) {
  const bytes = fs.readFileSync(filePath);

  return {
    bytes: bytes.length,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

export function validateBlogPublicationManifest(manifest) {
  assert(manifest.evidenceType === "blog-publication-manifest", "Manifest evidenceType mismatch");
  assert(manifest.artifactName === "blog-publication-package", "Manifest artifactName mismatch");
  assert(manifest.ok === true, "Manifest must be ok");
  assert(typeof manifest.path === "string" && manifest.path.startsWith("/blog/"), "Manifest path must be a /blog/ URL path");
  assert(
    ["manual-review-required", "ready-for-publication"].includes(manifest.publicationStatus),
    "Manifest publicationStatus is invalid",
  );
  assert(Array.isArray(manifest.files), "Manifest files must be an array");
  assert(Array.isArray(manifest.structuredDataTypes), "Manifest structuredDataTypes must be an array");
  assert(manifest.structuredDataTypes.includes("Article"), "Manifest structuredDataTypes must include Article");
  assert(manifest.structuredDataTypes.includes("BreadcrumbList"), "Manifest structuredDataTypes must include BreadcrumbList");

  const roles = manifest.files.map((file) => file.role);

  for (const role of REQUIRED_ROLES) {
    assert(roles.includes(role), `Manifest missing required evidence role: ${role}`);
  }

  for (const file of manifest.files) {
    assert(typeof file.path === "string" && file.path.length > 0, `Manifest file ${file.role} path is missing`);
    assert(typeof file.name === "string" && file.name.length > 0, `Manifest file ${file.role} name is missing`);
    assert(Number.isFinite(file.bytes) && file.bytes > 0, `Manifest file ${file.role} bytes must be positive`);
    assert(typeof file.sha256 === "string" && /^[a-f0-9]{64}$/i.test(file.sha256), `Manifest file ${file.role} sha256 is invalid`);

    const actual = fileHash(file.path);
    assert(actual.bytes === file.bytes, `Manifest file ${file.role} byte count mismatch`);
    assert(actual.sha256 === file.sha256, `Manifest file ${file.role} sha256 mismatch`);
  }

  return {
    evidenceType: "blog-publication-manifest-validation",
    fileCount: manifest.files.length,
    ok: true,
    path: manifest.path,
    publicationStatus: manifest.publicationStatus,
    requiredRoleCount: REQUIRED_ROLES.length,
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = readJson(args.manifestPath);
  const result = {
    ...validateBlogPublicationManifest(manifest),
    manifestPath: args.manifestPath,
  };

  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          evidenceType: "blog-publication-manifest-validation",
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
