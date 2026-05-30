import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO smoke workflow", () => {
  it("runs the production SEO smoke command after deploy-oriented triggers", () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");

    expect(workflow).toContain("name: SEO Smoke");
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("- main");
    expect(workflow).toContain("schedule:");
    expect(workflow).toContain('cron: "17 9 * * *"');
    expect(workflow).toContain("SEO_SMOKE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("uses: actions/setup-node@v4");
    expect(workflow).toContain("node-version: 22");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("sleep 90");
    expect(workflow).toContain("npm run seo:smoke");
  });
});
