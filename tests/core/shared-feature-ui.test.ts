import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const sharedFeatureComponents = [
  "src/features/bracket-capacity/FederalBracketCapacityTable.tsx",
  "src/features/bracket-impact/TaxBracketImpact.tsx",
  "src/features/conversion-sensitivity/ConversionSensitivityTable.tsx",
  "src/features/faq/FaqSection.tsx",
  "src/features/methodology/FederalTaxTable.tsx",
  "src/features/multi-year-schedule/MultiYearScheduleTable.tsx",
  "src/features/scenario-history/ScenarioHistoryPanel.tsx",
  "src/features/tax-data-freshness/TaxDataFreshnessCard.tsx",
  "src/features/theme-toggle/ThemeToggle.tsx",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("shared feature component professional UI", () => {
  it("keeps shared feature surfaces plain and non-glass", () => {
    const source = sharedFeatureComponents.map(readSource).join("\n");

    expect(source).not.toContain("backdrop-blur-xl");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("hover:-translate-y");
    expect(source).not.toContain("rounded-[22px]");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[18px]");
    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("bg-white/75");
    expect(source).not.toContain("bg-white/70");
    expect(source).not.toContain("bg-white/65");
    expect(source).not.toContain("bg-white/60");
    expect(source).not.toContain("bg-white/55");
    expect(source).toContain("rounded-md border border-neutral-200 bg-white");
  });
});
