import type { RothConversionInput } from "@/core/calculator/types";

const STORAGE_KEY = "roth-conversion-calculator:scenarios:v1";

export const SCENARIO_HISTORY_LIMIT = 8;

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  input: RothConversionInput;
}

function readScenarios(): SavedScenario[] {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed = JSON.parse(stored) as SavedScenario[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((scenario) => scenario && typeof scenario.id === "string" && scenario.input);
  } catch {
    return [];
  }
}

function writeScenarios(scenarios: SavedScenario[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
}

function createScenarioId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function listSavedScenarios(): SavedScenario[] {
  return readScenarios();
}

export function saveScenario(input: RothConversionInput, name?: string): SavedScenario {
  const savedAt = new Date().toISOString();
  const scenario: SavedScenario = {
    id: createScenarioId(),
    name: name?.trim() || `Scenario saved ${new Date(savedAt).toLocaleString()}`,
    savedAt,
    input,
  };
  const scenarios = [scenario, ...readScenarios()].slice(0, SCENARIO_HISTORY_LIMIT);

  writeScenarios(scenarios);

  return scenario;
}

export function deleteSavedScenario(id: string): void {
  writeScenarios(readScenarios().filter((scenario) => scenario.id !== id));
}
