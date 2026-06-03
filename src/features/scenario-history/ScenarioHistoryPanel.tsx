"use client";

import { RotateCcw, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/common/ui/button";
import { formatCurrency } from "@/common/format/currency";
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
        <div className="mt-4 grid gap-2">
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
      ) : (
        <p className="mt-4 rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-600 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-300">
          No saved scenarios yet.
        </p>
      )}
    </section>
  );
}
