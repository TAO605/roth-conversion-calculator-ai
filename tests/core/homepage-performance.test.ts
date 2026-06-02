import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("homepage performance boundaries", () => {
  it("lazy-loads non-critical homepage modules instead of statically bundling them", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).toContain('from "next/dynamic"');
    expect(homePage).toContain("LazyPanelFallback");
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/charts\/ProjectionChart"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/ai-assistant\/AiExplainer"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/calculation-breakdown\/CalculationBreakdown"\)/);
    expect(homePage).toMatch(/dynamic[\s\S]+import\("@\/features\/faq\/FaqSection"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/pdf-report\/PdfReportButton"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/tax-data-freshness\/TaxDataFreshnessCard"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/analytics\/CalculatorAnalyticsBeacon"\)/);

    expect(homePage).not.toContain('import { ProjectionChart } from "@/features/charts/ProjectionChart"');
    expect(homePage).not.toContain('import { AiExplainer } from "@/features/ai-assistant/AiExplainer"');
    expect(homePage).not.toContain('import { CalculationBreakdown } from "@/features/calculation-breakdown/CalculationBreakdown"');
    expect(homePage).not.toContain('import { FaqSection } from "@/features/faq/FaqSection"');
    expect(homePage).not.toContain('import { PdfReportButton } from "@/features/pdf-report/PdfReportButton"');
    expect(homePage).not.toContain('import { TaxDataFreshnessCard } from "@/features/tax-data-freshness/TaxDataFreshnessCard"');
    expect(homePage).not.toContain('import { CalculatorAnalyticsBeacon } from "@/features/analytics/CalculatorAnalyticsBeacon"');
  });

  it("uses size-stable lazy fallbacks for below-the-fold modules", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).toContain('className="min-h-[17rem]" label="Loading projection..."');
    expect(homePage).toContain('className="min-h-[24rem]" label="Loading AI helper..."');
    expect(homePage).toContain('className="min-h-[18rem]" label="Loading calculation details..."');
    expect(homePage).toContain('className="min-h-[14rem]" label="Loading FAQ..."');
    expect(homePage).toContain('className="min-h-[11rem]" label="Loading tax data status..."');
  });

  it("keeps FAQ structured data available without statically bundling FAQ UI", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const faqSection = fs.readFileSync(path.join(process.cwd(), "src/features/faq/FaqSection.tsx"), "utf8");

    expect(homePage).toContain('import { faqItems } from "@/features/faq/faq-items"');
    expect(homePage).toContain("faqJsonLd(faqItems)");
    expect(faqSection).toContain('import { faqItems } from "@/features/faq/faq-items"');
  });
});
