import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";
import { ResultSummary } from "@/features/result-summary/ResultSummary";

const input: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
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

describe("result summary layout", () => {
  it("puts safe V1.3-style primary estimates before detailed breakdown cards", () => {
    const result = calculateRothConversion(input);

    render(React.createElement(ResultSummary, { result }));

    expect(screen.getByLabelText("Primary result estimates").textContent).toContain("Estimated upfront tax");
    expect(screen.getByText("Modeled bracket room")).toBeTruthy();
    expect(screen.getByText("Projected after-tax difference")).toBeTruthy();
    expect(screen.getByText("Scenario reading")).toBeTruthy();
    expect(screen.getByText("Federal tax")).toBeTruthy();
  });

  it("avoids direct recommendation and absolute accuracy language", () => {
    const result = calculateRothConversion(input);
    const { container } = render(React.createElement(ResultSummary, { result }));
    const copy = container.textContent ?? "";

    expect(copy).not.toMatch(/\byou should convert\b/i);
    expect(copy).not.toMatch(/\bstrongly recommend\b/i);
    expect(copy).not.toMatch(/\boptimal conversion amount\b/i);
    expect(copy).not.toMatch(/\b100%\s+accurate\b/i);
  });
});
