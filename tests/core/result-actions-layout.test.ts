import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("result actions layout", () => {
  it("keeps result actions responsive as the action set grows", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");
    const actionsIndex = source.indexOf('aria-label="Result actions"');
    const shareIndex = source.indexOf("<ShareResultButton input={input} />");
    const reportIndex = source.indexOf("<PdfReportButton input={input} result={result} />");
    const cpaIndex = source.indexOf("<CopyProfessionalHandoffButton input={input} result={result} />");
    const resetIndex = source.indexOf("<RotateCcw aria-hidden");

    expect(actionsIndex).toBeGreaterThan(-1);
    expect(source).toContain("grid w-full min-w-0 grid-cols-1");
    expect(source).toContain("sm:grid-cols-2");
    expect(source).toContain("xl:flex");
    expect(source).toContain("[&>button]:w-full");
    expect(shareIndex).toBeGreaterThan(actionsIndex);
    expect(reportIndex).toBeGreaterThan(shareIndex);
    expect(cpaIndex).toBeGreaterThan(reportIndex);
    expect(resetIndex).toBeGreaterThan(cpaIndex);
  });
});
