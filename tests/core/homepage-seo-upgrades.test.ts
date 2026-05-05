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

  it("keeps the homepage navigation focused while preserving crawlable secondary links", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    const navSource = source.slice(source.indexOf("<nav"), source.indexOf("</nav>"));

    expect(navSource).toContain("Calculator");
    expect(navSource).toContain("AI helper");
    expect(navSource).toContain("Sources");
    expect(navSource).not.toContain("IRMAA");
    expect(navSource).not.toContain("Production launch");
    expect(source).toContain("More planning guides");
    expect(source).toContain("<details");
    expect(source).toContain("/roth-conversion-irmaa-guide");
    expect(source).toContain("/roth-conversion-social-security-tax-guide");
  });

  it("adds official source and transparent methodology sections to the homepage", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(source).toContain("Official sources reviewed");
    expect(source).toContain("https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026");
    expect(source).toContain("https://www.irs.gov/publications/p590a");
    expect(source).toContain("Transparent calculation method");
    expect(source).toContain("Taxable conversion = conversion amount minus pro-rata after-tax basis");
  });
});
