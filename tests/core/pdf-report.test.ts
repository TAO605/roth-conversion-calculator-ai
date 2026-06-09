import { describe, expect, it, vi } from "vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { PdfReportButton } from "@/features/pdf-report/PdfReportButton";
import { buildReportHtml } from "@/features/pdf-report/report-html";

const input: RothConversionInput = {
  age: 64,
  basis: 5000,
  conversionAmount: 60000,
  currentTaxableIncome: 195000,
  expectedAnnualReturn: 0.06,
  filingStatus: "single",
  inflationRate: 0.025,
  penaltyException: false,
  retirementAge: 65,
  retirementMarginalTaxRate: 0.22,
  stateMarginalTaxRate: 0.05,
  taxPaymentMethod: "outside_funds",
  taxYear: 2026,
  traditionalIraBalance: 300000,
  withheldForTaxes: 0,
};

describe("print-ready report export", () => {
  it("builds a printable HTML report with YMYL boundaries and IRMAA prep", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-08T12:00:00Z"));

    const html = buildReportHtml(input, calculateRothConversion(input));

    expect(html).toContain("<!doctype html>");
    expect(html).toContain("<title>Roth Conversion Calculator Report</title>");
    expect(html).toContain("Print this page or use your browser's Save as PDF option.");
    expect(html).toContain("Inputs To Verify");
    expect(html).toContain("Modeled Calculator Output");
    expect(html).toContain("Tax Impact Review Items");
    expect(html).toContain("IRMAA Review Prep");
    expect(html).toContain("Usual lookback tax year to verify");
    expect(html).toContain("2026 Part B proxy preview");
    expect(html).toContain("$649.20 per month using calculator income proxy");
    expect(html).toContain("not SSA&#39;s actual lookback-year MAGI determination");
    expect(html).toContain("ACA Premium Tax Credit Review Prep");
    expect(html).toContain("ACA amount estimate status");
    expect(html).toContain("missing_marketplace_inputs");
    expect(html).toContain("cannot estimate ACA premium tax credit dollars from taxable income alone");
    expect(html).toContain("Inputs Still Needed Before Any Subsidy Amount Review");
    expect(html).toContain("IRS Form 8962 premium tax credit");
    expect(html).toContain("Social Security Benefit Taxation Review Prep");
    expect(html).toContain("Taxable-benefit amount estimate status");
    expect(html).toContain("missing_social_security_inputs");
    expect(html).toContain("cannot estimate taxable Social Security benefit dollars");
    expect(html).toContain("Inputs Still Needed Before Any Taxable-Benefit Amount Review");
    expect(html).toContain("IRS Publication 915 Social Security and equivalent railroad retirement benefits");
    expect(html).toContain("NIIT Amount Review Prep");
    expect(html).toContain("NIIT amount estimate status");
    expect(html).toContain("missing_net_investment_income_inputs");
    expect(html).toContain("cannot estimate NIIT owed from the MAGI proxy alone");
    expect(html).toContain("Inputs Still Needed Before Any NIIT Amount Review");
    expect(html).toContain("IRS Form 8960 Net Investment Income Tax");
    expect(html).toContain("Medicare.gov Part B costs and IRMAA overview");
    expect(html).toContain(REQUIRED_DISCLAIMER);
    expect(html).not.toMatch(/\byou should convert\b/i);
    expect(html).not.toMatch(/\bstrongly recommend\b/i);
    expect(html).not.toMatch(/\b100%\s+accurate\b/i);

    vi.useRealTimers();
  });

  it("downloads the report as a local HTML file for browser PDF printing", () => {
    const createObjectUrl = vi.fn(() => "blob:report-html");
    const revokeObjectUrl = vi.fn();
    const click = vi.fn();
    let createdAnchor: HTMLAnchorElement | null = null;
    const originalCreateElement = document.createElement.bind(document);

    vi.stubGlobal("URL", {
      createObjectURL: createObjectUrl,
      revokeObjectURL: revokeObjectUrl,
    });
    vi.spyOn(document, "createElement").mockImplementation((tagName: string, options?: ElementCreationOptions) => {
      const element = originalCreateElement(tagName, options);
      if (tagName === "a") {
        createdAnchor = element as HTMLAnchorElement;
        vi.spyOn(createdAnchor, "click").mockImplementation(click);
      }
      return element;
    });

    render(React.createElement(PdfReportButton, { input, result: calculateRothConversion(input) }));
    fireEvent.click(screen.getByRole("button", { name: /download report/i }));

    expect(createObjectUrl).toHaveBeenCalledWith(expect.objectContaining({ type: "text/html;charset=utf-8" }));
    expect(createdAnchor?.download).toBe("roth-conversion-report.html");
    expect(createdAnchor?.href).toBe("blob:report-html");
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:report-html");
  });
});
