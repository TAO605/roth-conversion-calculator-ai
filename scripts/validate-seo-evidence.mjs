import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_GSC_PATH = "gsc-evidence-result.json";
const DEFAULT_DNS_PATH = "dns-evidence-result.json";
const DEFAULT_SECURITY_HEADERS_PATH = "security-headers-evidence-result.json";
const DEFAULT_HEALTH_PATH = "health-evidence-result.json";
const DEFAULT_PERFORMANCE_PATH = "performance-evidence-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const DEFAULT_BLOG_DISCOVERY_PATH = "blog-discovery-evidence-result.json";
const DEFAULT_PROFESSIONAL_UI_PATH = "professional-ui-evidence-result.json";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const BLOG_SOURCE_PATH = path.join(PROJECT_ROOT, "src/content/blog.ts");
const STATIC_STRUCTURED_DATA_PAGE_COUNT = 20;
const smokePath = process.argv[2] || DEFAULT_SMOKE_PATH;
const gscPath = process.argv[3] || DEFAULT_GSC_PATH;
const dnsPath = process.argv[4] || DEFAULT_DNS_PATH;
const securityHeadersPath = process.argv[5] || DEFAULT_SECURITY_HEADERS_PATH;
const healthPath = process.argv[6] || DEFAULT_HEALTH_PATH;
const performancePath = process.argv[7] || DEFAULT_PERFORMANCE_PATH;
const structuredDataPath = process.argv[8] || DEFAULT_STRUCTURED_DATA_PATH;
const blogDiscoveryPath = process.argv[9] || DEFAULT_BLOG_DISCOVERY_PATH;
const professionalUiPath = process.argv[10] || DEFAULT_PROFESSIONAL_UI_PATH;

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

function validateDnsEvidence(dnsEvidence, expectedBaseUrl) {
  assert(dnsEvidence.ok === true, "DNS evidence must be ok");
  assert(dnsEvidence.canonicalUrl === `${expectedBaseUrl}/`, "DNS evidence canonicalUrl must match SEO smoke baseUrl");
  assert(dnsEvidence.apexHost === "roth-conversion-calculator-ai.shop", "DNS evidence apexHost changed unexpectedly");
  assert(dnsEvidence.wwwHost === "www.roth-conversion-calculator-ai.shop", "DNS evidence wwwHost changed unexpectedly");
  assert(dnsEvidence.expectedCname === "cname.vercel-dns.com", "DNS evidence expected CNAME changed unexpectedly");
  assert(dnsEvidence.expectedCnameRetained === true, "DNS evidence must retain the expected Vercel CNAME");
  assert(dnsEvidence.apexRedirectsToCanonical === true, "DNS evidence must confirm apex redirects to canonical www");
  assert(dnsEvidence.wwwReturnsOk === true, "DNS evidence must confirm canonical www returns 200");
  assert(dnsEvidence.apexHttps?.status === 308, "DNS evidence apex HTTPS status must be 308");
  assert(dnsEvidence.apexHttps?.location === `${expectedBaseUrl}/`, "DNS evidence apex redirect location must match canonical");
  assert(dnsEvidence.wwwHttps?.status === 200, "DNS evidence canonical www HTTPS status must be 200");
  assert(Array.isArray(dnsEvidence.apexRecords?.a), "DNS evidence apex A records must be retained");
  assert(Array.isArray(dnsEvidence.apexRecords?.cname), "DNS evidence apex CNAME records must be retained");
  assert(Array.isArray(dnsEvidence.wwwRecords?.a), "DNS evidence www A records must be retained");
  assert(Array.isArray(dnsEvidence.wwwRecords?.cname), "DNS evidence www CNAME records must be retained");
}

function validateSecurityHeadersEvidence(securityHeaders, expectedBaseUrl) {
  assert(securityHeaders.ok === true, "Security headers evidence must be ok");
  assert(securityHeaders.evidenceType === "production-security-headers", "Security headers evidence type changed unexpectedly");
  assert(securityHeaders.url === `${expectedBaseUrl}/`, "Security headers evidence URL must match SEO smoke baseUrl");
  assert(securityHeaders.status === 200, "Security headers evidence status must be 200");
  assert(securityHeaders.headers?.xPoweredBy === "", "Security headers evidence must show no X-Powered-By header");
  assert(securityHeaders.headers?.xContentTypeOptions === "nosniff", "Security headers evidence must retain nosniff");
  assert(
    securityHeaders.headers?.referrerPolicy === "strict-origin-when-cross-origin",
    "Security headers evidence must retain Referrer-Policy",
  );
  assert(
    securityHeaders.headers?.strictTransportSecurity?.includes("max-age=63072000"),
    "Security headers evidence must retain HSTS",
  );
  for (const check of [
    "baseUriSelf",
    "connectSourcesLimited",
    "contentSecurityPolicyRetained",
    "formActionSelf",
    "frameAncestorsNone",
    "hstsRetained",
    "noPoweredByHeader",
    "nosniffRetained",
    "permissionsPolicyRetained",
    "referrerPolicyRetained",
  ]) {
    assert(securityHeaders.checks?.[check] === true, `Security headers evidence missing passing check: ${check}`);
  }
}

function validateHealthEvidence(health, expectedBaseUrl) {
  assert(health.ok === true, "Health endpoint evidence must be ok");
  assert(health.evidenceType === "production-health-endpoint", "Health evidence type changed unexpectedly");
  assert(health.url === `${expectedBaseUrl}/api/health`, "Health evidence URL must match SEO smoke baseUrl");
  assert(health.status === 200, "Health evidence status must be 200");
  assert(health.app === "roth-conversion-calculator", "Health evidence app changed unexpectedly");
  assert(health.taxYear === 2026, "Health evidence taxYear must remain 2026");
  assert(typeof health.version === "string" && health.version.length > 0, "Health evidence version is missing");
  assert(typeof health.taxData?.lastUpdated === "string" && health.taxData.lastUpdated.length > 0, "Health evidence taxData.lastUpdated is missing");
  assert(
    typeof health.taxData?.professionalReviewStatus === "string" &&
      health.taxData.professionalReviewStatus.toLowerCase().includes("pending"),
    "Health evidence must retain pending professional review status",
  );
  assert(health.content?.blogPosts >= 13, "Health evidence blog coverage is below expected count");
  assert(health.content?.glossaryTerms >= 12, "Health evidence glossary coverage is below expected count");
  assert(health.features?.enabled > 10, "Health evidence enabled feature coverage is unexpectedly low");
  for (const check of [
    "appRetained",
    "blogCoverageRetained",
    "cacheNoStoreRetained",
    "checkedAtRetained",
    "enabledFeatureCoverageRetained",
    "glossaryCoverageRetained",
    "healthEndpointOk",
    "noSecretLikeKeys",
    "professionalReviewPending",
    "statusOk",
    "taxDataLastUpdatedRetained",
    "taxYearRetained",
  ]) {
    assert(health.checks?.[check] === true, `Health evidence missing passing check: ${check}`);
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
  assert(Array.isArray(performance.samplePolicy.warningSummary), "Performance evidence samplePolicy must include warningSummary");
  assert(performance.samplePolicy.requestedSamples >= 1, "Performance evidence samplePolicy must include requestedSamples");
  assert(performance.samplePolicy.validSamples >= 1, "Performance evidence samplePolicy must include validSamples");
  assert(
    performance.samplePolicy.selectionStrategy === "median-total-blocking-time-valid-seo-sample",
    "Performance evidence samplePolicy selection strategy changed unexpectedly",
  );
  assert(
    typeof performance.warningClassification === "object" && performance.warningClassification !== null,
    "Performance evidence must include warningClassification",
  );
  assert(typeof performance.warningClassification.kind === "string", "Performance evidence warningClassification must include kind");
  assert(typeof performance.warningClassification.blocking === "boolean", "Performance evidence warningClassification must include blocking");
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

function validateProfessionalUiEvidence(professionalUi) {
  assert(professionalUi.ok === true, "Professional UI evidence must be ok");
  assert(
    professionalUi.evidenceType === "professional-ui-source-guard",
    "Professional UI evidence must identify the source guard",
  );
  assert(Array.isArray(professionalUi.scannedRoots), "Professional UI evidence must include scannedRoots");
  assert(professionalUi.scannedRoots.includes("src/app"), "Professional UI evidence must scan src/app");
  assert(professionalUi.scannedRoots.includes("src/features"), "Professional UI evidence must scan src/features");
  assert(professionalUi.scannedFileCount > 0, "Professional UI evidence must scan source files");
  assert(Array.isArray(professionalUi.forbiddenClasses), "Professional UI evidence must include forbiddenClasses");
  assert(professionalUi.forbiddenClasses.includes("backdrop-blur-xl"), "Professional UI evidence must block backdrop blur");
  assert(professionalUi.forbiddenClasses.includes("shadow-material"), "Professional UI evidence must block material shadows");
  assert(professionalUi.forbiddenClasses.includes("hover:-translate-y"), "Professional UI evidence must block hover lift");
  assert(professionalUi.violationCount === 0, "Professional UI evidence must have zero violations");
  assert(Array.isArray(professionalUi.violations) && professionalUi.violations.length === 0, "Professional UI evidence violations must be empty");
}

function run() {
  const smoke = readJson(smokePath);
  const gsc = readJson(gscPath);
  const dnsEvidence = readJson(dnsPath);
  const securityHeaders = readJson(securityHeadersPath);
  const health = readJson(healthPath);
  const performance = readJson(performancePath);
  const structuredData = readJson(structuredDataPath);
  const blogDiscovery = readJson(blogDiscoveryPath);
  const professionalUi = readJson(professionalUiPath);

  validateSmokeEvidence(smoke);
  validateGscEvidence(gsc, smoke.baseUrl);
  validateDnsEvidence(dnsEvidence, smoke.baseUrl);
  validateSecurityHeadersEvidence(securityHeaders, smoke.baseUrl);
  validateHealthEvidence(health, smoke.baseUrl);
  validatePerformanceEvidence(performance, smoke.baseUrl);
  validateStructuredDataEvidence(structuredData, smoke.baseUrl);
  validateBlogDiscoveryEvidence(blogDiscovery, smoke.baseUrl);
  validateProfessionalUiEvidence(professionalUi);

  console.log(
    JSON.stringify(
      {
        artifactFiles: [
          smokePath,
          gscPath,
          dnsPath,
          securityHeadersPath,
          healthPath,
          performancePath,
          structuredDataPath,
          blogDiscoveryPath,
          professionalUiPath,
        ],
        baseUrl: smoke.baseUrl,
        blogDiscoveryCount: blogDiscovery.blogPostCount,
        dnsCanonicalOk: dnsEvidence.apexRedirectsToCanonical === true && dnsEvidence.wwwReturnsOk === true,
        gscPriorityUrlCount: gsc.priorityUrlCount,
        healthEndpointOk: health.checks.healthEndpointOk === true,
        ok: true,
        performanceScore: performance.categories.performance,
        professionalUiScannedFileCount: professionalUi.scannedFileCount,
        securityHeadersOk: securityHeaders.ok === true,
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
