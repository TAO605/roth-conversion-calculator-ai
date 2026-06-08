import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SMOKE_PATH = "seo-smoke-result.json";
const DEFAULT_GSC_PATH = "gsc-evidence-result.json";
const DEFAULT_GSC_DISCOVERED_SAMPLE_PATH = "gsc-discovered-sample-evidence-result.json";
const DEFAULT_SEARCH_CONSOLE_VERIFICATION_PATH = "search-console-verification-evidence-result.json";
const DEFAULT_DNS_PATH = "dns-evidence-result.json";
const DEFAULT_SECURITY_HEADERS_PATH = "security-headers-evidence-result.json";
const DEFAULT_HEALTH_PATH = "health-evidence-result.json";
const DEFAULT_CRAWL_DISCOVERY_PATH = "crawl-discovery-evidence-result.json";
const DEFAULT_INTERNAL_LINK_PATH = "internal-link-evidence-result.json";
const DEFAULT_HTML_QUALITY_PATH = "html-quality-evidence-result.json";
const DEFAULT_PROFESSIONAL_REVIEW_PACKET_PATH = "professional-review-packet-evidence-result.json";
const DEFAULT_PERFORMANCE_PATH = "performance-evidence-result.json";
const DEFAULT_STRUCTURED_DATA_PATH = "structured-data-evidence-result.json";
const DEFAULT_BLOG_DISCOVERY_PATH = "blog-discovery-evidence-result.json";
const DEFAULT_PROFESSIONAL_UI_PATH = "professional-ui-evidence-result.json";
const DEFAULT_PRIVACY_EVIDENCE_BOUNDARY_PATH = "privacy-evidence-boundary-result.json";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const BLOG_SOURCE_PATH = path.join(PROJECT_ROOT, "src/content/blog.ts");
const STATIC_STRUCTURED_DATA_PAGE_COUNT = 21;
const smokePath = process.argv[2] || DEFAULT_SMOKE_PATH;
const gscPath = process.argv[3] || DEFAULT_GSC_PATH;
const gscDiscoveredSamplePath = process.argv[4] || DEFAULT_GSC_DISCOVERED_SAMPLE_PATH;
const searchConsoleVerificationPath = process.argv[5] || DEFAULT_SEARCH_CONSOLE_VERIFICATION_PATH;
const dnsPath = process.argv[6] || DEFAULT_DNS_PATH;
const securityHeadersPath = process.argv[7] || DEFAULT_SECURITY_HEADERS_PATH;
const healthPath = process.argv[8] || DEFAULT_HEALTH_PATH;
const crawlDiscoveryPath = process.argv[9] || DEFAULT_CRAWL_DISCOVERY_PATH;
const internalLinkPath = process.argv[10] || DEFAULT_INTERNAL_LINK_PATH;
const htmlQualityPath = process.argv[11] || DEFAULT_HTML_QUALITY_PATH;
const professionalReviewPacketPath = process.argv[12] || DEFAULT_PROFESSIONAL_REVIEW_PACKET_PATH;
const performancePath = process.argv[13] || DEFAULT_PERFORMANCE_PATH;
const structuredDataPath = process.argv[14] || DEFAULT_STRUCTURED_DATA_PATH;
const blogDiscoveryPath = process.argv[15] || DEFAULT_BLOG_DISCOVERY_PATH;
const professionalUiPath = process.argv[16] || DEFAULT_PROFESSIONAL_UI_PATH;
const privacyEvidenceBoundaryPath = process.argv[17] || DEFAULT_PRIVACY_EVIDENCE_BOUNDARY_PATH;

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

function validateGscDiscoveredSampleEvidence(samples, expectedBaseUrl) {
  assert(samples.ok === true, "GSC discovered sample evidence must be ok");
  assert(
    samples.evidenceType === "gsc-discovered-sample-url-evidence",
    "GSC discovered sample evidence type changed unexpectedly",
  );
  assert(samples.baseUrl === expectedBaseUrl, "GSC discovered sample baseUrl must match SEO smoke baseUrl");
  assert(samples.sourceIssueState === "discovered_not_indexed", "GSC discovered sample source issue state changed unexpectedly");
  assert(samples.resultCount >= 1, "GSC discovered sample evidence must include at least one sample URL");
  assert(samples.failureCount === 0, "GSC discovered sample evidence must have zero failures");
  assert(Array.isArray(samples.failures) && samples.failures.length === 0, "GSC discovered sample failures must be empty");
  assert(Array.isArray(samples.results), "GSC discovered sample results must be an array");
  assert(samples.siteIndex?.status === 200, "GSC discovered sample site-index status must be 200");
  assert(
    samples.siteIndex?.linkedSampleCount === samples.resultCount,
    "GSC discovered sample evidence must link every sample from /site-index",
  );
  assert(samples.siteIndex?.internalLinkCount >= 100, "GSC discovered sample site-index internal link count is too low");

  for (const result of samples.results) {
    assert(result.status === 200, `${result.url} status must be 200`);
    assert(result.inSitemap === true, `${result.url} must be in sitemap`);
    assert(result.noindex === false, `${result.url} must not be noindex`);
    assert(result.ok === true, `${result.url} sample evidence must be ok`);
    assert(result.siteIndexLinked === true, `${result.url} must be linked from /site-index`);
    assert(typeof result.canonical === "string" && result.canonical.startsWith(expectedBaseUrl), `${result.url} canonical mismatch`);
    assert(typeof result.title === "string" && result.title.length > 0, `${result.url} title is missing`);
  }
}

function validateSearchConsoleVerificationEvidence(verification, expectedBaseUrl) {
  assert(verification.ok === true, "Search Console verification evidence must be ok");
  assert(
    verification.evidenceType === "search-console-verification",
    "Search Console verification evidence type changed unexpectedly",
  );
  assert(verification.baseUrl === expectedBaseUrl, "Search Console verification baseUrl must match SEO smoke baseUrl");
  assert(
    verification.domainHost === "roth-conversion-calculator-ai.shop",
    "Search Console verification domainHost changed unexpectedly",
  );
  assert(
    verification.expectedTxtRecord ===
      "google-site-verification=bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q",
    "Search Console verification expected TXT record changed unexpectedly",
  );
  assert(verification.domainTxtVerified === true, "Search Console domain TXT verification must be visible");
  assert(verification.spfRecordRetained === true, "Search Console verification evidence must retain SPF");
  assert(verification.homepage?.status === 200, "Search Console verification homepage status must be 200");
  assert(verification.homepage?.htmlMetaVerified === true, "Search Console verification homepage meta must match");
  assert(
    verification.homepage?.canonical === expectedBaseUrl || verification.homepage?.canonical === `${expectedBaseUrl}/`,
    "Search Console verification homepage canonical mismatch",
  );
  assert(verification.canonicalHostRetained === true, "Search Console verification canonical host must be retained");
  assert(verification.gscUiOwnershipNotAsserted === true, "Search Console verification evidence must not assert GSC UI ownership");
  assert(
    Array.isArray(verification.googleVerificationRecords) && verification.googleVerificationRecords.length >= 1,
    "Search Console verification records must include at least one Google TXT token",
  );
  assert(Array.isArray(verification.txtRecords), "Search Console verification evidence must retain TXT records");
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

function validateCrawlDiscoveryEvidence(crawlDiscovery, expectedBaseUrl) {
  assert(crawlDiscovery.ok === true, "Crawl discovery evidence must be ok");
  assert(crawlDiscovery.evidenceType === "production-crawl-discovery", "Crawl discovery evidence type changed unexpectedly");
  assert(crawlDiscovery.baseUrl === expectedBaseUrl, "Crawl discovery evidence baseUrl must match SEO smoke baseUrl");
  assert(crawlDiscovery.robots?.status === 200, "Crawl discovery robots status must be 200");
  assert(crawlDiscovery.sitemap?.status === 200, "Crawl discovery sitemap status must be 200");
  assert(crawlDiscovery.feed?.status === 200, "Crawl discovery feed status must be 200");
  assert(crawlDiscovery.llms?.status === 200, "Crawl discovery llms status must be 200");
  assert(crawlDiscovery.robots?.discoveryCount === 3, "robots.txt must retain sitemap, feed, and llms discovery links");
  assert(crawlDiscovery.sitemap?.urlCount >= 120, "sitemap.xml URL count is below expected production coverage");
  assert(crawlDiscovery.feed?.itemCount >= 13, "feed.xml item count is below expected blog coverage");
  assert(crawlDiscovery.feed?.contentType.includes("application/rss+xml"), "feed.xml content type changed unexpectedly");
  assert(crawlDiscovery.llms?.contentType.includes("text/plain"), "llms.txt content type changed unexpectedly");
  for (const check of [
    "feedBlogCoverageRetained",
    "feedItemsRetained",
    "feedStatusOk",
    "llmsBoundaryRetained",
    "llmsCoreCoverageRetained",
    "llmsStatusOk",
    "robotsDiscoveryRetained",
    "robotsStatusOk",
    "sitemapCanonicalHostRetained",
    "sitemapRequiredPathsRetained",
    "sitemapStatusOk",
    "sitemapUrlCountRetained",
  ]) {
    assert(crawlDiscovery.checks?.[check] === true, `Crawl discovery evidence missing passing check: ${check}`);
  }
}

function validateInternalLinkEvidence(internalLink, expectedBaseUrl) {
  assert(internalLink.ok === true, "Internal link evidence must be ok");
  assert(internalLink.evidenceType === "production-internal-link-health", "Internal link evidence type changed unexpectedly");
  assert(internalLink.baseUrl === expectedBaseUrl, "Internal link evidence baseUrl must match SEO smoke baseUrl");
  assert(internalLink.sitemap?.status === 200, "Internal link evidence sitemap status must be 200");
  assert(internalLink.sitemap?.uniqueUrlCount >= 120, "Internal link evidence unique sitemap URL count is below expected production coverage");
  assert(internalLink.sitemap?.checkedUrlCount === internalLink.sitemap?.uniqueUrlCount, "Internal link evidence must check every sitemap URL");
  assert(internalLink.sitemap?.nonCanonicalUrlCount === 0, "Internal link evidence must not include non-canonical sitemap URLs");
  assert(internalLink.siteIndex?.status === 200, "Internal link evidence site-index status must be 200");
  assert(internalLink.siteIndex?.internalLinkCount >= 100, "Internal link evidence site-index internal link count is too low");
  assert(internalLink.siteIndex?.requiredPathCount >= 6, "Internal link evidence required site-index path count changed unexpectedly");
  assert(Array.isArray(internalLink.sampledFailures) && internalLink.sampledFailures.length === 0, "Internal link evidence must not retain sampled failures");

  for (const check of [
    "allSitemapUrlsOk",
    "canonicalHostRetained",
    "noNoindexRetained",
    "siteIndexCorePathsRetained",
    "siteIndexInternalLinksRetained",
    "sitemapUrlHealthRetained",
  ]) {
    assert(internalLink.checks?.[check] === true, `Internal link evidence missing passing check: ${check}`);
  }
}

function validateHtmlQualityEvidence(htmlQuality, expectedBaseUrl) {
  assert(htmlQuality.ok === true, "HTML quality evidence must be ok");
  assert(htmlQuality.evidenceType === "production-html-quality", "HTML quality evidence type changed unexpectedly");
  assert(htmlQuality.baseUrl === expectedBaseUrl, "HTML quality evidence baseUrl must match SEO smoke baseUrl");
  assert(htmlQuality.pageCount >= 120, "HTML quality evidence pageCount is below expected production coverage");
  assert(Array.isArray(htmlQuality.sampledFailures) && htmlQuality.sampledFailures.length === 0, "HTML quality evidence must not retain sampled failures");
  assert(htmlQuality.summary?.maxFailureCount === 0, "HTML quality evidence must have zero max failures");
  assert(htmlQuality.summary?.pagesWithCanonical === htmlQuality.pageCount, "HTML quality evidence must retain canonical coverage");
  assert(htmlQuality.summary?.pagesWithHtmlLang === htmlQuality.pageCount, "HTML quality evidence must retain html lang coverage");
  assert(htmlQuality.summary?.pagesWithSingleH1 === htmlQuality.pageCount, "HTML quality evidence must retain one H1 per page");
  assert(htmlQuality.summary?.pagesWithValidMetaDescription === htmlQuality.pageCount, "HTML quality evidence must retain meta descriptions");
  assert(htmlQuality.summary?.pagesWithValidTitle === htmlQuality.pageCount, "HTML quality evidence must retain titles");

  for (const check of [
    "buttonNameRetained",
    "canonicalRetained",
    "formLabelRetained",
    "htmlLangRetained",
    "imageAltRetained",
    "metaDescriptionRetained",
    "pageStatusRetained",
    "singleH1Retained",
    "titleRetained",
  ]) {
    assert(htmlQuality.checks?.[check] === true, `HTML quality evidence missing passing check: ${check}`);
  }
}

function validateProfessionalReviewPacketEvidence(reviewPacket, expectedBaseUrl) {
  assert(reviewPacket.ok === true, "Professional review packet evidence must be ok");
  assert(
    reviewPacket.evidenceType === "professional-review-packet",
    "Professional review packet evidence type changed unexpectedly",
  );
  assert(reviewPacket.baseUrl === expectedBaseUrl, "Professional review packet evidence baseUrl must match SEO smoke baseUrl");
  assert(reviewPacket.page?.path === "/professional-review-packet", "Professional review packet evidence must inspect the review packet path");
  assert(reviewPacket.page?.status === 200, "Professional review packet page status must be 200");
  assert(reviewPacket.page?.contentType.includes("text/html"), "Professional review packet page must return HTML");
  assert(reviewPacket.page?.termCount >= 10, "Professional review packet evidence must retain the required review terms");
  assert(reviewPacket.health?.taxYear === 2026, "Professional review packet health taxYear must remain 2026");
  assert(
    typeof reviewPacket.health?.professionalReviewStatus === "string" &&
      reviewPacket.health.professionalReviewStatus.toLowerCase().includes("pending"),
    "Professional review packet evidence must retain pending professional review status",
  );

  for (const check of [
    "healthPendingReviewRetained",
    "llmsRetained",
    "pageStatusOk",
    "pageTermsRetained",
    "sitemapRetained",
    "taxYearRetained",
  ]) {
    assert(reviewPacket.checks?.[check] === true, `Professional review packet evidence missing passing check: ${check}`);
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
    "/professional-review-packet",
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

function validatePrivacyEvidenceBoundary(boundary) {
  assert(boundary.ok === true, "Privacy evidence boundary must be ok");
  assert(
    boundary.evidenceType === "privacy-evidence-sync-boundary",
    "Privacy evidence boundary type changed unexpectedly",
  );
  assert(
    boundary.repository === "TAO605/roth-conversion-calculator-ai",
    "Privacy evidence boundary repository changed unexpectedly",
  );
  assert(boundary.branch === "main", "Privacy evidence boundary must scan main");
  assert(boundary.checks?.allowlistPresent === true, "Privacy evidence boundary must retain the allowlist");
  assert(
    boundary.checks?.gitignoreRetainsPrivateEvidenceRules === true,
    "Privacy evidence boundary must retain local screenshot ignore rules",
  );
  assert(
    boundary.checks?.remotePrivateEvidenceApprovedOnly === true,
    "Privacy evidence boundary must allow only approved remote screenshots",
  );
  assert(boundary.checks?.remoteScanAvailable === true, "Privacy evidence boundary remote scan must be available");
  assert(boundary.remotePrivateEvidenceCount === 2, "Privacy evidence boundary must retain only two approved screenshots");
  assert(boundary.approvedRemotePrivateEvidenceCount === 2, "Privacy evidence boundary approved screenshot count must be 2");
  assert(boundary.unapprovedRemotePrivateEvidenceCount === 0, "Privacy evidence boundary must have zero unapproved screenshots");
  assert(
    Array.isArray(boundary.unapprovedRemotePrivateEvidencePaths) &&
      boundary.unapprovedRemotePrivateEvidencePaths.length === 0,
    "Privacy evidence boundary unapproved paths must be empty",
  );
  assert(
    Array.isArray(boundary.approvedRemotePrivateEvidencePaths) &&
      boundary.approvedRemotePrivateEvidencePaths.includes("docs/evidence/gsc-homepage-indexed-result.png") &&
      boundary.approvedRemotePrivateEvidencePaths.includes("docs/evidence/gsc-homepage-live-faq-result.png"),
    "Privacy evidence boundary must retain the two approved homepage screenshots",
  );
}

function run() {
  const smoke = readJson(smokePath);
  const gsc = readJson(gscPath);
  const gscDiscoveredSamples = readJson(gscDiscoveredSamplePath);
  const searchConsoleVerification = readJson(searchConsoleVerificationPath);
  const dnsEvidence = readJson(dnsPath);
  const securityHeaders = readJson(securityHeadersPath);
  const health = readJson(healthPath);
  const crawlDiscovery = readJson(crawlDiscoveryPath);
  const internalLink = readJson(internalLinkPath);
  const htmlQuality = readJson(htmlQualityPath);
  const professionalReviewPacket = readJson(professionalReviewPacketPath);
  const performance = readJson(performancePath);
  const structuredData = readJson(structuredDataPath);
  const blogDiscovery = readJson(blogDiscoveryPath);
  const professionalUi = readJson(professionalUiPath);
  const privacyEvidenceBoundary = readJson(privacyEvidenceBoundaryPath);

  validateSmokeEvidence(smoke);
  validateGscEvidence(gsc, smoke.baseUrl);
  validateGscDiscoveredSampleEvidence(gscDiscoveredSamples, smoke.baseUrl);
  validateSearchConsoleVerificationEvidence(searchConsoleVerification, smoke.baseUrl);
  validateDnsEvidence(dnsEvidence, smoke.baseUrl);
  validateSecurityHeadersEvidence(securityHeaders, smoke.baseUrl);
  validateHealthEvidence(health, smoke.baseUrl);
  validateCrawlDiscoveryEvidence(crawlDiscovery, smoke.baseUrl);
  validateInternalLinkEvidence(internalLink, smoke.baseUrl);
  validateHtmlQualityEvidence(htmlQuality, smoke.baseUrl);
  validateProfessionalReviewPacketEvidence(professionalReviewPacket, smoke.baseUrl);
  validatePerformanceEvidence(performance, smoke.baseUrl);
  validateStructuredDataEvidence(structuredData, smoke.baseUrl);
  validateBlogDiscoveryEvidence(blogDiscovery, smoke.baseUrl);
  validateProfessionalUiEvidence(professionalUi);
  validatePrivacyEvidenceBoundary(privacyEvidenceBoundary);

  console.log(
    JSON.stringify(
      {
        artifactFiles: [
          smokePath,
          gscPath,
          gscDiscoveredSamplePath,
          searchConsoleVerificationPath,
          dnsPath,
          securityHeadersPath,
          healthPath,
          crawlDiscoveryPath,
          internalLinkPath,
          htmlQualityPath,
          professionalReviewPacketPath,
          performancePath,
          structuredDataPath,
          blogDiscoveryPath,
          professionalUiPath,
          privacyEvidenceBoundaryPath,
        ],
        baseUrl: smoke.baseUrl,
        blogDiscoveryCount: blogDiscovery.blogPostCount,
        crawlDiscoveryUrlCount: crawlDiscovery.sitemap.urlCount,
        dnsCanonicalOk: dnsEvidence.apexRedirectsToCanonical === true && dnsEvidence.wwwReturnsOk === true,
        gscDiscoveredSampleCount: gscDiscoveredSamples.resultCount,
        gscPriorityUrlCount: gsc.priorityUrlCount,
        healthEndpointOk: health.checks.healthEndpointOk === true,
        htmlQualityPageCount: htmlQuality.pageCount,
        internalLinkCheckedUrlCount: internalLink.sitemap.checkedUrlCount,
        ok: true,
        performanceScore: performance.categories.performance,
        professionalReviewPacketOk: professionalReviewPacket.ok === true,
        professionalUiScannedFileCount: professionalUi.scannedFileCount,
        privacyEvidenceBoundaryOk: privacyEvidenceBoundary.ok === true,
        privacyUnapprovedRemoteEvidenceCount: privacyEvidenceBoundary.unapprovedRemotePrivateEvidenceCount,
        securityHeadersOk: securityHeaders.ok === true,
        searchConsoleVerificationOk: searchConsoleVerification.ok === true,
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
