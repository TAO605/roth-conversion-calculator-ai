import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_READINESS_PATH = "blog-ready-result.json";
const DEFAULT_FINAL_PATH = "blog-final-publication-result.json";
const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const DEFAULT_BLOG_DISCOVERY_PATH = "blog-discovery-evidence-result.json";
const DEFAULT_OUTPUT_PATH = "blog-publication-manifest.json";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseArgs(argv) {
  const args = {
    blogDiscoveryPath: DEFAULT_BLOG_DISCOVERY_PATH,
    finalPath: DEFAULT_FINAL_PATH,
    output: DEFAULT_OUTPUT_PATH,
    readinessPath: DEFAULT_READINESS_PATH,
    smokePath: DEFAULT_SMOKE_PATH,
    structuredDataPath: DEFAULT_STRUCTURED_DATA_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--path") {
      args.path = next;
      index += 1;
    } else if (arg === "--readiness") {
      args.readinessPath = next;
      index += 1;
    } else if (arg === "--final") {
      args.finalPath = next;
      index += 1;
    } else if (arg === "--smoke") {
      args.smokePath = next;
      index += 1;
    } else if (arg === "--structured-data") {
      args.structuredDataPath = next;
      index += 1;
    } else if (arg === "--blog-discovery") {
      args.blogDiscoveryPath = next;
      index += 1;
    } else if (arg === "--review") {
      args.reviewPath = next;
      index += 1;
    } else if (arg === "--output") {
      args.output = next;
      index += 1;
    }
  }

  assert(args.path, "Usage: node scripts/generate-blog-publication-manifest.mjs --path /blog/slug");
  assert(args.path.startsWith("/blog/"), "Blog publication manifest path must be a /blog/ URL path");

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

function fileRecord(filePath, role) {
  const bytes = fs.readFileSync(filePath);

  return {
    bytes: bytes.length,
    name: path.basename(filePath),
    path: filePath,
    role,
    sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
  };
}

export function buildBlogPublicationManifest({ args, blogDiscovery, finalValidation, readiness, smoke, structuredData }) {
  assert(readiness.evidenceType === "blog-publication-readiness", "Readiness evidence type mismatch");
  assert(readiness.ok === true, "Readiness evidence must be ok");
  assert(finalValidation.evidenceType === "blog-final-publication-validation", "Final validation evidence type mismatch");
  assert(finalValidation.ok === true, "Final validation evidence must be ok");
  assert(finalValidation.path === args.path, "Final validation path must match manifest path");
  assert(smoke.ok === true, "SEO smoke evidence must be ok");
  assert(structuredData.ok === true, "Structured-data evidence must be ok");
  assert(blogDiscovery.ok === true, "Blog discovery evidence must be ok");

  const files = [
    fileRecord(args.readinessPath, "readiness"),
    fileRecord(args.finalPath, "final-publication-validation"),
    fileRecord(args.smokePath, "seo-smoke"),
    fileRecord(args.structuredDataPath, "structured-data"),
    fileRecord(args.blogDiscoveryPath, "blog-discovery"),
    ...(args.reviewPath ? [fileRecord(args.reviewPath, "draft-review")] : []),
  ];

  return {
    artifactName: "blog-publication-package",
    blogPostCount: blogDiscovery.blogPostCount,
    evidenceType: "blog-publication-manifest",
    files,
    generatedAt: new Date().toISOString(),
    ok: true,
    path: args.path,
    publicationStatus: finalValidation.publicationStatus,
    structuredDataTypes: finalValidation.structuredDataTypes,
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = buildBlogPublicationManifest({
    args,
    blogDiscovery: readJson(args.blogDiscoveryPath),
    finalValidation: readJson(args.finalPath),
    readiness: readJson(args.readinessPath),
    smoke: readJson(args.smokePath),
    structuredData: readJson(args.structuredDataPath),
  });
  const outputPath = path.resolve(args.output);
  const payload = {
    ...manifest,
    outputPath,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(payload, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          evidenceType: "blog-publication-manifest",
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
