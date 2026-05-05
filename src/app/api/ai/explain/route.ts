import { NextResponse } from "next/server";
import { finalizeAiAnswer, validateAiExplainRequest } from "@/core/compliance/ai-compliance-gateway";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { createOpenAiExplanation } from "@/core/ai/openai-provider";
import { createInMemoryRateLimiter, getClientRateLimitKey } from "@/core/ai/rate-limit";

interface AiExplainRequest {
  question?: string;
  input?: RothConversionInput;
  result?: RothConversionResult;
}

const aiRateLimiter = createInMemoryRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 60 * 1000,
});

export async function POST(request: Request) {
  const rateLimit = aiRateLimiter.check(getClientRateLimitKey(request.headers));

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        answer: finalizeAiAnswer(
          "The AI explainer is receiving too many requests from this browser or network. Please wait before trying again.",
        ),
        reason: "rate_limited",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  const body = (await request.json()) as AiExplainRequest;
  const validation = validateAiExplainRequest(body);

  if (!validation.ok) {
    return NextResponse.json(
      { answer: validation.answer, reason: validation.reason },
      { status: 200, headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } },
    );
  }

  const question = validation.question;
  const result = body.result;
  const input = body.input;
  const breakEven = result?.breakEvenYear === null ? "not reached in the projection period" : `${result?.breakEvenYear} years`;
  const fallbackExplanation = `Based on the calculator inputs, the estimated taxable conversion is $${Math.round(
    result?.taxableConversion ?? 0,
  ).toLocaleString()}, with an estimated upfront cost of $${Math.round(
    result?.totalUpfrontCost ?? 0,
  ).toLocaleString()}. The break-even estimate is ${breakEven}. This explanation assumes taxes are paid using ${
    input?.taxPaymentMethod === "outside_funds" ? "outside funds" : "the selected tax payment method"
  } and does not calculate IRMAA, ACA subsidies, NIIT, AMT, RMD interactions, or state-specific exceptions.`;

  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-5";
      const answer = await createOpenAiExplanation({
        apiKey,
        model,
        question,
        calculatorSummary: fallbackExplanation,
      });

      return NextResponse.json(
        { answer: finalizeAiAnswer(answer || fallbackExplanation) },
        { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } },
      );
    } catch {
      return NextResponse.json(
        { answer: finalizeAiAnswer(fallbackExplanation) },
        { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } },
      );
    }
  }

  return NextResponse.json(
    {
      answer: finalizeAiAnswer(fallbackExplanation),
    },
    { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } },
  );
}
