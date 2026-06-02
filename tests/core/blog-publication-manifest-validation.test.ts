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

function buildFiles(dir: string) {
  return {
    blogDiscovery: writeJson(dir, "blog-discovery-evidence-result.json", { blogPostCount: 13, ok: true }),
    finalValidation: writeJson(dir, "blog-final-publication-result.json", {
      evidenceType: "blog-final-publication-validation",
      ok: true,
      path: BLOG_PATH,
      publicationStatus: "ready-for-publication",
      structuredDataTypes: ["Article", "BreadcrumbList"],
    }),
    readiness: writeJson(dir, "blog-ready-result.json", {
      evidenceType: "blog-publication-readiness",
      ok: true,
      publicationStatus: "ready-for-publication",
    }),
    smoke: writeJson(dir, "seo-smoke-result.json", { ok: true }),
    structuredData: writeJson(dir, "structured-data-evidence-result.json", { ok: true }),
  };
}

function runManifest(files: Record<string, string>, outputPath: string) {
  execFileSync(
    process.execPath,
    [
      "scripts/generate-blog-publication-manifest.mjs",
      "--path",
      BLOG_PATH,
      "--readiness",
      files.readiness,
      "--final",
      files.finalValidation,
      "--smoke",
      files.smoke,
      "--structured-data",
      files.structuredData,
      "--blog-discovery",
      files.blogDiscovery,
      "--output",
      outputPath,
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
}

function runValidator(manifestPath: string) {
  const output = execFileSync(
    process.execPath,
    ["scripts/validate-blog-publication-manifest.mjs", "--manifest", manifestPath],
    { cwd: process.cwd(), encoding: "utf8" },
  );

  return JSON.parse(output);
}

describe("blog publication manifest validation", () => {
  it("validates manifest file inventory, roles, byte counts, and hashes", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-manifest-validate-${randomUUID()}-`));
    const files = buildFiles(dir);
    const manifestPath = path.join(dir, "blog-publication-manifest.json");

    runManifest(files, manifestPath);
    const result = runValidator(manifestPath);

    expect(result).toMatchObject({
      evidenceType: "blog-publication-manifest-validation",
      fileCount: 5,
      ok: true,
      path: BLOG_PATH,
      publicationStatus: "ready-for-publication",
      requiredRoleCount: 5,
    });
  });

  it("fails when a retained evidence file changes after manifest generation", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-manifest-tamper-${randomUUID()}-`));
    const files = buildFiles(dir);
    const manifestPath = path.join(dir, "blog-publication-manifest.json");

    runManifest(files, manifestPath);
    fs.writeFileSync(files.smoke, `${JSON.stringify({ ok: false }, null, 2)}\n`, "utf8");

    expect(() => runValidator(manifestPath)).toThrow(/seo-smoke .* mismatch/);
  });

  it("registers the package script and documents the manifest validator command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflowDoc = fs.readFileSync(
      path.join(process.cwd(), "docs/product/blog-authoring-seo-review-workflow.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:blog-publication-manifest-validate"]).toBe(
      "node scripts/validate-blog-publication-manifest.mjs",
    );
    expect(workflowDoc).toContain("seo:blog-publication-manifest-validate");
  });
});
