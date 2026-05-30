import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

export type AiQuestionClassification = "allowed" | "decision_advice" | "unrelated";

const decisionPatterns = [
  /\bshould i\b/i,
  /\bshould we\b/i,
  /\bdo you recommend\b/i,
  /\bwould you recommend\b/i,
  /\bwhat do you recommend\b/i,
  /\brecommend converting\b/i,
  /\boptimal amount\b/i,
  /\boptimal conversion amount\b/i,
  /\bbest amount\b/i,
  /\bbest move\b/i,
  /\bbest choice\b/i,
  /\bhow much should i convert\b/i,
];

const topicPatterns = [
  /\broth\b/i,
  /\bira\b/i,
  /\bconversion\b/i,
  /\btax\b/i,
  /\birs\b/i,
  /\bretirement\b/i,
  /\b5-?year rule\b/i,
  /\bpenalt(y|ies)\b/i,
];

const forbiddenAdvicePatterns = [
  /\byou should\b/i,
  /\byou need to\b/i,
  /\byou must\b/i,
  /\bi recommend\b/i,
  /\bwe recommend\b/i,
  /\bstrongly recommend\b/i,
  /\bthe optimal amount is\b/i,
  /\boptimal conversion amount\b/i,
  /\byour best move\b/i,
  /\byour best choice\b/i,
  /\b100%\s+accurate\b/i,
  /\bperfectly accurate\b/i,
  /\bguarantee(?:d|s)?\s+(?:the\s+)?accuracy\b/i,
  /\berror[-\s]?free\b/i,
  /\bzero[-\s]?error\b/i,
];

export function classifyAiQuestion(question: string): AiQuestionClassification {
  if (decisionPatterns.some((pattern) => pattern.test(question))) {
    return "decision_advice";
  }

  if (!topicPatterns.some((pattern) => pattern.test(question))) {
    return "unrelated";
  }

  return "allowed";
}

export function containsForbiddenAdvice(output: string): boolean {
  return forbiddenAdvicePatterns.some((pattern) => pattern.test(output));
}

export function appendDisclaimer(output: string): string {
  if (output.includes(REQUIRED_DISCLAIMER)) {
    return output;
  }

  return `${output.trim()}\n\n${REQUIRED_DISCLAIMER}`;
}
