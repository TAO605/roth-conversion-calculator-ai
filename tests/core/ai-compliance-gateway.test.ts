import { describe, expect, it } from "vitest";
import {
  buildAiRefusal,
  finalizeAiAnswer,
  validateAiExplainRequest,
} from "@/core/compliance/ai-compliance-gateway";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

describe("AI compliance gateway", () => {
  it("accepts focused Roth conversion education questions", () => {
    const validation = validateAiExplainRequest({
      question: "What does the Roth conversion 5-year rule mean?",
    });

    expect(validation).toMatchObject({
      ok: true,
      question: "What does the Roth conversion 5-year rule mean?",
    });
  });

  it("rejects decision advice requests before calling a model", () => {
    const validation = validateAiExplainRequest({
      question: "Should I convert $90,000 this year?",
    });

    expect(validation.ok).toBe(false);
    expect(validation.reason).toBe("decision_advice");
    expect(validation.answer).toContain("cannot provide a personal conversion decision");
    expect(validation.answer).toContain(REQUIRED_DISCLAIMER);
  });

  it("rejects sensitive personal data in prompts", () => {
    const validation = validateAiExplainRequest({
      question: "My SSN is 123-45-6789, can you explain my Roth conversion taxes?",
    });

    expect(validation.ok).toBe(false);
    expect(validation.reason).toBe("sensitive_data");
    expect(validation.answer).toContain("remove personal identifiers");
  });

  it("rejects prompts that are too long for the lightweight explainer", () => {
    const validation = validateAiExplainRequest({
      question: `Roth conversion ${"details ".repeat(260)}`,
    });

    expect(validation.ok).toBe(false);
    expect(validation.reason).toBe("too_long");
  });

  it("replaces unsafe model output with a compliant refusal", () => {
    const answer = finalizeAiAnswer("You should convert the full amount this year.");

    expect(answer).not.toContain("You should convert the full amount");
    expect(answer).toContain("cannot provide personalized tax");
    expect(answer).toContain(REQUIRED_DISCLAIMER);
  });

  it("always appends the required disclaimer to safe answers and refusals", () => {
    expect(finalizeAiAnswer("A Roth conversion moves pre-tax retirement assets into a Roth IRA.")).toContain(
      REQUIRED_DISCLAIMER,
    );
    expect(buildAiRefusal("unrelated")).toContain(REQUIRED_DISCLAIMER);
  });
});
