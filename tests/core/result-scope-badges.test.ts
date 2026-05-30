import React from "react";
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultScopeBadges } from "@/features/result-scope/ResultScopeBadges";

describe("result scope badges", () => {
  it("shows the result boundary before users read calculator outputs", () => {
    render(React.createElement(ResultScopeBadges, { taxYear: 2026 }));

    const badges = screen.getByTestId("result-scope-badges").textContent ?? "";

    expect(badges).toContain("2026 tax year");
    expect(badges).toContain("Educational estimate");
    expect(badges).toContain("Based on your inputs");
    expect(badges).toContain("Not tax advice");
    expect(badges).not.toMatch(/\b100%\s+accurate\b/i);
  });

  it("places result scope before the primary result summary", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const scopeIndex = source.indexOf("<ResultScopeBadges");
    const summaryIndex = source.indexOf("<ResultSummary result={result} />");
    const warningIndex = source.indexOf("<TaxImpactWarnings />");

    expect(scopeIndex).toBeGreaterThan(-1);
    expect(scopeIndex).toBeLessThan(summaryIndex);
    expect(scopeIndex).toBeLessThan(warningIndex);
  });
});
