import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { RothConversionInput } from "@/core/calculator/types";
import { buildSharePayload, ShareResultButton } from "@/features/share-link/ShareResultButton";

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

function setNavigatorShare(share: ((data: ShareData) => Promise<void>) | undefined) {
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
}

function setClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("ShareResultButton", () => {
  it("builds a native share payload with an educational title and URL", () => {
    const payload = buildSharePayload("https://www.roth-conversion-calculator-ai.shop/#example");

    expect(payload).toMatchObject({
      title: "Roth Conversion Calculator 2026",
      text: "Review this educational Roth conversion calculator scenario.",
      url: "https://www.roth-conversion-calculator-ai.shop/#example",
    });
  });

  it("uses native Web Share when available", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorShare(share);
    setClipboard(writeText);

    render(React.createElement(ShareResultButton, { input }));
    fireEvent.click(screen.getByRole("button", { name: /share result/i }));

    expect(await screen.findByRole("button", { name: /shared/i })).toBeTruthy();
    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Roth Conversion Calculator 2026",
        url: expect.stringContaining("#"),
      }),
    );
    expect(writeText).not.toHaveBeenCalled();
  });

  it("falls back to clipboard when native share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorShare(undefined);
    setClipboard(writeText);

    render(React.createElement(ShareResultButton, { input }));
    fireEvent.click(screen.getByRole("button", { name: /share result/i }));

    expect(await screen.findByRole("button", { name: /copied link/i })).toBeTruthy();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("#"));
  });
});
