interface ResponsesApiContent {
  type?: string;
  text?: string;
}

interface ResponsesApiOutput {
  content?: ResponsesApiContent[];
}

interface ResponsesApiResponse {
  output?: ResponsesApiOutput[];
  output_text?: string;
}

interface CreateOpenAiExplanationInput {
  apiKey: string;
  model: string;
  question: string;
  calculatorSummary: string;
  fetcher?: typeof fetch;
}

export function extractResponseText(response: ResponsesApiResponse): string {
  if (response.output_text) {
    return response.output_text;
  }

  for (const output of response.output ?? []) {
    for (const content of output.content ?? []) {
      if (content.type === "output_text" && content.text) {
        return content.text;
      }
    }
  }

  return "";
}

export async function createOpenAiExplanation({
  apiKey,
  model,
  question,
  calculatorSummary,
  fetcher = fetch,
}: CreateOpenAiExplanationInput): Promise<string> {
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are an AI Roth Conversion Explainer. Provide educational explanations only. Do not recommend whether the user should convert, do not choose an optimal conversion amount, and do not provide tax, financial, legal, or investment advice.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Question: ${question}\n\nCalculator summary: ${calculatorSummary}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI Responses API failed with status ${response.status}`);
  }

  return extractResponseText((await response.json()) as ResponsesApiResponse);
}
