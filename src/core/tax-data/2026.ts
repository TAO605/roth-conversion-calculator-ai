import type { FilingStatus, TaxBracket } from "@/core/calculator/types";

// 2026 brackets from IRS tax inflation adjustments. Values are stored as taxable income ranges.
export const FEDERAL_TAX_BRACKETS_2026: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 12400, rate: 0.1 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 640600, rate: 0.35 },
    { min: 640600, max: null, rate: 0.37 },
  ],
  married_joint: [
    { min: 0, max: 24800, rate: 0.1 },
    { min: 24800, max: 100800, rate: 0.12 },
    { min: 100800, max: 211400, rate: 0.22 },
    { min: 211400, max: 403550, rate: 0.24 },
    { min: 403550, max: 512450, rate: 0.32 },
    { min: 512450, max: 768700, rate: 0.35 },
    { min: 768700, max: null, rate: 0.37 },
  ],
  married_separate: [
    { min: 0, max: 12400, rate: 0.1 },
    { min: 12400, max: 50400, rate: 0.12 },
    { min: 50400, max: 105700, rate: 0.22 },
    { min: 105700, max: 201775, rate: 0.24 },
    { min: 201775, max: 256225, rate: 0.32 },
    { min: 256225, max: 384350, rate: 0.35 },
    { min: 384350, max: null, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17700, rate: 0.1 },
    { min: 17700, max: 67250, rate: 0.12 },
    { min: 67250, max: 105700, rate: 0.22 },
    { min: 105700, max: 201750, rate: 0.24 },
    { min: 201750, max: 256200, rate: 0.32 },
    { min: 256200, max: 640600, rate: 0.35 },
    { min: 640600, max: null, rate: 0.37 },
  ],
};
