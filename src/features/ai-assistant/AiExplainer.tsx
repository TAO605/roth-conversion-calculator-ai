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
          "The AI explainer is temporarily unavailable. Please try again later or review the calculator results with a licensed tax professional.",
      );
    } catch {
      setAnswer(
        "The AI explainer is temporarily unavailable. Please try again later or review the calculator results with a licensed tax professional.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="grid gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-systemBlue">
          <MessageCircle size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Educational AI helper</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">Ask AI to explain this estimate</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Use it for plain-English explanations of the numbers on this page. It explains rules and assumptions, not
            personal conversion decisions or action amounts.
          </p>
        </div>
      </div>
      <textarea
        aria-label="Ask the AI explainer a Roth conversion education question"
        className="min-h-20 rounded-[14px] border border-neutral-200 bg-white/80 p-3 text-sm outline-none focus:border-systemBlue focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-white/10"
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
      {answer ? <p className="whitespace-pre-line rounded-[16px] bg-white/65 p-4 text-sm leading-6 dark:bg-white/10">{answer}</p> : null}
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </Card>
  );
}
