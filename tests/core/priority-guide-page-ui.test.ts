import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const priorityGuidePages = [
  "src/app/calculator-assumptions-guide/page.tsx",
  "src/app/cpa-review-checklist/page.tsx",
  "src/app/roth-conversion-5-year-rules/page.tsx",
  "src/app/roth-conversion-aca-premium-tax-credit-guide/page.tsx",
  "src/app/roth-conversion-capital-gains-guide/page.tsx",
  "src/app/roth-conversion-cpa-questions/page.tsx",
  "src/app/roth-conversion-custodian-process/page.tsx",
  "src/app/roth-conversion-estimated-tax-guide/page.tsx",
  "src/app/roth-conversion-irmaa-guide/page.tsx",
  "src/app/roth-conversion-mistakes/page.tsx",
  "src/app/roth-conversion-niit-guide/page.tsx",
  "src/app/roth-conversion-planning-checklist/page.tsx",
  "src/app/roth-conversion-qcd-guide/page.tsx",
  "src/app/roth-conversion-recharacterization-guide/page.tsx",
  "src/app/roth-conversion-rmd-guide/page.tsx",
  "src/app/roth-conversion-social-security-tax-guide/page.tsx",
  "src/app/roth-conversion-tax-forms/page.tsx",
  "src/app/roth-conversion-timeline/page.tsx",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("priority guide page professional UI", () => {
  it("keeps YMYL guide pages on plain bordered review surfaces", () => {
    const source = priorityGuidePages.map(readSource).join("\n");

    expect(source).not.toContain("backdrop-blur-xl");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("hover:-translate-y");
    expect(source).not.toContain("rounded-[22px]");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[18px]");
    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("bg-white/75");
    expect(source).not.toContain("bg-white/70");
    expect(source).not.toContain("bg-white/60");
    expect(source).toContain("rounded-lg border border-neutral-200 bg-white");
    expect(source).toContain("rounded-md border border-neutral-200 bg-white");
  });
});
