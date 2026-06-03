import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { CalculatorInput } from "@/features/calculator-input/CalculatorInput";
import type { RothConversionInput } from "@/core/calculator/types";

const value: RothConversionInput = {
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

describe("calculator input layout", () => {
  it("keeps calculator fields in a single column inside the sidebar card", () => {
    render(React.createElement(CalculatorInput, { value, onChange: vi.fn() }));

    const grid = screen.getByTestId("calculator-input-grid");

    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).not.toContain("md:grid-cols-2");
  });

  it("prioritizes quick estimate fields and keeps advanced assumptions collapsed", () => {
    render(React.createElement(CalculatorInput, { value, onChange: vi.fn() }));

    const quickFields = screen.getByTestId("quick-estimate-fields");
    const projectionAssumptions = screen.getByTestId("projection-assumptions") as HTMLDetailsElement;
    const projectionFields = screen.getByTestId("projection-assumption-fields");
    const advanced = screen.getByTestId("advanced-inputs") as HTMLDetailsElement;

    expect(screen.getByText("Quick Estimate")).toBeTruthy();
    expect(quickFields.textContent).toContain("Conversion amount");
    expect(quickFields.textContent).toContain("Current taxable income");
    expect(quickFields.textContent).toContain("Filing status");
    expect(quickFields.textContent).toContain("State marginal tax rate");
    expect(quickFields.textContent).toContain("Traditional IRA balance");
    expect(quickFields.textContent).toContain("Projection assumptions");
    expect(projectionAssumptions.open).toBe(false);
    expect(projectionFields.textContent).toContain("Retirement age");
    expect(projectionFields.textContent).toContain("Expected annual return");
    expect(advanced.open).toBe(false);
    expect(advanced.textContent).toContain("Advanced assumptions");
    expect(advanced.textContent).toContain("After-tax basis");
  });

  it("keeps projection assumptions available without making the mobile quick form longer by default", () => {
    render(React.createElement(CalculatorInput, { value, onChange: vi.fn() }));

    const sourceFields = screen.getByTestId("quick-estimate-fields");
    const projectionAssumptions = screen.getByTestId("projection-assumptions") as HTMLDetailsElement;

    expect(sourceFields.children).toHaveLength(6);
    expect(projectionAssumptions.querySelectorAll("input")).toHaveLength(2);
    expect(projectionAssumptions.open).toBe(false);
  });

  it("keeps collapsible input summaries large enough for mobile touch targets", () => {
    render(React.createElement(CalculatorInput, { value, onChange: vi.fn() }));

    const projectionSummary = screen.getByText("Projection assumptions").closest("summary");
    const advancedSummary = screen.getByText("Advanced assumptions").closest("summary");
    const source = fs.readFileSync(path.join(process.cwd(), "src/features/calculator-input/CalculatorInput.tsx"), "utf8");

    expect(projectionSummary?.className).toContain("min-h-11");
    expect(advancedSummary?.className).toContain("min-h-11");
    expect(source).toContain("ChevronDown");
    expect(source).toContain("group-open:rotate-180");
    expect(source).toContain("[&::-webkit-details-marker]:hidden");
  });
});
