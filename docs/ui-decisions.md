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

## 2026-05-30 - Hidden Tax Warnings Are Prioritized, Not Calculated

The tax impact panel now uses user inputs to prioritize review items while keeping unsupported external tax effects out of the calculator math.

Decision:

- Pass calculator input and result into `TaxImpactWarnings`.
- Use `buildTaxImpactReviewItems` to label IRMAA, ACA, Social Security, NIIT, RMD, and state items as standard or input-triggered review.
- Use taxable income plus taxable conversion only as a proxy for NIIT MAGI-side review, not as a tax calculation.
- Link to existing educational guides for deeper review.

## 2026-05-30 - CPA Handoff Is A Copyable Packet

The calculator now includes a `Copy CPA packet` action in the result controls.

Decision:

- Generate plain text from deterministic calculator inputs and outputs.
- Include input-triggered review items from the tax impact prioritization module.
- Include document prompts such as tax returns, Form 8606 records, IRA balances, withholding, Medicare, Marketplace, Social Security, investment income, and RMD context.
- Keep the action as clipboard copy rather than collecting user email or advisor details.

## 2026-05-30 - Result Actions Use Responsive Grouping

The result action row now has four actions, so the layout uses explicit responsive behavior instead of relying on loose wrapping.

Decision:

- Use a labeled `Result actions` group.
- Use full-width single-column buttons on mobile.
- Use two columns on small/tablet viewports.
- Return to a compact flex row on wide desktop.
- Add a reset icon so the destructive utility action is visually recognizable.

## 2026-05-30 - Analytics And Below-Fold Modules Stay Lazy

The homepage now lazy-loads the analytics beacon and uses size-stable fallbacks for heavy below-the-fold modules.

Decision:

- Keep `ProjectionChart`, `AiExplainer`, `PdfReportButton`, `CopyProfessionalHandoffButton`, and `CalculatorAnalyticsBeacon` dynamically loaded.
- Disable SSR for the analytics beacon because it only sends browser-side events.
- Reserve `17rem` for projection loading and `24rem` for AI helper loading to reduce layout shift while chunks load.
- Test these boundaries in `tests/core/homepage-performance.test.ts`.

## 2026-05-30 - Production SEO Checks Are Scripted

Post-deploy SEO verification now uses `npm run seo:smoke`.

Decision:

- Keep the script dependency-free so it can run in the existing Node environment.
- Default to the production `www` domain but allow `SEO_SMOKE_BASE_URL` for previews.
- Check homepage, canonical, robots, sitemap, llms.txt, required trust copy, canonical host, and high-risk YMYL phrases.
- Treat smoke failures as command failures so they can be added to automation later.

## 2026-05-30 - SEO Smoke Runs In GitHub Actions

The production SEO smoke command is now wired into GitHub Actions.

Decision:

- Run on `workflow_dispatch`, pushes to `main`, and a daily schedule.
- Wait 90 seconds after push-triggered runs to reduce race conditions with Vercel production aliasing.
- Use Node 22 and `npm ci` for repeatable execution.
- Keep the workflow secret-free and read-only.

## 2026-05-30 - Search Console Monitoring Starts With Smoke Evidence

The SEO monitoring page now includes a Search Console submission loop.

Decision:

- Run `npm run seo:smoke` before sitemap or URL Inspection actions.
- Submit `sitemap.xml` through the Sitemaps report and record last-read/fetch evidence.
- Use URL Inspection for priority URLs and request indexing only after material changes.
- Review Page indexing statuses against canonical, robots, sitemap, internal-link, and release evidence before changing product code.
