"use client";

import { useEffect } from "react";
import { buildCalculatorAnalyticsEvent } from "@/core/analytics/ga";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params: Record<string, string | number>) => void;
  }
}

export function CalculatorAnalyticsBeacon({
  input,
  result,
}: {
  input: RothConversionInput;
  result: RothConversionResult;
}) {
  useEffect(() => {
    const event = buildCalculatorAnalyticsEvent(input, result);
    const timeoutId = window.setTimeout(() => {
      window.gtag?.("event", event.name, event.params);
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [input, result]);

  return null;
}
