import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildRecharacterizationGuideSections,
  getRecharacterizationGuideSummary,
} from "@/content/recharacterization-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion recharacterization guide", () => {
  it("builds an educational guide that separates contribution and conversion recharacterization", () => {
    const sections = buildRecharacterizationGuideSections();
    const summary = getRecharacterizationGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "conversion-rule",
        "contribution-rule",
        "backdoor-roth-context",
        "error-review",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("Roth conversions made after 2017 generally cannot be recharacterized");
    expect(labels).toContain("Regular IRA contribution recharacterization is a different concept");
    expect(labels).toContain("Backdoor Roth workflows often involve contribution recharacterization and later conversion");
    expect(labels).toContain("Custodian form errors should be reviewed quickly");
    expect(labels).toContain("Calculator does not undo or recharacterize conversions");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Conversion recharacterization", "Contribution recharacterization", "Backdoor Roth", "Calculator limits"]),
    );
  });

  it("exposes the recharacterization guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-recharacterization-guide/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-recharacterization-guide");
    expect(pageFile).toContain("Roth Conversion Recharacterization Guide");
    expect(pageFile).toContain("buildRecharacterizationGuideSections");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/roth-conversion-recharacterization-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-recharacterization-guide");
  });
});
