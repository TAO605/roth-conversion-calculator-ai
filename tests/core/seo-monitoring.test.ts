import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildSearchConsoleExceptionQueue,
  buildSearchConsoleIndexingRecordTemplate,
  buildSearchConsoleOpportunityMatrix,
  buildSearchConsoleQueryOpportunityRecordTemplate,
  buildSearchConsoleRetryProtocol,
  buildSearchConsoleSubmissionLoop,
  buildSearchConsoleValidationActionRecord,
  buildSearchConsoleValidationFollowUpRecord,
  buildSeoEvidenceArtifactReview,
  buildSeoMonitoringGroups,
  buildSitemapFreshnessEvidence,
  getSearchConsoleSources,
  getSeoMonitoringSummary,
} from "@/content/seo-monitoring";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("SEO monitoring playbook", () => {
  it("builds a post-launch SEO monitoring cadence for a Google tool site", () => {
    const groups = buildSeoMonitoringGroups();
    const summary = getSeoMonitoringSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["daily", "weekly", "monthly", "incident"]),
    );
    expect(labels).toContain("Check Google Search Console coverage");
    expect(labels).toContain("Review query impressions and CTR");
    expect(labels).toContain("Review Core Web Vitals");
    expect(labels).toContain("Publish or refresh long-tail content");
    expect(labels).toContain("Trigger rollback review");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.tools).toEqual(
      expect.arrayContaining(["Google Search Console", "GA4", "PageSpeed Insights", "Vercel Analytics"]),
    );
  });

  it("builds a Search Console submission and indexing loop from official surfaces", () => {
    const steps = buildSearchConsoleSubmissionLoop();
    const labels = steps.map((step) => step.label);
    const sources = getSearchConsoleSources();

    expect(labels).toEqual(
      expect.arrayContaining([
        "Run production SEO smoke before submitting",
        "Submit or resubmit sitemap.xml",
        "Run priority URL evidence check",
        "Inspect priority URLs",
        "Request indexing only after material changes",
        "Review Page indexing report",
        "Record and route exceptions",
      ]),
    );
    expect(steps.map((step) => step.tool)).toEqual(
      expect.arrayContaining([
        "npm run seo:smoke",
        "npm run seo:gsc-evidence",
        "Google Search Console Sitemaps report",
        "Google Search Console URL Inspection",
        "Google Search Console Page indexing report",
      ]),
    );
    expect(sources.map((source) => source.url)).toEqual(
      expect.arrayContaining([
        "https://support.google.com/webmasters/answer/7451001",
        "https://support.google.com/webmasters/answer/9012289",
        "https://support.google.com/webmasters/answer/7440203",
        "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      ]),
    );
  });

  it("tracks Search Console exceptions without treating transient Google failures as site regressions", () => {
    const exceptions = buildSearchConsoleExceptionQueue();
    const labels = exceptions.map((exception) => exception.label);
    const combined = exceptions
      .map((exception) => `${exception.observedStatus} ${exception.nextAction} ${exception.retryWindow}`)
      .join(" ");

    expect(labels).toEqual(
      expect.arrayContaining([
        "Domain property verification",
        "Sitemap submission",
        "URL Inspection indexing request",
      ]),
    );
    expect(combined).toContain("URL-prefix property");
    expect(combined).toContain("successful read on 2026-05-30");
    expect(combined).toContain("live test passed as indexable");
    expect(combined).toContain("npm run seo:gsc-evidence");
    expect(combined).toContain("Wait at least several hours");
    expect(exceptions.every((exception) => exception.evidenceToRecord.length > 30)).toBe(true);
  });

  it("defines a Search Console retry protocol that prevents repeated backend-error chasing", () => {
    const protocol = buildSearchConsoleRetryProtocol();
    const labels = protocol.map((step) => step.label);
    const combined = protocol
      .map((step) => `${step.trigger} ${step.preflight} ${step.action} ${step.stopCondition} ${step.record}`)
      .join(" ");

    expect(labels).toEqual(
      expect.arrayContaining([
        "Confirm the site before touching GSC",
        "Use the verified URL-prefix property",
        "Retry indexing once per operations window",
        "Escalate only when evidence changes",
      ]),
    );
    expect(combined).toContain("npm run seo:smoke");
    expect(combined).toContain("npm run seo:gsc-evidence");
    expect(combined).toContain("Stop after one failed Request indexing attempt");
    expect(combined).toContain("Search Console-side");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("documents a GSC indexing record template for manual URL Inspection evidence", () => {
    const fields = buildSearchConsoleIndexingRecordTemplate();
    const fieldNames = fields.map((item) => item.field);
    const combined = fields
      .map((item) => `${item.field} ${item.source} ${item.requiredWhen} ${item.validation}`)
      .join(" ");

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "recordStatus",
        "inspectedUrl",
        "indexingState",
        "liveTestState",
        "googleSelectedCanonical",
        "requestIndexing",
        "siteEvidence",
        "screenshots",
      ]),
    );
    expect(combined).toContain("docs/search-console-indexing-record-template.json");
    expect(combined).toContain("seo:gsc-indexing-record-draft");
    expect(combined).toContain("seo:gsc-indexing-record-ready");
    expect(combined).toContain("seo:gsc-indexing-record-summary");
    expect(combined).toContain("seo:gsc-indexing-records-manifest");
    expect(combined).toContain("production-seo-evidence");
    expect(combined).toContain("searchConsoleVerificationOk");
    expect(combined).toContain("Do not infer");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("documents sanitized GSC validation action records for Page indexing validation", () => {
    const fields = buildSearchConsoleValidationActionRecord();
    const fieldNames = fields.map((item) => item.field);
    const combined = fields
      .map((item) => `${item.field} ${item.source} ${item.requiredWhen} ${item.validation}`)
      .join(" ");

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "evidenceType",
        "gscResult.validationStarted",
        "siteEvidenceLinked",
        "privacyBoundary",
      ]),
    );
    expect(combined).toContain("seo:gsc-validation-action-validate");
    expect(combined).toContain("Validation started");
    expect(combined).toContain("account identifiers");
    expect(combined).toContain("cookies");
    expect(combined).toContain("tokens");
    expect(combined).toContain("screenshot paths");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("documents sanitized GSC validation follow-up plans after validation starts", () => {
    const fields = buildSearchConsoleValidationFollowUpRecord();
    const fieldNames = fields.map((item) => item.field);
    const combined = fields
      .map((item) => `${item.field} ${item.source} ${item.requiredWhen} ${item.validation}`)
      .join(" ");

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "sourceValidationAction",
        "followUpPlan",
        "reviewChecklist",
        "blockedActions",
        "privacyBoundary",
      ]),
    );
    expect(combined).toContain("seo:gsc-validation-follow-up-validate");
    expect(combined).toContain("rerun seo:gsc-discovered-samples");
    expect(combined).toContain("repeated Validate fix clicks");
    expect(combined).toContain("account identifiers");
    expect(combined).toContain("cookies");
    expect(combined).toContain("tokens");
    expect(combined).toContain("screenshot paths");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("documents sitemap freshness evidence for priority Search Console URLs", () => {
    const evidence = buildSitemapFreshnessEvidence();
    const paths = evidence.map((item) => item.path);
    const combined = evidence
      .map((item) => `${item.label} ${item.path} ${item.minimumLastmod} ${item.validation} ${item.evidence}`)
      .join(" ");

    expect(paths).toEqual(
      expect.arrayContaining(["/", "/seo-monitoring", "/methodology", "/tax-data-update", "/tax-brackets/2026"]),
    );
    expect(evidence.every((item) => item.minimumLastmod === "2026-05-30")).toBe(true);
    expect(combined).toContain("lastmodFresh: true");
    expect(combined).toContain("production-seo-evidence");
    expect(combined).toContain("Search Console retry");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("documents a downloaded SEO evidence artifact review checklist", () => {
    const review = buildSeoEvidenceArtifactReview();
    const files = review.map((item) => item.artifactFile);
    const combined = review
      .map((item) => `${item.label} ${item.artifactFile} ${item.check} ${item.passSignal} ${item.useBefore}`)
      .join(" ");

    expect(files).toEqual(
      expect.arrayContaining([
        "seo-smoke-result.json",
        "gsc-evidence-result.json",
        "gsc-discovered-sample-evidence-result.json",
        "docs/evidence/gsc-discovered-validation-final-2026-06-06.json",
        "docs/evidence/gsc-discovered-validation-follow-up-2026-06-06.json",
        "search-console-verification-evidence-result.json",
        "dns-evidence-result.json",
        "security-headers-evidence-result.json",
        "health-evidence-result.json",
        "crawl-discovery-evidence-result.json",
        "internal-link-evidence-result.json",
        "html-quality-evidence-result.json",
        "professional-review-packet-evidence-result.json",
        "professional-ui-evidence-result.json",
        "privacy-evidence-boundary-result.json",
        "ai-security-evidence-result.json",
        "ai-verifier-regression-evidence-result.json",
        "seo-evidence-validation-result.json",
        "seo-evidence-manifest.json",
        "seo-evidence-manifest-validation-result.json",
      ]),
    );
    expect(review.length).toBe(20);
    expect(combined).toContain("production-seo-evidence");
    expect(combined).toContain("gscDiscoveredSampleCount");
    expect(combined).toContain("sourceIssueState: discovered_not_indexed");
    expect(combined).toContain("failureCount: 0");
    expect(combined).toContain("siteIndex.linkedSampleCount");
    expect(combined).toContain("linked from /site-index");
    expect(combined).toContain("seo:gsc-validation-action-validate");
    expect(combined).toContain("validationStarted: true");
    expect(combined).toContain("validate_fix_started");
    expect(combined).toContain("gsc-indexing-validation-follow-up");
    expect(combined).toContain("seo:gsc-validation-follow-up-validate");
    expect(combined).toContain("blocked repeated Validate fix actions");
    expect(combined).toContain("raw private UI text");
    expect(combined).toContain("professionalUiScannedFileCount");
    expect(combined).toContain("searchConsoleVerificationOk: true");
    expect(combined).toContain("domainTxtVerified: true");
    expect(combined).toContain("htmlMetaVerified: true");
    expect(combined).toContain("spfRecordRetained: true");
    expect(combined).toContain("gscUiOwnershipNotAsserted: true");
    expect(combined).toContain("dnsCanonicalOk: true");
    expect(combined).toContain("securityHeadersOk: true");
    expect(combined).toContain("healthEndpointOk: true");
    expect(combined).toContain("crawl-discovery-evidence-result.json");
    expect(combined).toContain("robotsDiscoveryRetained: true");
    expect(combined).toContain("sitemapUrlCountRetained: true");
    expect(combined).toContain("sitemapCanonicalHostRetained: true");
    expect(combined).toContain("feedItemsRetained: true");
    expect(combined).toContain("llmsCoreCoverageRetained: true");
    expect(combined).toContain("crawlDiscoveryUrlCount");
    expect(combined).toContain("internal-link-evidence-result.json");
    expect(combined).toContain("allSitemapUrlsOk: true");
    expect(combined).toContain("canonicalHostRetained: true");
    expect(combined).toContain("noNoindexRetained: true");
    expect(combined).toContain("sitemapUrlHealthRetained: true");
    expect(combined).toContain("siteIndexInternalLinksRetained: true");
    expect(combined).toContain("siteIndexCorePathsRetained: true");
    expect(combined).toContain("internalLinkCheckedUrlCount");
    expect(combined).toContain("html-quality-evidence-result.json");
    expect(combined).toContain("htmlQualityPageCount");
    expect(combined).toContain("pageStatusRetained: true");
    expect(combined).toContain("htmlLangRetained: true");
    expect(combined).toContain("singleH1Retained: true");
    expect(combined).toContain("titleRetained: true");
    expect(combined).toContain("metaDescriptionRetained: true");
    expect(combined).toContain("canonicalRetained: true");
    expect(combined).toContain("imageAltRetained: true");
    expect(combined).toContain("buttonNameRetained: true");
    expect(combined).toContain("formLabelRetained: true");
    expect(combined).toContain("maxFailureCount: 0");
    expect(combined).toContain("professional-review-packet-evidence-result.json");
    expect(combined).toContain("professionalReviewPacketOk: true");
    expect(combined).toContain("privacy-evidence-boundary-result.json");
    expect(combined).toContain("privacyEvidenceBoundaryOk: true");
    expect(combined).toContain("allowlistRetained: true");
    expect(combined).toContain("gitignoreRulesRetained: true");
    expect(combined).toContain("approvedRemotePrivateEvidenceCount: 2");
    expect(combined).toContain("unapprovedRemotePrivateEvidenceCount: 0");
    expect(combined).toContain("privacyUnapprovedRemoteEvidenceCount: 0");
    expect(combined).toContain("ai-security-evidence-result.json");
    expect(combined).toContain("aiSecurityOk: true");
    expect(combined).toContain("paidModelFuseRetained: true");
    expect(combined).toContain("originGuardRetained: true");
    expect(combined).toContain("rateLimitRetained: true");
    expect(combined).toContain("fallbackProviderHeaderRetained: true");
    expect(combined).toContain("envExampleSecretHygieneRetained: true");
    expect(combined).toContain("crossOriginProbeBlocked: true");
    expect(combined).toContain("crossOriginProbeStatus: 403");
    expect(combined).toContain("crossOriginProbeProvider: fallback");
    expect(combined).toContain("crossOriginProbeReason: origin_blocked");
    expect(combined).toContain("homepageCspBlocksBrowserOpenAi: true");
    expect(combined).toContain("ai-verifier-regression-evidence-result.json");
    expect(combined).toContain("aiVerifierRegressionOk: true");
    expect(combined).toContain("aiVerifierRegressionScenarioCount: 6");
    expect(combined).toContain("statsPanel.totalFixtures: 6");
    expect(combined).toContain("statsPanel.passFixtures: 1");
    expect(combined).toContain("statsPanel.failFixtures: 4");
    expect(combined).toContain("statsPanel.fallbackFixtures: 1");
    expect(combined).toContain("deterministicCoverage: pass/fail/fallback");
    expect(combined).toContain("routeFailsClosedToFallback: true");
    expect(combined).toContain("sameOriginFallbackProbeRetained: true");
    expect(combined).toContain("pageTermsRetained: true");
    expect(combined).toContain("healthPendingReviewRetained: true");
    expect(combined).toContain("taxYearRetained: true");
    expect(combined).toContain("cacheNoStoreRetained: true");
    expect(combined).toContain("taxYearRetained: true");
    expect(combined).toContain("professionalReviewPending: true");
    expect(combined).toContain("noSecretLikeKeys: true");
    expect(combined).toContain("expectedCnameRetained: true");
    expect(combined).toContain("apexRedirectsToCanonical: true");
    expect(combined).toContain("wwwReturnsOk: true");
    expect(combined).toContain("contentSecurityPolicyRetained: true");
    expect(combined).toContain("hstsRetained: true");
    expect(combined).toContain("nosniffRetained: true");
    expect(combined).toContain("frameAncestorsNone: true");
    expect(combined).toContain("noPoweredByHeader: true");
    expect(combined).toContain("violationCount: 0");
    expect(combined).toContain("sha256");
    expect(combined).toContain("artifactSchemaVersion");
    expect(combined).toContain("generatedAt");
    expect(combined).toContain("eventName");
    expect(combined).toContain("gitHubRunUrl");
    expect(combined).toContain("gitHubCommitUrl");
    expect(combined).toContain("gitHubRunId");
    expect(combined).toContain("gitHubSha");
    expect(combined).toContain("gitHubRunAttempt");
    expect(combined).toContain("gitHubWorkflow");
    expect(combined).toContain("seo:evidence-manifest-validate");
    expect(combined).toContain("ok: true");
    expect(combined).toContain("postManifestValidation: true");
    expect(combined).toContain("manifestValidationResultRetained: true");
    expect(combined).toContain("generatedAtRetained: true");
    expect(combined).toContain("gitHubProvenanceConsistent: true");
    expect(combined).toContain("gitHubRepositoryRetained: true");
    expect(combined).toContain("gitHubServerUrlRetained: true");
    expect(combined).toContain("gitHubWorkflowRetained: true");
    expect(combined).toContain("runAttemptRetained: true");
    expect(combined).toContain("checkedFileCount: 19");
    expect(combined).toContain("sha256CheckedCount: 19");
    expect(combined).toContain("manifestFileCount: 21");
    expect(combined).toContain("selfDescribing: true");
    expect(combined).toContain("Search Console-side");
    expect(combined).toContain("URL Inspection");
    expect(combined).not.toMatch(/best amount|should convert|guaranteed|100% accurate/i);
  });

  it("turns Search Console queries into a safe content opportunity matrix", () => {
    const opportunities = buildSearchConsoleOpportunityMatrix();
    const clusters = opportunities.map((opportunity) => opportunity.cluster);
    const allQueries = opportunities.flatMap((opportunity) => opportunity.exampleQueries);

    expect(clusters).toEqual(
      expect.arrayContaining([
        "Core calculator intent",
        "Bracket room questions",
        "Hidden tax interaction questions",
        "Payment and withholding questions",
        "State and filing-status questions",
        "Process, forms, and CPA handoff questions",
      ]),
    );
    expect(allQueries).toEqual(
      expect.arrayContaining([
        "roth conversion calculator",
        "how much can i convert without going into the next tax bracket",
        "roth conversion irmaa impact",
        "pay roth conversion tax from ira",
        "roth conversion state tax calculator",
        "questions to ask cpa about roth conversion",
      ]),
    );
    expect(opportunities.length).toBeGreaterThanOrEqual(6);
    expect(opportunities.every((opportunity) => opportunity.reviewGate.length > 20)).toBe(true);
    expect(opportunities.filter((opportunity) => opportunity.risk === "professional").length).toBeGreaterThanOrEqual(
      3,
    );
    expect(opportunities.map((opportunity) => opportunity.action).join(" ")).not.toMatch(
      /should convert|best amount|guaranteed|100% accurate/i,
    );
  });

  it("documents a Search Console query opportunity record template with YMYL review gates", () => {
    const fields = buildSearchConsoleQueryOpportunityRecordTemplate();
    const fieldNames = fields.map((item) => item.field);
    const combined = fields
      .map((item) => `${item.field} ${item.source} ${item.requiredWhen} ${item.validation}`)
      .join(" ");

    expect(fieldNames).toEqual(
      expect.arrayContaining([
        "recordStatus",
        "source",
        "query",
        "metrics",
        "matchedCluster",
        "recommendedAction",
        "riskLevel",
        "reviewGate",
        "evidence",
        "decision",
      ]),
    );
    expect(combined).toContain("docs/search-console-query-opportunity-template.json");
    expect(combined).toContain("seo:gsc-query-opportunity-draft");
    expect(combined).toContain("seo:gsc-query-opportunity-import");
    expect(combined).toContain("seo:gsc-query-opportunity-backlog");
    expect(combined).toContain("seo:gsc-query-opportunity-ready");
    expect(combined).toContain("seo:gsc-query-opportunity-validate");
    expect(combined).toContain("professional review");
    expect(combined).toContain("needs_review");
    expect(combined).toContain("Do not use best amount");
  });

  it("exposes SEO monitoring through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const contentFile = fs.readFileSync(path.join(process.cwd(), "src/content/seo-monitoring.ts"), "utf8");
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/seo-monitoring/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
    expect(pageFile).toContain("SEO Monitoring Playbook");
    expect(pageFile).toContain("buildSeoMonitoringGroups");
    expect(pageFile).toContain("buildSearchConsoleExceptionQueue");
    expect(pageFile).toContain("buildSearchConsoleSubmissionLoop");
    expect(pageFile).toContain("buildSearchConsoleOpportunityMatrix");
    expect(pageFile).toContain("buildSearchConsoleQueryOpportunityRecordTemplate");
    expect(pageFile).toContain("buildSearchConsoleRetryProtocol");
    expect(pageFile).toContain("buildSitemapFreshnessEvidence");
    expect(pageFile).toContain("buildSeoEvidenceArtifactReview");
    expect(pageFile).toContain("buildSearchConsoleIndexingRecordTemplate");
    expect(pageFile).toContain("buildSearchConsoleValidationActionRecord");
    expect(pageFile).toContain("Search Console submission loop");
    expect(pageFile).toContain("GSC indexing record template");
    expect(pageFile).toContain("seo:gsc-indexing-record-draft");
    expect(pageFile).toContain("seo:gsc-indexing-record-ready");
    expect(pageFile).toContain("seo:gsc-indexing-record-summary");
    expect(pageFile).toContain("seo:gsc-indexing-records-manifest");
    expect(pageFile).toContain("seo:gsc-indexing-record-validate");
    expect(pageFile).toContain("seo:gsc-validation-action-validate");
    expect(pageFile).toContain("Search Console exception queue");
    expect(pageFile).toContain("Indexing retry protocol");
    expect(pageFile).toContain("Sitemap freshness evidence");
    expect(pageFile).toContain("SEO evidence artifact review");
    expect(pageFile).toContain("Query opportunity matrix");
    expect(pageFile).toContain("GSC query opportunity record");
    expect(pageFile).toContain("seo:gsc-query-opportunity-ready");
    expect(pageFile).toContain("seo:gsc-query-opportunity-validate");
    expect(contentFile).toContain("seo:gsc-evidence");
    expect(contentFile).toContain("lastmodFresh");
    expect(homePage).toContain('href="/seo-monitoring"');
    expect(siteIndexUrls).toContain("/seo-monitoring");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
  });
});
