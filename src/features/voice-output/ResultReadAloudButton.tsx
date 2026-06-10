"use client";

import { Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatBreakEven(value: number | null): string {
  return value === null ? "no modeled break-even year" : `modeled break-even around year ${value}`;
}

export function buildResultReadAloudText(input: RothConversionInput, result: RothConversionResult): string {
  return [
    `Educational Roth conversion estimate for tax year ${input.taxYear}.`,
    `Modeled taxable conversion is ${formatMoney(result.taxableConversion)}.`,
    `Estimated federal tax is ${formatMoney(result.federalTax)}.`,
    `User-estimated state tax is ${formatMoney(result.stateTax)}.`,
    `Total upfront cost estimate is ${formatMoney(result.totalUpfrontCost)}.`,
    `The projection shows ${formatBreakEven(result.breakEvenYear)}.`,
    "This is not tax advice. Review the scenario with a qualified tax professional before making a conversion decision.",
  ].join(" ");
}

function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function ResultReadAloudButton({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const [status, setStatus] = useState("");
  const text = useMemo(() => buildResultReadAloudText(input, result), [input, result]);
  const supported = canSpeak();

  const readAloud = () => {
    if (!supported) {
      setStatus("Read aloud is unavailable in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => setStatus("Read aloud finished.");
    window.speechSynthesis.speak(utterance);
    setStatus("Reading estimate aloud.");
  };

  return (
    <div className="grid gap-1">
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:ring-offset-2 disabled:cursor-not-allowed disabled:text-neutral-400 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900 dark:focus:ring-offset-neutral-950"
        disabled={!supported}
        onClick={readAloud}
        type="button"
      >
        <Volume2 aria-hidden="true" size={16} />
        Read aloud
      </button>
      {status ? (
        <span aria-live="polite" className="text-center text-[11px] leading-4 text-neutral-500 dark:text-neutral-400">
          {status}
        </span>
      ) : null}
    </div>
  );
}
