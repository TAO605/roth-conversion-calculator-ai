import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

function writeDraft(content: string): string {
  const filePath = path.join(os.tmpdir(), `blog-publication-readiness-${randomUUID()}.md`);
  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

function makeWords(count: number): string {
  return Array.from({ length: count }, (_, index) => `planning${index}`).join(" ");
}

function runReady(filePath: string) {
  const output = execFileSync(
    process.execPath,
    ["scripts/blog-publication-readiness.mjs", "--file", filePath, "--keyword", "Roth conversion calculator"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );

  return JSON.parse(output) as {
    evidenceType: string;
    keyword: string;
    manualReviewRequired: boolean;
    ok: boolean;
    publicationStatus: string;
    review: { ok: boolean; hardChecks: Array<{ id: string; passed: boolean }> };
    validation: { hardCheckCount: number; semanticSummary: { validHeadingHierarchy: boolean }; wordCount: number };
  };
}

function runReadyWithOutput(filePath: string, outputPath: string) {
  const output = execFileSync(
    process.execPath,
    [
      "scripts/blog-publication-readiness.mjs",
      "--file",
      filePath,
      "--keyword",
      "Roth conversion calculator",
      "--output",
      outputPath,
    ],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );

  return JSON.parse(output) as ReturnType<typeof runReady> & { outputPath: string };
}

describe("blog publication readiness command", () => {
  it("runs review and validation in one command for user-written drafts", () => {
    const draft = writeDraft(`# Roth Conversion Calculator Guide

Roth conversion calculator planning starts with a clear paragraph and **educational estimate** language.

## Roth Conversion Calculator Checklist

![Calculator inputs](calculator-inputs.png)

${makeWords(1500)}

Roth conversion calculator review should stay educational and assumption-based before a professional tax review.
`);

    const result = runReady(draft);

    expect(result.evidenceType).toBe("blog-publication-readiness");
    expect(result.ok).toBe(true);
    expect(result.keyword).toBe("Roth conversion calculator");
    expect(result.manualReviewRequired).toBe(true);
    expect(result.publicationStatus).toBe("manual-review-required");
    expect(result.review.ok).toBe(true);
    expect(result.validation.hardCheckCount).toBeGreaterThanOrEqual(8);
    expect(result.validation.wordCount).toBeGreaterThanOrEqual(800);
    expect(result.validation.semanticSummary.validHeadingHierarchy).toBe(true);
  });

  it("marks drafts ready for publication only when manual review signals pass too", () => {
    const repeatedKeyword = Array.from({ length: 8 }, () => "Roth conversion calculator").join(" ");
    const draft = writeDraft(`# Roth Conversion Calculator Guide

Roth conversion calculator planning starts with a clear paragraph and **educational estimate** language.

## Roth Conversion Calculator Strategy

${makeWords(750)}

## Roth Conversion Calculator Review

${makeWords(750)}

${repeatedKeyword}

![Calculator inputs](calculator-inputs.png)

Roth conversion calculator review should stay educational and assumption-based before a professional tax review.
`);

    const result = runReady(draft);

    expect(result.ok).toBe(true);
    expect(result.manualReviewRequired).toBe(false);
    expect(result.publicationStatus).toBe("ready-for-publication");
  });

  it("can write the readiness JSON evidence to an output file", () => {
    const evidencePath = path.join(os.tmpdir(), `blog-ready-evidence-${randomUUID()}`, "ready.json");
    const draft = writeDraft(`# Roth Conversion Calculator Guide

Roth conversion calculator planning starts with a clear paragraph and **educational estimate** language.

## Roth Conversion Calculator Checklist

![Calculator inputs](calculator-inputs.png)

${makeWords(1500)}

Roth conversion calculator review should stay educational and assumption-based before a professional tax review.
`);

    const result = runReadyWithOutput(draft, evidencePath);
    const saved = JSON.parse(fs.readFileSync(evidencePath, "utf8")) as typeof result;

    expect(result.ok).toBe(true);
    expect(result.outputPath).toBe(path.resolve(evidencePath));
    expect(saved.outputPath).toBe(path.resolve(evidencePath));
    expect(saved.publicationStatus).toBe("manual-review-required");
    expect(saved.validation.semanticSummary.validHeadingHierarchy).toBe(true);
  });

  it("fails when the retained hard-check rules would fail", () => {
    const draft = writeDraft(`# Roth Conversion Calculator Guide

Roth conversion calculator planning starts here.

### Skipped heading

${makeWords(820)}

Roth conversion calculator review should stay educational.
`);

    expect(() => runReady(draft)).toThrow();
  });

  it("registers the package script and documents the command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflowDoc = fs.readFileSync(
      path.join(process.cwd(), "docs/product/blog-authoring-seo-review-workflow.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:blog-ready"]).toBe("node scripts/blog-publication-readiness.mjs");
    expect(workflowDoc).toContain("npm run seo:blog-ready");
    expect(workflowDoc).toContain("--output blog-ready-result.json");
  });
});
