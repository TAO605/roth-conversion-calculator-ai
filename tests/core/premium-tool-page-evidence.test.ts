import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildPremiumToolPageEvidence } from "../../scripts/premium-tool-page-evidence.mjs";

describe("premium tool page evidence", () => {
  it("exposes a command for keyword landing page readiness", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(packageJson.scripts["seo:premium-tool-page"]).toBe("node scripts/premium-tool-page-evidence.mjs");
  });

  it("requires existing keyword pages to include sample result previews", () => {
    const evidence = buildPremiumToolPageEvidence(process.cwd());

    expect(evidence.ok).toBe(true);
    expect(evidence.findings).toEqual([]);
    expect(evidence.counts.slugCount).toBe(8);
    expect(evidence.counts.sampleScenarioCount).toBe(8);
    expect(evidence.counts.resultFocusCount).toBe(8);
  });
});
