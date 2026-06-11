import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("supporting calculator panel professional UI", () => {
  const supportPanelSources = [
    "src/features/ai-assistant/AiExplainer.tsx",
    "src/features/ai-assistant/AiVoiceAssistant.tsx",
    "src/features/tax-impact-warnings/TaxImpactWarnings.tsx",
    "src/features/tax-payment-comparison/TaxPaymentComparison.tsx",
    "src/features/charts/ProjectionChart.tsx",
    "src/features/calculation-breakdown/CalculationBreakdown.tsx",
    "src/features/result-scope/ResultScopeBadges.tsx",
  ];

  it("keeps support panels aligned with the no-glass financial-tool surface", () => {
    const source = supportPanelSources.map(readSource).join("\n");

    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("rounded-[12px]");
    expect(source).not.toContain("bg-white/65");
    expect(source).not.toContain("bg-white/80");
    expect(source).not.toContain("bg-blue-500/10");
    expect(source).not.toContain("shadow-sm");
    expect(source).not.toContain("focus:ring-4");
  });

  it("keeps the assistant below the calculator with standalone voice controls and compliance copy", () => {
    const source = readSource("src/features/ai-assistant/AiVoiceAssistant.tsx");
    const clientSource = readSource("src/app/HomeCalculatorClient.tsx");

    expect(source).toContain("AI voice assistant");
    expect(source).toContain("Ask about this estimate");
    expect(source).toContain("Ask the AI voice assistant");
    expect(source).toContain("protected server assistant");
    expect(source).toContain("Microphone permission is blocked");
    expect(source).not.toContain("Educational AI helper");
    expect(clientSource).toContain("Loading AI voice assistant...");
    expect(clientSource).not.toContain("Loading AI helper...");
  });

  it("uses worksheet-style numeric emphasis in supporting result panels", () => {
    const source = [
      readSource("src/features/tax-payment-comparison/TaxPaymentComparison.tsx"),
      readSource("src/features/calculation-breakdown/CalculationBreakdown.tsx"),
    ].join("\n");

    expect(source).toContain("font-mono text-2xl");
  });
});
