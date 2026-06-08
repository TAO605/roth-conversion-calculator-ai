import React from "react";
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultInputValidationNotice } from "@/features/result-validation/ResultInputValidationNotice";

describe("result input validation boundary", () => {
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
});
