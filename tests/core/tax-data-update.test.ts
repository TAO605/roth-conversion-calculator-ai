import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildTaxDataUpdateGroups, getTaxDataUpdateSummary } from "@/content/tax-data-update";
import { buildLlmsText } from "@/core/seo/llms";

describe("tax data update playbook", () => {
  it("builds an annual IRS tax-data update workflow", () => {
    const groups = buildTaxDataUpdateGroups();
    const summary = getTaxDataUpdateSummary(groups);
    const labels = groups.flatMap((group) => group.steps.map((step) => step.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["source-review", "implementation", "validation", "release", "rollback"]),
    );
    expect(labels).toContain("Confirm IRS source documents");
    expect(labels).toContain("Update federal bracket tables");
    expect(labels).toContain("Run calculation regression tests");
    expect(labels).toContain("Update tax-year freshness messaging");
    expect(labels).toContain("Prepare rollback path");
    expect(summary.totalSteps).toBeGreaterThanOrEqual(12);
    expect(summary.evidenceTypes).toEqual(
      expect.arrayContaining(["IRS source URL", "Tax table diff", "CPA review note", "Test output"]),
    );
  });

  it("exposes tax data update through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/tax-data-update/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/tax-data-update");
    expect(pageFile).toContain("Tax Data Update Playbook");
    expect(pageFile).toContain("buildTaxDataUpdateGroups");
    expect(homePage).toContain('href="/tax-data-update"');
    expect(siteIndexUrls).toContain("/tax-data-update");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/tax-data-update");
  });
});
