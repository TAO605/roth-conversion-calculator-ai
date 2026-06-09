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

const californiaInput: RothConversionInput = {
  ...input,
  selectedState: "california",
  stateMarginalTaxRate: 0.093,
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
    expect(packet).toContain("IRMAA review prep");
    expect(packet).toContain("Usual lookback tax year to verify: 2024");
    expect(packet).toContain("2026 Part B proxy preview");
    expect(packet).toContain("$649.20 per month using calculator income proxy");
    expect(packet).toContain("not SSA's actual lookback-year MAGI determination");
    expect(packet).toContain("Inputs still needed before any premium amount review");
    expect(packet).toContain("ACA premium tax credit review prep");
    expect(packet).toContain("Calculator income proxy before conversion: $195,000");
    expect(packet).toContain("Taxable conversion income increase: $59,000");
    expect(packet).toContain("ACA amount estimate status: missing_marketplace_inputs");
    expect(packet).toContain("cannot estimate ACA premium tax credit dollars from taxable income alone");
    expect(packet).toContain("Inputs still needed before any subsidy amount review");
    expect(packet).toContain("Social Security benefit taxation review prep");
    expect(packet).toContain("Non-Social-Security income proxy before conversion: $195,000");
    expect(packet).toContain("Social Security taxable-benefit amount estimate status: missing_social_security_inputs");
    expect(packet).toContain("cannot estimate taxable Social Security benefit dollars");
    expect(packet).toContain("Inputs still needed before any taxable-benefit amount review");
    expect(packet).toContain("NIIT MAGI-side review");
    expect(packet).toContain("NIIT amount review prep");
    expect(packet).toContain("MAGI proxy before conversion: $195,000");
    expect(packet).toContain("MAGI proxy excess after conversion: $54,000");
    expect(packet).toContain("NIIT amount estimate status: missing_net_investment_income_inputs");
    expect(packet).toContain("cannot estimate NIIT owed from the MAGI proxy alone");
    expect(packet).toContain("Inputs still needed before any NIIT amount review");
    expect(packet).toContain("RMD Uniform Lifetime preview");
    expect(packet).toContain("Traditional IRA balance proxy entered: $300,000");
    expect(packet).toContain("RMD preview status: below_rmd_age");
    expect(packet).toContain("Annual RMD preview: Not estimated");
    expect(packet).toContain("prior December 31 adjusted balance");
    expect(packet).toContain("Inputs still needed before any required amount review");
    expect(packet).toContain("AMT impact review prep");
    expect(packet).toContain("AMT income proxy before conversion: $195,000");
    expect(packet).toContain("AMT amount estimate status: missing_form_6251_inputs");
    expect(packet).toContain("cannot estimate AMT owed");
    expect(packet).toContain("Inputs still needed before any AMT amount review");
    expect(packet).toContain("State rules readiness");
    expect(packet).toContain("State rule registry status: Manual rate only (manual-only)");
    expect(packet).toContain("State rule registry boundary");
    expect(packet).toContain("Manual state marginal rate entered: 5%");
    expect(packet).toContain("Modeled state tax from manual rate: $2,950");
    expect(packet).toContain("State amount estimate status: manual_rate_only");
    expect(packet).toContain(
      "Supported state example pages: California (CA, Needs state review, worksheet ready), Texas (TX, No broad individual income tax), Florida (FL, No broad individual income tax), New York (NY, Needs state review, worksheet ready), Washington (WA, No broad individual income tax), New Jersey (NJ, Needs state review, worksheet ready)",
    );
    expect(packet).toContain("does not determine residency");
    expect(packet).toContain("Inputs still needed before any state-specific amount review");
    expect(packet).toContain("Form 8606 records");
    expect(packet).toContain(REQUIRED_DISCLAIMER);
    expect(packet).not.toMatch(/\byou should convert\b/i);
    expect(packet).not.toMatch(/\bstrongly recommend\b/i);
    expect(packet).not.toMatch(/\b100%\s+accurate\b/i);
    expect(packet).not.toMatch(/full state-law engine is active|final state tax/i);
  });

  it("adds selected-state amount-readiness worksheet details to the CPA packet", () => {
    const packet = buildProfessionalHandoffText(californiaInput, calculateRothConversion(californiaInput));

    expect(packet).toContain("State rule registry status: Needs state review (needs-review)");
    expect(packet).toContain("California State Amount Readiness");
    expect(packet).toContain("Selected-state amount readiness status: state_specific_inputs_missing");
    expect(packet).toContain("Official source checklist");
    expect(packet).toContain("Compare the federal taxable IRA distribution with California taxable IRA distribution rules");
    expect(packet).toContain("Inputs still needed before selected-state amount review");
    expect(packet).toContain("California Schedule CA adjustment detail");
    expect(packet).not.toMatch(/final state tax|complete state-law|you should|strongly recommend/i);
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
    const source = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(source).toContain("CopyProfessionalHandoffButton");
    expect(source).toContain('isFeatureEnabled("professional-handoff")');
    expect(source.indexOf("<CopyProfessionalHandoffButton input={input} result={result} />")).toBeGreaterThan(
      source.indexOf("<PdfReportButton input={input} result={result} />"),
    );
  });
});
