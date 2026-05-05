import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { CopyResultButton } from "@/features/result-copy/CopyResultButton";

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

describe("CopyResultButton", () => {
  it("copies the educational result summary to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(React.createElement(CopyResultButton, { input, result: calculateRothConversion(input) }));

    fireEvent.click(screen.getByRole("button", { name: /copy summary/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Roth Conversion Calculator Summary"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("This Roth Conversion Calculator is for educational"));
    expect(await screen.findByRole("button", { name: /copied/i })).toBeTruthy();
  });
});
