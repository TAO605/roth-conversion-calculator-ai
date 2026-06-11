"use client";

import { Mic, MicOff, MessageCircle, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/common/ui/button";
import { Card } from "@/common/ui/card";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

async function requestMicrophoneAccess(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text.trim()) {
    return false;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  return true;
}

export function AiVoiceAssistant({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const recognitionConstructor = useMemo(() => getSpeechRecognition(), []);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [question, setQuestion] = useState("What does my break-even year mean?");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("Ask a question about the current estimate.");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrophoneBlocked, setIsMicrophoneBlocked] = useState(false);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const askAssistant = async (nextQuestion = question) => {
    const trimmed = nextQuestion.trim();

    if (!trimmed) {
      setStatus("Enter or speak a question before asking.");
      return;
    }

    setIsLoading(true);
    setAnswer("");
    setStatus("Preparing an educational explanation.");

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, input, result }),
      });
      const data = (await response.json()) as { answer?: string };
      const nextAnswer =
        data.answer ||
        "The AI voice assistant is temporarily unavailable. Please review the calculator results with a licensed tax professional.";

      setAnswer(nextAnswer);
      setStatus("Answer ready. Review the explanation before using it for planning.");
    } catch {
      setAnswer(
        "The AI voice assistant is temporarily unavailable. Please review the calculator results with a licensed tax professional.",
      );
      setStatus("Assistant request failed. Manual calculator inputs and results remain available.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = async () => {
    if (!recognitionConstructor) {
      setStatus("Voice listening is unavailable in this browser. Text questions still work.");
      return;
    }

    const hasMicrophoneAccess = await requestMicrophoneAccess();

    if (!hasMicrophoneAccess) {
      setIsMicrophoneBlocked(true);
      setStatus("Microphone permission is blocked. Allow microphone access in the browser address bar, then try again.");
      return;
    }

    const recognition = new recognitionConstructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsMicrophoneBlocked(true);
        setStatus("Microphone permission is blocked. Allow microphone access in the browser address bar, then try again.");
        return;
      }

      setStatus(event.error ? `Voice listening stopped: ${event.error}. Use text if needed.` : "Voice listening stopped.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) {
        setStatus("No question was detected. Try again or type your question.");
        return;
      }

      setQuestion(transcript);
      setStatus("Question captured. Ask the assistant when ready.");
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    setStatus("Listening for one question about this estimate.");

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setStatus("Voice listening could not start in this browser. Text questions still work.");
    }
  };

  const readAnswer = () => {
    if (!speakText(answer)) {
      setStatus("Read aloud is unavailable in this browser.");
      return;
    }

    setStatus("Reading the current answer aloud.");
  };

  return (
    <Card className="grid gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded border border-neutral-200 bg-white text-systemBlue dark:border-white/10 dark:bg-neutral-950">
          <MessageCircle aria-hidden="true" size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">AI voice assistant</p>
          <h2 className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">Ask about this estimate</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Ask educational questions about the numbers on this page. Voice stays in the browser; explanations are
            routed through the protected server assistant.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <textarea
          aria-label="Ask the AI voice assistant a Roth conversion education question"
          className="min-h-20 rounded border border-neutral-200 bg-white p-3 text-sm outline-none transition-colors focus:border-[#0A2463] focus:ring-1 focus:ring-[#0A2463] dark:border-white/15 dark:bg-neutral-950"
          onChange={(event) => setQuestion(event.target.value)}
          value={question}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <Button disabled={isMicrophoneBlocked || isLoading} onClick={isListening ? stopListening : startListening} type="button" variant="ghost">
            {isListening ? <MicOff aria-hidden="true" size={16} /> : <Mic aria-hidden="true" size={16} />}
            {isListening ? "Stop" : "Speak"}
          </Button>
          <Button disabled={isLoading || question.trim().length === 0} onClick={() => askAssistant()} type="button">
            {isLoading ? "Asking..." : "Ask"}
          </Button>
          <Button disabled={!answer || isLoading} onClick={readAnswer} type="button" variant="ghost">
            <Volume2 aria-hidden="true" size={16} />
            Read
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["What does my break-even year mean?", "Why is there a penalty warning?", "What tax items need review?"].map(
          (item) => (
            <Button key={item} onClick={() => setQuestion(item)} type="button" variant="ghost">
              {item}
            </Button>
          ),
        )}
      </div>

      <p aria-live="polite" className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
        {status}
      </p>
      {answer ? (
        <p className="whitespace-pre-line rounded border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 dark:border-white/10 dark:bg-neutral-900">
          {answer}
        </p>
      ) : null}
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </Card>
  );
}
