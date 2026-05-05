"use client";

import { Clipboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildResultSummaryText } from "@/features/result-copy/result-summary-text";

export function CopyResultButton({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const [label, setLabel] = useState("Copy summary");

  const copySummary = async () => {
    await navigator.clipboard.writeText(buildResultSummaryText(input, result));
    setLabel("Copied");
    window.setTimeout(() => setLabel("Copy summary"), 1600);
  };

  return (
    <Button onClick={copySummary} type="button" variant="secondary">
      <Clipboard aria-hidden="true" size={16} />
      {label}
    </Button>
  );
}
