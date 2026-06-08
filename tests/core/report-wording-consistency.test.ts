import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const currentContentFiles = [
  "src/content/privacy-data-flow.ts",
  "src/app/privacy-data-flow/page.tsx",
  "src/core/seo/llms.ts",
  "src/content/cpa-review-checklist.ts",
  "src/content/tax-forms-guide.ts",
  "src/content/estimated-tax-guide.ts",
  "src/content/custodian-process-guide.ts",
  "src/content/common-mistakes-guide.ts",
  "src/content/professional-review-packet.ts",
  "src/content/cpa-questions-guide.ts",
  "src/content/recharacterization-guide.ts",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("report wording consistency", () => {
  it("describes the current export as a print-ready report instead of a direct PDF file", () => {
    const source = currentContentFiles.map(readSource).join("\n");

    expect(source).toContain("Print-ready calculator report");
    expect(source).toContain("Downloaded HTML report");
    expect(source).not.toMatch(/\bCalculator PDF\b/);
    expect(source).not.toMatch(/\bPDF exports\b/);
    expect(source).not.toMatch(/\bDownloaded PDF\b/);
  });
});
