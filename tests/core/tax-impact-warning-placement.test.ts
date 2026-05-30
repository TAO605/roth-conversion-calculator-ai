import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaxImpactWarnings } from "@/features/tax-impact-warnings/TaxImpactWarnings";

describe("tax impact warning placement", () => {
  it("renders hidden-cost warnings as a review-before-planning panel", () => {
    render(React.createElement(TaxImpactWarnings));

    const panel = screen.getByTestId("tax-impact-warnings");

    expect(panel.textContent).toContain("Review before planning");
    expect(panel.textContent).toContain("Tax Impact Warnings");
    expect(panel.textContent).toContain("Medicare IRMAA");
    expect(panel.textContent).toContain("ACA premium tax credits");
    expect(panel.textContent).toContain("Required Minimum Distributions");
  });

  it("keeps the warnings directly inside the results card before AI, projection, and advanced details", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const resultSummaryIndex = source.indexOf("<ResultSummary result={result} />");
    const warningIndex = source.indexOf("<TaxImpactWarnings />");
    const aiIndex = source.indexOf('id="ai-explainer"');
    const projectionIndex = source.indexOf("<ProjectionChart");
    const advancedDetailsIndex = source.indexOf("Advanced calculation details");

    expect(resultSummaryIndex).toBeGreaterThan(-1);
    expect(warningIndex).toBeGreaterThan(resultSummaryIndex);
    expect(warningIndex).toBeLessThan(aiIndex);
    expect(warningIndex).toBeLessThan(projectionIndex);
    expect(warningIndex).toBeLessThan(advancedDetailsIndex);
    expect(source.match(/<TaxImpactWarnings \/>/g)).toHaveLength(1);
  });
});
