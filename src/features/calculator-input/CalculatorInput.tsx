"use client";

import { SelectField, TextField } from "@/common/ui/field";
import type { FilingStatus, RothConversionInput, TaxPaymentMethod } from "@/core/calculator/types";
import { validateCalculatorInput } from "@/core/calculator/validation";
import { PresetPanel } from "@/features/calculator-input/PresetPanel";

interface CalculatorInputProps {
  value: RothConversionInput;
  onChange: (value: RothConversionInput) => void;
}

function numberValue(value: string): number {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

export function CalculatorInput({ value, onChange }: CalculatorInputProps) {
  const errors = validateCalculatorInput(value);

  const update = <K extends keyof RothConversionInput>(key: K, nextValue: RothConversionInput[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <PresetPanel onChange={onChange} value={value} />
      </div>
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
        label="Traditional IRA balance"
        type="number"
        inputMode="decimal"
        value={value.traditionalIraBalance}
        error={errors.traditionalIraBalance}
        description="Used for pro-rata basis calculations."
        onChange={(event) => update("traditionalIraBalance", numberValue(event.target.value))}
      />
      <TextField
        label="After-tax basis"
        type="number"
        inputMode="decimal"
        value={value.basis}
        error={errors.basis}
        description="Usually found on IRS Form 8606."
        onChange={(event) => update("basis", numberValue(event.target.value))}
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
        label="Current taxable income"
        type="number"
        inputMode="decimal"
        value={value.currentTaxableIncome}
        onChange={(event) => update("currentTaxableIncome", numberValue(event.target.value))}
      />
      <TextField
        label="State marginal tax rate"
        type="number"
        inputMode="decimal"
        value={value.stateMarginalTaxRate * 100}
        error={errors.stateMarginalTaxRate}
        description="Enter 0 for no-income-tax states."
        onChange={(event) => update("stateMarginalTaxRate", numberValue(event.target.value) / 100)}
      />
      <TextField
        label="Current age"
        type="number"
        inputMode="numeric"
        value={value.age}
        onChange={(event) => update("age", numberValue(event.target.value))}
      />
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
        value={value.expectedAnnualReturn * 100}
        onChange={(event) => update("expectedAnnualReturn", numberValue(event.target.value) / 100)}
      />
      <TextField
        label="Retirement marginal tax rate"
        type="number"
        inputMode="decimal"
        value={value.retirementMarginalTaxRate * 100}
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
      <label className="flex items-center justify-between rounded-[14px] bg-white/60 px-4 py-3 dark:bg-white/10 md:col-span-2">
        <span>
          <span className="block text-sm font-semibold">Penalty exception applies</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Use only if you know an IRS exception applies.</span>
        </span>
        <input
          checked={value.penaltyException}
          className="h-6 w-11 accent-systemBlue"
          type="checkbox"
          onChange={(event) => update("penaltyException", event.target.checked)}
        />
      </label>
    </div>
  );
}
