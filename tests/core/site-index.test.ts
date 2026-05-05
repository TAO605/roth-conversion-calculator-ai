import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { glossaryTerms } from "@/content/glossary";
import { statePages } from "@/content/state-pages";
import { buildSiteIndexGroups, getSiteIndexSummary } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("site index", () => {
  it("builds a crawlable inventory across calculator, content, compliance, and operations pages", () => {
    const groups = buildSiteIndexGroups();
    const summary = getSiteIndexSummary(groups);
    const urls = groups.flatMap((group) => group.links.map((link) => link.href));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["calculator", "education", "reference", "compliance", "operations"]),
    );
    expect(urls).toContain("/#calculator");
    expect(urls).toContain("/blog/what-is-a-roth-conversion-2026");
    expect(urls).toContain("/glossary/roth-conversion");
    expect(urls).toContain("/states/california");
    expect(urls).toContain("/privacy");
    expect(urls).toContain("/launch-readiness");
    expect(summary.totalLinks).toBeGreaterThan(blogPosts.length + glossaryTerms.length + statePages.length);
  });

  it("adds the site index to sitemap, homepage navigation, and LLM discovery text", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/site-index/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/site-index");
    expect(pageFile).toContain("Site Index");
    expect(pageFile).toContain("buildSiteIndexGroups");
    expect(homePage).toContain('href="/site-index"');
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/site-index");
  });
});
