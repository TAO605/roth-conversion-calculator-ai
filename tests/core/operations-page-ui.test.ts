import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const operationsPages = [
  "src/app/accessibility-audit/page.tsx",
  "src/app/ai-compliance-audit/page.tsx",
  "src/app/content-operations/page.tsx",
  "src/app/feedback-roadmap/page.tsx",
  "src/app/launch-readiness/page.tsx",
  "src/app/performance-audit/page.tsx",
  "src/app/privacy-data-flow/page.tsx",
  "src/app/production-launch/page.tsx",
  "src/app/seo-monitoring/page.tsx",
  "src/app/tax-data-update/page.tsx",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("operations page professional UI", () => {
  it("keeps audit and operations pages on plain bordered surfaces", () => {
    const source = operationsPages.map(readSource).join("\n");

    expect(source).not.toContain("backdrop-blur-xl");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("rounded-[22px]");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[18px]");
    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("bg-white/75");
    expect(source).not.toContain("bg-white/60");
    expect(source).toContain("rounded-lg border border-neutral-200 bg-white");
    expect(source).toContain("rounded-md border border-neutral-200 bg-white");
  });
});
