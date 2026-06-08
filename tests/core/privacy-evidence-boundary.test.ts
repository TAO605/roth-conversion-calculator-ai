import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("privacy evidence sync boundary", () => {
  it("ships an operations command for private evidence boundary checks", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/privacy-evidence-boundary.mjs"), "utf8");

    expect(packageJson.scripts["ops:privacy-evidence-boundary"]).toBe("node scripts/privacy-evidence-boundary.mjs");
    expect(script).toContain("privacy-evidence-sync-boundary");
    expect(script).toContain("docs/evidence");
    expect(script).toContain("remotePrivateEvidenceApprovedOnly");
    expect(script).toContain("private-evidence-sync-allowlist.json");
    expect(script).toContain("unapprovedRemotePrivateEvidencePaths");
    expect(script).toContain("localPrivateEvidenceCount");
    expect(script).toContain("GitHub tree request");
    expect(script).toContain("Local GSC screenshots may be kept for owner review");
  });

  it("ships a dry-run cleanup plan before deleting public GitHub evidence screenshots", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/privacy-evidence-cleanup-plan.mjs"), "utf8");

    expect(packageJson.scripts["ops:privacy-evidence-cleanup-plan"]).toBe(
      "node scripts/privacy-evidence-cleanup-plan.mjs",
    );
    expect(script).toContain("privacy-evidence-cleanup-plan");
    expect(script).toContain("dry-run only");
    expect(script).toContain("Explicit user confirmation is required");
    expect(script).toContain("cleanupComplete");
    expect(script).toContain("cleanupCandidates");
    expect(script).toContain("retainedApprovedPaths");
    expect(script).not.toContain("DELETE");
  });

  it("keeps local account UI screenshots ignored by default", () => {
    const gitignore = fs.readFileSync(path.join(process.cwd(), ".gitignore"), "utf8");

    expect(gitignore).toContain("docs/evidence/*.png");
    expect(gitignore).toContain("docs/evidence/*.jpg");
    expect(gitignore).toContain("docs/evidence/*.jpeg");
  });

  it("does not add local evidence images to any explicit GitHub sync allowlist", () => {
    const progress = fs.readFileSync(path.join(process.cwd(), "PROGRESS.md"), "utf8");
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/privacy-evidence-boundary.mjs"), "utf8");

    expect(script).not.toContain("docs/evidence/gsc-discovered-validation-final-2026-06-06.png");
    expect(progress).toContain("the screenshot is not synced because it contains visible account UI");
  });

  it("allowlists only screenshots with an explicit recorded approval source", () => {
    const allowlist = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "docs/private-evidence-sync-allowlist.json"), "utf8"),
    );
    const paths = allowlist.allowedPaths.map((entry: { path: string }) => entry.path);

    expect(paths).toEqual([
      "docs/evidence/gsc-homepage-indexed-result.png",
      "docs/evidence/gsc-homepage-live-faq-result.png",
    ]);
    expect(JSON.stringify(allowlist)).toContain("PROGRESS.md Round 111");
    expect(JSON.stringify(allowlist)).not.toContain("gsc-performance-zero-data-2026-06-06.png");
    expect(JSON.stringify(allowlist)).not.toContain("gsc-index-pages-overview-2026-06-06.png");
    expect(JSON.stringify(allowlist)).not.toContain("gsc-discovered-not-indexed-detail-2026-06-06.png");
  });
});
