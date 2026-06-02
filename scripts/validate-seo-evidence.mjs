import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_GSC_PATH = "gsc-evidence-result.json";
const DEFAULT_PERFORMANCE_PATH = "performance-evidence-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const DEFAULT_BLOG_DISCOVERY_PATH = "blog-discovery-evidence-result.json";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const BLOG_SOURCE_PATH = path.join(PROJECT_ROOT, "src/content/blog.ts");
const STATIC_STRUCTURED_DATA_PAGE_COUNT = 20;
const smokePath = process.argv[2] || DEFAULT_SMOKE_PATH;
const gscPath = process.argv[3] || DEFAULT_GSC_PATH;
const performancePath = process.argv[4] || DEFAULT_PERFORMANCE_PATH;
const structuredDataPath = process.argv[5] || DEFAULT_STRUCTURED_DATA_PATH;
const blogDiscoveryPath = process.argv[6] || DEFAULT_BLOG_DISCOVERY_PATH;

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

function readBlogSlugCount() {
  const source = fs.readFileSync(BLOG_SOURCE_PATH, "utf8");
  const slugs = [...source.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const uniqueSlugs = Array.from(new Set(slugs));

  assert(uniqueSlugs.length > 0, "Blog source did not expose any slugs for SEO evidence validation");

  return uniqueSlugs.length;
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

function validatePerformanceEvidence(performance, expectedBaseUrl) {
  assert(performance.ok === true, "Performance evidence must be ok");
  assert(performance.baseUrl === expectedBaseUrl, "Performance evidence baseUrl must match SEO smoke baseUrl");
  assert(performance.evidenceSource === "lighthouse-mobile-lab", "Performance evidence must come from mobile Lighthouse lab data");
  assert(performance.categories?.seo >= 0.95, "Mobile Lighthouse SEO score is below evidence threshold");
  assert(typeof performance.categories?.performance === "number", "Performance evidence is missing performance score");
  assert(typeof performance.metrics?.largestContentfulPaintMs === "number", "Performance evidence is missing LCP");
  assert(typeof performance.metrics?.totalBlockingTimeMs === "number", "Performance evidence is missing TBT");
  assert(typeof performance.metrics?.cumulativeLayoutShift === "number", "Performance evidence is missing CLS");
  assert(Array.isArray(performance.thresholdResults), "Performance evidence must include thresholdResults");
  assert(typeof performance.manualReviewRequired === "boolean", "Performance evidence must include manualReviewRequired");
  assert(Array.isArray(performance.reviewTriggers), "Performance evidence must include reviewTriggers");
  assert(typeof performance.reviewSummary === "string" && performance.reviewSummary.length > 0, "Performance evidence must include reviewSummary");
  assert(typeof performance.samplePolicy === "object" && performance.samplePolicy !== null, "Performance evidence must include samplePolicy");
  assert(Array.isArray(performance.samplePolicy.attempts), "Performance evidence samplePolicy must include attempts");
  assert(performance.samplePolicy.requestedSamples >= 1, "Performance evidence samplePolicy must include requestedSamples");
  assert(performance.samplePolicy.validSamples >= 1, "Performance evidence samplePolicy must include validSamples");
  assert(
    performance.samplePolicy.selectionStrategy === "median-total-blocking-time-valid-seo-sample",
    "Performance evidence samplePolicy selection strategy changed unexpectedly",
  );
  assert(typeof performance.tbtDiagnostics === "object" && performance.tbtDiagnostics !== null, "Performance evidence must include tbtDiagnostics");
  assert(Array.isArray(performance.tbtDiagnostics.attributionSummary), "Performance evidence must include tbtDiagnostics.attributionSummary");
  assert(Array.isArray(performance.tbtDiagnostics.longTasks), "Performance evidence must include tbtDiagnostics.longTasks");
  assert(Array.isArray(performance.tbtDiagnostics.mainThreadWork), "Performance evidence must include tbtDiagnostics.mainThreadWork");
  assert(Array.isArray(performance.tbtDiagnostics.scriptBootup), "Performance evidence must include tbtDiagnostics.scriptBootup");
  assert(
    Array.isArray(performance.tbtDiagnostics.thirdPartyMainThread),
    "Performance evidence must include tbtDiagnostics.thirdPartyMainThread",
  );
  assert(performance.thresholds?.minPerformanceScore === 0.5, "Performance evidence min score threshold changed unexpectedly");
  assert(typeof performance.lighthouseVersion === "string" && performance.lighthouseVersion.length > 0, "Performance evidence is missing Lighthouse version");
}

function validateStructuredDataEvidence(structuredData, expectedBaseUrl) {
  const expectedStructuredDataPageCount = STATIC_STRUCTURED_DATA_PAGE_COUNT + readBlogSlugCount();

  assert(structuredData.ok === true, "Structured data evidence must be ok");
  assert(structuredData.baseUrl === expectedBaseUrl, "Structured data evidence baseUrl must match SEO smoke baseUrl");
  assert(structuredData.jsonLdScriptCount >= 6, "Structured data evidence must include homepage JSON-LD scripts");
  assert(
    structuredData.pageCount >= expectedStructuredDataPageCount,
    `Structured data evidence must include at least ${expectedStructuredDataPageCount} priority content and blog pages`,
  );
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
    "/calculator-assumptions-guide",
    "/cpa-review-checklist",
    "/roth-conversion-5-year-rules",
    "/roth-conversion-capital-gains-guide",
    "/roth-conversion-cpa-questions",
    "/roth-conversion-custodian-process",
    "/roth-conversion-mistakes",
    "/roth-conversion-planning-checklist",
    "/roth-conversion-qcd-guide",
    "/roth-conversion-recharacterization-guide",
    "/roth-conversion-tax-forms",
    "/roth-conversion-timeline",
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

    if (pathname.startsWith("/blog/")) {
      assert(page.types.includes("Article"), `${pathname} structured data evidence missing Article`);
      assert(page.types.includes("BreadcrumbList"), `${pathname} structured data evidence missing BreadcrumbList`);
    } else if (pathname !== "/") {
      assert(page.types.includes("WebPage"), `${pathname} structured data evidence missing WebPage`);
      assert(page.types.includes("BreadcrumbList"), `${pathname} structured data evidence missing BreadcrumbList`);
    }
  }
}

function validateBlogDiscoveryEvidence(blogDiscovery, expectedBaseUrl) {
  const blogSlugCount = readBlogSlugCount();
  const expectedLlmsMinimum = Math.min(8, blogSlugCount);

  assert(blogDiscovery.ok === true, "Blog discovery evidence must be ok");
  assert(blogDiscovery.baseUrl === expectedBaseUrl, "Blog discovery evidence baseUrl must match SEO smoke baseUrl");
  assert(blogDiscovery.blogPostCount === blogSlugCount, "Blog discovery evidence blogPostCount must match content source");

  for (const check of ["blogHub", "sitemap", "rss", "llms"]) {
    assert(blogDiscovery.checks?.[check]?.status === 200, `Blog discovery ${check} status must be 200`);
  }

  assert(blogDiscovery.checks.blogHub.coveredCount === blogSlugCount, "Blog hub must cover every blog post");
  assert(blogDiscovery.checks.sitemap.coveredCount === blogSlugCount, "Sitemap must cover every blog post");
  assert(blogDiscovery.checks.rss.coveredCount === blogSlugCount, "RSS feed must cover every blog post");
  assert(Array.isArray(blogDiscovery.checks.blogHub.missing) && blogDiscovery.checks.blogHub.missing.length === 0, "Blog hub must not miss article links");
  assert(Array.isArray(blogDiscovery.checks.sitemap.missing) && blogDiscovery.checks.sitemap.missing.length === 0, "Sitemap must not miss blog URLs");
  assert(Array.isArray(blogDiscovery.checks.rss.missing) && blogDiscovery.checks.rss.missing.length === 0, "RSS feed must not miss blog URLs");
  assert(blogDiscovery.checks.llms.coveredCount >= expectedLlmsMinimum, "llms.txt must cover the expected recent blog guide count");
  assert(blogDiscovery.checks.llms.expectedMinimum === expectedLlmsMinimum, "llms.txt expectedMinimum must match current blog count");
}

function run() {
  const smoke = readJson(smokePath);
  const gsc = readJson(gscPath);
  const performance = readJson(performancePath);
  const structuredData = readJson(structuredDataPath);
  const blogDiscovery = readJson(blogDiscoveryPath);

  validateSmokeEvidence(smoke);
  validateGscEvidence(gsc, smoke.baseUrl);
  validatePerformanceEvidence(performance, smoke.baseUrl);
  validateStructuredDataEvidence(structuredData, smoke.baseUrl);
  validateBlogDiscoveryEvidence(blogDiscovery, smoke.baseUrl);

  console.log(
    JSON.stringify(
      {
        artifactFiles: [smokePath, gscPath, performancePath, structuredDataPath, blogDiscoveryPath],
        baseUrl: smoke.baseUrl,
        blogDiscoveryCount: blogDiscovery.blogPostCount,
        gscPriorityUrlCount: gsc.priorityUrlCount,
        ok: true,
        performanceScore: performance.categories.performance,
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
