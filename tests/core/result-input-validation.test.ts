import React from "react";
import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HomeCalculatorClient } from "@/app/HomeCalculatorClient";
import { encodeShareCode } from "@/common/storage/share-code";
import { saveCalculatorInput } from "@/common/storage/calculator-persistence";
import type { RothConversionInput } from "@/core/calculator/types";
import { ResultInputValidationNotice } from "@/features/result-validation/ResultInputValidationNotice";

const invalidInput: RothConversionInput = {
  conversionAmount: 5000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "withhold_from_ira",
  withheldForTaxes: 9000,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

describe("result input validation boundary", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  it("shows why estimates are paused when calculator inputs are invalid", () => {
    render(
      React.createElement(ResultInputValidationNotice, {
        errors: {
          withheldForTaxes: "Withheld tax amount cannot exceed the conversion amount.",
          retirementAge: "Retirement age should be greater than current age.",
        },
      }),
    );

    const notice = screen.getByTestId("result-input-validation-notice");

    expect(notice.textContent).toContain("Results paused until inputs are fixed.");
    expect(notice.textContent).toContain("avoid showing a misleading tax scenario");
    expect(notice.textContent).toContain("Withheld tax amount cannot exceed the conversion amount.");
    expect(notice.textContent).toContain("Retirement age should be greater than current age.");
  });

  it("keeps result modules behind the invalid-input gate on the homepage", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(source).toContain("const inputErrors = useMemo(() => validateCalculatorInput(input), [input]);");
    expect(source).toContain("const hasInputErrors = Object.keys(inputErrors).length > 0;");
    expect(source).toContain(
      "{hasInputErrors ? <ResultInputValidationNotice errors={inputErrors} /> : <ResultSummary result={result} />}",
    );
    expect(source).toContain('!hasInputErrors && isFeatureEnabled("pdf-report")');
    expect(source).toContain('!hasInputErrors && isFeatureEnabled("professional-handoff")');
    expect(source).toContain('!hasInputErrors && isFeatureEnabled("ai-explainer")');
    expect(source).toContain('!hasInputErrors && isFeatureEnabled("projection-chart")');
    expect(source).toContain('!hasInputErrors && isFeatureEnabled("calculation-breakdown")');
  });

  it("pauses results when an invalid share link restores calculator input", async () => {
    window.history.replaceState(null, "", `/#${encodeShareCode(invalidInput)}`);

    render(React.createElement(HomeCalculatorClient));

    await waitFor(() => {
      expect(screen.getByTestId("result-input-validation-notice").textContent).toContain(
        "Results paused until inputs are fixed.",
      );
    });

    expect(screen.getAllByText("Withheld tax amount cannot exceed the conversion amount.")).toHaveLength(2);
    expect(screen.queryByText("Estimated upfront cost")).toBeNull();
    expect(screen.queryByText("Download report")).toBeNull();
    expect(screen.queryByText("Tax Payment Method Comparison")).toBeNull();
  });

  it("pauses results when invalid localStorage input is restored", async () => {
    saveCalculatorInput(invalidInput);

    render(React.createElement(HomeCalculatorClient));

    await waitFor(() => {
      expect(screen.getByTestId("result-input-validation-notice").textContent).toContain(
        "Results paused until inputs are fixed.",
      );
    });

    expect(screen.getAllByText("Withheld tax amount cannot exceed the conversion amount.")).toHaveLength(2);
    expect(screen.queryByText("Estimated upfront cost")).toBeNull();
  });

  it("restores results after an invalid input is corrected", async () => {
    window.history.replaceState(null, "", `/#${encodeShareCode(invalidInput)}`);

    render(React.createElement(HomeCalculatorClient));

    await waitFor(() => {
      expect(screen.getByTestId("result-input-validation-notice")).toBeTruthy();
    });

    const advancedInputs = screen.getByTestId("advanced-inputs") as HTMLDetailsElement;
    advancedInputs.open = true;
    const withheldField = screen.getByText("Estimated amount withheld from IRA").closest("label")?.querySelector("input");

    expect(withheldField).toBeTruthy();
    fireEvent.change(withheldField as HTMLInputElement, {
      target: { value: "4000" },
    });

    await waitFor(() => {
      expect(screen.queryByTestId("result-input-validation-notice")).toBeNull();
      expect(screen.getByText("Estimated upfront cost")).toBeTruthy();
    });

    expect(screen.getByText("Tax Payment Method Comparison")).toBeTruthy();
  });
});
