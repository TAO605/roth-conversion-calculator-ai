import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildFeedbackRoadmapGroups, getFeedbackRoadmapSummary } from "@/content/feedback-roadmap";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("feedback roadmap playbook", () => {
  it("builds a small-version feedback and roadmap workflow", () => {
    const groups = buildFeedbackRoadmapGroups();
    const summary = getFeedbackRoadmapSummary(groups);
    const labels = groups.flatMap((group) => group.steps.map((step) => step.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["collection", "triage", "scope", "release", "follow-up"]),
    );
    expect(labels).toContain("Capture user feedback source");
    expect(labels).toContain("Classify compliance risk");
    expect(labels).toContain("Confirm small-version boundary");
    expect(labels).toContain("Ship behind feature registry");
    expect(labels).toContain("Record user-facing outcome");
    expect(summary.totalSteps).toBeGreaterThanOrEqual(12);
    expect(summary.artifacts).toEqual(
      expect.arrayContaining(["Feedback record", "Priority score", "Small-version spec", "Rollback note"]),
    );
  });

  it("exposes feedback roadmap through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/feedback-roadmap/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/feedback-roadmap");
    expect(pageFile).toContain("Feedback Roadmap Playbook");
    expect(pageFile).toContain("buildFeedbackRoadmapGroups");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/feedback-roadmap");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/feedback-roadmap");
  });
});
