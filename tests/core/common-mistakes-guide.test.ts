import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildCommonMistakeGroups, getCommonMistakeSummary } from "@/content/common-mistakes-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion mistakes guide", () => {
  it("builds a compliance-safe guide to common Roth conversion modeling mistakes", () => {
    const groups = buildCommonMistakeGroups();
    const summary = getCommonMistakeSummary(groups);
    const labels = groups.flatMap((group) => group.mistakes.map((mistake) => mistake.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["tax-inputs", "basis", "tax-interactions", "payment-method", "decision-process"]),
    );
    expect(labels).toContain("Using gross income instead of taxable income");
    expect(labels).toContain("Guessing after-tax basis");
    expect(labels).toContain("Ignoring IRMAA and ACA subsidy effects");
    expect(labels).toContain("Treating IRA withholding like outside funds");
    expect(labels).toContain("Treating calculator output as advice");
    expect(summary.totalMistakes).toBeGreaterThanOrEqual(12);
    expect(summary.reviewPaths).toEqual(
      expect.arrayContaining(["Calculator Assumptions Guide", "CPA Review Checklist", "Tax Interaction Limits"]),
    );
  });

  it("exposes the mistakes guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-mistakes/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-mistakes");
    expect(pageFile).toContain("Roth Conversion Mistakes Guide");
    expect(pageFile).toContain("buildCommonMistakeGroups");
    expect(homePage).toContain('href="/roth-conversion-mistakes"');
    expect(siteIndexUrls).toContain("/roth-conversion-mistakes");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-mistakes");
  });
});
