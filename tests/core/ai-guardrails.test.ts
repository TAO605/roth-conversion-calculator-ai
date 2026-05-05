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

  it("appends the required disclaimer", () => {
    expect(appendDisclaimer("Educational explanation.")).toContain(REQUIRED_DISCLAIMER);
  });
});
