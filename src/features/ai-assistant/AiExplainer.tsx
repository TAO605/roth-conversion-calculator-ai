"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import { Card } from "@/common/ui/card";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export function AiExplainer({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const [question, setQuestion] = useState("What does my break-even year mean?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const explain = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, input, result }),
      });
      const data = (await response.json()) as { answer?: string };

      setAnswer(
        data.answer ||
          "The explanation assistant is temporarily unavailable. Please try again later or review the calculator results with a licensed tax professional.",
      );
    } catch {
      setAnswer(
        "The explanation assistant is temporarily unavailable. Please try again later or review the calculator results with a licensed tax professional.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="grid gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-200 bg-white text-systemBlue dark:border-white/10 dark:bg-neutral-950">
          <MessageCircle size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Educational explanation</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">Review this estimate in plain English</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Use it for plain-English explanations of the numbers on this page. It explains rules and assumptions, not
            personal conversion decisions or action amounts.
          </p>
        </div>
      </div>
      <textarea
        aria-label="Ask the explanation assistant a Roth conversion education question"
        className="min-h-20 rounded border border-neutral-200 bg-white p-3 text-sm outline-none transition-colors focus:border-[#0A2463] focus:ring-1 focus:ring-[#0A2463] dark:border-white/15 dark:bg-neutral-950"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {["What is the 5-year rule?", "Why is there a penalty warning?", "What does basis mean?"].map((item) => (
          <Button key={item} onClick={() => setQuestion(item)} type="button" variant="ghost">
            {item}
          </Button>
        ))}
      </div>
      <Button disabled={loading || question.trim().length === 0} onClick={explain} type="button">
        {loading ? "Explaining..." : "Explain"}
      </Button>
      {answer ? <p className="whitespace-pre-line rounded border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 dark:border-white/10 dark:bg-neutral-900">{answer}</p> : null}
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </Card>
  );
}
