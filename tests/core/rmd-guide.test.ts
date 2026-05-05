import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildRmdGuideSections, getRmdGuideSummary } from "@/content/rmd-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion RMD guide", () => {
  it("builds an educational guide for RMD issues around Roth conversions", () => {
    const sections = buildRmdGuideSections();
    const summary = getRmdGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "rmd-basics",
        "conversion-sequence",
        "roth-ira-owner",
        "inherited-accounts",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("RMD amount is not a Roth conversion amount");
    expect(labels).toContain("Take required distributions before converting remaining eligible assets");
    expect(labels).toContain("Roth IRA owners generally do not take lifetime RMDs");
    expect(labels).toContain("Inherited Roth accounts can have beneficiary distribution rules");
    expect(labels).toContain("Calculator does not determine RMD obligations");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["RMD obligation", "Conversion sequence", "Roth IRA owner rules", "Calculator limits"]),
    );
  });

  it("exposes the RMD guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-rmd-guide/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-rmd-guide");
    expect(pageFile).toContain("Roth Conversion RMD Guide");
    expect(pageFile).toContain("buildRmdGuideSections");
    expect(homePage).toContain('href="/roth-conversion-rmd-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-rmd-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-rmd-guide");
  });
});
