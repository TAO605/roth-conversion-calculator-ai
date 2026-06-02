import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { RothConversionInput } from "@/core/calculator/types";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import {
  buildCalculatorAnalyticsEvent,
  buildDeferredGtagLoaderScript,
  buildGtagConfigScript,
  buildGtagScriptSrc,
  getGaMeasurementId,
} from "@/core/analytics/ga";

const input: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0.05,
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

describe("GA4 analytics", () => {
  it("only accepts valid GA4 measurement IDs", () => {
    expect(getGaMeasurementId({})).toBe("G-2YJ3V38RGJ");
    expect(getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-ABC123XYZ9" })).toBe("G-ABC123XYZ9");
    expect(getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "UA-OLD-ID" })).toBeNull();
    expect(getGaMeasurementId({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "" })).toBeNull();
  });

  it("builds GA4 script assets for the configured measurement ID", () => {
    expect(buildGtagScriptSrc("G-ABC123XYZ9")).toBe("https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ9");
    expect(buildGtagConfigScript("G-ABC123XYZ9")).toContain("gtag('config','G-ABC123XYZ9'");
    expect(buildDeferredGtagLoaderScript("G-ABC123XYZ9")).toContain("requestIdleCallback");
    expect(buildDeferredGtagLoaderScript("G-ABC123XYZ9")).toContain("window.addEventListener('load'");
    expect(buildDeferredGtagLoaderScript("G-ABC123XYZ9")).toContain("setTimeout(load,3000)");
    expect(buildDeferredGtagLoaderScript("G-ABC123XYZ9")).toContain("window.gtag=window.gtag||gtag");
  });

  it("buckets calculator analytics without exposing exact financial inputs", () => {
    const event = buildCalculatorAnalyticsEvent(input, calculateRothConversion(input));
    const serialized = JSON.stringify(event);

    expect(event.name).toBe("calculator_result_view");
    expect(event.params.conversion_bucket).toBe("$50k-$100k");
    expect(serialized).not.toContain("50000");
    expect(serialized).not.toContain("85000");
    expect(serialized).not.toContain("250000");
  });

  it("mounts GA and calculator event beacons through the app shell", () => {
    const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const googleAnalytics = fs.readFileSync(
      path.join(process.cwd(), "src/features/analytics/GoogleAnalytics.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");
    const calculatorClient = fs.readFileSync(path.join(process.cwd(), "src/app/HomeCalculatorClient.tsx"), "utf8");

    expect(layout).toContain("GoogleAnalytics");
    expect(googleAnalytics).toContain("buildDeferredGtagLoaderScript");
    expect(googleAnalytics).toContain("ga4-deferred-loader");
    expect(googleAnalytics).not.toContain("next/script");
    expect(googleAnalytics).not.toContain('strategy="lazyOnload"');
    expect(googleAnalytics).not.toContain('strategy="afterInteractive"');
    expect(homePage).toContain("HomeCalculatorClient");
    expect(calculatorClient).toContain("CalculatorAnalyticsBeacon");
    expect(calculatorClient).toContain('isFeatureEnabled("privacy-safe-analytics")');
  });
});
