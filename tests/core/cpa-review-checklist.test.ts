import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildCpaReviewChecklistGroups, getCpaReviewChecklistSummary } from "@/content/cpa-review-checklist";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("CPA review checklist", () => {
  it("builds a professional review handoff checklist for calculator users", () => {
    const groups = buildCpaReviewChecklistGroups();
    const summary = getCpaReviewChecklistSummary(groups);
    const labels = groups.flatMap((group) => group.items.map((item) => item.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["inputs", "tax-documents", "model-limits", "advisor-questions", "records"]),
    );
    expect(labels).toContain("Calculator result summary");
    expect(labels).toContain("Traditional IRA basis records");
    expect(labels).toContain("State tax assumptions");
    expect(labels).toContain("IRMAA and ACA subsidy review");
    expect(labels).toContain("Written professional recommendation");
    expect(summary.totalItems).toBeGreaterThanOrEqual(12);
    expect(summary.handoffOutputs).toEqual(
      expect.arrayContaining(["Print-ready calculator report", "Tax document packet", "Question list", "Decision record"]),
    );
  });

  it("exposes CPA review checklist through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/cpa-review-checklist/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/cpa-review-checklist");
    expect(pageFile).toContain("CPA Review Checklist");
    expect(pageFile).toContain("buildCpaReviewChecklistGroups");
    expect(homePage).toContain('href="/cpa-review-checklist"');
    expect(siteIndexUrls).toContain("/cpa-review-checklist");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/cpa-review-checklist");
  });
});
