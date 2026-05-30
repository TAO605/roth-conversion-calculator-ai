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
