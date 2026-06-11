"use client";

import { ChevronDown } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { SelectField, TextField } from "@/common/ui/field";
import { getStateRuleRegistryEntry } from "@/content/state-rule-registry";
import type {
  FilingStatus,
  RothConversionInput,
  StateReadinessInputs,
  StateResidencyStatus,
  TaxPaymentMethod,
} from "@/core/calculator/types";
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

function optionalNumberValue(value: string): number | null {
  if (value.trim() === "") {
    return null;
  }

  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function optionalNumberDisplayValue(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "";
}

function defaultStateReadinessInputs(): StateReadinessInputs {
  return {
    localTaxApplies: null,
    notes: "",
    otherStateTaxCreditApplies: null,
    reviewedStateTaxEstimate: null,
    residencyStatus: "not_provided",
    stateAdjustedGrossIncome: null,
    stateIraBasis: null,
  };
}

function yesNoUnknown(value: boolean | null | undefined): string {
  if (value === true) {
    return "yes";
  }

  if (value === false) {
    return "no";
  }

  return "unknown";
}

function yesNoUnknownValue(value: string): boolean | null {
  if (value === "yes") {
    return true;
  }

  if (value === "no") {
    return false;
  }

  return null;
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
  const selectedStateRule = getStateRuleRegistryEntry(value.selectedState);
  const showStateReadinessInputs = selectedStateRule.amountReadiness !== undefined;
  const readinessInputs = value.stateReadinessInputs ?? defaultStateReadinessInputs();

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
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                selectedState: null,
                stateReadinessInputs: undefined,
                stateMarginalTaxRate: numberValue(event.target.value) / 100,
              }))
            }
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
            label="Net investment income for NIIT review"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.netInvestmentIncome)}
            error={errors.netInvestmentIncome}
            description="Optional Form 8960 review input. Leave blank if you do not know this amount."
            onChange={(event) => update("netInvestmentIncome", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Annual Social Security benefits"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.annualSocialSecurityBenefits)}
            error={errors.annualSocialSecurityBenefits}
            description="Optional Form SSA-1099 box 5 input for taxable-benefit review."
            onChange={(event) => update("annualSocialSecurityBenefits", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Tax-exempt interest for Social Security review"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.taxExemptInterest)}
            error={errors.taxExemptInterest}
            description="Optional Publication 915 combined-income input. Leave blank if none or unknown."
            onChange={(event) => update("taxExemptInterest", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Annual advance premium tax credit"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.annualAdvancePremiumTaxCredit)}
            error={errors.annualAdvancePremiumTaxCredit}
            description="Optional Form 1095-A / Form 8962 APTC amount for Marketplace reconciliation review."
            onChange={(event) => update("annualAdvancePremiumTaxCredit", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Marketplace coverage months"
            type="number"
            inputMode="numeric"
            value={optionalNumberDisplayValue(value.marketplaceCoverageMonths)}
            error={errors.marketplaceCoverageMonths}
            description="Optional count from Marketplace coverage records. Use 0-12."
            onChange={(event) => update("marketplaceCoverageMonths", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Form 6251 tentative minimum tax"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.amtTentativeMinimumTax)}
            error={errors.amtTentativeMinimumTax}
            description="Optional Form 6251 comparison input. This does not calculate AMTI or exemptions."
            onChange={(event) => update("amtTentativeMinimumTax", optionalNumberValue(event.target.value))}
          />
          <TextField
            label="Regular tax liability for AMT comparison"
            type="number"
            inputMode="decimal"
            value={optionalNumberDisplayValue(value.amtRegularTaxLiability)}
            error={errors.amtRegularTaxLiability}
            description="Optional regular-tax comparison amount from tax software or Form 6251 review."
            onChange={(event) => update("amtRegularTaxLiability", optionalNumberValue(event.target.value))}
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
          {showStateReadinessInputs ? (
            <details
              className="group rounded border border-neutral-200 bg-white px-3 py-1 shadow-none dark:border-white/10 dark:bg-neutral-950"
              data-testid="state-readiness-inputs"
            >
              <DisclosureSummary>{selectedStateRule.amountReadiness?.worksheetTitle ?? "State amount readiness"}</DisclosureSummary>
              <div className="mt-3 grid gap-4">
                <SelectField
                  label="Residency status for selected state"
                  value={readinessInputs.residencyStatus}
                  description="Used only for professional review readiness, not by the calculator formula."
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      residencyStatus: event.target.value as StateResidencyStatus,
                    })
                  }
                >
                  <option value="not_provided">Not provided</option>
                  <option value="resident">Resident</option>
                  <option value="part_year">Part-year resident</option>
                  <option value="nonresident">Nonresident</option>
                </SelectField>
                <TextField
                  label="State adjusted gross income"
                  type="number"
                  inputMode="decimal"
                  value={optionalNumberDisplayValue(readinessInputs.stateAdjustedGrossIncome)}
                  description="Optional worksheet input. Leave blank if you only have federal taxable income."
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      stateAdjustedGrossIncome: optionalNumberValue(event.target.value),
                    })
                  }
                />
                <TextField
                  label="State IRA basis or already-taxed amount"
                  type="number"
                  inputMode="decimal"
                  value={optionalNumberDisplayValue(readinessInputs.stateIraBasis)}
                  description="Optional state-specific basis value for professional review."
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      stateIraBasis: optionalNumberValue(event.target.value),
                    })
                  }
                />
                <TextField
                  label="Reviewed state tax estimate"
                  type="number"
                  inputMode="decimal"
                  value={optionalNumberDisplayValue(readinessInputs.reviewedStateTaxEstimate)}
                  description="Optional tax software or CPA-reviewed state tax amount. It is compared with the manual-rate estimate only."
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      reviewedStateTaxEstimate: optionalNumberValue(event.target.value),
                    })
                  }
                />
                <SelectField
                  label="Local tax may apply"
                  value={yesNoUnknown(readinessInputs.localTaxApplies)}
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      localTaxApplies: yesNoUnknownValue(event.target.value),
                    })
                  }
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </SelectField>
                <SelectField
                  label="Other-state tax credit may apply"
                  value={yesNoUnknown(readinessInputs.otherStateTaxCreditApplies)}
                  onChange={(event) =>
                    update("stateReadinessInputs", {
                      ...readinessInputs,
                      otherStateTaxCreditApplies: yesNoUnknownValue(event.target.value),
                    })
                  }
                >
                  <option value="unknown">Unknown</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </SelectField>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    State review notes
                  </span>
                  <textarea
                    className="min-h-24 w-full min-w-0 rounded border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-950 outline-none transition-colors focus:border-[#0A2463] focus:ring-1 focus:ring-[#0A2463] dark:border-white/15 dark:bg-neutral-950 dark:text-white"
                    maxLength={500}
                    value={readinessInputs.notes}
                    onChange={(event) =>
                      update("stateReadinessInputs", {
                        ...readinessInputs,
                        notes: event.target.value.slice(0, 500),
                      })
                    }
                  />
                  <span className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    Optional notes for CPA handoff. Do not enter account numbers, SSNs, or private credentials.
                  </span>
                </label>
              </div>
            </details>
          ) : null}
        </div>
      </details>
    </div>
  );
}
