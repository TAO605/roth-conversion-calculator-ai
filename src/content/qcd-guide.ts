export interface QcdGuidePoint {
  label: string;
  reviewTopic: string;
  explanation: string;
  professionalReviewNote: string;
}

export interface QcdGuideSection {
  id: string;
  title: string;
  purpose: string;
  points: QcdGuidePoint[];
}

function point(
  label: string,
  reviewTopic: string,
  explanation: string,
  professionalReviewNote: string,
): QcdGuidePoint {
  return { label, reviewTopic, explanation, professionalReviewNote };
}

export function buildQcdGuideSections(): QcdGuideSection[] {
  return [
    {
      id: "qcd-basics",
      title: "Qualified Charitable Distribution Basics",
      purpose: "Explain what a QCD is before users compare it with a Roth conversion.",
      points: [
        point(
          "A QCD is a direct IRA distribution to an eligible charity",
          "QCD basics",
          "A qualified charitable distribution generally involves a direct transfer from an IRA to an eligible charitable organization when IRS requirements are met.",
          "Confirm eligibility, age requirements, annual limits, and charity status with IRS resources or a tax professional.",
        ),
        point(
          "QCD treatment is separate from charitable deduction modeling",
          "QCD basics",
          "QCDs can have different tax treatment than personally receiving a distribution and then making a charitable gift.",
          "Review itemized deductions, standard deduction, and QCD reporting separately.",
        ),
        point(
          "QCD age and account rules matter",
          "QCD basics",
          "QCD eligibility can depend on age, account type, and distribution procedure.",
          "Bring account type, age, custodian instructions, and charity details to review.",
        ),
      ],
    },
    {
      id: "rmd-context",
      title: "RMD Coordination",
      purpose: "Connect QCD education to RMD review without treating it as a conversion strategy.",
      points: [
        point(
          "A QCD can count toward an RMD when IRS requirements are met",
          "RMD coordination",
          "A QCD may satisfy part or all of an RMD in qualifying circumstances, but RMD rules and QCD rules should both be reviewed.",
          "Confirm RMD amount, QCD amount, dates, and custodian processing before relying on the result.",
        ),
        point(
          "RMD and QCD records should stay separate from conversion records",
          "RMD coordination",
          "Required distributions, charitable distributions, and Roth conversions can appear in the same planning year but should be tracked separately.",
          "Archive confirmations by transaction type and tax year.",
        ),
        point(
          "QCDs may affect taxable income assumptions",
          "RMD coordination",
          "If a QCD changes the taxable portion of IRA distributions, the calculator's taxable income input may need review before adding conversion income.",
          "Update income assumptions after QCD and RMD treatment is reviewed.",
        ),
      ],
    },
    {
      id: "conversion-separation",
      title: "QCD Versus Roth Conversion",
      purpose: "Prevent users from entering charitable distributions as Roth conversion amounts.",
      points: [
        point(
          "QCDs are not Roth conversions",
          "Conversion separation",
          "A QCD is a charitable IRA distribution, while a Roth conversion moves eligible retirement assets into a Roth account and may create taxable conversion income.",
          "Do not enter a QCD amount as the calculator's Roth conversion amount.",
        ),
        point(
          "A QCD does not create a Roth IRA deposit",
          "Conversion separation",
          "The charitable transfer should not be treated as money converted into a Roth IRA for projection purposes.",
          "Keep QCD confirmations separate from Roth conversion confirmations.",
        ),
        point(
          "Same-year QCD and conversion planning needs sequencing review",
          "Conversion separation",
          "Users may consider QCDs, RMDs, and conversions in one year, but sequencing and reporting are separate topics.",
          "Ask a CPA or custodian how each transaction should be processed and reported.",
        ),
      ],
    },
    {
      id: "recordkeeping",
      title: "Recordkeeping and Filing Review",
      purpose: "List records users should keep for professional review.",
      points: [
        point(
          "Form 1099-R and charity acknowledgments should be saved",
          "Recordkeeping",
          "QCD review often needs custodian distribution records and charity acknowledgment documents.",
          "Bring Form 1099-R, charity acknowledgments, custodian confirmations, and tax return records to review.",
        ),
        point(
          "Tax software may require manual classification",
          "Recordkeeping",
          "QCD reporting can require care because a distribution form may not fully explain the tax treatment by itself.",
          "Review tax software entries before filing.",
        ),
        point(
          "Post-filing comparison should update future scenarios",
          "Recordkeeping",
          "If QCD treatment changed taxable income, future Roth conversion scenarios should use the filed-return result as a better baseline.",
          "Save filed returns and calculator assumptions together.",
        ),
      ],
    },
    {
      id: "calculator-boundary",
      title: "Calculator Boundary",
      purpose: "Make clear that QCD strategy is outside the Roth conversion calculator.",
      points: [
        point(
          "Calculator does not optimize QCD or charitable giving strategy",
          "Calculator limits",
          "The calculator estimates Roth conversion tax cost and projections; it does not determine QCD eligibility, charitable giving strategy, or RMD satisfaction.",
          "Use calculator output only as one worksheet in a broader professional review.",
        ),
        point(
          "QCD questions belong in the CPA handoff packet",
          "Calculator limits",
          "Users considering QCDs should include charity records, RMD notes, distribution confirmations, and conversion scenarios in the review packet.",
          "Document QCD, RMD, and conversion amounts separately.",
        ),
        point(
          "Income-linked items should be reviewed together",
          "Calculator limits",
          "QCDs can affect taxable income assumptions that also interact with Social Security taxation, IRMAA, ACA premium tax credits, NIIT, and capital gains.",
          "Review the full retirement income stack instead of isolating one transaction.",
        ),
      ],
    },
  ];
}

export function getQcdGuideSummary(sections: QcdGuideSection[]) {
  const points = sections.flatMap((section) => section.points);

  return {
    totalSections: sections.length,
    totalPoints: points.length,
    reviewTopics: Array.from(new Set(points.map((entry) => entry.reviewTopic))),
  };
}
