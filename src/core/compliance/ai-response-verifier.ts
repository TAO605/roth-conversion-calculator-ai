import type { RothConversionResult } from "@/core/calculator/types";
import { containsForbiddenAdvice } from "@/core/compliance/ai-guardrails";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

export type AiResponseVerifierReason =
  | "empty"
  | "too_long"
  | "forbidden_advice"
  | "sensitive_data"
  | "unsupported_dollar_amount"
  | "missing_disclaimer";

export interface AiResponseVerification {
  ok: boolean;
  reasons: AiResponseVerifierReason[];
  unsupportedDollarAmounts: string[];
}

const maxVerifiedAnswerLength = 2200;

const sensitiveOutputPatterns = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\bssn\b/i,
  /\bsocial security number\b/i,
  /\baccount number\b/i,
  /\brouting number\b/i,
  /\b\d{12,19}\b/,
];

function normalizeAnswer(answer: string): string {
  return answer.trim().replace(/\s+/g, " ");
}

function answerWithoutRequiredDisclaimer(answer: string): string {
  return normalizeAnswer(answer.replace(REQUIRED_DISCLAIMER, ""));
}

function parseDollarAmount(value: string): number | null {
  const parsed = Number(value.replace(/[$,]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function roundedResultAmounts(result: RothConversionResult): number[] {
  return [
    result.taxableConversion,
    result.federalTax,
    result.stateTax,
    result.earlyDistributionPenalty,
    result.totalUpfrontCost,
    result.afterTaxDifference,
    result.bracketImpact.incomeTaxedInHigherBrackets,
  ].map((value) => Math.round(value));
}

function extractUnsupportedDollarAmounts(answer: string, result: RothConversionResult): string[] {
  const allowed = new Set(roundedResultAmounts(result));
  const matches = answer.match(/\$[\d,]+(?:\.\d{1,2})?/g) ?? [];

  return matches.filter((match) => {
    const parsed = parseDollarAmount(match);
    return parsed === null || !allowed.has(Math.round(parsed));
  });
}

export function verifyAiResponse(answer: string, result: RothConversionResult): AiResponseVerification {
  const normalized = normalizeAnswer(answer);
  const modelBody = answerWithoutRequiredDisclaimer(answer);
  const reasons: AiResponseVerifierReason[] = [];
  const unsupportedDollarAmounts = extractUnsupportedDollarAmounts(modelBody, result);

  if (!normalized) {
    reasons.push("empty");
  }

  if (normalized.length > maxVerifiedAnswerLength) {
    reasons.push("too_long");
  }

  if (containsForbiddenAdvice(modelBody)) {
    reasons.push("forbidden_advice");
  }

  if (sensitiveOutputPatterns.some((pattern) => pattern.test(modelBody))) {
    reasons.push("sensitive_data");
  }

  if (unsupportedDollarAmounts.length > 0) {
    reasons.push("unsupported_dollar_amount");
  }

  if (!normalized.includes(REQUIRED_DISCLAIMER)) {
    reasons.push("missing_disclaimer");
  }

  return {
    ok: reasons.length === 0,
    reasons,
    unsupportedDollarAmounts,
  };
}
