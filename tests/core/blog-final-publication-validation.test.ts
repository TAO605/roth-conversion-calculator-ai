import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

const BLOG_PATH = "/blog/what-is-a-roth-conversion-2026";

function writeJson(dir: string, name: string, payload: unknown) {
  const filePath = path.join(dir, name);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return filePath;
}

function buildPackage(publicationStatus = "ready-for-publication") {
  const readiness = {
    evidenceType: "blog-publication-readiness",
    ok: true,
    publicationStatus,
    review: { ok: true },
    validation: {
      linkSummary: {
        internalLinkCount: 1,
        officialSourceLinkCount: 1,
      },
      semanticSummary: {
        validHeadingHierarchy: true,
      },
    },
  };
  const smoke = {
    baseUrl: "https://www.roth-conversion-calculator-ai.shop",
    ok: true,
    results: [
      { check: "homepage", status: 200 },
      { check: "robots", status: 200 },
      { check: "sitemap", status: 200 },
      { check: "llms", status: 200 },
    ],
  };
  const structuredData = {
    ok: true,
    pages: [
      {
        forbiddenKeys: [],
        forbiddenTextMatches: [],
        path: BLOG_PATH,
        types: ["Article", "BreadcrumbList"],
      },
    ],
  };
  const blogDiscovery = {
    blogPostCount: 13,
    checks: {
      blogHub: { coveredCount: 13, status: 200 },
      llms: { coveredCount: 8, expectedMinimum: 8, status: 200 },
      rss: { coveredCount: 13, status: 200 },
      sitemap: { coveredCount: 13, status: 200 },
    },
    ok: true,
  };

  return { blogDiscovery, readiness, smoke, structuredData };
}

function runValidator(files: Record<string, string>, extraArgs: string[] = []) {
  const output = execFileSync(
    process.execPath,
    [
      "scripts/validate-blog-final-publication.mjs",
      "--path",
      BLOG_PATH,
      "--readiness",
      files.readiness,
      "--smoke",
      files.smoke,
      "--structured-data",
      files.structuredData,
      "--blog-discovery",
      files.blogDiscovery,
      ...extraArgs,
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  return JSON.parse(output);
}

describe("blog final publication validation", () => {
  it("validates the retained final publication package for an approved blog URL", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-final-${randomUUID()}-`));
    const payload = buildPackage();
    const files = {
      blogDiscovery: writeJson(dir, "blog-discovery-evidence-result.json", payload.blogDiscovery),
      readiness: writeJson(dir, "blog-ready-result.json", payload.readiness),
      smoke: writeJson(dir, "seo-smoke-result.json", payload.smoke),
      structuredData: writeJson(dir, "structured-data-evidence-result.json", payload.structuredData),
    };

    const result = runValidator(files);

    expect(result).toMatchObject({
      blogPostCount: 13,
      evidenceType: "blog-final-publication-validation",
      ok: true,
      path: BLOG_PATH,
      publicationStatus: "ready-for-publication",
    });
    expect(result.structuredDataTypes).toEqual(["Article", "BreadcrumbList"]);
  });

  it("requires explicit acceptance before publishing manual-review-required evidence", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-final-manual-${randomUUID()}-`));
    const payload = buildPackage("manual-review-required");
    const files = {
      blogDiscovery: writeJson(dir, "blog-discovery-evidence-result.json", payload.blogDiscovery),
      readiness: writeJson(dir, "blog-ready-result.json", payload.readiness),
      smoke: writeJson(dir, "seo-smoke-result.json", payload.smoke),
      structuredData: writeJson(dir, "structured-data-evidence-result.json", payload.structuredData),
    };

    expect(() => runValidator(files)).toThrow(/manual-review-required needs --manual-review-accepted/);

    const result = runValidator(files, ["--manual-review-accepted"]);

    expect(result).toMatchObject({
      manualReviewAccepted: true,
      ok: true,
      publicationStatus: "manual-review-required",
    });
  });

  it("registers the package script and documents the final validation command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflowDoc = fs.readFileSync(
      path.join(process.cwd(), "docs/product/blog-authoring-seo-review-workflow.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:blog-final-validate"]).toBe("node scripts/validate-blog-final-publication.mjs");
    expect(workflowDoc).toContain("seo:blog-final-validate");
  });
});
