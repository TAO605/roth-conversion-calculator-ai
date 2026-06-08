import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("result actions layout", () => {
  it("keeps result actions responsive as the action set grows", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");
    const actionsIndex = source.indexOf('aria-label="Result actions"');
    const summaryIndex = source.indexOf("<ResultSummary result={result} />");
    const shareIndex = source.indexOf("<ShareResultButton input={input} />");
    const reportIndex = source.indexOf('<PdfReportButton input={input} result={result} />');
    const cpaIndex = source.indexOf("<CopyProfessionalHandoffButton input={input} result={result} />");
    const resetIndex = source.indexOf("<RotateCcw aria-hidden");

    expect(actionsIndex).toBeGreaterThan(-1);
    expect(summaryIndex).toBeGreaterThan(-1);
    expect(actionsIndex).toBeGreaterThan(summaryIndex);
    expect(source).toContain("mt-4 grid w-full min-w-0 grid-cols-2 gap-2 md:grid-cols-4");
    expect(source).toContain("[&>button]:w-full");
    expect(source).toContain('isFeatureEnabled("pdf-report")');
    expect(source).not.toContain("xl:flex");
    expect(shareIndex).toBeGreaterThan(actionsIndex);
    expect(reportIndex).toBeGreaterThan(shareIndex);
    expect(cpaIndex).toBeGreaterThan(reportIndex);
    expect(resetIndex).toBeGreaterThan(cpaIndex);
  });

  it("keeps dynamically loaded result action buttons from shifting the toolbar", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(source).toContain("function LazyActionButtonFallback");
    expect(source).toContain('<LazyActionButtonFallback label="Loading report..." />');
    expect(source).toContain('<LazyActionButtonFallback label="Loading CPA packet..." />');
    expect(source).not.toContain("{ loading: () => null },");
  });
});
