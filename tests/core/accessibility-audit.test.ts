import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildAccessibilityAuditGroups, getAccessibilityAuditSummary } from "@/content/accessibility-audit";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("accessibility audit playbook", () => {
  it("builds a WCAG-focused accessibility audit checklist for the calculator site", () => {
    const groups = buildAccessibilityAuditGroups();
    const summary = getAccessibilityAuditSummary(groups);
    const labels = groups.flatMap((group) => group.checks.map((check) => check.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["keyboard", "screen-reader", "visual", "motion", "forms"]),
    );
    expect(labels).toContain("Complete calculator with keyboard only");
    expect(labels).toContain("Verify screen reader labels");
    expect(labels).toContain("Check color contrast in light and dark mode");
    expect(labels).toContain("Respect reduced motion preferences");
    expect(labels).toContain("Validate mobile input labels and errors");
    expect(summary.totalChecks).toBeGreaterThanOrEqual(12);
    expect(summary.standards).toEqual(
      expect.arrayContaining(["WCAG 2.1 AA", "Apple VoiceOver", "Keyboard navigation", "Reduced motion"]),
    );
  });

  it("exposes accessibility audit through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/accessibility-audit/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/accessibility-audit");
    expect(pageFile).toContain("Accessibility Audit Playbook");
    expect(pageFile).toContain("buildAccessibilityAuditGroups");
    expect(homePage).toContain('href="/accessibility-audit"');
    expect(siteIndexUrls).toContain("/accessibility-audit");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/accessibility-audit");
  });
});
