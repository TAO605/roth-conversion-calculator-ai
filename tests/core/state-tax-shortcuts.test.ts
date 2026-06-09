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
    expect(onChange.mock.lastCall?.[0](input)).toMatchObject({
      selectedState: "california",
      stateReadinessInputs: undefined,
      stateMarginalTaxRate: 0.093,
    });

    fireEvent.change(stateShortcut, { target: { value: "texas" } });
    expect(onChange).toHaveBeenLastCalledWith(expect.any(Function));
    expect(onChange.mock.lastCall?.[0]({ ...input, stateMarginalTaxRate: 0.093 })).toMatchObject({
      selectedState: "texas",
      stateReadinessInputs: undefined,
      stateMarginalTaxRate: 0,
    });
  });

  it("clears selectedState when the state marginal rate is manually edited", () => {
    const onChange = vi.fn();

    render(React.createElement(CalculatorInput, { value: { ...input, selectedState: "california", stateMarginalTaxRate: 0.093 }, onChange }));

    fireEvent.change(screen.getByLabelText(/state marginal tax rate/i), { target: { value: "4.5" } });

    expect(onChange).toHaveBeenLastCalledWith(expect.any(Function));
    expect(
      onChange.mock.lastCall?.[0]({
        ...input,
        selectedState: "california",
        stateReadinessInputs: {
          localTaxApplies: true,
          notes: "CA review",
          otherStateTaxCreditApplies: false,
          residencyStatus: "resident",
          stateAdjustedGrossIncome: 120000,
          stateIraBasis: 7000,
        },
        stateMarginalTaxRate: 0.093,
      }),
    ).toMatchObject({
      selectedState: null,
      stateReadinessInputs: undefined,
    });
  });

  it("shows selected-state readiness fields for worksheet states only", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      React.createElement(CalculatorInput, {
        value: { ...input, selectedState: "california", stateMarginalTaxRate: 0.093 },
        onChange,
      }),
    );

    expect(screen.getByTestId("state-readiness-inputs").textContent).toContain("California State Amount Readiness");
    expect(screen.getByLabelText(/residency status for selected state/i)).toBeTruthy();
    expect(screen.getByLabelText(/state adjusted gross income/i)).toBeTruthy();

    rerender(
      React.createElement(CalculatorInput, {
        value: { ...input, selectedState: "texas", stateMarginalTaxRate: 0 },
        onChange,
      }),
    );

    expect(screen.queryByTestId("state-readiness-inputs")).toBeNull();
  });

  it("updates selected-state readiness fields without changing the state tax rate", () => {
    const onChange = vi.fn();
    const value = { ...input, selectedState: "california", stateMarginalTaxRate: 0.093 };

    render(React.createElement(CalculatorInput, { value, onChange }));

    fireEvent.change(screen.getByLabelText(/residency status for selected state/i), {
      target: { value: "resident" },
    });

    expect(onChange).toHaveBeenLastCalledWith(expect.any(Function));
    expect(onChange.mock.lastCall?.[0](value)).toMatchObject({
      selectedState: "california",
      stateMarginalTaxRate: 0.093,
      stateReadinessInputs: {
        residencyStatus: "resident",
      },
    });
  });
});
