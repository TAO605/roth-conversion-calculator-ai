import { describe, expect, it } from "vitest";
import { appendDisclaimer, classifyAiQuestion, containsForbiddenAdvice } from "@/core/compliance/ai-guardrails";
import { verifyAiResponse } from "@/core/compliance/ai-response-verifier";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

const input: RothConversionInput = {
  age: 64,
  basis: 5000,
  conversionAmount: 60000,
  currentTaxableIncome: 195000,
  expectedAnnualReturn: 0.06,
  filingStatus: "single",
  inflationRate: 0.025,
  penaltyException: false,
  retirementAge: 65,
  retirementMarginalTaxRate: 0.22,
  stateMarginalTaxRate: 0.05,
  taxPaymentMethod: "outside_funds",
  taxYear: 2026,
  traditionalIraBalance: 300000,
  withheldForTaxes: 0,
};

describe("AI guardrails", () => {
  it("rejects personalized conversion decisions", () => {
    expect(classifyAiQuestion("Should I convert $80,000 this year?")).toBe("decision_advice");
  });

  it("rejects unrelated questions", () => {
    expect(classifyAiQuestion("Write me a recipe for dinner")).toBe("unrelated");
  });

  it("allows Roth conversion education questions", () => {
    expect(classifyAiQuestion("What is the Roth conversion 5-year rule?")).toBe("allowed");
  });

  it("detects forbidden advice language", () => {
    expect(containsForbiddenAdvice("You should convert the full amount.")).toBe(true);
  });

  it("detects V1.3 high-risk recommendation and accuracy claims", () => {
    expect(containsForbiddenAdvice("Strongly recommend paying taxes with external funds.")).toBe(true);
    expect(containsForbiddenAdvice("This result is 100% accurate.")).toBe(true);
    expect(containsForbiddenAdvice("The optimal conversion amount is $45,000.")).toBe(true);
    expect(containsForbiddenAdvice("We guarantee the accuracy of this estimate.")).toBe(true);
  });

  it("rejects optimal-action prompts before model execution", () => {
    expect(classifyAiQuestion("What is my optimal conversion amount?")).toBe("decision_advice");
    expect(classifyAiQuestion("What do you recommend for my IRA conversion?")).toBe("decision_advice");
  });

  it("appends the required disclaimer", () => {
    expect(appendDisclaimer("Educational explanation.")).toContain(REQUIRED_DISCLAIMER);
  });

  it("verifies AI answers for disclaimer, advice language, sensitive data, and unsupported dollar amounts", () => {
    const result = calculateRothConversion(input);
    const safe = verifyAiResponse(
      `The calculator estimates a taxable conversion of $59,000 and an upfront cost of $21,288. ${REQUIRED_DISCLAIMER}`,
      result,
    );
    const unsafe = verifyAiResponse(
      `You should convert $123,456. My SSN is 123-45-6789.`,
      result,
    );

    expect(safe).toMatchObject({
      ok: true,
      reasons: [],
      unsupportedDollarAmounts: [],
    });
    expect(unsafe.ok).toBe(false);
    expect(unsafe.reasons).toEqual(
      expect.arrayContaining(["forbidden_advice", "sensitive_data", "unsupported_dollar_amount", "missing_disclaimer"]),
    );
    expect(unsafe.unsupportedDollarAmounts).toContain("$123,456");
  });
});
