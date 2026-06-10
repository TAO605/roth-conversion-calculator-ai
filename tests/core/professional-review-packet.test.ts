import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import {
  buildProfessionalReviewPacketSections,
  getProfessionalReviewPacketSummary,
} from "@/content/professional-review-packet";
import { buildSiteIndexGroups } from "@/content/site-index";
import { buildLlmsText } from "@/core/seo/llms";

describe("professional review packet", () => {
  it("builds a review packet with pending status, model scope, limits, and production evidence", () => {
    const sections = buildProfessionalReviewPacketSections();
    const summary = getProfessionalReviewPacketSummary(sections);
    const labels = sections.flatMap((section) => section.items.map((item) => item.label));

    expect(sections.map((section) => section.id)).toEqual(
      expect.arrayContaining([
        "review-status",
        "calculation-scope",
        "not-modeled",
        "source-data",
        "seo-evidence",
        "review-handoff",
      ]),
    );
    expect(labels).toContain("Current status");
    expect(labels).toContain("Federal bracket estimate");
    expect(labels).toContain("IRMAA");
    expect(labels).toContain("ACA premium tax credits");
    expect(labels).toContain("Social Security, NIIT, AMT, and RMD");
    expect(labels).toContain("Production SEO artifact");
    expect(labels).toContain("Stop condition");
    expect(summary.pendingReviewRetained).toBe(true);
    expect(summary.itemCount).toBeGreaterThanOrEqual(15);
    expect(summary.evidenceTypes).toContain("professional-review-packet-evidence-result.json");

    const packetText = sections
      .flatMap((section) => [section.title, section.goal, ...section.items.flatMap((entry) => [entry.evidence, entry.detail])])
      .join("\n");

    expect(packetText).toContain("Bounded Preview And Review Limits");
    expect(packetText).toContain("bounded 2026 Part B and Part D IRMAA proxy previews");
    expect(packetText).toContain("APTC at-stake preview");
    expect(packetText).toContain("bounded Social Security taxable-benefit, NIIT, AMT exposure, and Uniform Lifetime RMD previews");
    expect(packetText).toContain("does not model every state exclusion");
    expect(packetText).not.toContain("does not calculate premium changes");
    expect(packetText).not.toContain("does not calculate premium tax credit changes");
  });

  it("exposes the packet through sitemap, site index, llms.txt, and structured data monitoring", () => {
    const urls = sitemap().map((entry) => entry.url);
    const siteIndexUrls = buildSiteIndexGroups().flatMap((group) => group.links.map((link) => link.href));
    const llmsText = buildLlmsText(blogPosts);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/professional-review-packet/page.tsx"), "utf8");
    const structuredDataEvidence = fs.readFileSync(
      path.join(process.cwd(), "scripts/structured-data-evidence.mjs"),
      "utf8",
    );

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/professional-review-packet");
    expect(siteIndexUrls).toContain("/professional-review-packet");
    expect(llmsText).toContain("https://www.roth-conversion-calculator-ai.shop/professional-review-packet");
    expect(pageFile).toContain("contentWebPageJsonLd");
    expect(pageFile).toContain("Tax professional review pending");
    expect(structuredDataEvidence).toContain("/professional-review-packet");
  });

  it("adds an evidence command and CI artifact coverage for the review packet", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");
    const validator = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence.mjs"), "utf8");
    const manifest = fs.readFileSync(path.join(process.cwd(), "scripts/generate-seo-evidence-manifest.mjs"), "utf8");
    const manifestValidator = fs.readFileSync(
      path.join(process.cwd(), "scripts/validate-seo-evidence-manifest.mjs"),
      "utf8",
    );

    expect(packageJson.scripts["seo:professional-review-packet"]).toBe(
      "node scripts/professional-review-packet-evidence.mjs",
    );
    expect(workflow).toContain("Run professional review packet evidence check");
    expect(workflow).toContain(
      "node scripts/professional-review-packet-evidence.mjs | tee professional-review-packet-evidence-result.json",
    );
    expect(workflow).toContain("professional-review-packet-evidence-result.json");
    expect(validator).toContain("validateProfessionalReviewPacketEvidence");
    expect(validator).toContain("professionalReviewPacketOk");
    expect(
      fs.readFileSync(path.join(process.cwd(), "scripts/professional-review-packet-evidence.mjs"), "utf8"),
    ).toContain("Bounded Preview And Review Limits");
    expect(manifest).toContain("professional-review-packet-evidence-result.json");
    expect(manifest).toContain("2026-06-08.2");
    expect(manifestValidator).toContain("professional-review-packet-evidence-result.json");
    expect(manifestValidator).toContain("2026-06-08.2");
  });
});
