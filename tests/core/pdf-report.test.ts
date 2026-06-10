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

const californiaInput: RothConversionInput = {
  ...input,
  selectedState: "california",
    stateReadinessInputs: {
      localTaxApplies: true,
      notes: "Moved during the tax year",
      otherStateTaxCreditApplies: false,
      reviewedStateTaxEstimate: 6200,
      residencyStatus: "part_year",
    stateAdjustedGrossIncome: 210000,
    stateIraBasis: 8000,
  },
  stateMarginalTaxRate: 0.093,
};

const niitInput: RothConversionInput = {
  ...input,
  netInvestmentIncome: 40000,
};

const socialSecurityInput: RothConversionInput = {
  ...input,
  annualSocialSecurityBenefits: 30000,
  taxExemptInterest: 1000,
};

const acaInput: RothConversionInput = {
  ...input,
  annualAdvancePremiumTaxCredit: 7200,
  marketplaceCoverageMonths: 12,
};

const amtInput: RothConversionInput = {
  ...input,
  amtRegularTaxLiability: 28000,
  amtTentativeMinimumTax: 31000,
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
    expect(html).toContain("2026 Part D IRMAA proxy preview");
    expect(html).toContain("$83.30 per month of Part D IRMAA adjustment");
    expect(html).toContain("Part D plan premiums vary by plan");
    expect(html).toContain("ACA Premium Tax Credit Review Prep");
    expect(html).toContain("Annual advance premium tax credit entered");
    expect(html).toContain("Marketplace coverage months entered");
    expect(html).toContain("Monthly APTC at-stake preview");
    expect(html).toContain("Annual APTC at-stake preview");
    expect(html).toContain("ACA amount estimate status");
    expect(html).toContain("missing_marketplace_inputs");
    expect(html).toContain("ACA APTC at-stake preview requires Marketplace-specific inputs");
    expect(html).toContain("Inputs Still Needed Before Any Subsidy Amount Review");
    expect(html).toContain("IRS Form 8962 premium tax credit");
    expect(html).toContain("Social Security Benefit Taxation Review Prep");
    expect(html).toContain("Annual Social Security benefits entered");
    expect(html).toContain("Tax-exempt interest entered for Publication 915 review");
    expect(html).toContain("Combined-income proxy after conversion");
    expect(html).toContain("Bounded taxable Social Security benefit preview");
    expect(html).toContain("Taxable-benefit amount estimate status");
    expect(html).toContain("missing_social_security_inputs");
    expect(html).toContain("bounded taxable Social Security benefit preview requires annual benefit");
    expect(html).toContain("Inputs Still Needed Before Any Taxable-Benefit Amount Review");
    expect(html).toContain("IRS Publication 915 Social Security and equivalent railroad retirement benefits");
    expect(html).toContain("NIIT Amount Review Prep");
    expect(html).toContain("NIIT amount estimate status");
    expect(html).toContain("User-entered net investment income");
    expect(html).toContain("Not provided");
    expect(html).toContain("NIIT exposure base used by bounded preview");
    expect(html).toContain("Bounded NIIT 3.8% preview");
    expect(html).toContain("missing_net_investment_income_inputs");
    expect(html).toContain("bounded NIIT preview requires user-entered net investment income");
    expect(html).toContain("Inputs Still Needed Before Any NIIT Amount Review");
    expect(html).toContain("IRS Form 8960 Net Investment Income Tax");
    expect(html).toContain("RMD Uniform Lifetime Preview");
    expect(html).toContain("RMD preview status");
    expect(html).toContain("below_rmd_age");
    expect(html).toContain("Annual RMD preview");
    expect(html).toContain("Not estimated");
    expect(html).toContain("prior December 31 adjusted balance");
    expect(html).toContain("IRS RMD FAQs");
    expect(html).toContain("AMT Impact Review Prep");
    expect(html).toContain("Tentative minimum tax entered");
    expect(html).toContain("Regular tax liability entered for AMT comparison");
    expect(html).toContain("AMT exposure preview");
    expect(html).toContain("AMT amount estimate status");
    expect(html).toContain("missing_form_6251_inputs");
    expect(html).toContain("AMT exposure preview requires user-entered Form 6251");
    expect(html).toContain("Inputs Still Needed Before Any AMT Amount Review");
    expect(html).toContain("IRS Form 6251 Alternative Minimum Tax");
    expect(html).toContain("State Rules Readiness");
    expect(html).toContain("State rule registry status");
    expect(html).toContain("Manual rate only (manual-only)");
    expect(html).toContain("State rule registry boundary");
    expect(html).toContain("Manual state marginal rate entered");
    expect(html).toContain("5%");
    expect(html).toContain("State amount estimate status");
    expect(html).toContain("Reviewed state tax estimate");
    expect(html).toContain("Reviewed estimate difference from manual-rate state tax");
    expect(html).toContain("manual_rate_only");
    expect(html).toContain(
      "California (CA, Needs state review, worksheet ready), Texas (TX, No broad individual income tax), Florida (FL, No broad individual income tax), New York (NY, Needs state review, worksheet ready), Washington (WA, No broad individual income tax), New Jersey (NJ, Needs state review, worksheet ready)",
    );
    expect(html).toContain("does not determine residency");
    expect(html).toContain("Inputs Still Needed Before Any State-Specific Amount Review");
    expect(html).toContain("IRS state government websites directory");
    expect(html).toContain("Medicare.gov Part B costs and IRMAA overview");
    expect(html).toContain(REQUIRED_DISCLAIMER);
    expect(html).not.toMatch(/\byou should convert\b/i);
    expect(html).not.toMatch(/\bstrongly recommend\b/i);
    expect(html).not.toMatch(/\b100%\s+accurate\b/i);
    expect(html).not.toMatch(/full state-law engine is active|final state tax|total part d premium/i);

    vi.useRealTimers();
  });

  it("carries AMT exposure preview values into the printable report", () => {
    const html = buildReportHtml(amtInput, calculateRothConversion(amtInput));

    expect(html).toContain("Tentative minimum tax entered");
    expect(html).toContain("$31,000");
    expect(html).toContain("Regular tax liability entered for AMT comparison");
    expect(html).toContain("$28,000");
    expect(html).toContain("AMT exposure preview");
    expect(html).toContain("$3,000");
    expect(html).toContain("amt_exposure_preview_available");
    expect(html).toContain("does not calculate alternative minimum taxable income");
    expect(html).not.toMatch(/final amt|amt owed:|tax due:|you should|strongly recommend/i);
  });

  it("carries ACA APTC at-stake preview values into the printable report", () => {
    const html = buildReportHtml(acaInput, calculateRothConversion(acaInput));

    expect(html).toContain("Annual advance premium tax credit entered");
    expect(html).toContain("$7,200");
    expect(html).toContain("Marketplace coverage months entered");
    expect(html).toContain("12");
    expect(html).toContain("Monthly APTC at-stake preview");
    expect(html).toContain("$600");
    expect(html).toContain("Annual APTC at-stake preview");
    expect(html).toContain("aptc_at_stake_preview_available");
    expect(html).toContain("does not calculate the final Form 8962 credit");
    expect(html).not.toMatch(/final premium tax credit|final subsidy|you should|strongly recommend/i);
  });

  it("carries bounded Social Security taxable-benefit preview values into the printable report", () => {
    const html = buildReportHtml(socialSecurityInput, calculateRothConversion(socialSecurityInput));

    expect(html).toContain("Annual Social Security benefits entered");
    expect(html).toContain("$30,000");
    expect(html).toContain("Tax-exempt interest entered for Publication 915 review");
    expect(html).toContain("$1,000");
    expect(html).toContain("Combined-income proxy after conversion");
    expect(html).toContain("$270,000");
    expect(html).toContain("Bounded taxable Social Security benefit preview");
    expect(html).toContain("$25,500");
    expect(html).toContain("bounded_estimate_available");
    expect(html).toContain("not a full Publication 915 worksheet");
    expect(html).not.toMatch(/final taxable benefit|benefit tax owed|you should|strongly recommend/i);
  });

  it("carries bounded NIIT preview values into the printable report when net investment income is provided", () => {
    const html = buildReportHtml(niitInput, calculateRothConversion(niitInput));

    expect(html).toContain("User-entered net investment income");
    expect(html).toContain("$40,000");
    expect(html).toContain("NIIT exposure base used by bounded preview");
    expect(html).toContain("Bounded NIIT 3.8% preview");
    expect(html).toContain("$1,520");
    expect(html).toContain("bounded_estimate_available");
    expect(html).toContain("not a full Form 8960 calculation");
    expect(html).not.toMatch(/final niit|final tax|you should|strongly recommend/i);
  });

  it("carries the selected-state amount-readiness worksheet into the printable report", () => {
    const html = buildReportHtml(californiaInput, calculateRothConversion(californiaInput));

    expect(html).toContain("State rule registry status");
    expect(html).toContain("Needs state review (needs-review)");
    expect(html).toContain("Selected-state amount readiness status");
    expect(html).toContain("state_specific_inputs_missing");
    expect(html).toContain("User-provided state readiness field status");
    expect(html).toContain("ready_for_professional_review");
    expect(html).toContain("User-provided state readiness field label");
    expect(html).toContain("Ready for professional review");
    expect(html).toContain("User-provided state readiness completeness score");
    expect(html).toContain("100%");
    expect(html).toContain("reviewed_state_estimate_provided");
    expect(html).toContain("$6,200");
    expect(html).toContain("$713");
    expect(html).toContain("Missing state readiness fields");
    expect(html).toContain("None");
    expect(html).toContain("State readiness score boundary");
    expect(html).toContain("document-readiness score only");
    expect(html).toContain("California State Amount Readiness Official Checklist");
    expect(html).toContain("User-Provided Selected-State Readiness Fields");
    expect(html).toContain("State adjusted gross income: $210,000");
    expect(html).toContain("Reviewed state tax estimate: $6,200");
    expect(html).toContain("State review notes: Moved during the tax year");
    expect(html).toContain("California Schedule CA adjustment detail");
    expect(html).toContain("California FTB Publication 1005 Pension and Annuity Guidelines");
    expect(html).not.toMatch(/final state tax|complete state-law|you should|strongly recommend/i);
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
