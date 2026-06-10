import { describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { buildReportMailtoHref } from "@/features/email-report/EmailReportButton";

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

describe("email report draft", () => {
  it("builds a local mailto draft without recipient collection or advice language", () => {
    const href = buildReportMailtoHref(input, calculateRothConversion(input));
    const url = new URL(href);
    const body = url.searchParams.get("body") ?? "";

    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("");
    expect(url.searchParams.get("subject")).toContain("Roth conversion calculator summary 2026");
    expect(body).toContain("Roth Conversion Calculator Summary");
    expect(body).toContain("This Roth Conversion Calculator is for educational");
    expect(body).toContain("created locally in your browser");
    expect(body).toContain("qualified tax professional");
    expect(body).not.toMatch(/\b(recommend|optimal|you should convert)\b/i);
    expect(href).not.toMatch(/https?:\/\//i);
  });
});
