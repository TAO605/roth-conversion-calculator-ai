"use client";

import { Download } from "lucide-react";
import { Button } from "@/common/ui/button";
import { formatCurrency } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

export function PdfReportButton({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const download = () => {
    const report = [
      "Roth Conversion Calculator Report",
      "",
      `Conversion amount: ${formatCurrency(input.conversionAmount)}`,
      `Taxable conversion: ${formatCurrency(result.taxableConversion)}`,
      `Federal tax estimate: ${formatCurrency(result.federalTax)}`,
      `State tax estimate: ${formatCurrency(result.stateTax)}`,
      `Potential penalty: ${formatCurrency(result.earlyDistributionPenalty)}`,
      `Total upfront cost: ${formatCurrency(result.totalUpfrontCost)}`,
      `Break-even year: ${result.breakEvenYear ?? "Not reached"}`,
      `Basis exclusion ratio: ${(result.breakdown.basisExclusionRatio * 100).toFixed(2)}%`,
      `Taxable conversion ratio: ${(result.breakdown.taxableConversionRatio * 100).toFixed(2)}%`,
      `Effective federal tax rate: ${(result.breakdown.effectiveFederalTaxRate * 100).toFixed(2)}%`,
      `Total upfront cost rate: ${(result.breakdown.totalCostRate * 100).toFixed(2)}%`,
      `Penalty basis modeled: ${formatCurrency(result.breakdown.penaltyBasis)}`,
      `Penalty explanation: ${result.breakdown.penaltyExplanation}`,
      `Federal bracket before conversion: ${(result.bracketImpact.beforeRate * 100).toFixed(1)}%`,
      `Federal bracket after conversion: ${(result.bracketImpact.afterRate * 100).toFixed(1)}%`,
      `Crosses federal bracket: ${result.bracketImpact.crossesBracket ? "Yes" : "No"}`,
      `Amount modeled in higher brackets: ${formatCurrency(result.bracketImpact.incomeTaxedInHigherBrackets)}`,
      "",
      REQUIRED_DISCLAIMER,
    ].join("\n");
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "roth-conversion-report.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} type="button" variant="secondary">
      <Download aria-hidden="true" size={16} />
      Download report
    </Button>
  );
}
