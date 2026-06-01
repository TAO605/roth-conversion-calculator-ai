import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

function writeDraft(content: string): string {
  const filePath = path.join(os.tmpdir(), `blog-seo-review-${randomUUID()}.md`);
  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

function makeWords(count: number): string {
  return Array.from({ length: count }, (_, index) => `planning${index}`).join(" ");
}

function runReview(filePath: string, keyword = "Roth conversion calculator") {
  const output = execFileSync(
    process.execPath,
    ["scripts/blog-seo-review.mjs", "--file", filePath, "--keyword", keyword],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );

  return JSON.parse(output) as {
    keywordDensity: number;
    keywordOccurrences: number;
    ok: boolean;
    preferredReady: boolean;
    wordCount: number;
    hardChecks: Array<{ id: string; passed: boolean }>;
    manualReview: Array<{ id: string; passed: boolean }>;
    semanticSummary: {
      paragraphCount: number;
      strongPhraseCount: number;
      validHeadingHierarchy: boolean;
    };
  };
}

describe("blog SEO review command", () => {
  it("passes a user-owned draft that satisfies hard on-page SEO checks", () => {
    const draft = writeDraft(`# Roth Conversion Calculator Guide

Roth conversion calculator planning starts with a clear educational scope and a careful review of taxable income.

## Roth Conversion Calculator Checklist

![Calculator inputs](calculator-inputs.png)

${makeWords(820)}

Roth conversion calculator review should stay educational and assumption-based before a professional tax review.
`);

    const result = runReview(draft);

    expect(result.ok).toBe(true);
    expect(result.wordCount).toBeGreaterThanOrEqual(800);
    expect(result.hardChecks.every((check) => check.passed)).toBe(true);
    expect(result.semanticSummary.paragraphCount).toBeGreaterThan(0);
    expect(result.semanticSummary.validHeadingHierarchy).toBe(true);
  });

  it("fails hard checks for missing keyword placement, duplicate H1s, short body, and empty image alt text", () => {
    const draft = writeDraft(`# Different Topic

# Second H1

Short draft.

## Outline

![](missing-alt.png)
`);

    expect(() =>
      execFileSync(process.execPath, ["scripts/blog-seo-review.mjs", "--file", draft, "--keyword", "Roth conversion calculator"], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ).toThrow();
  });

  it("exposes density and preferred word count as manual review signals", () => {
    const draft = writeDraft(`# Roth Conversion Calculator Review

Roth conversion calculator users need a natural draft.

## Roth Conversion Calculator Review Steps

![Review packet](review-packet.png)

${makeWords(820)}

Roth conversion calculator output should be reviewed before decisions.
`);

    const result = runReview(draft);
    const densityCheck = result.manualReview.find((check) => check.id === "keyword_density_review");
    const preferredWordCheck = result.manualReview.find((check) => check.id === "preferred_blog_word_count");

    expect(result.ok).toBe(true);
    expect(result.keywordOccurrences).toBe(4);
    expect(result.keywordDensity).toBeGreaterThan(0);
    expect(densityCheck).toBeDefined();
    expect(preferredWordCheck).toBeDefined();
  });

  it("registers the package script for draft review without touching blog body content", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/blog-seo-review.mjs"), "utf8");

    expect(packageJson.scripts["seo:blog-review"]).toBe("node scripts/blog-seo-review.mjs");
    expect(script).toContain("keyword_first_100_words");
    expect(script).toContain("keyword_final_100_words");
    expect(script).toContain("keyword_density_review");
    expect(script).toContain("image_alt_text");
    expect(script).toContain("heading_hierarchy");
    expect(script).toContain("paragraph_text_structure");
    expect(script).toContain("h2_outline_review");
  });

  it("handles UTF-8 BOM drafts from Windows writing tools", () => {
    const draft = writeDraft(`\uFEFF# Roth Conversion Calculator Draft

Roth conversion calculator review should still recognize the first heading when a writing tool saves a BOM.

## Roth Conversion Calculator Details

![Draft worksheet](draft.png)

${makeWords(820)}

Roth conversion calculator review remains educational.
`);

    const result = runReview(draft);

    expect(result.ok).toBe(true);
    expect(result.hardChecks.find((check) => check.id === "single_h1")?.passed).toBe(true);
  });

  it("fails skipped heading levels while exposing paragraph and strong semantic evidence", () => {
    const draft = writeDraft(`# Roth Conversion Calculator Draft

Roth conversion calculator review starts with a paragraph and **educational estimate** language.

### Skipped Heading

![Draft worksheet](draft.png)

${makeWords(820)}

Roth conversion calculator review remains educational.
`);

    expect(() =>
      execFileSync(process.execPath, ["scripts/blog-seo-review.mjs", "--file", draft, "--keyword", "Roth conversion calculator"], {
        cwd: process.cwd(),
        encoding: "utf8",
      }),
    ).toThrow();

    const fixedDraft = writeDraft(`# Roth Conversion Calculator Draft

Roth conversion calculator review starts with a paragraph and **educational estimate** language.

## Roth Conversion Calculator Outline

### Nested Review Detail

![Draft worksheet](draft.png)

${makeWords(820)}

Roth conversion calculator review remains educational.
`);
    const result = runReview(fixedDraft);

    expect(result.ok).toBe(true);
    expect(result.semanticSummary.paragraphCount).toBeGreaterThanOrEqual(2);
    expect(result.semanticSummary.strongPhraseCount).toBe(1);
    expect(result.manualReview.find((check) => check.id === "paragraph_text_structure")?.passed).toBe(true);
  });
});
