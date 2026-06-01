import fs from "node:fs";

const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_GSC_PATH = "gsc-evidence-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const smokePath = process.argv[2] || DEFAULT_SMOKE_PATH;
const gscPath = process.argv[3] || DEFAULT_GSC_PATH;
const structuredDataPath = process.argv[4] || DEFAULT_STRUCTURED_DATA_PATH;

const freshnessCriticalPaths = new Set([
  "/",
  "/seo-monitoring",
  "/methodology",
  "/tax-data-update",
  "/tax-brackets/2026",
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  const bytes = fs.readFileSync(filePath);
  const hasUtf16Bom = bytes[0] === 0xff && bytes[1] === 0xfe;
  const hasUtf16Nulls = bytes.length > 5 && bytes[3] === 0 && bytes[5] === 0;
  const raw = bytes.toString(hasUtf16Bom || hasUtf16Nulls ? "utf16le" : "utf8").replace(/^\uFEFF/, "").trim();

  assert(raw.startsWith("{") && raw.endsWith("}"), `${filePath} must contain a single JSON object`);

  return JSON.parse(raw);
}

function findResult(results, key, value) {
  return results.find((result) => result[key] === value);
}

function validateSmokeEvidence(smoke) {
  assert(smoke.ok === true, "seo smoke evidence must be ok");
  assert(typeof smoke.baseUrl === "string" && smoke.baseUrl.startsWith("https://"), "seo smoke baseUrl is missing");
  assert(Array.isArray(smoke.results), "seo smoke results must be an array");

  for (const check of ["homepage", "robots", "sitemap", "llms"]) {
    const result = findResult(smoke.results, "check", check);
    assert(result, `seo smoke evidence missing ${check}`);
    assert(result.status === 200, `${check} status must be 200`);
  }

  const homepage = findResult(smoke.results, "check", "homepage");
  assert(homepage.canonical === smoke.baseUrl || homepage.canonical === `${smoke.baseUrl}/`, "homepage canonical mismatch");
}

function validateGscEvidence(gsc, expectedBaseUrl) {
  assert(gsc.ok === true, "GSC evidence must be ok");
  assert(gsc.baseUrl === expectedBaseUrl, "GSC evidence baseUrl must match SEO smoke baseUrl");
  assert(gsc.minFreshLastmod === "2026-05-30", "GSC evidence minFreshLastmod changed unexpectedly");
  assert(gsc.priorityUrlCount >= 6, "GSC evidence priorityUrlCount is too low");
  assert(Array.isArray(gsc.results), "GSC evidence results must be an array");

  for (const pathname of ["/", "/seo-monitoring", "/methodology", "/tax-data-update", "/tax-brackets/2026", "/roth-conversion-irmaa-guide"]) {
    const result = findResult(gsc.results, "path", pathname);
    assert(result, `GSC evidence missing ${pathname}`);
    assert(result.status === 200, `${pathname} status must be 200`);
    assert(result.inSitemap === true, `${pathname} must be in sitemap`);
    assert(result.noindex === false, `${pathname} must not be noindex`);
    assert(typeof result.canonical === "string" && result.canonical.startsWith(expectedBaseUrl), `${pathname} canonical mismatch`);
    assert(typeof result.lastmod === "string" && result.lastmod.length > 0, `${pathname} lastmod is missing`);

    if (freshnessCriticalPaths.has(pathname)) {
      assert(result.lastmodFresh === true, `${pathname} must have lastmodFresh: true`);
    }
  }
}

function validateStructuredDataEvidence(structuredData, expectedBaseUrl) {
  assert(structuredData.ok === true, "Structured data evidence must be ok");
  assert(structuredData.baseUrl === expectedBaseUrl, "Structured data evidence baseUrl must match SEO smoke baseUrl");
  assert(structuredData.jsonLdScriptCount >= 6, "Structured data evidence must include homepage JSON-LD scripts");
  assert(structuredData.pageCount >= 8, "Structured data evidence must include priority content pages");
  assert(Array.isArray(structuredData.pages), "Structured data evidence pages must be an array");
  assert(Array.isArray(structuredData.types), "Structured data evidence types must be an array");
  assert(Array.isArray(structuredData.forbiddenKeys), "Structured data forbiddenKeys must be an array");
  assert(Array.isArray(structuredData.forbiddenTextMatches), "Structured data forbiddenTextMatches must be an array");
  assert(structuredData.forbiddenKeys.length === 0, "Structured data must not include review or rating keys");
  assert(structuredData.forbiddenTextMatches.length === 0, "Structured data must not include unsafe YMYL text");
  assert(structuredData.siteUrlCount > 0, "Structured data must include canonical site URLs");

  for (const type of ["WebApplication", "WebSite", "WebPage", "HowTo", "Organization", "FAQPage"]) {
    assert(structuredData.types.includes(type), `Structured data evidence missing ${type}`);
  }

  for (const pathname of [
    "/",
    "/roth-conversion-irmaa-guide",
    "/roth-conversion-aca-premium-tax-credit-guide",
    "/tax-brackets/2026",
    "/roth-conversion-niit-guide",
    "/roth-conversion-rmd-guide",
    "/roth-conversion-social-security-tax-guide",
    "/roth-conversion-estimated-tax-guide",
  ]) {
    const page = findResult(structuredData.pages, "path", pathname);
    assert(page, `Structured data evidence missing ${pathname}`);
    assert(Array.isArray(page.types), `${pathname} structured data types must be an array`);
    assert(Array.isArray(page.forbiddenKeys) && page.forbiddenKeys.length === 0, `${pathname} must not include review or rating keys`);
    assert(
      Array.isArray(page.forbiddenTextMatches) && page.forbiddenTextMatches.length === 0,
      `${pathname} must not include unsafe YMYL text`,
    );
    assert(page.siteUrlCount > 0, `${pathname} structured data must include canonical site URLs`);

    if (pathname !== "/") {
      assert(page.types.includes("WebPage"), `${pathname} structured data evidence missing WebPage`);
      assert(page.types.includes("BreadcrumbList"), `${pathname} structured data evidence missing BreadcrumbList`);
    }
  }
}

function run() {
  const smoke = readJson(smokePath);
  const gsc = readJson(gscPath);
  const structuredData = readJson(structuredDataPath);

  validateSmokeEvidence(smoke);
  validateGscEvidence(gsc, smoke.baseUrl);
  validateStructuredDataEvidence(structuredData, smoke.baseUrl);

  console.log(
    JSON.stringify(
      {
        artifactFiles: [smokePath, gscPath, structuredDataPath],
        baseUrl: smoke.baseUrl,
        gscPriorityUrlCount: gsc.priorityUrlCount,
        ok: true,
        smokeCheckCount: smoke.results.length,
        structuredDataTypeCount: structuredData.types.length,
      },
      null,
      2,
    ),
  );
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
