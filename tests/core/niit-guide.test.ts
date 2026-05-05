import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildNiitGuideSections, getNiitGuideSummary } from "@/content/niit-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion NIIT guide", () => {
  it("builds an educational guide for net investment income tax interactions", () => {
    const sections = buildNiitGuideSections();
    const summary = getNiitGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "niit-basics",
        "conversion-income",
        "investment-income",
        "form-8960-review",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("NIIT is a 3.8% tax tied to net investment income and MAGI thresholds");
    expect(labels).toContain("Roth conversion income can raise MAGI even when it is not net investment income");
    expect(labels).toContain("Net investment income categories need separate classification");
    expect(labels).toContain("Form 8960 review is outside the calculator");
    expect(labels).toContain("Calculator does not estimate NIIT");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["NIIT basics", "MAGI review", "Investment income", "Calculator limits"]),
    );
  });

  it("exposes the NIIT guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-niit-guide/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-niit-guide");
    expect(pageFile).toContain("Roth Conversion NIIT Guide");
    expect(pageFile).toContain("buildNiitGuideSections");
    expect(homePage).toContain('href="/roth-conversion-niit-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-niit-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-niit-guide");
  });
});
