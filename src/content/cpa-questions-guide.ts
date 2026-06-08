export interface CpaQuestionItem {
  prompt: string;
  reviewTopic: string;
  whyAsk: string;
  materialsToBring: string[];
}

export interface CpaQuestionGroup {
  id: string;
  title: string;
  purpose: string;
  questions: CpaQuestionItem[];
}

function question(
  prompt: string,
  reviewTopic: string,
  whyAsk: string,
  materialsToBring: string[],
): CpaQuestionItem {
  return { prompt, reviewTopic, whyAsk, materialsToBring };
}

export function buildCpaQuestionGroups(): CpaQuestionGroup[] {
  return [
    {
      id: "income-modeling",
      title: "Taxable Income and Bracket Modeling",
      purpose: "Validate the income assumptions that drive the calculator's federal bracket estimate.",
      questions: [
        question(
          "How should I verify the taxable income estimate before adding conversion income?",
          "Taxable income",
          "The calculator uses user-entered taxable income as an assumption, and actual taxable income can change after deductions, credits, and other income are reviewed.",
          ["Calculator scenario", "Recent pay stubs", "Prior-year return", "Income estimate worksheet"],
        ),
        question(
          "Which income items should be included before modeling a conversion?",
          "Taxable income",
          "Wages, business income, pensions, Social Security taxation, capital gains, and other items can change the marginal bracket used for the estimate.",
          ["Income estimate worksheet", "Brokerage tax estimates", "Retirement income records"],
        ),
        question(
          "Could a partial conversion keep more income within a target bracket?",
          "Taxable income",
          "This frames bracket capacity as a review question without asking the tool to recommend a conversion amount.",
          ["Bracket capacity output", "Saved calculator scenarios", "Tax projection notes"],
        ),
      ],
    },
    {
      id: "basis-and-aggregation",
      title: "Basis, Pro-Rata, and IRA Aggregation",
      purpose: "Review whether after-tax basis inputs are supported by records and tax reporting history.",
      questions: [
        question(
          "Do my after-tax basis records and Form 8606 history support the calculator basis input?",
          "Basis records",
          "Basis errors can materially change the estimated taxable conversion amount.",
          ["Form 8606 history", "Prior-year tax returns", "Nondeductible contribution records"],
        ),
        question(
          "Which IRA balances should be included when reviewing pro-rata treatment?",
          "Basis records",
          "Traditional, SEP, SIMPLE, and rollover IRA balances may be relevant to professional review of taxable conversion treatment.",
          ["IRA statements", "Year-end fair market value records", "Rollover account records"],
        ),
        question(
          "What records should I keep if basis is uncertain or incomplete?",
          "Basis records",
          "Incomplete basis records should be surfaced before relying on a modeled taxable amount.",
          ["Available tax returns", "Custodian contribution history", "CPA notes"],
        ),
      ],
    },
    {
      id: "tax-payment",
      title: "Tax Payment Method and Withholding",
      purpose: "Separate conversion modeling from tax-payment logistics and penalty assumptions.",
      questions: [
        question(
          "Would withholding from the IRA change the amount converted or penalty assumptions?",
          "Tax payment method",
          "Withholding may reduce the Roth deposit and can create separate early distribution issues for users under 59 1/2.",
          ["Tax payment method assumption", "Custodian withholding confirmation", "Age input"],
        ),
        question(
          "Should estimated tax payments be reviewed after conversion income is modeled?",
          "Tax payment method",
          "The calculator estimates tax cost but does not determine payment deadlines, underpayment exposure, or safe-harbor treatment.",
          ["Estimated tax vouchers", "Prior-year tax liability", "Calculator tax cost output"],
        ),
        question(
          "How should state tax payment assumptions be reviewed?",
          "Tax payment method",
          "State tax treatment can differ from the simplified state-rate assumption used in the calculator.",
          ["State tax assumption", "State residency notes", "Prior state return"],
        ),
      ],
    },
    {
      id: "tax-interactions",
      title: "Income-Linked Tax Interactions",
      purpose: "Identify tax topics outside the calculator's simplified model that may need professional review.",
      questions: [
        question(
          "Could the conversion affect IRMAA, ACA premium tax credits, NIIT, RMDs, or state tax items?",
          "Tax interactions",
          "Roth conversion income can interact with income-linked thresholds not fully modeled by the calculator.",
          ["Tax interaction checklist", "Health insurance subsidy records", "Medicare premium records"],
        ),
        question(
          "Are credits, deductions, AMT, or capital gain rates affected by the extra income?",
          "Tax interactions",
          "A marginal bracket estimate may not capture all tax-return interactions.",
          ["Prior-year return", "Tax projection report", "Investment income estimates"],
        ),
        question(
          "Does my age or RMD status change the review questions?",
          "Tax interactions",
          "Age can affect penalty assumptions, RMD coordination, and tax-year planning context.",
          ["Age scenario output", "RMD records", "Custodian distribution records"],
        ),
      ],
    },
    {
      id: "filing-records",
      title: "Filing Records and Post-Filing Review",
      purpose: "Prepare a traceable handoff from calculator estimate to tax filing and future assumptions.",
      questions: [
        question(
          "Which forms and custodian records should be saved after filing?",
          "Filing records",
          "Good records make it easier to reconcile estimates, filed returns, basis history, and future conversion scenarios.",
          ["Form 1099-R", "Form 5498", "Form 8606", "Conversion confirmation"],
        ),
        question(
          "How should I compare the filed return with the calculator estimate?",
          "Filing records",
          "Post-filing comparison helps identify assumptions that were too high, too low, or outside the calculator scope.",
          ["Filed return", "Print-ready calculator report", "CPA notes", "Post-filing review log"],
        ),
        question(
          "What should be documented before considering another future conversion?",
          "Filing records",
          "Future planning should start from actual filed outcomes, not only pre-conversion estimates.",
          ["Decision record", "Tax form packet", "Updated calculator scenario"],
        ),
      ],
    },
  ];
}

export function getCpaQuestionGuideSummary(groups: CpaQuestionGroup[]) {
  const questions = groups.flatMap((group) => group.questions);
  const materialCount = questions.reduce((count, entry) => count + entry.materialsToBring.length, 0);

  return {
    totalGroups: groups.length,
    totalQuestions: questions.length,
    totalMaterials: materialCount,
    reviewTopics: Array.from(new Set(questions.map((entry) => entry.reviewTopic))),
  };
}
