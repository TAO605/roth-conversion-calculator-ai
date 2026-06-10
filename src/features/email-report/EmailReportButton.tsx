"use client";

import { Mail } from "lucide-react";
import { Button } from "@/common/ui/button";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildResultSummaryText } from "@/features/result-copy/result-summary-text";

export function buildReportMailtoHref(input: RothConversionInput, result: RothConversionResult): string {
  const subject = `Roth conversion calculator summary ${input.taxYear}`;
  const body = [
    buildResultSummaryText(input, result),
    "",
    "Review note: This email draft is created locally in your browser. Confirm assumptions with a qualified tax professional before using it for a filing or planning decision.",
  ].join("\n");

  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EmailReportButton({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const openEmailDraft = () => {
    window.location.href = buildReportMailtoHref(input, result);
  };

  return (
    <Button onClick={openEmailDraft} type="button" variant="secondary">
      <Mail aria-hidden="true" size={16} />
      Email draft
    </Button>
  );
}
