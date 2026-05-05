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
      <div className="flex items-center gap-2">
        <MessageCircle className="text-systemBlue" size={20} />
        <h2 className="text-xl font-bold">AI Roth Conversion Explainer</h2>
      </div>
      <textarea
        className="min-h-24 rounded-[14px] border border-neutral-200 bg-white/80 p-3 text-sm outline-none focus:border-systemBlue focus:ring-4 focus:ring-blue-500/15 dark:border-white/15 dark:bg-white/10"
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
