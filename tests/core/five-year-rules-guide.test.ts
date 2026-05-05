import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildFiveYearRuleSections, getFiveYearRulesSummary } from "@/content/five-year-rules-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion 5-year rules guide", () => {
  it("builds an educational guide that separates Roth IRA 5-year rule concepts", () => {
    const sections = buildFiveYearRuleSections();
    const summary = getFiveYearRulesSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "qualified-distribution-clock",
        "conversion-clock",
        "ordering-rules",
        "age-and-exceptions",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Qualified distribution 5-year period");
    expect(labels).toContain("Separate 5-year period for each conversion or rollover");
    expect(labels).toContain("Roth IRA distribution ordering rules");
    expect(labels).toContain("Age 59 1/2 and exception review");
    expect(labels).toContain("Calculator output does not decide withdrawal treatment");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Qualified distributions", "Conversion recapture", "Ordering rules", "Calculator limits"]),
    );
  });

  it("exposes the 5-year rules guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-5-year-rules/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-5-year-rules");
    expect(pageFile).toContain("Roth Conversion 5-Year Rules Guide");
    expect(pageFile).toContain("buildFiveYearRuleSections");
    expect(homePage).toContain('href="/roth-conversion-5-year-rules"');
    expect(siteIndexUrls).toContain("/roth-conversion-5-year-rules");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-5-year-rules");
  });
});
