import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  featureRegistry,
  getEnabledFeatureIds,
  getFeatureById,
  isFeatureEnabled,
  withFeatureOverride,
} from "@/core/features/feature-registry";

describe("feature registry", () => {
  it("tracks modular features with unique ids and rollback paths", () => {
    const ids = featureRegistry.map((feature) => feature.id);

    expect(featureRegistry.length).toBeGreaterThanOrEqual(6);
    expect(new Set(ids).size).toBe(ids.length);
    expect(featureRegistry.every((feature) => feature.version.match(/^1\.0\.\d+$/))).toBe(true);
    expect(featureRegistry.every((feature) => feature.rollbackPath.length > 0)).toBe(true);
  });

  it("keeps core calculator locked while allowing feature modules to be toggled", () => {
    const core = getFeatureById("core-calculator");
    const copySummary = getFeatureById("copy-summary");

    expect(core).toMatchObject({
      locked: true,
      enabled: true,
      grayRate: 100,
    });
    expect(copySummary).toMatchObject({
      locked: false,
      enabled: true,
    });
  });

  it("returns only enabled feature ids", () => {
    expect(getEnabledFeatureIds()).toContain("scenario-history");
    expect(getEnabledFeatureIds()).toContain("calculator-input-layout");
    expect(getEnabledFeatureIds()).toContain("share-link");
    expect(getEnabledFeatureIds()).toContain("pdf-report");
    expect(getEnabledFeatureIds()).toContain("professional-handoff");
    expect(getEnabledFeatureIds()).toContain("projection-chart");
    expect(getEnabledFeatureIds()).toContain("calculation-breakdown");
    expect(getEnabledFeatureIds()).toContain("tax-payment-comparison");
    expect(getEnabledFeatureIds()).toContain("result-scope-boundary");
    expect(getEnabledFeatureIds()).toContain("tax-impact-warnings-boundary");
    expect(getEnabledFeatureIds()).toContain("tax-data-freshness");
    expect(getEnabledFeatureIds()).toContain("ai-compliance-gateway");
    expect(getEnabledFeatureIds()).toContain("seo-structured-content");
    expect(getEnabledFeatureIds()).toContain("production-readiness");
    expect(getEnabledFeatureIds()).toContain("privacy-safe-analytics");
    expect(getEnabledFeatureIds()).toContain("blog-internal-linking");
    expect(getEnabledFeatureIds()).toContain("search-console-verification");
    expect(getEnabledFeatureIds()).toContain("rss-feed");
    expect(getEnabledFeatureIds()).toContain("homepage-lazy-loading");
    expect(getEnabledFeatureIds()).toContain("glossary-hub");
    expect(getEnabledFeatureIds()).toContain("health-check-endpoint");
    expect(getEnabledFeatureIds()).toContain("federal-tax-brackets-page");
    expect(getEnabledFeatureIds()).toContain("filing-status-seo-pages");
    expect(getEnabledFeatureIds()).toContain("filing-status-hub");
    expect(getEnabledFeatureIds()).toContain("age-scenario-seo-pages");
    expect(getEnabledFeatureIds()).toContain("example-scenario-seo-pages");
    expect(getEnabledFeatureIds()).toContain("homepage-howto-structured-data");
    expect(getEnabledFeatureIds()).toContain("pwa-install-icons");
    expect(getEnabledFeatureIds()).toContain("keyword-landing-pages");
    expect(getEnabledFeatureIds()).toContain("social-preview-metadata");
    expect(getEnabledFeatureIds()).toContain("tax-bracket-rate-pages");
    expect(getEnabledFeatureIds()).toContain("sitemap-priority-hints");
    expect(getEnabledFeatureIds()).toContain("tax-payment-method-pages");
    expect(getEnabledFeatureIds()).toContain("basis-planning-pages");
    expect(getEnabledFeatureIds()).toContain("llms-text-index");
    expect(getEnabledFeatureIds()).toContain("social-preview-image");
    expect(getEnabledFeatureIds()).toContain("multi-year-planning-pages");
    expect(getEnabledFeatureIds()).toContain("tax-interaction-pages");
    expect(getEnabledFeatureIds()).toContain("launch-readiness-checklist");
    expect(getEnabledFeatureIds()).toContain("site-index");
    expect(getEnabledFeatureIds()).toContain("production-launch-guide");
    expect(getEnabledFeatureIds()).toContain("seo-monitoring-playbook");
    expect(getEnabledFeatureIds()).toContain("performance-audit-playbook");
    expect(getEnabledFeatureIds()).toContain("accessibility-audit-playbook");
    expect(getEnabledFeatureIds()).toContain("tax-data-update-playbook");
    expect(getEnabledFeatureIds()).toContain("ai-compliance-audit-playbook");
    expect(getEnabledFeatureIds()).toContain("content-operations-playbook");
    expect(getEnabledFeatureIds()).toContain("operations-page-ui");
    expect(getEnabledFeatureIds()).toContain("content-hub-page-ui");
    expect(getEnabledFeatureIds()).toContain("priority-guide-page-ui");
    expect(getEnabledFeatureIds()).toContain("dynamic-detail-page-ui");
    expect(getEnabledFeatureIds()).toContain("shared-feature-ui");
    expect(getEnabledFeatureIds()).toContain("professional-ui-global-guard");
    expect(getEnabledFeatureIds()).toContain("cpa-review-checklist");
    expect(getEnabledFeatureIds()).toContain("feedback-roadmap-playbook");
    expect(getEnabledFeatureIds()).toContain("privacy-data-flow-playbook");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-planning-checklist");
    expect(getEnabledFeatureIds()).toContain("calculator-assumptions-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-mistakes-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-tax-forms-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-timeline-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-custodian-process-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-cpa-questions-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-five-year-rules-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-rmd-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-social-security-tax-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-irmaa-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-aca-premium-tax-credit-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-niit-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-capital-gains-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-estimated-tax-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-recharacterization-guide");
    expect(getEnabledFeatureIds()).toContain("roth-conversion-qcd-guide");
  });

  it("evaluates feature flags without allowing the locked core to be disabled", () => {
    expect(isFeatureEnabled("copy-summary")).toBe(true);
    expect(isFeatureEnabled("unknown-feature")).toBe(false);

    withFeatureOverride("copy-summary", { enabled: false }, () => {
      expect(isFeatureEnabled("copy-summary")).toBe(false);
    });

    withFeatureOverride("scenario-history", { grayRate: 0 }, () => {
      expect(isFeatureEnabled("scenario-history")).toBe(false);
    });

    withFeatureOverride("core-calculator", { enabled: false, grayRate: 0 }, () => {
      expect(isFeatureEnabled("core-calculator")).toBe(true);
    });
  });

  it("gates optional homepage modules through the feature registry", () => {
    const homePage = [
      fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8"),
      fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8"),
    ].join("\n");

    expect(homePage).toContain('isFeatureEnabled("ai-explainer")');
    expect(homePage).toContain('isFeatureEnabled("tax-data-freshness")');
    expect(homePage).toContain('isFeatureEnabled("theme-toggle")');
    expect(homePage).toContain('isFeatureEnabled("share-link")');
    expect(homePage).toContain('isFeatureEnabled("pdf-report")');
    expect(homePage).toContain('isFeatureEnabled("professional-handoff")');
    expect(homePage).toContain('isFeatureEnabled("projection-chart")');
    expect(homePage).toContain('isFeatureEnabled("calculation-breakdown")');
    expect(homePage).toContain('isFeatureEnabled("tax-payment-comparison")');
    expect(homePage).toContain('isFeatureEnabled("result-scope-boundary")');
    expect(homePage).toContain('isFeatureEnabled("tax-impact-warnings-boundary")');
    expect(homePage).toContain('isFeatureEnabled("scenario-history")');
    expect(homePage).toContain('isFeatureEnabled("privacy-safe-analytics")');
    expect(homePage).toContain('isFeatureEnabled("homepage-howto-structured-data")');
    expect(homePage).not.toContain('isFeatureEnabled("copy-summary")');
    expect(homePage).not.toContain('isFeatureEnabled("conversion-sensitivity")');
  });

  it("keeps the result scope boundary locked because it is a YMYL disclosure", () => {
    expect(getFeatureById("result-scope-boundary")).toMatchObject({
      locked: true,
      enabled: true,
      grayRate: 100,
    });

    withFeatureOverride("result-scope-boundary", { enabled: false, grayRate: 0 }, () => {
      expect(isFeatureEnabled("result-scope-boundary")).toBe(true);
    });
  });

  it("keeps the tax impact warnings boundary locked because it is a YMYL disclosure", () => {
    expect(getFeatureById("tax-impact-warnings-boundary")).toMatchObject({
      locked: true,
      enabled: true,
      grayRate: 100,
    });

    withFeatureOverride("tax-impact-warnings-boundary", { enabled: false, grayRate: 0 }, () => {
      expect(isFeatureEnabled("tax-impact-warnings-boundary")).toBe(true);
    });
  });
});
