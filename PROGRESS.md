# Progress

## Snapshot

- Focus: V1.3 result scope badges completed
- Changed surface: result scope UI, scope placement tests, UI/design memory, project workflow memory
- Validation target: targeted Vitest tests, full Vitest suite, production build, desktop/mobile screenshot smoke

## Round Log

- Round 1: bootstrap created for the current V1.3 execution request.
- Round 1 complete: added V1.3 YMYL language guard; targeted tests passed, full `npm test` passed, and `npm run build` passed.
- Round 1 deployed: Vercel production deployment aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage, sitemap, and robots checks returned 200.
- Round 2 complete: updated homepage result summary to prioritize safe V1.3 metrics: `Estimated upfront tax`, `Modeled bracket room`, and `Projected after-tax difference`.
- Round 2 validation: targeted tests passed, full `npm test` passed with 81 files / 213 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke found all primary metrics with no horizontal overflow.
- Round 2 deployed: GitHub main is `a319a6219a31e770aa31e06d7959479c21b42271`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage and sitemap checks returned 200.
- Round 3 complete: split calculator inputs into visible `Quick Estimate` fields and collapsed `Advanced assumptions` without removing any original inputs.
- Round 3 validation: targeted tests passed, full `npm test` passed with 81 files / 214 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed Quick Estimate visibility, collapsed advanced assumptions, and no horizontal overflow.
- Round 3 cleanup: removed high-risk phrases from AI helper refusal copy and normalized the YMYL source scan so split-across-line phrases are also caught.
- Round 4 complete: moved `Tax Impact Warnings` into the Results card directly after `ResultSummary` and before AI, projection, and advanced calculation details.
- Round 4 validation: targeted tests passed, full `npm test` passed with 82 files / 216 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed warning visibility, result-adjacent placement, and no horizontal overflow.
- Round 5 complete: added safe `Tax Payment Method Comparison` to compare outside funds versus IRA withholding as educational scenarios without recommendation language.
- Round 5 validation: targeted tests passed, full `npm test` passed with 83 files / 218 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed comparison visibility, placement after warnings, and no horizontal overflow.
- Round 6 complete: added result scope badges before the primary result numbers: `2026 tax year`, `Educational estimate`, `Based on your inputs`, and `Not tax advice`.
- Round 6 validation: targeted tests passed, full `npm test` passed with 84 files / 220 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed scope visibility, placement before results, and no horizontal overflow.
- Round 7 complete: strengthened tax-data trust signals with explicit last-updated metadata, IRS source links, public professional-review status, and health-payload traceability.
- Round 7 validation: targeted tax-data/health/homepage/YMYL tests passed, full `npm test` passed with 84 files / 221 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed trust copy visibility and no horizontal overflow.
- Round 7 deployed: GitHub main is `a08aeec10b2854fcc63c65e7eee9890f0bd3b25d`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage, health endpoint, and sitemap checks returned 200.
- Round 8 complete: converted Tax Impact Warnings from a static list into input-prioritized review items for IRMAA, ACA, Social Security, NIIT, RMD, and state-specific review without calculating unsupported external amounts.
- Round 8 validation: targeted warning/result/YMYL tests passed, full `npm test` passed with 84 files / 222 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed prioritized warning visibility and no horizontal overflow.
- Round 8 deployed: GitHub main is `169ac7c56d1bbf2368756b1a0c7fa6df848fe3b7`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage and sitemap checks returned 200.
- Round 9 complete: added a copyable CPA review packet that summarizes inputs, modeled outputs, input-triggered review items, source documents to bring, and compliance boundaries.
- Round 9 validation: targeted professional-handoff/warning/YMYL tests passed, full `npm test` passed with 85 files / 225 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed the `Copy CPA packet` action is visible with no horizontal overflow.
- Round 9 deployed: GitHub main is `54f124bc1ea0b90f7d404a450d2286941a47896f`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage and sitemap checks returned 200.
- Round 10 complete: made the expanded result action set responsive with a mobile single-column layout, tablet two-column layout, desktop wrapping row, and icon-backed reset action.
- Round 10 validation: targeted result-action/professional-handoff/homepage-performance/YMYL tests passed, full `npm test` passed with 86 files / 226 tests, `npm run build` passed, and Playwright desktop/mobile screenshot smoke confirmed all four result actions are visible with no horizontal overflow.
- Round 10 deployed: GitHub main is `a34f29b1747cc859569019dda1b99b910bbcb634`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage and sitemap checks returned 200.
- Round 11 complete: reduced homepage first-load work by lazy-loading the analytics beacon and making below-the-fold chart/AI lazy fallbacks size-stable for CLS control.
- Round 11 validation: targeted homepage-performance/result-action/YMYL tests passed, full `npm test` passed with 86 files / 227 tests, `npm run build` passed with homepage First Load JS around 135 kB, and Playwright desktop/mobile smoke confirmed no horizontal overflow and local CLS sample of 0.
- Round 11 deployed: GitHub main is `cfa7a1df2d8bbf45f93fa70f586fe010a37f1b3f`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live homepage and sitemap checks returned 200.
