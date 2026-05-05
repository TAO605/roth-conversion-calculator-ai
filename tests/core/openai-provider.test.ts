import { describe, expect, it, vi } from "vitest";
import { createOpenAiExplanation, extractResponseText } from "@/core/ai/openai-provider";

describe("openai provider", () => {
  it("extracts output_text from Responses API output", () => {
    expect(
      extractResponseText({
        output: [
          {
            content: [
              {
                type: "output_text",
                text: "Educational explanation",
              },
            ],
          },
        ],
      }),
    ).toBe("Educational explanation");
  });

  it("calls the Responses API with model and instructions", async () => {
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        output: [{ content: [{ type: "output_text", text: "Explanation from model" }] }],
      }),
    })) as unknown as typeof fetch;

    const text = await createOpenAiExplanation({
      apiKey: "test-key",
      model: "gpt-5",
      question: "What is a Roth conversion?",
      calculatorSummary: "Taxable conversion is $50,000.",
      fetcher,
    });

    expect(text).toBe("Explanation from model");
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      }),
    );
  });
});
