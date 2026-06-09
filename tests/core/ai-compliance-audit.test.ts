import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildAiComplianceAuditGroups,
  buildAiVerifierRegressionCoverage,
  getAiComplianceAuditSummary,
  getAiVerifierRegressionSummary,
} from "@/content/ai-compliance-audit";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("AI compliance audit playbook", () => {
  it("builds a compliance audit workflow for AI-assisted explanations", () => {
    const groups = buildAiComplianceAuditGroups();
    const summary = getAiComplianceAuditSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["prompt-boundary", "output-review", "privacy", "model-change", "fallback"]),
    );
    expect(labels).toContain("Reject personalized conversion decisions");
    expect(labels).toContain("Append required disclaimer");
    expect(labels).toContain("Block sensitive personal data prompts");
    expect(labels).toContain("Run model upgrade regression prompts");
    expect(labels).toContain("Verify static fallback response");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.riskControls).toEqual(
      expect.arrayContaining(["No advice boundary", "Required disclaimer", "Sensitive data blocking", "Fallback mode"]),
    );
  });

  it("exposes AI compliance audit through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/ai-compliance-audit/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/ai-compliance-audit");
    expect(pageFile).toContain("AI Compliance Audit Playbook");
    expect(pageFile).toContain("buildAiComplianceAuditGroups");
    expect(homePage).toContain('href="/ai-compliance-audit"');
    expect(siteIndexUrls).toContain("/ai-compliance-audit");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/ai-compliance-audit");
  });

  it("surfaces deterministic AI verifier regression evidence for production review", () => {
    const coverage = buildAiVerifierRegressionCoverage();
    const stats = getAiVerifierRegressionSummary(coverage);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/ai-compliance-audit/page.tsx"), "utf8");

    expect(coverage).toHaveLength(6);
    expect(stats).toMatchObject({
      deterministicCoverage: "pass/fail/fallback",
      failFixtures: 4,
      fallbackFixtures: 1,
      passFixtures: 1,
      totalFixtures: 6,
    });
    expect(stats.privacyBoundary).toContain("No paid model calls");
    expect(coverage.map((item) => item.expectedOutcome)).toEqual(
      expect.arrayContaining(["pass", "fail", "fallback"]),
    );
    expect(coverage.map((item) => item.label)).toEqual(
      expect.arrayContaining([
        "Safe calculator explanation",
        "Advice-language output",
        "Sensitive-data output",
        "Unsupported dollar output",
        "Missing disclaimer output",
        "Production fallback mode",
      ]),
    );
    expect(pageFile).toContain("AI Verifier Regression Evidence");
    expect(pageFile).toContain("Verifier Stats");
    expect(pageFile).toContain("getAiVerifierRegressionSummary");
    expect(pageFile).toContain("buildAiVerifierRegressionCoverage");
    expect(pageFile).toContain("ops:ai-verifier-regression");
    expect(pageFile).toContain("ai-verifier-regression-evidence-result.json");
  });
});
