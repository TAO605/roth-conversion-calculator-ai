import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO smoke script", () => {
  it("exposes a repeatable production SEO smoke command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/seo-smoke.mjs"), "utf8");

    expect(packageJson.scripts["seo:smoke"]).toBe("node scripts/seo-smoke.mjs");
    expect(script).toContain("SEO_SMOKE_BASE_URL");
    expect(script).toContain("https://www.roth-conversion-calculator-ai.shop");
    expect(script).toContain("/robots.txt");
    expect(script).toContain("/sitemap.xml");
    expect(script).toContain("/llms.txt");
    expect(script).toContain("rel=[\"']canonical");
    expect(script).toContain("100%\\s+accurate");
    expect(script).toContain("you should convert");
    expect(script).toContain("strongly recommend");
    expect(script).toContain("optimal for you");
  });
});
