import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildQcdGuideSections, getQcdGuideSummary } from "@/content/qcd-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion QCD guide", () => {
  it("builds an educational guide for qualified charitable distribution interactions", () => {
    const sections = buildQcdGuideSections();
    const summary = getQcdGuideSummary(sections);
    const labels = sections.flatMap((section) => section.points.map((point) => point.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "qcd-basics",
        "rmd-context",
        "conversion-separation",
        "recordkeeping",
        "calculator-boundary",
      ]),
    );
    expect(labels).toContain("A QCD is a direct IRA distribution to an eligible charity");
    expect(labels).toContain("A QCD can count toward an RMD when IRS requirements are met");
    expect(labels).toContain("QCDs are not Roth conversions");
    expect(labels).toContain("Form 1099-R and charity acknowledgments should be saved");
    expect(labels).toContain("Calculator does not optimize QCD or charitable giving strategy");
    expect(summary.totalPoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["QCD basics", "RMD coordination", "Conversion separation", "Calculator limits"]),
    );
  });

  it("exposes the QCD guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-qcd-guide/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-qcd-guide");
    expect(pageFile).toContain("Roth Conversion QCD Guide");
    expect(pageFile).toContain("buildQcdGuideSections");
    expect(homePage).toContain('href="/roth-conversion-qcd-guide"');
    expect(siteIndexUrls).toContain("/roth-conversion-qcd-guide");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-qcd-guide");
  });
});
