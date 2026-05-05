import { encodeShareCode } from "@/common/storage/share-code";
import type { RothConversionInput, TaxPaymentMethod } from "@/core/calculator/types";

export interface TaxPaymentMethodPage {
  slug: string;
  taxPaymentMethod: TaxPaymentMethod;
  label: string;
  title: string;
  description: string;
  penaltyNote: string;
  complianceNote: string;
  withheldForTaxes: number;
  paragraphs: string[];
}

export const taxPaymentMethodPages: TaxPaymentMethodPage[] = [
  {
    slug: "outside-funds",
    taxPaymentMethod: "outside_funds",
    label: "Outside funds",
    title: "Pay Roth Conversion Taxes With Outside Funds",
    description:
      "Learn how the Roth Conversion Calculator models outside-funds tax payment assumptions for educational tax-cost estimates.",
    penaltyNote:
      "The calculator does not model a 10% early distribution penalty when conversion taxes are assumed to be paid from outside funds.",
    complianceNote:
      "This educational page explains calculator assumptions and does not recommend a tax payment method.",
    withheldForTaxes: 0,
    paragraphs: [
      "Outside-funds tax payment means the calculator assumes conversion taxes are paid from money outside the IRA distribution.",
      "This can make the modeled Roth conversion amount easier to compare because no part of the IRA conversion is used for tax withholding in the estimate.",
      "The calculator still estimates federal tax, user-entered state tax, break-even timing, and projected after-tax value based on the other inputs.",
    ],
  },
  {
    slug: "withhold-from-ira",
    taxPaymentMethod: "withhold_from_ira",
    label: "Withhold from IRA",
    title: "Withhold Roth Conversion Taxes From an IRA",
    description:
      "Learn how the Roth Conversion Calculator models IRA withholding and possible early distribution penalty assumptions.",
    penaltyNote:
      "If age is below 59.5 and no exception is selected, the calculator models a 10% penalty only on the amount withheld from the IRA for taxes.",
    complianceNote:
      "This educational page explains calculator assumptions and does not determine whether any IRS exception applies.",
    withheldForTaxes: 5000,
    paragraphs: [
      "Withholding from the IRA means part of the IRA distribution is assumed to be used for taxes rather than converted to Roth.",
      "For users under 59.5, the calculator models a possible 10% early distribution penalty on the withheld amount unless the penalty exception toggle is enabled.",
      "The estimate is simplified and does not replace professional review of withholding rules, exceptions, account paperwork, or tax return treatment.",
    ],
  },
  {
    slug: "not-sure",
    taxPaymentMethod: "not_sure",
    label: "Not sure",
    title: "Not Sure How Roth Conversion Taxes Will Be Paid",
    description:
      "Use this educational page when you are not sure whether Roth conversion taxes will be paid from outside funds or IRA withholding.",
    penaltyNote:
      "When tax payment method is marked not sure, the calculator does not model an early distribution penalty amount.",
    complianceNote:
      "This educational page helps users identify an assumption to verify and does not provide tax or financial advice.",
    withheldForTaxes: 0,
    paragraphs: [
      "The not-sure option exists for users who want to explore the calculator before deciding how tax payment assumptions should be entered.",
      "Because withholding choices can affect penalty modeling, the calculator keeps the penalty amount at zero when the method is marked not sure.",
      "Users can switch between outside funds and IRA withholding later to compare how the modeled output changes.",
    ],
  },
];

export function getTaxPaymentMethodPageBySlug(slug: string): TaxPaymentMethodPage | undefined {
  return taxPaymentMethodPages.find((page) => page.slug === slug);
}

const defaultCalculatorPrefill: RothConversionInput = {
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

export function buildTaxPaymentMethodCalculatorHref(page: TaxPaymentMethodPage): string {
  return `/#${encodeShareCode({
    ...defaultCalculatorPrefill,
    taxPaymentMethod: page.taxPaymentMethod,
    withheldForTaxes: page.withheldForTaxes,
  })}`;
}
