import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildContentOperationsGroups,
  getBlogFinalPublicationReview,
  getBlogDraftReviewWorkflow,
  getContentOperationsSummary,
} from "@/content/content-operations";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("content operations playbook", () => {
  it("builds an editorial workflow for long-term SEO operations", () => {
    const groups = buildContentOperationsGroups();
    const summary = getContentOperationsSummary(groups);
    const labels = groups.flatMap((group) => group.steps.map((step) => step.label));

    expect(groups.map((group) => group.id)).toEqual(
      expect.arrayContaining(["research", "production", "review", "publishing", "refresh"]),
    );
    expect(labels).toContain("Collect GSC query opportunities");
    expect(labels).toContain("Map keyword intent to page type");
    expect(labels).toContain("Run compliance copy review");
    expect(labels).toContain("Add internal links to calculator");
    expect(labels).toContain("Refresh declining pages");
    expect(summary.totalSteps).toBeGreaterThanOrEqual(12);
    expect(summary.outputs).toEqual(
      expect.arrayContaining(["Keyword brief", "Draft page", "Compliance review", "Internal link checklist"]),
    );
  });

  it("exposes content operations through sitemap, homepage, site index, and LLM discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/content-operations/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/content-operations");
    expect(pageFile).toContain("Content Operations Playbook");
    expect(pageFile).toContain("buildContentOperationsGroups");
    expect(homePage).toContain('href="/content-operations"');
    expect(siteIndexUrls).toContain("/content-operations");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/content-operations");
  });

  it("publishes the user-owned blog draft review gate without generating article copy", () => {
    const workflow = getBlogDraftReviewWorkflow();
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/content-operations/page.tsx"), "utf8");

    expect(workflow.command).toBe('npm run seo:blog-review -- --file path/to/draft.md --keyword "primary keyword"');
    expect(workflow.evidenceCommand).toBe("npm run seo:blog-evidence-validate -- blog-review-result.json");
    expect(workflow.readinessCommand).toBe(
      'npm run seo:blog-ready -- --file path/to/draft.md --keyword "primary keyword" --output blog-ready-result.json',
    );
    expect(workflow.ownershipBoundary).toContain("user writes or approves the blog article body");
    expect(workflow.hardChecks).toEqual(
      expect.arrayContaining([
        "Primary keyword appears within the first 100 words.",
        "Primary keyword appears within the final 100 words.",
        "Draft has at least 800 words.",
        "Exactly one H1 appears on the page.",
        "Heading levels do not skip from H1 directly to H3 or deeper.",
        "Every uploaded image includes descriptive alt text.",
        "Draft avoids personalized recommendations, best/optimal claims, guarantees, fake ratings, risk-free claims, and 100% accuracy claims.",
        "Draft includes at least one internal link to the calculator or a relevant supporting guide.",
        "Draft includes at least one official source link for tax, Medicare, ACA, Social Security, or government rule context.",
      ]),
    );
    expect(workflow.manualReview).toEqual(
      expect.arrayContaining([
        "1,500+ words is preferred for blog articles when the topic supports it.",
        "Keyword density target is reviewed as 2% to 4% without keyword stuffing.",
        "Normal body text is represented as paragraphs, not oversized heading text.",
        "Additional tax, Medicare, ACA, IRS, and state-tax claims stay source-aligned and educational beyond the required official source link.",
      ]),
    );
    expect(workflow.publicationDuties.join(" ")).toContain("Article JSON-LD");
    expect(workflow.publicationDuties.join(" ")).toContain("validate the blog review JSON evidence");
    expect(workflow.publicationDuties.join(" ")).toContain("one-step readiness command");
    expect(workflow.publicationDuties.join(" ")).toContain("manual-review-required");
    expect(workflow.publicationDuties.join(" ")).toContain("SEO smoke");
    expect(pageFile).toContain("Blog Draft SEO Review");
    expect(pageFile).toContain("evidenceCommand");
    expect(pageFile).toContain("readinessCommand");
    expect(pageFile).toContain("getBlogDraftReviewWorkflow");
  });

  it("exposes a final publication review gate before AI publishes user-owned blog articles", () => {
    const finalReview = getBlogFinalPublicationReview();
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/content-operations/page.tsx"), "utf8");

    expect(finalReview.title).toBe("Final publication review");
    expect(finalReview.goal).toContain("after the user finishes or approves the article body");
    expect(finalReview.validationCommand).toContain("npm run seo:blog-final-validate");
    expect(finalReview.validationCommand).toContain("--path /blog/approved-slug");
    expect(finalReview.validationCommand).toContain("--output blog-final-publication-result.json");
    expect(finalReview.requiredEvidence).toEqual(
      expect.arrayContaining([
        "`blog-ready-result.json` with `ok: true` and a reviewed publication status.",
        "`blog-final-publication-result.json` retained after final package validation.",
        "Post-deploy production evidence from SEO smoke, structured-data evidence, blog discovery evidence, sitemap, RSS, and llms.txt.",
      ]),
    );
    expect(finalReview.stopConditions).toEqual(
      expect.arrayContaining([
        "The article body has not been written or approved by the user.",
        "`publicationStatus` is `manual-review-required` and the remaining manual signals have not been accepted.",
        "The draft uses personalized tax advice, best/optimal claims, guarantees, fake ratings, risk-free claims, or 100% accuracy claims.",
      ]),
    );
    expect(finalReview.publishCriteria.join(" ")).toContain("user-approved body is the source of truth");
    expect(finalReview.publishCriteria.join(" ")).toContain("Article and BreadcrumbList");
    expect(pageFile).toContain("getBlogFinalPublicationReview");
    expect(pageFile).toContain("Final release gate");
    expect(pageFile).toContain("validationCommand");
    expect(pageFile).toContain("Required evidence");
    expect(pageFile).toContain("Stop conditions");
    expect(pageFile).toContain("Publish criteria");
  });
});
