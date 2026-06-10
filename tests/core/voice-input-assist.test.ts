import React from "react";
import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { parseVoiceInputCommand, VoiceInputAssist } from "@/features/voice-input/VoiceInputAssist";
import type { RothConversionInput } from "@/core/calculator/types";

const baseInput: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
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

describe("voice input assist", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "SpeechRecognition");
    Reflect.deleteProperty(window, "webkitSpeechRecognition");
    Reflect.deleteProperty(navigator, "mediaDevices");
    Reflect.deleteProperty(navigator, "permissions");
  });

  it("parses supported voice phrases into bounded calculator field updates", () => {
    expect(parseVoiceInputCommand("conversion amount 90000")).toEqual({
      field: "conversionAmount",
      value: 90000,
    });
    expect(parseVoiceInputCommand("current taxable income 110000")).toEqual({
      field: "currentTaxableIncome",
      value: 110000,
    });
    expect(parseVoiceInputCommand("state tax rate 5")).toEqual({
      field: "stateMarginalTaxRate",
      value: 0.05,
    });
    expect(parseVoiceInputCommand("traditional IRA balance 300000")).toEqual({
      field: "traditionalIraBalance",
      value: 300000,
    });
  });

  it("rejects unsupported or unsafe phrases instead of guessing a tax field", () => {
    expect(parseVoiceInputCommand("what is the best Roth conversion amount")).toBeNull();
    expect(parseVoiceInputCommand("conversion amount minus 500")).toBeNull();
    expect(parseVoiceInputCommand("please advise me")).toBeNull();
  });

  it("applies recognized speech through functional calculator state updates", async () => {
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

    const onChange = vi.fn();
    render(React.createElement(VoiceInputAssist, { onChange }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Speak/i }));
    });
    act(() => {
      instance?.onresult?.({ results: [{ 0: { transcript: "conversion amount 75000" } }] });
    });

    expect(onChange).toHaveBeenCalledWith(expect.any(Function));
    expect(onChange.mock.lastCall?.[0](baseInput)).toMatchObject({ conversionAmount: 75000 });
    expect(screen.getByText(/Applied voice input/i)).toBeTruthy();
  });

  it("turns microphone permission failures into a clear blocked state", async () => {
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

    render(React.createElement(VoiceInputAssist, { onChange: vi.fn() }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Speak/i }));
    });

    expect(screen.getByText(/Microphone permission is blocked/i)).toBeTruthy();
    expect((screen.getByRole("button", { name: /Speak/i }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("keeps voice support browser-only and out of structured-data claims", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/features/voice-input/VoiceInputAssist.tsx"), "utf8");
    const jsonLd = fs.readFileSync(path.join(process.cwd(), "src/core/seo/json-ld.ts"), "utf8");

    expect(source).toContain("SpeechRecognition");
    expect(source).toContain("getUserMedia");
    expect(source).toContain("Microphone permission is blocked");
    expect(source).toContain("No audio is sent to this site");
    expect(source).not.toContain("fetch(");
    expect(jsonLd).not.toMatch(/voiceInput|voiceOutput/i);
  });
});
