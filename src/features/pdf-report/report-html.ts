import { formatCurrency, formatCurrencyWithCents, formatPercent } from "@/common/format/currency";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildRmdReviewPrep } from "@/features/tax-impact-warnings/rmd-review-prep";
import { buildSocialSecurityTaxationReviewPrep } from "@/features/tax-impact-warnings/social-security-review-prep";
import { buildTaxImpactReviewItems } from "@/features/tax-impact-warnings/tax-impact-review";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBreakEven(result: RothConversionResult): string {
  return result.breakEvenYear === null ? "Not reached in projection period" : `${result.breakEvenYear} years`;
}

function row(label: string, value: string): string {
  return `<tr><th scope="row">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;
}

function list(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function buildReportHtml(input: RothConversionInput, result: RothConversionResult): string {
  const reviewItems = buildTaxImpactReviewItems(input, result);
  const irmaaPrep = buildIrmaaReviewPrep(input, result);
  const acaPrep = buildAcaPremiumTaxCreditReviewPrep(input, result);
  const socialSecurityPrep = buildSocialSecurityTaxationReviewPrep(input, result);
  const niitPrep = buildNiitReviewPrep(input, result);
  const rmdPrep = buildRmdReviewPrep(input);
  const generatedAt = new Date().toISOString().slice(0, 10);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Roth Conversion Calculator Report</title>
  <style>
    :root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; color: #171717; }
    body { margin: 0; background: #f5f5f5; }
    main { max-width: 840px; margin: 0 auto; padding: 32px 20px; background: #fff; }
    h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.2; }
    h2 { margin: 28px 0 12px; font-size: 18px; line-height: 1.3; }
    p, li, td, th { font-size: 14px; line-height: 1.55; }
    .meta { color: #525252; margin: 0 0 20px; }
    .notice { border: 1px solid #d4d4d4; border-radius: 8px; padding: 12px 14px; background: #fafafa; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { border: 1px solid #e5e5e5; padding: 9px 10px; text-align: left; vertical-align: top; }
    th { width: 42%; background: #fafafa; font-weight: 700; }
    ul { margin: 8px 0 0; padding-left: 20px; }
    a { color: #0645ad; }
    @media print {
      body { background: #fff; }
      main { max-width: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Roth Conversion Calculator Report</h1>
    <p class="meta">Generated ${escapeHtml(generatedAt)} for the ${escapeHtml(String(input.taxYear))} tax year. Print this page or use your browser's Save as PDF option.</p>

    <section class="notice" aria-label="Report boundary">
      <p><strong>Report boundary:</strong> This is an educational calculator report based on the inputs entered in the browser. It is not tax, financial, legal, or investment advice.</p>
    </section>

    <section aria-labelledby="inputs-heading">
      <h2 id="inputs-heading">Inputs To Verify</h2>
      <table>
        <tbody>
          ${row("Conversion amount", formatCurrency(input.conversionAmount))}
          ${row("Traditional IRA balance", formatCurrency(input.traditionalIraBalance))}
          ${row("After-tax basis entered", formatCurrency(input.basis))}
          ${row("Filing status", input.filingStatus)}
          ${row("Current taxable income entered", formatCurrency(input.currentTaxableIncome))}
          ${row("State marginal tax assumption", formatPercent(input.stateMarginalTaxRate))}
          ${row("Age entered", String(input.age))}
          ${row("Retirement age assumption", String(input.retirementAge))}
          ${row("Tax payment method modeled", input.taxPaymentMethod)}
          ${row("Expected annual return assumption", formatPercent(input.expectedAnnualReturn))}
          ${row("Retirement marginal tax assumption", formatPercent(input.retirementMarginalTaxRate))}
        </tbody>
      </table>
    </section>

    <section aria-labelledby="outputs-heading">
      <h2 id="outputs-heading">Modeled Calculator Output</h2>
      <table>
        <tbody>
          ${row("Taxable conversion estimate", formatCurrency(result.taxableConversion))}
          ${row("Federal tax estimate", formatCurrency(result.federalTax))}
          ${row("State tax estimate", formatCurrency(result.stateTax))}
          ${row("Potential early distribution penalty", formatCurrency(result.earlyDistributionPenalty))}
          ${row("Total upfront cost estimate", formatCurrency(result.totalUpfrontCost))}
          ${row("Modeled break-even estimate", formatBreakEven(result))}
          ${row("Projected after-tax difference", formatCurrency(result.afterTaxDifference))}
          ${row("Basis exclusion ratio", formatPercent(result.breakdown.basisExclusionRatio))}
          ${row("Federal bracket before conversion", formatPercent(result.bracketImpact.beforeRate))}
          ${row("Federal bracket after conversion", formatPercent(result.bracketImpact.afterRate))}
          ${row("Amount modeled in higher brackets", formatCurrency(result.bracketImpact.incomeTaxedInHigherBrackets))}
        </tbody>
      </table>
    </section>

    <section aria-labelledby="review-heading">
      <h2 id="review-heading">Tax Impact Review Items</h2>
      ${list(reviewItems.map((item) => `${item.label}: ${item.reason}`))}
    </section>

    <section aria-labelledby="irmaa-heading">
      <h2 id="irmaa-heading">IRMAA Review Prep</h2>
      <table>
        <tbody>
          ${row("Premium year context", String(irmaaPrep.premiumYear))}
          ${row("Usual lookback tax year to verify", String(irmaaPrep.usualLookbackTaxYear))}
          ${row("Calculator income proxy after conversion", formatCurrency(irmaaPrep.incomeProxy))}
          ${row(
            "2026 Part B proxy preview",
            `${formatCurrencyWithCents(irmaaPrep.partBEstimate.totalMonthlyPremium)} per month using calculator income proxy; includes ${formatCurrencyWithCents(
              irmaaPrep.partBEstimate.monthlyAdjustmentAmount,
            )} of IRMAA adjustment in the CMS full Part B table.`,
          )}
          ${row("Part B proxy bracket", irmaaPrep.partBEstimate.bracketLabel)}
          ${row("Part B proxy boundary", irmaaPrep.partBEstimate.boundaryNote)}
          ${row("IRMAA threshold note", irmaaPrep.thresholdLabel)}
          ${row("Prep summary", irmaaPrep.summary)}
        </tbody>
      </table>
      <h2>Inputs Still Needed Before Any Premium Amount Review</h2>
      ${list(irmaaPrep.missingInputs)}
    </section>

    <section aria-labelledby="aca-heading">
      <h2 id="aca-heading">ACA Premium Tax Credit Review Prep</h2>
      <table>
        <tbody>
          ${row("Calculator income proxy before conversion", formatCurrency(acaPrep.incomeProxyBeforeConversion))}
          ${row("Taxable conversion income increase", formatCurrency(acaPrep.conversionIncomeIncrease))}
          ${row("Calculator income proxy after conversion", formatCurrency(acaPrep.incomeProxyAfterConversion))}
          ${row("ACA amount estimate status", acaPrep.amountEstimateStatus)}
          ${row("ACA boundary", acaPrep.boundaryNote)}
        </tbody>
      </table>
      <h2>Inputs Still Needed Before Any Subsidy Amount Review</h2>
      ${list(acaPrep.missingInputs)}
    </section>

    <section aria-labelledby="social-security-heading">
      <h2 id="social-security-heading">Social Security Benefit Taxation Review Prep</h2>
      <table>
        <tbody>
          ${row(
            "Non-Social-Security income proxy before conversion",
            formatCurrency(socialSecurityPrep.nonSocialSecurityIncomeProxyBeforeConversion),
          )}
          ${row("Taxable conversion income increase", formatCurrency(socialSecurityPrep.taxableConversionIncrease))}
          ${row(
            "Non-Social-Security income proxy after conversion",
            formatCurrency(socialSecurityPrep.nonSocialSecurityIncomeProxyAfterConversion),
          )}
          ${row("Taxable-benefit amount estimate status", socialSecurityPrep.amountEstimateStatus)}
          ${row("Social Security threshold note", socialSecurityPrep.thresholdNote)}
          ${row("Social Security boundary", socialSecurityPrep.boundaryNote)}
        </tbody>
      </table>
      <h2>Inputs Still Needed Before Any Taxable-Benefit Amount Review</h2>
      ${list(socialSecurityPrep.missingInputs)}
    </section>

    <section aria-labelledby="niit-heading">
      <h2 id="niit-heading">NIIT Amount Review Prep</h2>
      <table>
        <tbody>
          ${row("MAGI proxy before conversion", formatCurrency(niitPrep.magiProxyBeforeConversion))}
          ${row("Taxable conversion income increase", formatCurrency(niitPrep.taxableConversionIncrease))}
          ${row("MAGI proxy after conversion", formatCurrency(niitPrep.magiProxyAfterConversion))}
          ${row("Filing-status NIIT threshold", formatCurrency(niitPrep.filingStatusThreshold))}
          ${row("MAGI proxy excess after conversion", formatCurrency(niitPrep.magiProxyExcessAfterConversion))}
          ${row("NIIT amount estimate status", niitPrep.amountEstimateStatus)}
          ${row("NIIT formula note", niitPrep.formulaNote)}
          ${row("NIIT boundary", niitPrep.boundaryNote)}
        </tbody>
      </table>
      <h2>Inputs Still Needed Before Any NIIT Amount Review</h2>
      ${list(niitPrep.missingInputs)}
    </section>

    <section aria-labelledby="rmd-heading">
      <h2 id="rmd-heading">RMD Uniform Lifetime Preview</h2>
      <table>
        <tbody>
          ${row("Owner age entered", String(rmdPrep.ownerAge))}
          ${row("Traditional IRA balance proxy entered", formatCurrency(rmdPrep.balanceProxy))}
          ${row("RMD preview status", rmdPrep.previewStatus)}
          ${row(
            "Uniform Lifetime Table distribution period",
            rmdPrep.uniformLifetimeDistributionPeriod === null
              ? "Not available in this bounded preview"
              : rmdPrep.uniformLifetimeDistributionPeriod.toFixed(1),
          )}
          ${row(
            "Annual RMD preview",
            rmdPrep.annualRmdPreview === null ? "Not estimated" : formatCurrencyWithCents(rmdPrep.annualRmdPreview),
          )}
          ${row("RMD boundary", rmdPrep.boundaryNote)}
        </tbody>
      </table>
      <h2>Inputs Still Needed Before Any Required Amount Review</h2>
      ${list(rmdPrep.missingInputs)}
    </section>

    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading">Review Sources</h2>
      <ul>
        <li><a href="https://www.medicare.gov/basics/costs/medicare-costs/part-b-costs">Medicare.gov Part B costs and IRMAA overview</a></li>
        <li><a href="https://www.ssa.gov/forms/ssa-44.pdf">SSA Form SSA-44 for life-changing event review</a></li>
        <li><a href="https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/">HealthCare.gov premium tax credit and Marketplace savings</a></li>
        <li><a href="https://www.irs.gov/forms-pubs/about-form-8962">IRS Form 8962 premium tax credit</a></li>
        <li><a href="https://www.irs.gov/publications/p915">IRS Publication 915 Social Security and equivalent railroad retirement benefits</a></li>
        <li><a href="https://www.ssa.gov/faqs/en/questions/KA-02471.html">SSA taxes on Social Security benefits FAQ</a></li>
        <li><a href="https://www.irs.gov/newsroom/net-investment-income-tax">IRS Net Investment Income Tax</a></li>
        <li><a href="https://www.irs.gov/forms-pubs/about-form-8960">IRS Form 8960 Net Investment Income Tax</a></li>
        <li><a href="https://www.irs.gov/publications/p590b">IRS Publication 590-B distributions from IRAs</a></li>
        <li><a href="https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs">IRS RMD FAQs</a></li>
        <li><a href="https://www.irs.gov/publications/p590a">IRS Publication 590-A</a></li>
        <li><a href="https://www.irs.gov/publications/p590b">IRS Publication 590-B</a></li>
      </ul>
    </section>

    <section aria-labelledby="disclaimer-heading">
      <h2 id="disclaimer-heading">Disclaimer</h2>
      <p>${escapeHtml(REQUIRED_DISCLAIMER)}</p>
    </section>
  </main>
</body>
</html>`;
}
