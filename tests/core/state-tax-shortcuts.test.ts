import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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

describe("state tax shortcuts", () => {
  it("applies example state marginal tax rates from the shortcut selector", () => {
    const onChange = vi.fn();

    render(React.createElement(CalculatorInput, { value: input, onChange }));

    const stateShortcut = screen.getByRole("combobox", { name: /state shortcut/i });

    fireEvent.change(stateShortcut, { target: { value: "california" } });
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Function));
    expect(onChange.mock.lastCall?.[0](input)).toMatchObject({ stateMarginalTaxRate: 0.093 });

    fireEvent.change(stateShortcut, { target: { value: "texas" } });
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Function));
    expect(onChange.mock.lastCall?.[0]({ ...input, stateMarginalTaxRate: 0.093 })).toMatchObject({
      stateMarginalTaxRate: 0,
    });
  });
});
