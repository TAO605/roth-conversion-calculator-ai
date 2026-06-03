import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const hubPages = [
  "src/app/age-scenarios/page.tsx",
  "src/app/basis/page.tsx",
  "src/app/calculators/page.tsx",
  "src/app/examples/page.tsx",
  "src/app/filing-status/page.tsx",
  "src/app/glossary/page.tsx",
  "src/app/multi-year-planning/page.tsx",
  "src/app/release-notes/page.tsx",
  "src/app/site-index/page.tsx",
  "src/app/states/page.tsx",
  "src/app/tax-interactions/page.tsx",
  "src/app/tax-payment-methods/page.tsx",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("content hub page professional UI", () => {
  it("keeps index and hub cards on plain bordered surfaces", () => {
    const source = hubPages.map(readSource).join("\n");

    expect(source).not.toContain("backdrop-blur-xl");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("hover:-translate-y");
    expect(source).not.toContain("rounded-[22px]");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[18px]");
    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("bg-white/75");
    expect(source).not.toContain("bg-white/70");
    expect(source).not.toContain("bg-white/60");
    expect(source).toContain("rounded-lg border border-neutral-200 bg-white");
  });
});
