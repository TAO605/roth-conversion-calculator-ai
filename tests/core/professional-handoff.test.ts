import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { CopyProfessionalHandoffButton } from "@/features/professional-handoff/CopyProfessionalHandoffButton";
import { buildProfessionalHandoffText } from "@/features/professional-handoff/professional-handoff-text";

const input: RothConversionInput = {
  age: 64,
  basis: 5000,
  conversionAmount: 60000,
  currentTaxableIncome: 195000,
  expectedAnnualReturn: 0.06,
  filingStatus: "single",
  inflationRate: 0.025,
  penaltyException: false,
  retirementAge: 65,
  retirementMarginalTaxRate: 0.22,
  stateMarginalTaxRate: 0.05,
  taxPaymentMethod: "outside_funds",
  taxYear: 2026,
  traditionalIraBalance: 300000,
  withheldForTaxes: 0,
};

describe("professional handoff packet", () => {
  it("builds a CPA-friendly review packet without unsupported advice language", () => {
    const packet = buildProfessionalHandoffText(input, calculateRothConversion(input));

    expect(packet).toContain("Roth Conversion Professional Review Packet");
    expect(packet).toContain("Purpose: Educational estimate summary");
    expect(packet).toContain("Calculator inputs to verify");
    expect(packet).toContain("Modeled calculator output");
    expect(packet).toContain("Input-triggered review items");
    expect(packet).toContain("Medicare IRMAA");
    expect(packet).toContain("NIIT MAGI-side review");
    expect(packet).toContain("Form 8606 records");
    expect(packet).toContain(REQUIRED_DISCLAIMER);
    expect(packet).not.toMatch(/\byou should convert\b/i);
    expect(packet).not.toMatch(/\bstrongly recommend\b/i);
    expect(packet).not.toMatch(/\b100%\s+accurate\b/i);
  });

  it("copies the packet to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    render(React.createElement(CopyProfessionalHandoffButton, { input, result: calculateRothConversion(input) }));

    fireEvent.click(screen.getByRole("button", { name: /copy cpa packet/i }));

    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Roth Conversion Professional Review Packet"));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Input-triggered review items"));
    expect(await screen.findByRole("button", { name: /copied/i })).toBeTruthy();
  });

  it("mounts the packet action in the homepage results actions", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(source).toContain("CopyProfessionalHandoffButton");
    expect(source.indexOf("<CopyProfessionalHandoffButton input={input} result={result} />")).toBeGreaterThan(
      source.indexOf("<PdfReportButton input={input} result={result} />"),
    );
  });
});
