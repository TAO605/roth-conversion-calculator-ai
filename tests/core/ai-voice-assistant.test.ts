import React from "react";
import { act } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { AiVoiceAssistant } from "@/features/ai-assistant/AiVoiceAssistant";

const input: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

describe("AiVoiceAssistant", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    Reflect.deleteProperty(window, "SpeechRecognition");
    Reflect.deleteProperty(window, "webkitSpeechRecognition");
    Reflect.deleteProperty(navigator, "mediaDevices");
  });

  it("asks the protected server assistant with calculator context and keeps the disclaimer visible", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ answer: "Review the break-even estimate as an educational projection." }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(React.createElement(AiVoiceAssistant, { input, result: calculateRothConversion(input) }));

    fireEvent.change(screen.getByLabelText(/Ask the AI voice assistant/i), {
      target: { value: "What does break-even mean?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Ask$/i }));

    expect(await screen.findByText(/Review the break-even estimate/i)).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/explain",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      question: "What does break-even mean?",
      input: { conversionAmount: 50000 },
      result: { taxableConversion: 50000 },
    });
    expect(screen.getByText(REQUIRED_DISCLAIMER)).toBeTruthy();
  });

  it("captures a spoken question without turning speech into calculator field edits", async () => {
    let instance: {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onend: (() => void) | null;
      onerror: ((event: { error?: string }) => void) | null;
      onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
      start: () => void;
      stop: () => void;
    } | null = null;

    class FakeSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "";
      onend: (() => void) | null = null;
      onerror: ((event: { error?: string }) => void) | null = null;
      onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null = null;
      start = vi.fn();
      stop = vi.fn();

      constructor() {
        instance = this;
      }
    }

    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: FakeSpeechRecognition,
    });

    render(React.createElement(AiVoiceAssistant, { input, result: calculateRothConversion(input) }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Speak/i }));
    });
    act(() => {
      instance?.onresult?.({ results: [{ 0: { transcript: "why is my upfront cost high" } }] });
    });

    expect((screen.getByLabelText(/Ask the AI voice assistant/i) as HTMLTextAreaElement).value).toBe(
      "why is my upfront cost high",
    );
    expect(screen.getByText(/Question captured/i)).toBeTruthy();
  });

  it("surfaces microphone permission denial as an actionable blocked state", async () => {
    class FakeSpeechRecognition {
      continuous = false;
      interimResults = false;
      lang = "";
      onend: (() => void) | null = null;
      onerror: ((event: { error?: string }) => void) | null = null;
      onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null = null;
      start = vi.fn();
      stop = vi.fn();
    }

    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: FakeSpeechRecognition,
    });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockRejectedValue(new DOMException("denied", "NotAllowedError")),
      },
    });

    render(React.createElement(AiVoiceAssistant, { input, result: calculateRothConversion(input) }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Speak/i }));
    });

    expect(screen.getByText(/Microphone permission is blocked/i)).toBeTruthy();
    expect((screen.getByRole("button", { name: /Speak/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("recovers from API failures without hiding manual calculator output", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network failure")));

    render(React.createElement(AiVoiceAssistant, { input, result: calculateRothConversion(input) }));
    fireEvent.click(screen.getByRole("button", { name: /^Ask$/i }));

    expect(await screen.findByText(/AI voice assistant is temporarily unavailable/i)).toBeTruthy();

    await waitFor(() => {
      expect((screen.getByRole("button", { name: /^Ask$/i }) as HTMLButtonElement).disabled).toBe(false);
    });
  });
});
