import { NextResponse } from "next/server";
import { finalizeAiAnswer, validateAiExplainRequest } from "@/core/compliance/ai-compliance-gateway";
import { verifyAiResponse } from "@/core/compliance/ai-response-verifier";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { createOpenAiExplanation } from "@/core/ai/openai-provider";
import {
  createInMemoryRateLimiter,
  getAiExplainerMaxRequestsPerHour,
  getClientRateLimitKey,
  isAllowedAiRequestOrigin,
} from "@/core/ai/rate-limit";

interface AiExplainRequest {
  question?: string;
  input?: RothConversionInput;
  result?: RothConversionResult;
}

const aiRateLimiter = createInMemoryRateLimiter({
  maxRequests: getAiExplainerMaxRequestsPerHour(),
  windowMs: 60 * 60 * 1000,
});

export async function POST(request: Request) {
  const originCheck = isAllowedAiRequestOrigin(request.headers);

  if (!originCheck.allowed) {
    return NextResponse.json(
      {
        answer: finalizeAiAnswer(
          "The AI explainer is available from the Roth Conversion Calculator page. Please use the on-page calculator before asking for an educational explanation.",
        ),
        reason: "origin_blocked",
      },
      { status: 403, headers: { "X-AI-Provider": "fallback" } },
    );
  }

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

  let body: AiExplainRequest;

  try {
    body = (await request.json()) as AiExplainRequest;
  } catch {
    return NextResponse.json(
      {
        answer: finalizeAiAnswer(
          "The AI explainer could not read the request. Please refresh the calculator and try again without sharing private identifiers.",
        ),
        reason: "invalid_json",
      },
      {
        status: 400,
        headers: {
          "X-AI-Provider": "fallback",
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  const validation = validateAiExplainRequest(body);

  if (!validation.ok) {
    return NextResponse.json(
      { answer: validation.answer, reason: validation.reason },
      { status: 200, headers: { "X-AI-Provider": "fallback", "X-RateLimit-Remaining": String(rateLimit.remaining) } },
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
  } and does not calculate final IRMAA billing, ACA subsidies, final NIIT, AMT, RMD interactions, or state-specific exceptions.`;

  const apiKey = process.env.OPENAI_API_KEY;
  const paidModelEnabled = process.env.AI_EXPLAINER_PAID_MODEL_ENABLED === "true";
  const fallbackAnswer = finalizeAiAnswer(fallbackExplanation);

  if (paidModelEnabled && apiKey && result) {
    try {
      const model = process.env.OPENAI_MODEL || "gpt-5";
      const answer = await createOpenAiExplanation({
        apiKey,
        model,
        question,
        calculatorSummary: fallbackExplanation,
      });
      const finalizedAnswer = finalizeAiAnswer(answer || fallbackExplanation);
      const verification = verifyAiResponse(finalizedAnswer, result);

      if (!verification.ok) {
        return NextResponse.json(
          {
            answer: fallbackAnswer,
            verifier: {
              ok: false,
              reasons: verification.reasons,
            },
          },
          {
            headers: {
              "X-AI-Provider": "fallback",
              "X-AI-Verifier": "failed",
              "X-AI-Verifier-Reasons": verification.reasons.join(","),
              "X-RateLimit-Remaining": String(rateLimit.remaining),
            },
          },
        );
      }

      return NextResponse.json(
        {
          answer: finalizedAnswer,
          verifier: {
            ok: true,
            reasons: [],
          },
        },
        {
          headers: {
            "X-AI-Provider": "openai",
            "X-AI-Verifier": "passed",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    } catch {
      return NextResponse.json(
        {
          answer: fallbackAnswer,
          verifier: {
            ok: true,
            reasons: [],
          },
        },
        {
          headers: {
            "X-AI-Provider": "fallback",
            "X-AI-Verifier": "fallback",
            "X-RateLimit-Remaining": String(rateLimit.remaining),
          },
        },
      );
    }
  }

  return NextResponse.json(
    {
      answer: fallbackAnswer,
      verifier: {
        ok: true,
        reasons: [],
      },
    },
    {
      headers: {
        "X-AI-Provider": "fallback",
        "X-AI-Verifier": "fallback",
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    },
  );
}
