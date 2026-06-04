import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("professional UI evidence command", () => {
  it("keeps the source guard wired into the production SEO evidence artifact", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");
    const validator = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence.mjs"), "utf8");
    const manifest = fs.readFileSync(path.join(process.cwd(), "scripts/generate-seo-evidence-manifest.mjs"), "utf8");
    const evidenceScript = fs.readFileSync(path.join(process.cwd(), "scripts/professional-ui-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:professional-ui-evidence"]).toBe("node scripts/professional-ui-evidence.mjs");
    expect(workflow).toContain("node scripts/professional-ui-evidence.mjs | tee professional-ui-evidence-result.json");
    expect(workflow).toContain("professional-ui-evidence-result.json");
    expect(validator).toContain("validateProfessionalUiEvidence");
    expect(validator).toContain("professionalUiScannedFileCount");
    expect(manifest).toContain("professional-ui-evidence-result.json");
    expect(evidenceScript).toContain("professional-ui-source-guard");
    expect(evidenceScript).toContain("src/app");
    expect(evidenceScript).toContain("src/features");
  });
});
