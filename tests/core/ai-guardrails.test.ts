import { describe, expect, it } from "vitest";
import { appendDisclaimer, classifyAiQuestion, containsForbiddenAdvice } from "@/core/compliance/ai-guardrails";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

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
});
