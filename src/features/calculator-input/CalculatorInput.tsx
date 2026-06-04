"use client";

import { ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { SelectField, TextField } from "@/common/ui/field";
import type { FilingStatus, RothConversionInput, TaxPaymentMethod } from "@/core/calculator/types";
import { validateCalculatorInput } from "@/core/calculator/validation";
import { PresetPanel } from "@/features/calculator-input/PresetPanel";

interface CalculatorInputProps {
  value: RothConversionInput;
  onChange: Dispatch<SetStateAction<RothConversionInput>>;
}

function numberValue(value: string): number {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function percentDisplayValue(value: number): string {
  const percent = value * 100;

  if (!Number.isFinite(percent)) {
    return "0";
  }

  return Number(percent.toFixed(4)).toString();
}

function DisclosureSummary({ children }: { children: string }) {
  return (
    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-neutral-950 marker:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A2463] focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-neutral-950 [&::-webkit-details-marker]:hidden">
      <span>{children}</span>
      <ChevronDown
        aria-hidden="true"
        className="shrink-0 text-neutral-500 transition-transform group-open:rotate-180 dark:text-neutral-400"
        size={16}
      />
    </summary>
  );
}

export function CalculatorInput({ value, onChange }: CalculatorInputProps) {
  const errors = validateCalculatorInput(value);

  const update = <K extends keyof RothConversionInput>(key: K, nextValue: RothConversionInput[K]) => {
    onChange((current) => ({ ...current, [key]: nextValue }));
  };

  return (
    <div className="grid grid-cols-1 gap-4" data-testid="calculator-input-grid">
      <section className="grid gap-4 rounded border border-neutral-200 bg-white p-4 shadow-none dark:border-white/10 dark:bg-neutral-950">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-systemBlue">
            Quick Estimate
          </p>
          <h3 className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">Core inputs</h3>
          <p className="mt-1 text-xs leading-5 text-neutral-600 dark:text-neutral-300">
            Start with the fields that drive the first result. Advanced assumptions stay below.
          </p>
        </div>
        <div className="grid gap-4" data-testid="quick-estimate-fields">
          <TextField
            label="Conversion amount"
            type="number"
            inputMode="decimal"
            value={value.conversionAmount}
            error={errors.conversionAmount}
            description="Amount you plan to convert from a traditional IRA or 401(k) to Roth."
            onChange={(event) => update("conversionAmount", numberValue(event.target.value))}
          />
          <TextField
            label="Current taxable income"
            type="number"
            inputMode="decimal"
            value={value.currentTaxableIncome}
            onChange={(event) => update("currentTaxableIncome", numberValue(event.target.value))}
          />
          <SelectField
            label="Filing status"
            value={value.filingStatus}
            onChange={(event) => update("filingStatus", event.target.value as FilingStatus)}
          >
            <option value="single">Single</option>
            <option value="married_joint">Married filing jointly</option>
            <option value="head_of_household">Head of household</option>
            <option value="married_separate">Married filing separately</option>
          </SelectField>
          <TextField
            label="State marginal tax rate"
            type="number"
            inputMode="decimal"
            value={percentDisplayValue(value.stateMarginalTaxRate)}
            error={errors.stateMarginalTaxRate}
            description="Enter 0 for no-income-tax states."
            onChange={(event) => update("stateMarginalTaxRate", numberValue(event.target.value) / 100)}
          />
          <TextField
            label="Traditional IRA balance"
            type="number"
            inputMode="decimal"
            value={value.traditionalIraBalance}
            error={errors.traditionalIraBalance}
            description="Used with after-tax basis in advanced assumptions."
            onChange={(event) => update("traditionalIraBalance", numberValue(event.target.value))}
          />
          <details
            className="group rounded border border-neutral-200 bg-white px-3 py-1 shadow-none dark:border-white/10 dark:bg-neutral-950"
            data-testid="projection-assumptions"
          >
            <DisclosureSummary>Projection assumptions</DisclosureSummary>
            <div className="mt-3 grid gap-4" data-testid="projection-assumption-fields">
              <TextField
                label="Retirement age"
                type="number"
                inputMode="numeric"
                value={value.retirementAge}
                error={errors.retirementAge}
                onChange={(event) => update("retirementAge", numberValue(event.target.value))}
              />
              <TextField
                label="Expected annual return"
                type="number"
                inputMode="decimal"
                value={percentDisplayValue(value.expectedAnnualReturn)}
                onChange={(event) => update("expectedAnnualReturn", numberValue(event.target.value) / 100)}
              />
            </div>
          </details>
        </div>
      </section>

      <details
        className="group rounded border border-neutral-200 bg-white px-4 py-2 shadow-none dark:border-white/10 dark:bg-neutral-950"
        data-testid="advanced-inputs"
      >
        <DisclosureSummary>Advanced assumptions</DisclosureSummary>
        <div className="mt-4 grid gap-4">
          <TextField
            label="After-tax basis"
            type="number"
            inputMode="decimal"
            value={value.basis}
            error={errors.basis}
            description="Usually found on IRS Form 8606."
            onChange={(event) => update("basis", numberValue(event.target.value))}
          />
          <TextField
            label="Current age"
            type="number"
            inputMode="numeric"
            value={value.age}
            onChange={(event) => update("age", numberValue(event.target.value))}
          />
          <TextField
            label="Retirement marginal tax rate"
            type="number"
            inputMode="decimal"
            value={percentDisplayValue(value.retirementMarginalTaxRate)}
            onChange={(event) => update("retirementMarginalTaxRate", numberValue(event.target.value) / 100)}
          />
          <SelectField
            label="How will you pay the conversion tax?"
            value={value.taxPaymentMethod}
            description="This matters for possible early distribution penalties."
            onChange={(event) => update("taxPaymentMethod", event.target.value as TaxPaymentMethod)}
          >
            <option value="outside_funds">Outside funds</option>
            <option value="withhold_from_ira">Withhold from IRA distribution</option>
            <option value="not_sure">Not sure</option>
          </SelectField>
          <TextField
            label="Estimated amount withheld from IRA"
            type="number"
            inputMode="decimal"
            value={value.withheldForTaxes}
            error={errors.withheldForTaxes}
            onChange={(event) => update("withheldForTaxes", numberValue(event.target.value))}
          />
          <label className="flex items-center justify-between rounded border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-950">
            <span>
              <span className="block text-sm font-semibold">Penalty exception applies</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Use only if you know an IRS exception applies.
              </span>
            </span>
            <input
              checked={value.penaltyException}
              className="h-6 w-11 accent-systemBlue"
              type="checkbox"
              onChange={(event) => update("penaltyException", event.target.checked)}
            />
          </label>
          <PresetPanel onChange={onChange} value={value} />
        </div>
      </details>
    </div>
  );
}
