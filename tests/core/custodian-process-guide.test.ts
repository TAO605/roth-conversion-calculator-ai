import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildCustodianProcessSteps, getCustodianProcessSummary } from "@/content/custodian-process-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion custodian process guide", () => {
  it("builds an educational workflow for custodian processing and record review", () => {
    const steps = buildCustodianProcessSteps();
    const summary = getCustodianProcessSummary(steps);
    const labels = steps.flatMap((step) => step.checkpoints.map((checkpoint) => checkpoint.label));

    expect(steps.map((step) => step.id)).toEqual(
      expect.arrayContaining(["pre-request", "request-submission", "processing-review", "tax-records", "post-process"]),
    );
    expect(labels).toContain("Confirm eligible source and destination accounts");
    expect(labels).toContain("Record whether taxes are paid from outside funds or withholding");
    expect(labels).toContain("Save the conversion confirmation number");
    expect(labels).toContain("Reconcile custodian records with Form 1099-R and Form 5498");
    expect(labels).toContain("Update the calculator scenario with actual processed amounts");
    expect(summary.totalCheckpoints).toBeGreaterThanOrEqual(12);
    expect(summary.reviewArtifacts).toEqual(
      expect.arrayContaining([
        "Account eligibility note",
        "Submitted conversion request",
        "Custodian confirmation",
        "Tax form reconciliation",
      ]),
    );
  });

  it("exposes the custodian process guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/roth-conversion-custodian-process/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-custodian-process");
    expect(pageFile).toContain("Roth Conversion Custodian Process Guide");
    expect(pageFile).toContain("buildCustodianProcessSteps");
    expect(homePage).toContain('href="/roth-conversion-custodian-process"');
    expect(siteIndexUrls).toContain("/roth-conversion-custodian-process");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-custodian-process");
  });
});
