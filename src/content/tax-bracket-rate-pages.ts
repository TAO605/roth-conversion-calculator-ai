import type { FilingStatus } from "@/core/calculator/types";
import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";

export interface TaxBracketRateRange {
  filingStatus: FilingStatus;
  label: string;
  min: number;
  max: number | null;
}

export interface TaxBracketRatePage {
  slug: string;
  rate: number;
  title: string;
  description: string;
  summary: string;
  disclaimer: string;
  ranges: TaxBracketRateRange[];
}

const filingStatusLabels: Record<FilingStatus, string> = {
  single: "Single",
  married_joint: "Married filing jointly",
  married_separate: "Married filing separately",
  head_of_household: "Head of household",
};

function rateToPercent(rate: number): number {
  return Math.round(rate * 100);
}

function rateToSlug(rate: number): string {
  return `${rateToPercent(rate)}-percent-tax-bracket`;
}

const uniqueRates = Array.from(new Set(Object.values(FEDERAL_TAX_BRACKETS_2026).flatMap((brackets) => brackets.map((bracket) => bracket.rate)))).sort(
  (first, second) => first - second,
);

export const taxBracketRatePages: TaxBracketRatePage[] = uniqueRates.map((rate) => {
  const percent = rateToPercent(rate);
  const ranges = Object.entries(FEDERAL_TAX_BRACKETS_2026).map(([filingStatus, brackets]) => {
    const bracket = brackets.find((item) => item.rate === rate);

    if (!bracket) {
      throw new Error(`Missing ${percent}% bracket for ${filingStatus}`);
    }

    return {
      filingStatus: filingStatus as FilingStatus,
      label: filingStatusLabels[filingStatus as FilingStatus],
      min: bracket.min,
      max: bracket.max,
    };
  });

  return {
    slug: rateToSlug(rate),
    rate,
    title: `${percent}% Federal Tax Bracket for Roth Conversions in 2026`,
    description: `See 2026 taxable income ranges for the ${percent}% federal tax bracket and how Roth conversion income can move through this bracket.`,
    summary: `The ${percent}% bracket page shows the taxable income range for each filing status and links back to the calculator for educational Roth conversion modeling.`,
    disclaimer:
      "This page is educational and illustrative only. It does not provide tax, financial, legal, or investment advice.",
    ranges,
  };
});

export function getTaxBracketRatePageBySlug(slug: string): TaxBracketRatePage | undefined {
  return taxBracketRatePages.find((page) => page.slug === slug);
}

export function buildBracketRateCalculatorHref(_page: TaxBracketRatePage): string {
  return "/#calculator";
}
