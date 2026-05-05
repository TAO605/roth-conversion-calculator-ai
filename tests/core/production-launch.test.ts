import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildProductionLaunchGroups, getProductionLaunchSummary } from "@/content/production-launch";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("production launch guide", () => {
  it("builds grouped production launch steps for a Google SEO tool site", () => {
    const groups = buildProductionLaunchGroups();
    const summary = getProductionLaunchSummary(groups);
    const labels = groups.flatMap((group) => group.steps.map((step) => step.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["hosting", "environment", "google", "verification", "rollback"]),
    );
    expect(labels).toContain("Connect production domain");
    expect(labels).toContain("Configure Vercel environment variables");
    expect(labels).toContain("Verify Google Search Console");
    expect(labels).toContain("Submit sitemap.xml");
    expect(labels).toContain("Confirm rollback deployment");
    expect(groups[0].steps[0].detail).toContain("www.roth-conversion-calculator-ai.shop");
    expect(groups[1].steps[0].detail).toContain("G-43JB1BYSQD");
    expect(groups[1].steps[0].detail).toContain("HRbRO-Uc1Qg324AW4DLI681t-BqvwgwJxfTt3w9VXqk");
    expect(summary.totalSteps).toBeGreaterThanOrEqual(12);
    expect(summary.requiredEvidence).toContain("Production URL");
    expect(summary.requiredEvidence).toContain("GSC property");
  });

  it("surfaces the launch guide across crawl and discovery paths", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/production-launch/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/production-launch");
    expect(pageFile).toContain("Production Launch Guide");
    expect(pageFile).toContain("buildProductionLaunchGroups");
    expect(homePage).toContain('href="/production-launch"');
    expect(siteIndexUrls).toContain("/production-launch");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/production-launch");
  });
});
