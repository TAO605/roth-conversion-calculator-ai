import { appendDisclaimer, classifyAiQuestion, containsForbiddenAdvice } from "@/core/compliance/ai-guardrails";

export type AiRejectionReason = "decision_advice" | "unrelated" | "sensitive_data" | "too_long" | "empty";

export interface AiExplainRequestLike {
  question?: unknown;
}

export type AiExplainValidation =
  | {
      ok: true;
      question: string;
    }
  | {
      ok: false;
      reason: AiRejectionReason;
      answer: string;
    };

const maxQuestionLength = 1800;

const sensitiveDataPatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\bssn\b/i,
  /\bsocial security number\b/i,
  /\baccount number\b/i,
  /\brouting number\b/i,
  /\b\d{12,19}\b/,
];

const refusalText: Record<AiRejectionReason, string> = {
  decision_advice:
    "I can explain Roth conversion rules and calculator results, but I cannot tell you whether you should convert or choose an optimal amount. A licensed tax professional can review your full tax picture.",
  unrelated: "I can only answer educational questions about Roth conversions, IRAs, IRS rules, and this calculator.",
  sensitive_data:
    "Please remove personal identifiers, account numbers, Social Security numbers, and other sensitive data before using the AI explainer. You can ask general Roth conversion education questions without sharing private identifiers.",
  too_long:
    "Please shorten the question and focus on one Roth conversion topic at a time. The AI explainer is designed for concise educational explanations.",
  empty: "Please enter a Roth conversion, IRA, IRS rule, tax, or retirement-account question.",
};

function normalizeQuestion(question: unknown): string {
  return typeof question === "string" ? question.trim().replace(/\s+/g, " ") : "";
}

function containsSensitiveData(question: string): boolean {
  return sensitiveDataPatterns.some((pattern) => pattern.test(question));
}

export function buildAiRefusal(reason: AiRejectionReason): string {
  return appendDisclaimer(refusalText[reason]);
}

export function validateAiExplainRequest(request: AiExplainRequestLike): AiExplainValidation {
  const question = normalizeQuestion(request.question);

  if (!question) {
    return { ok: false, reason: "empty", answer: buildAiRefusal("empty") };
  }

  if (question.length > maxQuestionLength) {
    return { ok: false, reason: "too_long", answer: buildAiRefusal("too_long") };
  }

  if (containsSensitiveData(question)) {
    return { ok: false, reason: "sensitive_data", answer: buildAiRefusal("sensitive_data") };
  }

  const classification = classifyAiQuestion(question);

  if (classification !== "allowed") {
    return { ok: false, reason: classification, answer: buildAiRefusal(classification) };
  }

  return { ok: true, question };
}

export function finalizeAiAnswer(answer: string): string {
  const normalized = normalizeQuestion(answer);

  if (!normalized || containsForbiddenAdvice(normalized)) {
    return appendDisclaimer(
      "I cannot provide personalized tax, financial, legal, or investment advice. I can explain the calculator result, Roth conversion rules, and educational considerations for review with a licensed professional.",
    );
  }

  return appendDisclaimer(normalized);
}
