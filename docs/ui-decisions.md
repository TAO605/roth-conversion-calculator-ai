# UI Decisions

## 2026-05-30 - Result Summary Uses Safe V1.3 Metrics

V1.3 asked for a top result area with three dominant numbers. The production implementation keeps that hierarchy but changes the risky `Optimal Conversion Amount` concept into `Modeled bracket room`.

Decision:

- Use `Estimated upfront tax` for immediate cost.
- Use `Modeled bracket room` for tax-bracket capacity without implying personal advice.
- Use `Projected after-tax difference` for long-term scenario comparison.
- Preserve detail cards below the primary row for auditability.

## 2026-05-30 - Quick Estimate Keeps Full Calculator Fidelity

V1.3 asked for fewer visible inputs so users can start faster. The production implementation uses progressive disclosure instead of deleting fields.

Decision:

- Keep the quick block focused on the high-frequency fields that drive the initial estimate.
- Keep basis, current age, retirement tax rate, tax payment method, withholding, penalty exception, and presets in collapsed advanced assumptions.
- Preserve all original inputs so existing calculations, tests, and CPA-review use cases remain intact.

## 2026-05-30 - Hidden Tax Interactions Belong Next To Results

V1.3 emphasized IRMAA and ACA as hidden costs users often miss. The production UI now surfaces the warning panel immediately after the result summary rather than below AI, projection, and advanced details.

Decision:

- Show `Tax Impact Warnings` inside the Results card.
- Keep it after the primary result metrics so the main result still lands first.
- Keep it before AI, projection, and advanced calculation details so hidden interactions are not buried.
- Frame unsupported interactions as professional-review items, not calculated dollar amounts.

## 2026-05-30 - Tax Payment Comparison Is Scenario Modeling

V1.3 requested a tax payment method comparison. The production implementation avoids recommendation language and treats the comparison as a simplified model.

Decision:

- Compare outside funds and IRA withholding inside the Results card.
- Use estimated federal plus state tax as the modeled tax amount for the withholding scenario.
- Show projected Roth value impact and possible early-distribution penalty separately.
- Do not label either option as the best choice or a recommendation.

## 2026-05-30 - Result Boundaries Are Visible Before Numbers

The result area now shows scope badges before the primary numbers so users see the educational and YMYL boundary before interpreting the estimate.

Decision:

- Show tax year, educational estimate, based-on-inputs, and not-tax-advice badges.
- Keep badges compact and visually secondary to the primary result cards.
- Avoid accuracy guarantee language in the badge set.

## 2026-05-30 - Tax Data Trust Requires Source Links And Review Status

The tax-data freshness card now exposes the active tax year, last updated date, official IRS source links, update window, and professional-review status.

Decision:

- Use official IRS links for 2026 tax inflation adjustments, Publication 590-A, and Publication 590-B.
- Say `Tax professional review pending` unless there is real review evidence.
- Add the same metadata to the public health payload so deployment checks can verify the data-trust state.
- Keep the wording educational and avoid implying guaranteed accuracy.
