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
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/ai-assistant\/AiExplainer"\)/);
    expect(calculatorClient).toMatch(/dynamic<[\s\S]+import\("@\/features\/calculation-breakdown\/CalculationBreakdown"\)/);
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
    expect(calculatorClient).toContain('className="min-h-[24rem]" label="Loading AI helper..."');
    expect(calculatorClient).toContain('className="min-h-[18rem]" label="Loading calculation details..."');
  });

  it("keeps FAQ structured data available without statically bundling FAQ UI", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const faqSection = fs.readFileSync(path.join(process.cwd(), "src/features/faq/FaqSection.tsx"), "utf8");

    expect(homePage).toContain('import { faqItems } from "@/features/faq/faq-items"');
    expect(homePage).toContain("faqJsonLd(faqItems)");
    expect(faqSection).toContain('import { faqItems } from "@/features/faq/faq-items"');
  });

  it("uses a lighter mobile background paint path for LCP stability", () => {
    const globalCss = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const mobileBlock = globalCss.match(/@media \(max-width: 640px\) \{[\s\S]+?\n\}/)?.[0] ?? "";

    expect(mobileBlock).toContain("linear-gradient");
    expect(mobileBlock).not.toContain("radial-gradient");
  });

  it("keeps mobile glass effects out of the first-paint path", () => {
    const card = fs.readFileSync(path.join(process.cwd(), "src/common/ui/card.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(card).toContain("shadow-sm backdrop-blur-none");
    expect(card).toContain("sm:shadow-material sm:backdrop-blur-xl");
    expect(homePage).toContain("shadow-sm backdrop-blur-none");
    expect(homePage).toContain("sm:backdrop-blur-xl");
  });

  it("places the calculator before workflow explainer cards for mobile first-screen density", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage.indexOf("<HomeCalculatorClient />")).toBeLessThan(
      homePage.indexOf('aria-label="AI calculator workflow"'),
    );
  });
});
