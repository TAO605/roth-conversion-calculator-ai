"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { RothConversionInput } from "@/core/calculator/types";

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

type VoiceField =
  | "age"
  | "basis"
  | "conversionAmount"
  | "currentTaxableIncome"
  | "retirementAge"
  | "stateMarginalTaxRate"
  | "traditionalIraBalance";

interface ParsedVoiceCommand {
  field: VoiceField;
  value: number;
}

const fieldMatchers: Array<{ field: VoiceField; pattern: RegExp; percent?: boolean }> = [
  { field: "conversionAmount", pattern: /\b(?:conversion|convert|roth conversion)(?: amount)?\b/i },
  { field: "currentTaxableIncome", pattern: /\b(?:current taxable income|taxable income|income)\b/i },
  { field: "traditionalIraBalance", pattern: /\b(?:traditional ira balance|ira balance|traditional balance)\b/i },
  { field: "stateMarginalTaxRate", pattern: /\b(?:state marginal tax rate|state tax rate|state rate)\b/i, percent: true },
  { field: "basis", pattern: /\b(?:after tax basis|basis)\b/i },
  { field: "age", pattern: /\b(?:current age|age)\b/i },
  { field: "retirementAge", pattern: /\b(?:retirement age)\b/i },
];

function normalizeSpokenNumber(text: string): number | null {
  const compact = text.replace(/,/g, "");
  const match = compact.match(/-?\d+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

export function parseVoiceInputCommand(transcript: string): ParsedVoiceCommand | null {
  const normalized = transcript.trim().toLowerCase();

  if (/\b(?:minus|negative)\b/.test(normalized)) {
    return null;
  }

  const value = normalizeSpokenNumber(normalized);

  if (value === null || value < 0) {
    return null;
  }

  const matched = fieldMatchers.find((candidate) => candidate.pattern.test(normalized));

  if (!matched) {
    return null;
  }

  return {
    field: matched.field,
    value: matched.percent ? value / 100 : value,
  };
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

async function getMicrophonePermissionState(): Promise<PermissionState | null> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return null;
  }

  try {
    const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return status.state;
  } catch {
    return null;
  }
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

export function VoiceInputAssist({ onChange }: { onChange: Dispatch<SetStateAction<RothConversionInput>> }) {
  const recognitionConstructor = useMemo(() => getSpeechRecognition(), []);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMicrophoneBlocked, setIsMicrophoneBlocked] = useState(false);
  const [status, setStatus] = useState(
    recognitionConstructor
      ? "Say a supported field and amount, then review the filled value."
      : "Voice input is unavailable in this browser.",
  );

  useEffect(() => {
    let isMounted = true;

    getMicrophonePermissionState().then((permissionState) => {
      if (!isMounted || permissionState !== "denied") {
        return;
      }

      setIsMicrophoneBlocked(true);
      setStatus("Microphone permission is blocked. Allow microphone access in the browser address bar, then try again.");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  if (!recognitionConstructor) {
    return (
      <div className="rounded border border-neutral-200 bg-white p-3 text-xs leading-5 text-neutral-500 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400">
        <p className="text-sm font-semibold text-neutral-950 dark:text-white">Voice input assist</p>
        <p className="mt-1">Voice input is unavailable in this browser. Manual inputs remain fully supported.</p>
      </div>
    );
  }

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = async () => {
    const hasMicrophoneAccess = await requestMicrophoneAccess();

    if (!hasMicrophoneAccess) {
      setIsListening(false);
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

      setStatus(event.error ? `Voice input stopped: ${event.error}. Try again or use manual inputs.` : "Voice input stopped.");
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      const parsed = parseVoiceInputCommand(transcript);

      if (!parsed) {
        setStatus("Could not match that phrase. Try: conversion amount 50000.");
        return;
      }

      onChange((current) => ({ ...current, [parsed.field]: parsed.value }));
      setStatus("Applied voice input. Review the updated field before using the estimate.");
    };

    recognitionRef.current = recognition;
    setStatus("Listening for one field, such as conversion amount 50000.");
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setStatus("Voice input could not start in this browser. Manual inputs remain fully supported.");
    }
  };

  return (
    <div className="rounded border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-neutral-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-950 dark:text-white">Voice input assist</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Browser-only helper for supported numeric fields. No audio is sent to this site.
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900 dark:focus:ring-offset-neutral-950"
          disabled={isMicrophoneBlocked}
          onClick={isListening ? stopListening : startListening}
          type="button"
        >
          {isListening ? <MicOff aria-hidden="true" size={16} /> : <Mic aria-hidden="true" size={16} />}
          {isListening ? "Stop" : "Speak"}
        </button>
      </div>
      <p aria-live="polite" className="mt-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
        {status}
      </p>
    </div>
  );
}
