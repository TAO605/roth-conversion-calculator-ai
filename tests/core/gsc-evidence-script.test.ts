import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("GSC evidence script", () => {
  it("exposes a repeatable priority URL evidence command for Search Console retries", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/gsc-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:gsc-evidence"]).toBe("node scripts/gsc-evidence.mjs");
    expect(script).toContain("GSC_EVIDENCE_BASE_URL");
    expect(script).toContain("https://www.roth-conversion-calculator-ai.shop");
    expect(script).toContain("/seo-monitoring");
    expect(script).toContain("/methodology");
    expect(script).toContain("/tax-data-update");
    expect(script).toContain("/tax-brackets/2026");
    expect(script).toContain("/roth-conversion-irmaa-guide");
    expect(script).toContain("rel=[\"']canonical");
    expect(script).toContain("sitemap.xml");
    expect(script).toContain("noindex");
    expect(script).toContain("priorityUrlCount");
    expect(script).toContain("minFreshLastmod");
    expect(script).toContain("2026-05-30");
    expect(script).toContain("freshnessCriticalPaths");
    expect(script).toContain("lastmodFresh");
  });

  it("keeps priority URL pages from inheriting the homepage canonical", () => {
    const methodologyPage = fs.readFileSync(path.join(process.cwd(), "src/app/methodology/page.tsx"), "utf8");

    expect(methodologyPage).toContain('canonical: "/methodology"');
  });

  it("requires fresh sitemap lastmod evidence for recently updated priority pages", () => {
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/gsc-evidence.mjs"), "utf8");

    expect(script).toContain('"/seo-monitoring"');
    expect(script).toContain('"/methodology"');
    expect(script).toContain('"/tax-data-update"');
    expect(script).toContain('"/tax-brackets/2026"');
    expect(script).toContain("sitemap lastmod");
    expect(script).toContain("is older than");
  });
});
