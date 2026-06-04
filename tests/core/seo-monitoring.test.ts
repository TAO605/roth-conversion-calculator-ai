import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildSearchConsoleExceptionQueue,
  buildSearchConsoleOpportunityMatrix,
  buildSearchConsoleRetryProtocol,
  buildSearchConsoleSubmissionLoop,
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
        "professional-ui-evidence-result.json",
        "seo-evidence-validation-result.json",
        "seo-evidence-manifest.json",
        "seo-evidence-manifest-validation-result.json",
      ]),
    );
    expect(review.length).toBe(6);
    expect(combined).toContain("production-seo-evidence");
    expect(combined).toContain("professionalUiScannedFileCount");
    expect(combined).toContain("violationCount: 0");
    expect(combined).toContain("sha256");
    expect(combined).toContain("artifactSchemaVersion");
    expect(combined).toContain("generatedAt");
    expect(combined).toContain("gitHubRunUrl");
    expect(combined).toContain("gitHubCommitUrl");
    expect(combined).toContain("seo:evidence-manifest-validate");
    expect(combined).toContain("ok: true");
    expect(combined).toContain("postManifestValidation: true");
    expect(combined).toContain("manifestValidationResultRetained: true");
    expect(combined).toContain("generatedAtRetained: true");
    expect(combined).toContain("sha256CheckedCount: 7");
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
    expect(pageFile).toContain("buildSearchConsoleRetryProtocol");
    expect(pageFile).toContain("buildSitemapFreshnessEvidence");
    expect(pageFile).toContain("buildSeoEvidenceArtifactReview");
    expect(pageFile).toContain("Search Console submission loop");
    expect(pageFile).toContain("Search Console exception queue");
    expect(pageFile).toContain("Indexing retry protocol");
    expect(pageFile).toContain("Sitemap freshness evidence");
    expect(pageFile).toContain("SEO evidence artifact review");
    expect(pageFile).toContain("Query opportunity matrix");
    expect(contentFile).toContain("seo:gsc-evidence");
    expect(contentFile).toContain("lastmodFresh");
    expect(homePage).toContain('href="/seo-monitoring"');
    expect(siteIndexUrls).toContain("/seo-monitoring");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/seo-monitoring");
  });
});
