import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { AiExplainer } from "@/features/ai-assistant/AiExplainer";

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

describe("AiExplainer", () => {
  it("recovers from API failures and keeps the required disclaimer visible", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network failure")));

    render(React.createElement(AiExplainer, { input, result: calculateRothConversion(input) }));
    fireEvent.click(screen.getByRole("button", { name: /explain/i }));

    expect(await screen.findByText(/explanation assistant is temporarily unavailable/i)).toBeTruthy();
    expect(screen.getByText(REQUIRED_DISCLAIMER)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /explain/i }).hasAttribute("disabled")).toBe(false);
    });
  });
});
