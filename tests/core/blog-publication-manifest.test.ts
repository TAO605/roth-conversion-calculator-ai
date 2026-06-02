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

function buildEvidencePackage() {
  return {
    blogDiscovery: {
      blogPostCount: 13,
      ok: true,
    },
    finalValidation: {
      evidenceType: "blog-final-publication-validation",
      ok: true,
      path: BLOG_PATH,
      publicationStatus: "ready-for-publication",
      structuredDataTypes: ["Article", "BreadcrumbList"],
    },
    readiness: {
      evidenceType: "blog-publication-readiness",
      ok: true,
      publicationStatus: "ready-for-publication",
    },
    smoke: {
      ok: true,
    },
    structuredData: {
      ok: true,
    },
  };
}

function runManifest(files: Record<string, string>, outputPath: string, blogPath = BLOG_PATH) {
  const output = execFileSync(
    process.execPath,
    [
      "scripts/generate-blog-publication-manifest.mjs",
      "--path",
      blogPath,
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

  return JSON.parse(output);
}

describe("blog publication manifest", () => {
  it("writes a retained manifest for final blog publication evidence files", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-manifest-${randomUUID()}-`));
    const payload = buildEvidencePackage();
    const outputPath = path.join(dir, "blog-publication-manifest.json");
    const files = {
      blogDiscovery: writeJson(dir, "blog-discovery-evidence-result.json", payload.blogDiscovery),
      finalValidation: writeJson(dir, "blog-final-publication-result.json", payload.finalValidation),
      readiness: writeJson(dir, "blog-ready-result.json", payload.readiness),
      smoke: writeJson(dir, "seo-smoke-result.json", payload.smoke),
      structuredData: writeJson(dir, "structured-data-evidence-result.json", payload.structuredData),
    };

    const manifest = runManifest(files, outputPath);
    const saved = JSON.parse(fs.readFileSync(outputPath, "utf8"));

    expect(manifest).toMatchObject({
      artifactName: "blog-publication-package",
      blogPostCount: 13,
      evidenceType: "blog-publication-manifest",
      ok: true,
      outputPath,
      path: BLOG_PATH,
      publicationStatus: "ready-for-publication",
    });
    expect(saved.files).toHaveLength(5);
    expect(saved.files.map((file: { role: string }) => file.role)).toEqual([
      "readiness",
      "final-publication-validation",
      "seo-smoke",
      "structured-data",
      "blog-discovery",
    ]);
    expect(saved.files.every((file: { bytes: number; sha256: string }) => file.bytes > 0 && file.sha256.length === 64)).toBe(true);
  });

  it("fails when the final validation path does not match the requested blog path", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), `blog-manifest-path-${randomUUID()}-`));
    const payload = buildEvidencePackage();
    const files = {
      blogDiscovery: writeJson(dir, "blog-discovery-evidence-result.json", payload.blogDiscovery),
      finalValidation: writeJson(dir, "blog-final-publication-result.json", payload.finalValidation),
      readiness: writeJson(dir, "blog-ready-result.json", payload.readiness),
      smoke: writeJson(dir, "seo-smoke-result.json", payload.smoke),
      structuredData: writeJson(dir, "structured-data-evidence-result.json", payload.structuredData),
    };

    expect(() => runManifest(files, path.join(dir, "manifest.json"), "/blog/different-slug")).toThrow(
      /Final validation path must match manifest path/,
    );
  });

  it("registers the package script and documents the publication manifest command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const workflowDoc = fs.readFileSync(
      path.join(process.cwd(), "docs/product/blog-authoring-seo-review-workflow.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:blog-publication-manifest"]).toBe(
      "node scripts/generate-blog-publication-manifest.mjs",
    );
    expect(workflowDoc).toContain("seo:blog-publication-manifest");
  });
});
