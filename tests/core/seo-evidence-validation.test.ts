import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO evidence artifact validation", () => {
  it("exposes a local validator for uploaded production SEO evidence files", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/validate-seo-evidence.mjs"), "utf8");
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");

    expect(packageJson.scripts["seo:evidence-validate"]).toBe("node scripts/validate-seo-evidence.mjs");
    expect(script).toContain("seo-smoke-result.json");
    expect(script).toContain("gsc-evidence-result.json");
    expect(script).toContain("lastmodFresh");
    expect(script).toContain("priorityUrlCount");
    expect(script).toContain("hasUtf16Bom");
    expect(script).toContain("utf16le");
    expect(script).toContain("/seo-monitoring");
    expect(script).toContain("/tax-brackets/2026");
    expect(script).toContain("must contain a single JSON object");
    expect(workflow).toContain("Validate SEO evidence artifact");
    expect(workflow).toContain("npm run seo:evidence-validate");
  });

  it("keeps the uploaded artifact files aligned with validator defaults", () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");

    expect(workflow).toContain("node scripts/seo-smoke.mjs | tee seo-smoke-result.json");
    expect(workflow).toContain("node scripts/gsc-evidence.mjs | tee gsc-evidence-result.json");
    expect(workflow).toContain("seo-smoke-result.json");
    expect(workflow).toContain("gsc-evidence-result.json");
    expect(workflow).toContain("name: production-seo-evidence");
    expect(workflow).toContain("retention-days: 30");
  });
});
