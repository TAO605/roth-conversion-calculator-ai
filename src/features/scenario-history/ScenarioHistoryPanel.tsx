"use client";

import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/common/ui/button";
import { formatCurrency } from "@/common/format/currency";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import { validateCalculatorInput } from "@/core/calculator/validation";
import {
  deleteSavedScenario,
  listSavedScenarios,
  saveScenario,
  type SavedScenario,
} from "@/common/storage/scenario-history";
import type { RothConversionInput } from "@/core/calculator/types";

export function ScenarioHistoryPanel({
  input,
  onRestore,
}: {
  input: RothConversionInput;
  onRestore: (input: RothConversionInput) => void;
}) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  useEffect(() => {
    setScenarios(listSavedScenarios());
  }, []);

  const saveCurrentScenario = () => {
    const name = `${formatCurrency(input.conversionAmount)} conversion`;
    saveScenario(input, name);
    setScenarios(listSavedScenarios());
  };

  const deleteScenario = (id: string) => {
    deleteSavedScenario(id);
    setScenarios(listSavedScenarios());
  };

  const comparisonRows = scenarios.map((scenario) => {
    const errors = validateCalculatorInput(scenario.input);
    const hasErrors = Object.keys(errors).length > 0;
    const result = hasErrors ? null : calculateRothConversion(scenario.input);

    return {
      hasErrors,
      result,
      scenario,
    };
  });

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Saved scenarios</h3>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Keep local snapshots for quick comparisons. Nothing is uploaded.
          </p>
        </div>
        <Button onClick={saveCurrentScenario} type="button" variant="secondary">
          <Save aria-hidden="true" size={16} />
          Save scenario
        </Button>
      </div>

      {scenarios.length > 0 ? (
        <div className="mt-4 grid gap-4">
          <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-white/10">
            <table className="min-w-[46rem] w-full text-left text-sm">
              <caption className="sr-only">Local saved scenario comparison</caption>
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="px-3 py-2 font-semibold" scope="col">Scenario</th>
                  <th className="px-3 py-2 font-semibold" scope="col">Conversion</th>
                  <th className="px-3 py-2 font-semibold" scope="col">Income</th>
                  <th className="px-3 py-2 font-semibold" scope="col">Federal</th>
                  <th className="px-3 py-2 font-semibold" scope="col">State</th>
                  <th className="px-3 py-2 font-semibold" scope="col">Upfront cost</th>
                  <th className="px-3 py-2 font-semibold" scope="col">Break-even</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
                {comparisonRows.map(({ hasErrors, result, scenario }) => (
                  <tr className="text-neutral-700 dark:text-neutral-200" key={scenario.id}>
                    <th className="px-3 py-2 font-semibold text-neutral-950 dark:text-white" scope="row">
                      {scenario.name}
                    </th>
                    <td className="px-3 py-2">{formatCurrency(scenario.input.conversionAmount)}</td>
                    <td className="px-3 py-2">{formatCurrency(scenario.input.currentTaxableIncome)}</td>
                    <td className="px-3 py-2">{result ? formatCurrency(result.federalTax) : "Needs valid input"}</td>
                    <td className="px-3 py-2">{result ? formatCurrency(result.stateTax) : "Needs valid input"}</td>
                    <td className="px-3 py-2">{result ? formatCurrency(result.totalUpfrontCost) : "Needs valid input"}</td>
                    <td className="px-3 py-2">
                      {hasErrors ? "Needs valid input" : result?.breakEvenYear === null ? "Not reached" : `${result?.breakEvenYear} yrs`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Comparison rows are local educational estimates only. Use them to organize assumptions before qualified
            professional review, not as a recommendation.
          </p>
          <div className="grid gap-2">
          {scenarios.map((scenario) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-neutral-950"
              key={scenario.id}
            >
              <div>
                <p className="text-sm font-semibold text-neutral-950 dark:text-white">{scenario.name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Saved {new Date(scenario.savedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  aria-label={`Restore ${scenario.name}`}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-systemBlue transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-systemBlue dark:hover:bg-white/10"
                  onClick={() => onRestore(scenario.input)}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={16} />
                </button>
                <button
                  aria-label={`Delete ${scenario.name}`}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-systemRed transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-systemRed dark:hover:bg-white/10"
                  onClick={() => deleteScenario(scenario.id)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300">
          No saved scenarios yet.
        </p>
      )}
    </section>
  );
}
