import React from "react";
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalculatorInput } from "@/features/calculator-input/CalculatorInput";
import type { RothConversionInput } from "@/core/calculator/types";

const input: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

describe("homepage SEO and UX upgrades", () => {
  it("renders user-facing percentage inputs without floating point artifacts", () => {
    render(React.createElement(CalculatorInput, { value: input, onChange: vi.fn() }));

    expect((screen.getByLabelText("Expected annual return") as HTMLInputElement).value).toBe("7");
    expect((screen.getByLabelText("Retirement marginal tax rate") as HTMLInputElement).value).toBe("22");
    expect(screen.queryByDisplayValue("7.000000000000001")).toBeNull();
  });

  it("keeps the homepage navigation and footer tool-only while preserving minimal crawlable links", () => {
    const pageSource = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const source = [
      pageSource,
      fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8"),
    ].join("\n");

    const navSource = source.slice(source.indexOf("<nav"), source.indexOf("</nav>"));
    const footerSource = pageSource.slice(pageSource.indexOf("<footer"), pageSource.indexOf("</footer>"));

    expect(navSource).toContain("RothCalc");
    expect(navSource).toContain("ThemeToggle");
    expect(navSource).not.toContain("Explanation");
    expect(navSource).not.toContain("Sources");
    expect(navSource).not.toContain('href="#calculator"');
    expect(navSource).not.toContain("IRMAA");
    expect(navSource).not.toContain("Production launch");

    expect(footerSource).toContain("/methodology");
    expect(footerSource).toContain("/calculator-assumptions-guide");
    expect(footerSource).toContain("/site-index");
    expect(footerSource).toContain("/privacy");
    expect(footerSource).toContain("/terms");
    expect(footerSource).toContain("/disclaimer");
    expect(footerSource).toContain("/editorial-policy");
    expect(footerSource).toContain("/release-notes");
    expect(footerSource).not.toContain("More planning guides");
    expect(footerSource).not.toContain("<details");
    expect(footerSource).not.toContain("/roth-conversion-irmaa-guide");
    expect(footerSource).not.toContain("/roth-conversion-social-security-tax-guide");
    expect(footerSource).not.toContain("/launch-readiness");
    expect(footerSource).not.toContain("/seo-monitoring");
  });

  it("keeps source and methodology content off the homepage tool surface", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(source).not.toContain("Official sources reviewed");
    expect(source).not.toContain("Transparent calculation method");
    expect(source).not.toContain("Taxable conversion = conversion amount minus pro-rata after-tax basis");
    expect(source).toContain("/calculator-assumptions-guide");
    expect(source).toContain("/methodology");
    expect(source).toContain("/site-index");
  });

  it("keeps homepage semantic landmarks explicit for crawlers and assistive technology", () => {
    const pageSource = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const source = [
      pageSource,
      fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8"),
    ].join("\n");

    expect(pageSource.match(/<main\b/g)).toHaveLength(1);
    expect(pageSource.match(/<h1\b/g)).toHaveLength(1);
    expect(source).toContain('aria-label="Primary navigation"');
    expect(source).toContain('aria-label="Roth conversion calculator"');
    expect(source).toContain('aria-labelledby="calculator-inputs-heading"');
    expect(source).toContain('id="calculator-inputs-heading"');
    expect(source).toContain('aria-label="Roth conversion estimate results"');
    expect(source).toContain('aria-label="Footer navigation and disclaimer"');
  });
});
