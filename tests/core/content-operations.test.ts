import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildContentOperationsGroups, getContentOperationsSummary } from "@/content/content-operations";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("content operations playbook", () => {
  it("builds an editorial workflow for long-term SEO operations", () => {
    const groups = buildContentOperationsGroups();
    const summary = getContentOperationsSummary(groups);
    const labels = groups.flatMap((group) => group.steps.map((step) => step.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["research", "production", "review", "publishing", "refresh"]),
    );
    expect(labels).toContain("Collect GSC query opportunities");
    expect(labels).toContain("Map keyword intent to page type");
    expect(labels).toContain("Run compliance copy review");
    expect(labels).toContain("Add internal links to calculator");
    expect(labels).toContain("Refresh declining pages");
    expect(summary.totalSteps).toBeGreaterThanOrEqual(12);
    expect(summary.outputs).toEqual(
      expect.arrayContaining(["Keyword brief", "Draft page", "Compliance review", "Internal link checklist"]),
    );
  });

  it("exposes content operations through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/content-operations/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/content-operations");
    expect(pageFile).toContain("Content Operations Playbook");
    expect(pageFile).toContain("buildContentOperationsGroups");
    expect(homePage).toContain('href="/content-operations"');
    expect(siteIndexUrls).toContain("/content-operations");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/content-operations");
  });
});
