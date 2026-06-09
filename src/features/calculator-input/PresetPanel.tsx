"use client";

import { Button } from "@/common/ui/button";
import type { Dispatch, SetStateAction } from "react";
import type { RothConversionInput } from "@/core/calculator/types";
import { applyScenarioPreset, getScenarioPresets, getStateTaxPresets } from "@/core/calculator/presets";

interface PresetPanelProps {
  value: RothConversionInput;
  onChange: Dispatch<SetStateAction<RothConversionInput>>;
}

export function PresetPanel({ value, onChange }: PresetPanelProps) {
  const scenarioPresets = getScenarioPresets();
  const statePresets = getStateTaxPresets();

  return (
    <div className="grid gap-4 rounded border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
      <div>
        <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">Sample scenarios</h3>
        <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Educational examples only. They are not recommendations.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {scenarioPresets.map((preset) => (
          <Button
            key={preset.id}
            onClick={() => onChange((current) => applyScenarioPreset(current, preset.id))}
            title={`${preset.description} ${preset.disclaimer}`}
            type="button"
            variant="secondary"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <label className="grid min-w-0 gap-2" htmlFor="state-tax-shortcut">
        <span className="text-sm font-semibold text-neutral-950 dark:text-white">State shortcut</span>
        <select
          className="min-h-12 w-full min-w-0 rounded border border-neutral-200 bg-white px-3 text-base text-neutral-950 outline-none transition-colors focus:border-[#0A2463] focus:ring-1 focus:ring-[#0A2463] dark:border-white/15 dark:bg-neutral-950 dark:text-white"
          id="state-tax-shortcut"
          onChange={(event) => {
            const preset = statePresets.find((item) => item.slug === event.target.value);
            if (preset) {
              onChange((current) => ({ ...current, selectedState: preset.slug, stateMarginalTaxRate: preset.rate }));
            }
          }}
          value={value.selectedState ?? ""}
        >
          <option value="">Choose a state example</option>
          {statePresets.map((preset) => (
            <option key={preset.slug} value={preset.slug}>
              {preset.label} - {(preset.rate * 100).toFixed(2)}%
            </option>
          ))}
        </select>
        <span className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          State shortcuts are examples. Verify your actual marginal rate.
        </span>
      </label>
    </div>
  );
}
