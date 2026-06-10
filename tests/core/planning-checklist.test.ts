import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildPlanningChecklistGroups, getPlanningChecklistSummary } from "@/content/planning-checklist";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion planning checklist", () => {
  it("builds a pre-calculator planning checklist for users", () => {
    const groups = buildPlanningChecklistGroups();
    const summary = getPlanningChecklistSummary(groups);
    const labels = groups.flatMap((group) => group.items.map((item) => item.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["tax-profile", "account-data", "conversion-assumptions", "model-limits", "review"]),
    );
    expect(labels).toContain("Filing status and taxable income");
    expect(labels).toContain("Traditional IRA balance");
    expect(labels).toContain("After-tax basis");
    expect(labels).toContain("Tax payment method");
    expect(labels).toContain("Professional review plan");
    expect(summary.totalItems).toBeGreaterThanOrEqual(12);
    expect(summary.calculatorInputs).toEqual(
      expect.arrayContaining(["filingStatus", "currentTaxableIncome", "traditionalIraBalance", "basis"]),
    );
  });

  it("exposes the planning checklist through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-planning-checklist/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-planning-checklist");
    expect(pageFile).toContain("Roth Conversion Planning Checklist");
    expect(pageFile).toContain("buildPlanningChecklistGroups");
    expect(homePage).toContain('href="/site-index"');
    expect(siteIndexUrls).toContain("/roth-conversion-planning-checklist");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-planning-checklist");
  });
});
