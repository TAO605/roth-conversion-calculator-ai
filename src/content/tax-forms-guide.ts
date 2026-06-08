export interface TaxFormsGuideItem {
  label: string;
  calculatorConnection: string;
  purpose: string;
  reviewNote: string;
}

export interface TaxFormsGuideGroup {
  id: string;
  title: string;
  goal: string;
  forms: TaxFormsGuideItem[];
}

function form(
  label: string,
  calculatorConnection: string,
  purpose: string,
  reviewNote: string,
): TaxFormsGuideItem {
  return { label, calculatorConnection, purpose, reviewNote };
}

export function buildTaxFormsGuideGroups(): TaxFormsGuideGroup[] {
  return [
    {
      id: "conversion-reporting",
      title: "Conversion Reporting Forms",
      goal: "Understand forms commonly associated with the conversion transaction itself.",
      forms: [
        form(
          "Form 1099-R",
          "conversionAmount",
          "Reports distributions from retirement accounts, which may include amounts converted to a Roth IRA.",
          "Review distribution codes and gross distribution amounts with tax software or a CPA.",
        ),
        form(
          "Form 5498",
          "conversionAmount",
          "May report Roth IRA conversion contributions and IRA fair market value information.",
          "This form often arrives after filing season, so keep custodian records and confirm timing.",
        ),
        form(
          "Roth conversion confirmation",
          "conversionAmount",
          "Custodian confirmation showing what actually moved into the Roth IRA.",
          "Compare confirmations with calculator assumptions and year-end tax forms.",
        ),
      ],
    },
    {
      id: "basis-records",
      title: "Basis and Taxable Amount Records",
      goal: "Support the after-tax basis and taxable conversion assumptions used by the calculator.",
      forms: [
        form(
          "Form 8606",
          "basis",
          "Commonly used to report nondeductible IRA contributions, basis, and certain conversion information.",
          "Do not guess basis; reconcile Form 8606 history before relying on a taxable conversion estimate.",
        ),
        form(
          "Prior-year tax returns",
          "basis",
          "Can contain prior Form 8606 filings, nondeductible contribution records, and carryforward basis information.",
          "Bring prior returns to professional review when basis is uncertain.",
        ),
        form(
          "Nondeductible IRA contribution records",
          "basis",
          "Support after-tax money that may reduce the modeled taxable conversion amount.",
          "Confirm whether records are complete and whether aggregation rules apply.",
        ),
      ],
    },
    {
      id: "custodian-documents",
      title: "Custodian and Account Documents",
      goal: "Tie calculator account values to real-world account balances and transaction records.",
      forms: [
        form(
          "Traditional IRA statements",
          "traditionalIraBalance",
          "Show current account value used in simplified pro-rata basis modeling.",
          "Include rollover, SEP, and SIMPLE IRA balances where relevant for professional review.",
        ),
        form(
          "Year-end fair market value statements",
          "traditionalIraBalance",
          "Help reconcile account values used for tax reporting and pro-rata discussions.",
          "Use year-end values carefully because calculator input may use a current estimate.",
        ),
        form(
          "Withholding confirmation",
          "taxPaymentMethod",
          "Documents any amount withheld from an IRA distribution for taxes.",
          "Review whether withholding changes the amount converted and any penalty assumptions.",
        ),
      ],
    },
    {
      id: "review-package",
      title: "Professional Review Package",
      goal: "Bundle calculator output with documents that help a CPA review the scenario.",
      forms: [
        form(
          "Print-ready calculator report",
          "taxableConversion",
          "Summarizes user-entered assumptions, estimated tax cost, projection output, source links, and disclaimer language.",
          "Use it as a worksheet, not as filing instructions or advice.",
        ),
        form(
          "CPA question list",
          "taxableConversion",
          "Lists model-limit questions such as IRMAA, ACA subsidies, NIIT, RMDs, AMT, credits, and state treatment.",
          "Ask the professional to document conclusions and caveats.",
        ),
        form(
          "Decision record",
          "taxableConversion",
          "Records final professional recommendation, actual user decision, and post-filing comparison notes.",
          "Keep this separate from the calculator estimate so assumptions and actual outcomes are traceable.",
        ),
      ],
    },
  ];
}

export function getTaxFormsGuideSummary(groups: TaxFormsGuideGroup[]) {
  const forms = groups.flatMap((group) => group.forms);

  return {
    totalGroups: groups.length,
    totalForms: forms.length,
    calculatorConnections: Array.from(new Set(forms.map((entry) => entry.calculatorConnection))),
  };
}
