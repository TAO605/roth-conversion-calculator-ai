import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO evidence artifact validation", () => {
  it("exposes a local validator for uploaded production SEO evidence files", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence.mjs"), "utf8");
    const structuredDataScript = fs.readFileSync(
      path.join(process.cwd(), "scripts/structured-data-evidence.mjs"),
      "utf8",
    );
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");
    const manifestScript = fs.readFileSync(path.join(process.cwd(), "scripts/generate-seo-evidence-manifest.mjs"), "utf8");
    const manifestValidator = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence-manifest.mjs"), "utf8");

    expect(packageJson.scripts["seo:evidence-validate"]).toBe("node scripts/validate-seo-evidence.mjs");
    expect(packageJson.scripts["seo:evidence-manifest"]).toBe("node scripts/generate-seo-evidence-manifest.mjs");
    expect(packageJson.scripts["seo:evidence-manifest-validate"]).toBe("node scripts/validate-seo-evidence-manifest.mjs");
    expect(packageJson.scripts["seo:search-console-verification"]).toBe(
      "node scripts/search-console-verification-evidence.mjs",
    );
    expect(packageJson.scripts["seo:dns-evidence"]).toBe("node scripts/dns-evidence.mjs");
    expect(packageJson.scripts["seo:security-headers"]).toBe("node scripts/security-headers-evidence.mjs");
    expect(packageJson.scripts["seo:health"]).toBe("node scripts/health-evidence.mjs");
    expect(packageJson.scripts["seo:crawl-discovery"]).toBe("node scripts/crawl-discovery-evidence.mjs");
    expect(packageJson.scripts["seo:internal-links"]).toBe("node scripts/internal-link-evidence.mjs");
    expect(packageJson.scripts["seo:html-quality"]).toBe("node scripts/html-quality-evidence.mjs");
    expect(packageJson.scripts["seo:professional-review-packet"]).toBe(
      "node scripts/professional-review-packet-evidence.mjs",
    );
    expect(packageJson.scripts["seo:performance"]).toBe("node scripts/performance-evidence.mjs");
    expect(packageJson.scripts["seo:structured-data"]).toBe("node scripts/structured-data-evidence.mjs");
    expect(script).toContain("seo-smoke-result.json");
    expect(script).toContain("gsc-evidence-result.json");
    expect(script).toContain("gsc-discovered-sample-evidence-result.json");
    expect(script).toContain("search-console-verification-evidence-result.json");
    expect(script).toContain("dns-evidence-result.json");
    expect(script).toContain("security-headers-evidence-result.json");
    expect(script).toContain("health-evidence-result.json");
    expect(script).toContain("crawl-discovery-evidence-result.json");
    expect(script).toContain("internal-link-evidence-result.json");
    expect(script).toContain("html-quality-evidence-result.json");
    expect(script).toContain("professional-review-packet-evidence-result.json");
    expect(script).toContain("performance-evidence-result.json");
    expect(script).toContain("structured-data-evidence-result.json");
    expect(script).toContain("blog-discovery-evidence-result.json");
    expect(script).toContain("privacy-evidence-boundary-result.json");
    expect(script).toContain("ai-security-evidence-result.json");
    expect(script).toContain("ai-verifier-regression-evidence-result.json");
    expect(script).toContain("fileURLToPath(import.meta.url)");
    expect(script).toContain("lastmodFresh");
    expect(script).toContain("priorityUrlCount");
    expect(script).toContain("hasUtf16Bom");
    expect(script).toContain("utf16le");
    expect(script).toContain("/seo-monitoring");
    expect(script).toContain("/tax-brackets/2026");
    expect(script).toContain("validateStructuredDataEvidence");
    expect(script).toContain("validateBlogDiscoveryEvidence");
    expect(script).toContain("validatePrivacyEvidenceBoundary");
    expect(script).toContain("validateAiSecurityEvidence");
    expect(script).toContain("validateAiVerifierRegressionEvidence");
    expect(script).toContain("validateDnsEvidence");
    expect(script).toContain("validateGscDiscoveredSampleEvidence");
    expect(script).toContain("gscDiscoveredSampleCount");
    expect(script).toContain("siteIndex?.linkedSampleCount");
    expect(script).toContain("must be linked from /site-index");
    expect(script).toContain("validateSearchConsoleVerificationEvidence");
    expect(script).toContain("searchConsoleVerificationOk");
    expect(script).toContain("domainTxtVerified");
    expect(script).toContain("htmlMetaVerified");
    expect(script).toContain("spfRecordRetained");
    expect(script).toContain("gscUiOwnershipNotAsserted");
    expect(script).toContain("validateSecurityHeadersEvidence");
    expect(script).toContain("dnsCanonicalOk");
    expect(script).toContain("securityHeadersOk");
    expect(script).toContain("healthEndpointOk");
    expect(script).toContain("validateCrawlDiscoveryEvidence");
    expect(script).toContain("crawlDiscoveryUrlCount");
    expect(script).toContain("robotsDiscoveryRetained");
    expect(script).toContain("validateInternalLinkEvidence");
    expect(script).toContain("internalLinkCheckedUrlCount");
    expect(script).toContain("allSitemapUrlsOk");
    expect(script).toContain("siteIndexCorePathsRetained");
    expect(script).toContain("validateHtmlQualityEvidence");
    expect(script).toContain("htmlQualityPageCount");
    expect(script).toContain("htmlLangRetained");
    expect(script).toContain("singleH1Retained");
    expect(script).toContain("formLabelRetained");
    expect(script).toContain("validateProfessionalReviewPacketEvidence");
    expect(script).toContain("professionalReviewPacketOk");
    expect(script).toContain("validateHealthEvidence");
    expect(script).toContain("professionalReviewStatus");
    expect(script).toContain("noSecretLikeKeys");
    expect(script).toContain("contentSecurityPolicyRetained");
    expect(script).toContain("noPoweredByHeader");
    expect(script).toContain("expectedCnameRetained");
    expect(script).toContain("apexRedirectsToCanonical");
    expect(script).toContain("wwwReturnsOk");
    expect(script).toContain("validatePerformanceEvidence");
    expect(script).toContain("lighthouse-mobile-lab");
    expect(script).toContain("performanceScore");
    expect(script).toContain("thresholdResults");
    expect(script).toContain("manualReviewRequired");
    expect(script).toContain("reviewTriggers");
    expect(script).toContain("reviewSummary");
    expect(script).toContain("samplePolicy");
    expect(script).toContain("requestedSamples");
    expect(script).toContain("validSamples");
    expect(script).toContain("warningClassification");
    expect(script).toContain("warningSummary");
    expect(script).toContain("median-total-blocking-time-valid-seo-sample");
    expect(script).toContain("tbtDiagnostics");
    expect(script).toContain("attributionSummary");
    expect(script).toContain("thirdPartyMainThread");
    expect(script).toContain("blogDiscoveryCount");
    expect(script).toContain("structuredDataTypeCount");
    expect(script).toContain("privacyEvidenceBoundaryOk");
    expect(script).toContain("privacyUnapprovedRemoteEvidenceCount");
    expect(script).toContain("aiSecurityOk");
    expect(script).toContain("aiVerifierRegressionOk");
    expect(script).toContain("aiVerifierRegressionScenarioCount");
    expect(script).toContain("statsPanel");
    expect(script).toContain("deterministicCoverage");
    expect(script).toContain("totalFixtures");
    expect(script).toContain("pageCount");
    expect(script).toContain("STATIC_STRUCTURED_DATA_PAGE_COUNT");
    expect(script).toContain("readBlogSlugCount");
    expect(script).toContain("expectedStructuredDataPageCount");
    expect(script).toContain("/roth-conversion-irmaa-guide");
    expect(script).toContain("/roth-conversion-aca-premium-tax-credit-guide");
    expect(script).toContain("/roth-conversion-niit-guide");
    expect(script).toContain("/roth-conversion-rmd-guide");
    expect(script).toContain("/roth-conversion-social-security-tax-guide");
    expect(script).toContain("/roth-conversion-estimated-tax-guide");
    expect(script).toContain("/calculator-assumptions-guide");
    expect(script).toContain("/cpa-review-checklist");
    expect(script).toContain("/roth-conversion-tax-forms");
    expect(script).toContain("/roth-conversion-timeline");
    expect(script).toContain("must contain a single JSON object");
    expect(structuredDataScript).toContain("STRUCTURED_DATA_EVIDENCE_BASE_URL");
    expect(structuredDataScript).toContain("WebApplication");
    expect(structuredDataScript).toContain("WebSite");
    expect(structuredDataScript).toContain("WebPage");
    expect(structuredDataScript).toContain("HowTo");
    expect(structuredDataScript).toContain("Organization");
    expect(structuredDataScript).toContain("FAQPage");
    expect(structuredDataScript).toContain("aggregateRating");
    expect(structuredDataScript).toContain("reviewRating");
    expect(structuredDataScript).toContain("100%\\s+accurate");
    expect(structuredDataScript).toContain("voiceInput");
    expect(structuredDataScript).toContain("siteUrlCount");
    expect(structuredDataScript).toContain("monitoredPages");
    expect(structuredDataScript).toContain("/roth-conversion-irmaa-guide");
    expect(structuredDataScript).toContain("/roth-conversion-aca-premium-tax-credit-guide");
    expect(structuredDataScript).toContain("/tax-brackets/2026");
    expect(structuredDataScript).toContain("/roth-conversion-niit-guide");
    expect(structuredDataScript).toContain("/roth-conversion-rmd-guide");
    expect(structuredDataScript).toContain("/roth-conversion-social-security-tax-guide");
    expect(structuredDataScript).toContain("/roth-conversion-estimated-tax-guide");
    expect(structuredDataScript).toContain("/calculator-assumptions-guide");
    expect(structuredDataScript).toContain("/cpa-review-checklist");
    expect(structuredDataScript).toContain("/roth-conversion-tax-forms");
    expect(structuredDataScript).toContain("/roth-conversion-timeline");
    expect(structuredDataScript).toContain("src/content/blog.ts");
    expect(structuredDataScript).toContain("fileURLToPath(import.meta.url)");
    expect(structuredDataScript).toContain("readBlogArticlePages");
    expect(structuredDataScript).toContain('path: `/blog/${slug}`');
    expect(structuredDataScript).toContain("Article");
    expect(structuredDataScript).toContain("BreadcrumbList");
    expect(workflow).toContain("Run structured data evidence check");
    expect(workflow).toContain("Run mobile performance evidence check");
    expect(workflow).toContain("set -o pipefail");
    expect(workflow).toContain("Run DNS and canonical host evidence check");
    expect(workflow).toContain("Run Search Console verification evidence check");
    expect(workflow).toContain(
      "node scripts/search-console-verification-evidence.mjs | tee search-console-verification-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/dns-evidence.mjs | tee dns-evidence-result.json");
    expect(workflow).toContain(
      "node scripts/gsc-discovered-sample-evidence.mjs | tee gsc-discovered-sample-evidence-result.json",
    );
    expect(workflow).toContain("Run security headers evidence check");
    expect(workflow).toContain("node scripts/security-headers-evidence.mjs | tee security-headers-evidence-result.json");
    expect(workflow).toContain("Run health endpoint evidence check");
    expect(workflow).toContain("node scripts/health-evidence.mjs | tee health-evidence-result.json");
    expect(workflow).toContain("Run crawl discovery evidence check");
    expect(workflow).toContain("node scripts/crawl-discovery-evidence.mjs | tee crawl-discovery-evidence-result.json");
    expect(workflow).toContain("Run internal link evidence check");
    expect(workflow).toContain("node scripts/internal-link-evidence.mjs | tee internal-link-evidence-result.json");
    expect(workflow).toContain("Run HTML quality evidence check");
    expect(workflow).toContain("node scripts/html-quality-evidence.mjs | tee html-quality-evidence-result.json");
    expect(workflow).toContain("Run professional review packet evidence check");
    expect(workflow).toContain(
      "node scripts/professional-review-packet-evidence.mjs | tee professional-review-packet-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/performance-evidence.mjs | tee performance-evidence-result.json");
    expect(workflow).toContain("node scripts/structured-data-evidence.mjs | tee structured-data-evidence-result.json");
    expect(workflow).toContain("Run blog discovery evidence check");
    expect(workflow).toContain("node scripts/blog-discovery-evidence.mjs | tee blog-discovery-evidence-result.json");
    expect(workflow).toContain("Run private evidence boundary check");
    expect(workflow).toContain("node scripts/privacy-evidence-boundary.mjs | tee privacy-evidence-boundary-result.json");
    expect(workflow).toContain("Run AI security evidence check");
    expect(workflow).toContain("node scripts/ai-security-evidence.mjs | tee ai-security-evidence-result.json");
    expect(workflow).toContain("Run AI verifier regression evidence check");
    expect(workflow).toContain(
      "node scripts/ai-verifier-regression-evidence.mjs | tee ai-verifier-regression-evidence-result.json",
    );
    expect(workflow).toContain("Validate SEO evidence artifact");
    expect(workflow).toContain("node scripts/validate-seo-evidence.mjs | tee seo-evidence-validation-result.json");
    expect(workflow).toContain("Generate SEO evidence manifest");
    expect(workflow).toContain("node scripts/generate-seo-evidence-manifest.mjs | tee seo-evidence-manifest.json");
    expect(workflow).toContain("Validate SEO evidence manifest checksums");
    expect(workflow).toContain("node scripts/validate-seo-evidence-manifest.mjs | tee seo-evidence-manifest-validation-result.json");
    expect(manifestScript).toContain("structured-data-evidence-result.json");
    expect(manifestScript).toContain("gsc-discovered-sample-evidence-result.json");
    expect(manifestScript).toContain("search-console-verification-evidence-result.json");
    expect(manifestScript).toContain("dns-evidence-result.json");
    expect(manifestScript).toContain("security-headers-evidence-result.json");
    expect(manifestScript).toContain("health-evidence-result.json");
    expect(manifestScript).toContain("crawl-discovery-evidence-result.json");
    expect(manifestScript).toContain("internal-link-evidence-result.json");
    expect(manifestScript).toContain("html-quality-evidence-result.json");
    expect(manifestScript).toContain("professional-review-packet-evidence-result.json");
    expect(manifestScript).toContain("performance-evidence-result.json");
    expect(manifestScript).toContain("blog-discovery-evidence-result.json");
    expect(manifestScript).toContain("privacy-evidence-boundary-result.json");
    expect(manifestScript).toContain("ai-security-evidence-result.json");
    expect(manifestScript).toContain("ai-verifier-regression-evidence-result.json");
    expect(manifestScript).toContain("seo-evidence-manifest-validation-result.json");
    expect(manifestScript).toContain("postManifestValidation");
    expect(manifestScript).toContain("GITHUB_RUN_ID");
    expect(manifestScript).toContain("GITHUB_SHA");
    expect(manifestScript).toContain("GITHUB_REPOSITORY");
    expect(manifestScript).toContain("gitHubRepository");
    expect(manifestScript).toContain("gitHubServerUrl");
    expect(manifestScript).toContain("gitHubRunUrl");
    expect(manifestScript).toContain("gitHubCommitUrl");
    expect(manifestScript).toContain("/actions/runs/");
    expect(manifestScript).toContain("/commit/");
    expect(manifestScript).toContain('import crypto from "node:crypto"');
    expect(manifestScript).toContain("sha256");
    expect(manifestScript).toContain('crypto.createHash("sha256")');
    expect(manifestScript).toContain("hasUtf16Bom");
    expect(manifestScript).toContain("utf16le");
    expect(manifestScript).toContain("selfDescribing");
    expect(manifestScript).toContain("seo-evidence-manifest.json");
    expect(manifestScript).toContain("production-seo-evidence");
    expect(manifestScript).toContain("artifactSchemaVersion");
    expect(manifestScript).toContain("ARTIFACT_SCHEMA_VERSION");
    expect(manifestScript).toContain("2026-06-08.2");
    expect(manifestScript).toContain("generatedAt");
    expect(manifestScript).toContain("retentionDays: 30");
    expect(manifestValidator).toContain("validateSeoEvidenceManifest");
    expect(manifestValidator).toContain("EXPECTED_ARTIFACT_SCHEMA_VERSION");
    expect(manifestValidator).toContain("2026-06-08.2");
    expect(manifestValidator).toContain("artifactSchemaVersion");
    expect(manifestValidator).toContain("ISO_TIMESTAMP_PATTERN");
    expect(manifestValidator).toContain("generatedAtRetained");
    expect(manifestValidator).toContain("sha256 mismatch");
    expect(manifestValidator).toContain("byte count mismatch");
    expect(manifestValidator).toContain("selfDescribing");
    expect(manifestValidator).toContain("manifestValidationResultRetained");
    expect(manifestValidator).toContain("GITHUB_RUN_URL_PATTERN");
    expect(manifestValidator).toContain("GITHUB_COMMIT_URL_PATTERN");
    expect(manifestValidator).toContain("GITHUB_SHA_PATTERN");
    expect(manifestValidator).toContain("GITHUB_RUN_ID_PATTERN");
    expect(manifestValidator).toContain("ALLOWED_EVENT_NAMES");
    expect(manifestValidator).toContain("EXPECTED_GITHUB_REPOSITORY");
    expect(manifestValidator).toContain("EXPECTED_GITHUB_SERVER_URL");
    expect(manifestValidator).toContain("gitHubRepository changed unexpectedly");
    expect(manifestValidator).toContain("gitHubRepositoryRetained");
    expect(manifestValidator).toContain("gitHubServerUrl changed unexpectedly");
    expect(manifestValidator).toContain("gitHubServerUrlRetained");
    expect(manifestValidator).toContain("eventName is not an allowed value");
    expect(manifestValidator).toContain("gitHubWorkflowRetained");
    expect(manifestValidator).toContain("runAttemptRetained");
    expect(manifestValidator).toContain("gitHubWorkflow must be retained");
    expect(manifestValidator).toContain("gitHubRunAttempt must be numeric");
    expect(manifestValidator).toContain("validateGitHubProvenance");
    expect(manifestValidator).toContain("gitHubProvenanceConsistent");
    expect(manifestValidator).toContain("gitHubCommitUrl must match gitHubSha");
    expect(manifestValidator).toContain("gitHubRunUrl must match gitHubRunId");
    expect(manifestValidator).toContain("runUrlRetained");
    expect(manifestValidator).toContain("commitUrlRetained");
  });

  it("keeps the uploaded artifact files aligned with validator defaults", () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");

    expect(workflow).toContain("node scripts/seo-smoke.mjs | tee seo-smoke-result.json");
    expect(workflow).toContain("node scripts/gsc-evidence.mjs | tee gsc-evidence-result.json");
    expect(workflow).toContain(
      "node scripts/gsc-discovered-sample-evidence.mjs | tee gsc-discovered-sample-evidence-result.json",
    );
    expect(workflow).toContain(
      "node scripts/search-console-verification-evidence.mjs | tee search-console-verification-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/dns-evidence.mjs | tee dns-evidence-result.json");
    expect(workflow).toContain("node scripts/security-headers-evidence.mjs | tee security-headers-evidence-result.json");
    expect(workflow).toContain("node scripts/health-evidence.mjs | tee health-evidence-result.json");
    expect(workflow).toContain("node scripts/crawl-discovery-evidence.mjs | tee crawl-discovery-evidence-result.json");
    expect(workflow).toContain("node scripts/internal-link-evidence.mjs | tee internal-link-evidence-result.json");
    expect(workflow).toContain("node scripts/html-quality-evidence.mjs | tee html-quality-evidence-result.json");
    expect(workflow).toContain(
      "node scripts/professional-review-packet-evidence.mjs | tee professional-review-packet-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/performance-evidence.mjs | tee performance-evidence-result.json");
    expect(workflow).toContain("node scripts/structured-data-evidence.mjs | tee structured-data-evidence-result.json");
    expect(workflow).toContain("node scripts/blog-discovery-evidence.mjs | tee blog-discovery-evidence-result.json");
    expect(workflow).toContain("node scripts/privacy-evidence-boundary.mjs | tee privacy-evidence-boundary-result.json");
    expect(workflow).toContain("node scripts/ai-security-evidence.mjs | tee ai-security-evidence-result.json");
    expect(workflow).toContain(
      "node scripts/ai-verifier-regression-evidence.mjs | tee ai-verifier-regression-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/validate-seo-evidence.mjs | tee seo-evidence-validation-result.json");
    expect(workflow).toContain("node scripts/generate-seo-evidence-manifest.mjs | tee seo-evidence-manifest.json");
    expect(workflow).toContain("node scripts/validate-seo-evidence-manifest.mjs | tee seo-evidence-manifest-validation-result.json");
    expect(workflow).toContain("seo-smoke-result.json");
    expect(workflow).toContain("gsc-evidence-result.json");
    expect(workflow).toContain("gsc-discovered-sample-evidence-result.json");
    expect(workflow).toContain("search-console-verification-evidence-result.json");
    expect(workflow).toContain("dns-evidence-result.json");
    expect(workflow).toContain("security-headers-evidence-result.json");
    expect(workflow).toContain("health-evidence-result.json");
    expect(workflow).toContain("crawl-discovery-evidence-result.json");
    expect(workflow).toContain("internal-link-evidence-result.json");
    expect(workflow).toContain("html-quality-evidence-result.json");
    expect(workflow).toContain("professional-review-packet-evidence-result.json");
    expect(workflow).toContain("performance-evidence-result.json");
    expect(workflow).toContain("structured-data-evidence-result.json");
    expect(workflow).toContain("blog-discovery-evidence-result.json");
    expect(workflow).toContain("privacy-evidence-boundary-result.json");
    expect(workflow).toContain("ai-security-evidence-result.json");
    expect(workflow).toContain("ai-verifier-regression-evidence-result.json");
    expect(workflow).toContain("seo-evidence-validation-result.json");
    expect(workflow).toContain("seo-evidence-manifest.json");
    expect(workflow).toContain("seo-evidence-manifest-validation-result.json");
    expect(workflow).toContain("name: production-seo-evidence");
    expect(workflow).toContain("retention-days: 30");
  });

  it("retains sha256 checksums for each source evidence file in the manifest", () => {
    const manifestScript = fs.readFileSync(path.join(process.cwd(), "scripts/generate-seo-evidence-manifest.mjs"), "utf8");

    expect(manifestScript).toContain('import crypto from "node:crypto"');
    expect(manifestScript).toContain('crypto.createHash("sha256").update(bytes).digest("hex")');
    expect(manifestScript).toContain("sha256");
    expect(manifestScript).toContain("selfDescribing: true");
  });

  it("validates manifest byte counts and sha256 checksums before artifact upload", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");
    const manifestValidator = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence-manifest.mjs"), "utf8");

    expect(packageJson.scripts["seo:evidence-manifest-validate"]).toBe("node scripts/validate-seo-evidence-manifest.mjs");
    expect(workflow).toContain("Validate SEO evidence manifest checksums");
    expect(workflow).toContain("node scripts/validate-seo-evidence-manifest.mjs | tee seo-evidence-manifest-validation-result.json");
    expect(manifestValidator).toContain("EXPECTED_SOURCE_FILES");
    expect(manifestValidator).toContain("sha256CheckedCount");
    expect(manifestValidator).toContain("manifestValidationResultRetained");
    expect(manifestValidator).toContain("crypto.createHash");
    expect(manifestValidator).toContain("sha256 mismatch");
    expect(manifestValidator).toContain("byte count mismatch");
  });
});
