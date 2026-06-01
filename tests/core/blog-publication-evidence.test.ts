import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

function writeJson(content: unknown): string {
  const filePath = path.join(os.tmpdir(), `blog-publication-evidence-${randomUUID()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");

  return filePath;
}

function validReviewEvidence() {
  return {
    emptyAltImageCount: 0,
    hardChecks: [
      { id: "keyword_first_100_words", passed: true },
      { id: "keyword_final_100_words", passed: true },
      { id: "minimum_word_count", passed: true },
      { id: "single_h1", passed: true },
      { id: "heading_hierarchy", passed: true },
      { id: "h1_contains_keyword", passed: true },
      { id: "h2_contains_keyword", passed: true },
      { id: "image_alt_text", passed: true },
    ],
    headingCounts: { h1: 1, h2: 3 },
    keyword: "Roth conversion calculator",
    keywordDensity: 2.4,
    keywordOccurrences: 12,
    manualReview: [
      { id: "preferred_blog_word_count", passed: true },
      { id: "keyword_density_review", passed: true },
      { id: "h2_outline_review", passed: true },
      { id: "paragraph_text_structure", passed: true },
      { id: "strong_emphasis_review", passed: true },
    ],
    ok: true,
    preferredReady: true,
    semanticSummary: {
      paragraphCount: 18,
      strongPhraseCount: 4,
      validHeadingHierarchy: true,
    },
    wordCount: 1550,
  };
}

function runValidation(filePath: string) {
  const output = execFileSync(process.execPath, ["scripts/validate-blog-publication-evidence.mjs", filePath], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  return JSON.parse(output) as {
    hardCheckCount: number;
    keyword: string;
    manualReviewCount: number;
    ok: boolean;
    preferredReady: boolean;
    semanticSummary: { paragraphCount: number; validHeadingHierarchy: boolean };
    wordCount: number;
  };
}

describe("blog publication evidence validator", () => {
  it("accepts retained blog review evidence with semantic checks", () => {
    const result = runValidation(writeJson(validReviewEvidence()));

    expect(result.ok).toBe(true);
    expect(result.keyword).toBe("Roth conversion calculator");
    expect(result.wordCount).toBe(1550);
    expect(result.hardCheckCount).toBeGreaterThanOrEqual(8);
    expect(result.manualReviewCount).toBeGreaterThanOrEqual(5);
    expect(result.semanticSummary.validHeadingHierarchy).toBe(true);
  });

  it("rejects evidence when a hard check failed", () => {
    const evidence = validReviewEvidence();
    evidence.hardChecks = evidence.hardChecks.map((check) =>
      check.id === "heading_hierarchy" ? { ...check, passed: false } : check,
    );

    expect(() => runValidation(writeJson(evidence))).toThrow();
  });

  it("registers the package script for publication evidence validation", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/validate-blog-publication-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:blog-evidence-validate"]).toBe("node scripts/validate-blog-publication-evidence.mjs");
    expect(script).toContain("semanticSummary");
    expect(script).toContain("heading_hierarchy");
    expect(script).toContain("paragraph_text_structure");
  });

  it("documents silent npm output so retained review evidence stays valid JSON", () => {
    const workflowDoc = fs.readFileSync(
      path.join(process.cwd(), "docs/product/blog-authoring-seo-review-workflow.md"),
      "utf8",
    );

    expect(workflowDoc).toContain("npm --silent run seo:blog-review");
    expect(workflowDoc).toContain("blog-review-result.json");
    expect(workflowDoc).toContain("npm run seo:blog-evidence-validate");
  });
});
