import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("homepage no-AI professional UI pass", () => {
  it("removes glass and oversized template styling from shared primitives", () => {
    const source = [
      readSource("src/common/ui/card.tsx"),
      readSource("src/common/ui/button.tsx"),
      readSource("src/common/ui/field.tsx"),
    ].join("\n");

    expect(source).not.toContain("backdrop-blur");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("active:scale");
    expect(source).not.toContain("focus:ring-4");
    expect(source).toContain("bg-[#0A2463]");
  });

  it("keeps the homepage focused on the calculator rather than AI branding or marketing hero copy", () => {
    const source = readSource("src/app/page.tsx");

    expect(source).toContain("Roth Conversion Calculator 2026");
    expect(source).not.toContain("Start calculating");
    expect(source).not.toContain("Review explanation");
    expect(source).not.toContain("AI-powered 2026 estimate");
    expect(source).not.toContain("AI Roth Conversion Calculator");
    expect(source).not.toContain("Ask AI after results");
  });

  it("uses the adapted 40/60 calculator/result split", () => {
    const source = readSource("src/app/HomeCalculatorClient.tsx");

    expect(source).toContain("lg:grid-cols-5");
    expect(source).toContain("lg:col-span-2");
    expect(source).toContain("lg:col-span-3");
  });

  it("formats primary result values like a financial worksheet", () => {
    const source = readSource("src/features/result-summary/ResultSummary.tsx");

    expect(source).toContain("font-mono");
    expect(source).toContain("text-[32px]");
    expect(source).not.toContain("bg-blue-500/10");
    expect(source).not.toContain("shadow-sm");
  });
});
