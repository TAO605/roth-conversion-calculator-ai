import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { RothConversionInput } from "@/core/calculator/types";
import { ScenarioHistoryPanel } from "@/features/scenario-history/ScenarioHistoryPanel";

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

describe("ScenarioHistoryPanel", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves the current calculator scenario and restores it later", () => {
    const restore = vi.fn();

    const { rerender } = render(React.createElement(ScenarioHistoryPanel, { input, onRestore: restore }));
    fireEvent.click(screen.getByRole("button", { name: /save scenario/i }));

    expect(screen.getByText("$50,000 conversion")).toBeTruthy();

    rerender(
      React.createElement(ScenarioHistoryPanel, {
        input: {
          ...input,
          conversionAmount: 90000,
        },
        onRestore: restore,
      }),
    );
    fireEvent.click(screen.getByRole("button", { name: /restore \$50,000 conversion/i }));

    expect(restore).toHaveBeenCalledWith(expect.objectContaining({ conversionAmount: 50000 }));
  });

  it("deletes a saved scenario without restoring it", () => {
    const restore = vi.fn();

    render(React.createElement(ScenarioHistoryPanel, { input, onRestore: restore }));
    fireEvent.click(screen.getByRole("button", { name: /save scenario/i }));
    fireEvent.click(screen.getByRole("button", { name: /delete \$50,000 conversion/i }));

    expect(screen.queryByText("$50,000 conversion")).toBeNull();
    expect(restore).not.toHaveBeenCalled();
  });
});
