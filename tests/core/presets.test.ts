import { describe, expect, it } from "vitest";
import { applyScenarioPreset, getScenarioPresets, getStateTaxPresets } from "@/core/calculator/presets";
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

describe("calculator presets", () => {
  it("exposes three educational scenario presets", () => {
    const presets = getScenarioPresets();

    expect(presets).toHaveLength(3);
    expect(presets.every((preset) => preset.disclaimer.includes("sample scenario"))).toBe(true);
  });

  it("applies a scenario preset without changing tax year or claiming recommendation", () => {
    const preset = getScenarioPresets()[0];
    const applied = applyScenarioPreset(baseInput, preset.id);

    expect(applied.taxYear).toBe(2026);
    expect(applied.conversionAmount).not.toBe(baseInput.conversionAmount);
  });

  it("includes state tax shortcuts for no-tax and high-tax examples", () => {
    const presets = getStateTaxPresets();

    expect(presets.find((preset) => preset.stateCode === "TX")?.rate).toBe(0);
    expect(presets.find((preset) => preset.stateCode === "CA")?.rate).toBeGreaterThan(0.09);
  });
});
