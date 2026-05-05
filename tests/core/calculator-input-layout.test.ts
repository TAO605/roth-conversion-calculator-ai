import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
});
