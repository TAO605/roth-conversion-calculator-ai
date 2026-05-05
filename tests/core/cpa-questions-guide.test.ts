import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { buildCpaQuestionGroups, getCpaQuestionGuideSummary } from "@/content/cpa-questions-guide";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("Roth conversion CPA questions guide", () => {
  it("builds an educational question bank for professional Roth conversion review", () => {
    const groups = buildCpaQuestionGroups();
    const summary = getCpaQuestionGuideSummary(groups);
    const questions = groups.flatMap((group) => group.questions.map((question) => question.prompt));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["income-modeling", "basis-and-aggregation", "tax-payment", "tax-interactions", "filing-records"]),
    );
    expect(questions).toContain("How should I verify the taxable income estimate before adding conversion income?");
    expect(questions).toContain("Do my after-tax basis records and Form 8606 history support the calculator basis input?");
    expect(questions).toContain("Would withholding from the IRA change the amount converted or penalty assumptions?");
    expect(questions).toContain("Could the conversion affect IRMAA, ACA premium tax credits, NIIT, RMDs, or state tax items?");
    expect(questions).toContain("Which forms and custodian records should be saved after filing?");
    expect(summary.totalQuestions).toBeGreaterThanOrEqual(15);
    expect(summary.reviewTopics).toEqual(
      expect.arrayContaining(["Taxable income", "Basis records", "Tax payment method", "Tax interactions"]),
    );
  });

  it("exposes the CPA questions guide through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/roth-conversion-cpa-questions/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-cpa-questions");
    expect(pageFile).toContain("Roth Conversion CPA Questions Guide");
    expect(pageFile).toContain("buildCpaQuestionGroups");
    expect(homePage).toContain('href="/roth-conversion-cpa-questions"');
    expect(siteIndexUrls).toContain("/roth-conversion-cpa-questions");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/roth-conversion-cpa-questions");
  });
});
