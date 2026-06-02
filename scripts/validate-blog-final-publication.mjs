import fs from "node:fs";
import { pathToFileURL } from "node:url";

const DEFAULT_READINESS_PATH = "blog-ready-result.json";
const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const DEFAULT_BLOG_DISCOVERY_PATH = "blog-discovery-evidence-result.json";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseArgs(argv) {
  const args = {
    blogDiscoveryPath: DEFAULT_BLOG_DISCOVERY_PATH,
    manualReviewAccepted: false,
    readinessPath: DEFAULT_READINESS_PATH,
    smokePath: DEFAULT_SMOKE_PATH,
    structuredDataPath: DEFAULT_STRUCTURED_DATA_PATH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--readiness") {
      args.readinessPath = next;
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
    } else if (arg === "--path") {
      args.path = next;
      index += 1;
    } else if (arg === "--manual-review-accepted") {
      args.manualReviewAccepted = true;
    }
  }

  assert(args.path, "Usage: node scripts/validate-blog-final-publication.mjs --path /blog/slug");
  assert(args.path.startsWith("/blog/"), "Final publication path must be a /blog/ URL path");

  return args;
}

function readJson(filePath) {
  const bytes = fs.readFileSync(filePath);
  const hasUtf16Bom = bytes[0] === 0xff && bytes[1] === 0xfe;
  const hasUtf16Nulls = bytes.length > 5 && bytes[3] === 0 && bytes[5] === 0;
  const raw = bytes.toString(hasUtf16Bom || hasUtf16Nulls ? "utf16le" : "utf8").replace(/^\uFEFF/, "").trim();

  assert(raw.startsWith("{") && raw.endsWith("}"), `${filePath} must contain a single JSON object`);

  return JSON.parse(raw);
}

function validateReadiness(readiness, manualReviewAccepted) {
  assert(readiness.evidenceType === "blog-publication-readiness", "Readiness evidence type mismatch");
  assert(readiness.ok === true, "Blog readiness evidence must be ok");
  assert(
    ["manual-review-required", "ready-for-publication"].includes(readiness.publicationStatus),
    "Blog readiness publicationStatus is invalid",
  );
  assert(readiness.review?.ok === true, "Nested blog review evidence must be ok");
  assert(readiness.validation?.linkSummary?.internalLinkCount > 0, "Readiness evidence must include an internal link");
  assert(readiness.validation?.linkSummary?.officialSourceLinkCount > 0, "Readiness evidence must include an official source link");
  assert(readiness.validation?.semanticSummary?.validHeadingHierarchy === true, "Readiness evidence must confirm heading hierarchy");

  if (readiness.publicationStatus === "manual-review-required") {
    assert(manualReviewAccepted, "manual-review-required needs --manual-review-accepted before final publication");
  }
}

function validateSmoke(smoke) {
  assert(smoke.ok === true, "SEO smoke evidence must be ok");
  assert(typeof smoke.baseUrl === "string" && smoke.baseUrl.startsWith("https://"), "SEO smoke baseUrl is missing");
  assert(Array.isArray(smoke.results), "SEO smoke results must be an array");

  for (const check of ["homepage", "robots", "sitemap", "llms"]) {
    const result = smoke.results.find((item) => item.check === check);
    assert(result?.status === 200, `SEO smoke ${check} status must be 200`);
  }
}

function validateStructuredData(structuredData, path) {
  assert(structuredData.ok === true, "Structured-data evidence must be ok");
  assert(Array.isArray(structuredData.pages), "Structured-data evidence pages must be an array");

  const page = structuredData.pages.find((item) => item.path === path);
  assert(page, `Structured-data evidence missing ${path}`);
  assert(page.types?.includes("Article"), `${path} structured data must include Article`);
  assert(page.types?.includes("BreadcrumbList"), `${path} structured data must include BreadcrumbList`);
  assert(Array.isArray(page.forbiddenKeys) && page.forbiddenKeys.length === 0, `${path} must not include forbidden review/rating keys`);
  assert(
    Array.isArray(page.forbiddenTextMatches) && page.forbiddenTextMatches.length === 0,
    `${path} must not include unsafe structured-data text`,
  );
}

function validateBlogDiscovery(blogDiscovery) {
  assert(blogDiscovery.ok === true, "Blog discovery evidence must be ok");
  assert(blogDiscovery.checks?.blogHub?.status === 200, "Blog hub evidence status must be 200");
  assert(blogDiscovery.checks?.sitemap?.status === 200, "Sitemap evidence status must be 200");
  assert(blogDiscovery.checks?.rss?.status === 200, "RSS evidence status must be 200");
  assert(blogDiscovery.checks?.llms?.status === 200, "llms.txt evidence status must be 200");
  assert(blogDiscovery.checks.blogHub.coveredCount === blogDiscovery.blogPostCount, "Blog hub must cover every blog post");
  assert(blogDiscovery.checks.sitemap.coveredCount === blogDiscovery.blogPostCount, "Sitemap must cover every blog post");
  assert(blogDiscovery.checks.rss.coveredCount === blogDiscovery.blogPostCount, "RSS must cover every blog post");
  assert(blogDiscovery.checks.llms.coveredCount >= blogDiscovery.checks.llms.expectedMinimum, "llms.txt must meet expected blog coverage");
}

export function validateBlogFinalPublicationPackage({ blogDiscovery, manualReviewAccepted, path, readiness, smoke, structuredData }) {
  validateReadiness(readiness, manualReviewAccepted);
  validateSmoke(smoke);
  validateStructuredData(structuredData, path);
  validateBlogDiscovery(blogDiscovery);

  return {
    blogPostCount: blogDiscovery.blogPostCount,
    evidenceType: "blog-final-publication-validation",
    manualReviewAccepted,
    ok: true,
    path,
    publicationStatus: readiness.publicationStatus,
    structuredDataTypes: structuredData.pages.find((page) => page.path === path)?.types ?? [],
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const result = validateBlogFinalPublicationPackage({
    blogDiscovery: readJson(args.blogDiscoveryPath),
    manualReviewAccepted: args.manualReviewAccepted,
    path: args.path,
    readiness: readJson(args.readinessPath),
    smoke: readJson(args.smokePath),
    structuredData: readJson(args.structuredDataPath),
  });

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
          evidenceType: "blog-final-publication-validation",
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
