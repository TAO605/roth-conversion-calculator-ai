import { beforeEach, describe, expect, it } from "vitest";
import type { RothConversionInput } from "@/core/calculator/types";
import {
  deleteSavedScenario,
  listSavedScenarios,
  saveScenario,
  SCENARIO_HISTORY_LIMIT,
} from "@/common/storage/scenario-history";

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

function inputWithAmount(conversionAmount: number): RothConversionInput {
  return {
    ...baseInput,
    conversionAmount,
  };
}

describe("scenario history storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves named scenarios newest first with restorable calculator input", () => {
    saveScenario(inputWithAmount(25000), "Lower tax bracket");
    saveScenario(inputWithAmount(75000), "Larger conversion");

    const scenarios = listSavedScenarios();

    expect(scenarios).toHaveLength(2);
    expect(scenarios[0]).toMatchObject({
      name: "Larger conversion",
      input: { conversionAmount: 75000 },
    });
    expect(scenarios[1]).toMatchObject({
      name: "Lower tax bracket",
      input: { conversionAmount: 25000 },
    });
    expect(scenarios[0].id).not.toEqual(scenarios[1].id);
  });

  it("limits saved scenarios to the most recent entries", () => {
    for (let index = 0; index < SCENARIO_HISTORY_LIMIT + 2; index += 1) {
      saveScenario(inputWithAmount(10000 + index), `Scenario ${index}`);
    }

    const scenarios = listSavedScenarios();

    expect(scenarios).toHaveLength(SCENARIO_HISTORY_LIMIT);
    expect(scenarios[0].name).toBe(`Scenario ${SCENARIO_HISTORY_LIMIT + 1}`);
    expect(scenarios.at(-1)?.name).toBe("Scenario 2");
  });

  it("deletes only the selected saved scenario", () => {
    const first = saveScenario(inputWithAmount(30000), "Keep");
    const second = saveScenario(inputWithAmount(40000), "Remove");

    deleteSavedScenario(second.id);

    expect(listSavedScenarios()).toMatchObject([
      {
        id: first.id,
        name: "Keep",
        input: { conversionAmount: 30000 },
      },
    ]);
  });
});
