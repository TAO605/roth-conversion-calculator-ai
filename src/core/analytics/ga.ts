import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";

export interface AnalyticsEvent {
  name: "calculator_result_view";
  params: {
    filing_status: string;
    conversion_bucket: string;
    taxable_income_bucket: string;
    state_rate_bucket: string;
    break_even_bucket: string;
    tax_year: number;
  };
}

type EnvLike = Record<string, string | undefined>;

const gaIdPattern = /^G-[A-Z0-9]{6,}$/;
const defaultGaMeasurementId = "G-2YJ3V38RGJ";

function bucketCurrency(value: number): string {
  if (value < 25000) {
    return "$0-$25k";
  }

  if (value < 50000) {
    return "$25k-$50k";
  }

  if (value < 100000) {
    return "$50k-$100k";
  }

  if (value < 250000) {
    return "$100k-$250k";
  }

  if (value < 500000) {
    return "$250k-$500k";
  }

  return "$500k+";
}

function bucketStateRate(value: number): string {
  if (value <= 0) {
    return "0%";
  }

  if (value < 0.03) {
    return "0%-3%";
  }

  if (value < 0.06) {
    return "3%-6%";
  }

  if (value < 0.1) {
    return "6%-10%";
  }

  return "10%+";
}

function bucketBreakEven(value: number | null): string {
  if (value === null) {
    return "not_reached";
  }

  if (value <= 5) {
    return "0-5_years";
  }

  if (value <= 10) {
    return "6-10_years";
  }

  if (value <= 20) {
    return "11-20_years";
  }

  return "20+_years";
}

export function getGaMeasurementId(env: EnvLike = process.env): string | null {
  const id = (env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? defaultGaMeasurementId).trim().toUpperCase();

  return id && gaIdPattern.test(id) ? id : null;
}

export function buildGtagScriptSrc(measurementId: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

export function buildGtagConfigScript(measurementId: string): string {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js',new Date());",
    `gtag('config','${measurementId}',{send_page_view:true});`,
  ].join("");
}

export function buildCalculatorAnalyticsEvent(
  input: RothConversionInput,
  result: RothConversionResult,
): AnalyticsEvent {
  return {
    name: "calculator_result_view",
    params: {
      filing_status: input.filingStatus,
      conversion_bucket: bucketCurrency(input.conversionAmount),
      taxable_income_bucket: bucketCurrency(input.currentTaxableIncome),
      state_rate_bucket: bucketStateRate(input.stateMarginalTaxRate),
      break_even_bucket: bucketBreakEven(result.breakEvenYear),
      tax_year: input.taxYear,
    },
  };
}
