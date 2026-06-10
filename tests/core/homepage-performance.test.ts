import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("homepage performance boundaries", () => {
  it("lazy-loads non-critical homepage modules instead of statically bundling them", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const calculatorClient = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(homePage).not.toContain('"use client"');
    expect(homePage).toContain("HomeCalculatorClient");
    expect(calculatorClient).toContain('"use client"');
    expect(calculatorClient).toContain('from "next/dynamic"');
    expect(calculatorClient).toContain("LazyPanelFallback");
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/charts\/ProjectionChart"\)/);
    expect(calculatorClient).toContain('isFeatureEnabled("projection-chart")');
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/ai-assistant\/AiExplainer"\)/);
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/calculation-breakdown\/CalculationBreakdown"\)/);
    expect(calculatorClient).toContain('isFeatureEnabled("calculation-breakdown")');
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/pdf-report\/PdfReportButton"\)/);
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/analytics\/CalculatorAnalyticsBeacon"\)/);

    expect(calculatorClient).not.toContain('import { ProjectionChart } from "@/features/charts/ProjectionChart"');
    expect(calculatorClient).not.toContain('import { AiExplainer } from "@/features/ai-assistant/AiExplainer"');
    expect(calculatorClient).not.toContain('import { CalculationBreakdown } from "@/features/calculation-breakdown/CalculationBreakdown"');
    expect(calculatorClient).not.toContain('import { PdfReportButton } from "@/features/pdf-report/PdfReportButton"');
    expect(calculatorClient).not.toContain('import { CalculatorAnalyticsBeacon } from "@/features/analytics/CalculatorAnalyticsBeacon"');
  });

  it("uses size-stable lazy fallbacks for below-the-fold modules", () => {
    const calculatorClient = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(calculatorClient).toContain('className="min-h-[17rem]" label="Loading projection..."');
    expect(calculatorClient).toContain('className="min-h-[24rem]" label="Loading explanation assistant..."');
    expect(calculatorClient).toContain('className="min-h-[18rem]" label="Loading calculation details..."');
  });

  it("keeps FAQ structured data off the tool-only homepage when the visible FAQ is not mounted", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).not.toContain('import { faqItems } from "@/features/faq/faq-items"');
    expect(homePage).not.toContain("faqJsonLd(faqItems)");
    expect(homePage).not.toContain("<FaqSection />");
  });

  it("uses a lighter mobile background paint path for LCP stability", () => {
    const globalCss = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const mobileBlock = globalCss.match(/@media \(max-width: 640px\) \{[\s\S]+?\n\}/)?.[0] ?? "";

    expect(mobileBlock).toContain("linear-gradient");
    expect(mobileBlock).not.toContain("radial-gradient");
  });

  it("keeps decorative glass effects out of the core calculator path", () => {
    const card = fs.readFileSync(path.join(process.cwd(), "src/common/ui/card.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(card).toContain("shadow-none");
    expect(card).not.toContain("backdrop-blur");
    expect(card).not.toContain("shadow-material");
    expect(homePage).toContain("shadow-none");
    expect(homePage).not.toContain("backdrop-blur");
  });

  it("places the calculator before footer discovery content for mobile first-screen density", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage.indexOf("<HomeCalculatorClient />")).toBeLessThan(
      homePage.indexOf('aria-label="Footer navigation and disclaimer"'),
    );
    expect(homePage).not.toContain('aria-label="Calculator workflow"');
  });

  it("keeps mobile result summary compact before secondary actions", () => {
    const resultSummary = fs.readFileSync(path.join(process.cwd(), "src/features/result-summary/ResultSummary.tsx"), "utf8");
    const calculatorClient = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(resultSummary).toContain("p-3 shadow-none");
    expect(resultSummary).toContain("sm:p-4");
    expect(resultSummary).toContain("font-mono");
    expect(resultSummary).toContain("text-[32px]");
    expect(resultSummary).toContain("hidden text-xs");
    expect(calculatorClient.indexOf("<ResultSummary result={result} />")).toBeLessThan(
      calculatorClient.indexOf('aria-label="Result actions"'),
    );
  });
});
