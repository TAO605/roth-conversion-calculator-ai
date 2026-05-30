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
- Round 12 complete: added a repeatable `npm run seo:smoke` command for homepage, robots, sitemap, llms.txt, canonical, required trust copy, canonical host, and high-risk YMYL phrase checks.
- Round 12 validation: targeted SEO/YMYL tests passed, `npm run seo:smoke` passed against production, full `npm test` passed with 87 files / 228 tests, and `npm run build` passed with homepage First Load JS around 135 kB.
- Round 12 deployed: GitHub main is `c8a78cbe41c021109c0ba3b7f484913a69350cf2`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; post-deploy `npm run seo:smoke` passed.
- Round 13 complete: added a GitHub Actions workflow to run production `npm run seo:smoke` after pushes to main, on manual dispatch, and on a daily schedule.
- Round 13 validation: targeted SEO workflow/script/YMYL tests passed, `npm run seo:smoke` passed against production, full `npm test` passed with 88 files / 229 tests, and `npm run build` passed with homepage First Load JS around 135 kB.
- Round 13 automated: GitHub main is `bda73172fdf8643ca2a9aaafc3009aa4ed770e3e`; the new `SEO Smoke` workflow was recognized by GitHub Actions and the push-triggered run `26677226207` completed successfully.
- Round 14 complete: enhanced `/seo-monitoring` with a Search Console submission loop covering smoke verification, sitemap submission, URL Inspection, request indexing boundaries, Page indexing review, and exception routing.
- Round 14 validation: targeted SEO monitoring/SEO smoke/YMYL tests passed, `npm run seo:smoke` passed against production, full `npm test` passed with 88 files / 230 tests, and `npm run build` passed.
- Round 14 deployed: GitHub main is `c3155333ec488985f28738af3f7d01a2c157798d`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; post-deploy `npm run seo:smoke` passed and `/seo-monitoring` returned the Search Console loop.
- Round 15 in progress: adding a Search Console query opportunity matrix to turn GSC queries into content actions with compliance and professional-review gates.
- Round 15 validation so far: targeted SEO monitoring and YMYL guard tests passed with 2 files / 5 tests.
- Round 15 complete: added the Search Console query opportunity matrix to `/seo-monitoring`, release notes `1.0.68`, feature registry `1.0.68`, and the V1.3 engineering addendum.
- Round 15 validation: targeted SEO monitoring/release notes/YMYL tests passed with 3 files / 7 tests; full `npm test` passed with 88 files / 231 tests; `npm run build` passed; production `npm run seo:smoke` passed.
- Round 15 deployed: GitHub main is `6485f02d9749002214cefe893347936e174f3d4c`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live `/seo-monitoring` returned the query opportunity matrix and professional review gates; GitHub Actions SEO Smoke run `26678412979` completed successfully.
- Search Console operation: URL-prefix property `https://www.roth-conversion-calculator-ai.shop/` was accessible; domain property `sc-domain:roth-conversion-calculator-ai.shop` was not verified because DNS TXT verification was missing.
- Search Console operation: submitted `/sitemap.xml`; GSC returned success with last-read date `2026-05-30` and 120 discovered submitted URLs.
- Search Console operation: inspected `https://www.roth-conversion-calculator-ai.shop/seo-monitoring`; initial state was `Discovered - currently not indexed`, live test passed with `URL can be indexed`, HTTP `200 OK`, all resources loaded, and no JavaScript console messages. Two manual `Request indexing` attempts returned Google's transient `Something went wrong, please try again later` message.
- Round 16 in progress: adding a Search Console exception queue so DNS verification gaps and transient request-indexing failures are tracked as operational evidence instead of triggering unnecessary site changes.
- Round 16 complete: added the Search Console exception queue to `/seo-monitoring`, release notes `1.0.69`, feature registry `1.0.69`, and the V1.3 exception-queue engineering addendum.
- Round 16 validation: targeted SEO monitoring/release notes/YMYL tests passed with 3 files / 8 tests; full `npm test` passed with 88 files / 232 tests; `npm run build` passed; production `npm run seo:smoke` passed.
- Round 16 deployed: GitHub main is `97fa5681139f9a1a9b6d0595b62d9e248769bfcc`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live `/seo-monitoring` returned the exception queue, domain verification item, and URL Inspection indexing request item; GitHub Actions SEO Smoke run `26679082372` completed successfully.
- Round 17 in progress: adding `npm run seo:gsc-evidence` to verify priority URL status, canonical tags, sitemap inclusion, and noindex signals before Search Console retry work.
- Round 17 discovery: the new evidence command found `/methodology` inheriting the homepage canonical on production, so the round now includes a source-level methodology canonical fix.
- Round 17 validation so far: targeted GSC evidence/SEO monitoring/release notes/YMYL tests passed with 4 files / 10 tests; full `npm test` passed with 89 files / 234 tests; `npm run build` passed; production `npm run seo:smoke` passed.
- Round 17 deployed: GitHub main was repaired after an upload encoding issue and is now `a2002a72c8473449b71d83a7d4d0cb229a489ad2`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; production `npm run seo:gsc-evidence` passed for 6 priority URLs including `/methodology`; GitHub Actions SEO Smoke run `26679449721` completed successfully.
- Round 18 in progress: adding `npm run seo:gsc-evidence` to the GitHub Actions SEO Smoke workflow so priority URL canonical, sitemap, and noindex checks run automatically after every main push and scheduled run.
- Round 18 validation so far: targeted SEO workflow/GSC evidence/release/YMYL tests passed with 4 files / 6 tests; full `npm test` passed with 89 files / 234 tests; `npm run build` passed; production `npm run seo:smoke` passed; production `npm run seo:gsc-evidence` passed.
- Round 18 deployed: GitHub main is `151c749f8ccd8cda6a296b7f06d91718c567005b`; Vercel production deployment was aliased to `https://www.roth-conversion-calculator-ai.shop`; live release notes showed `Automated GSC evidence checks`; GitHub Actions SEO Smoke run `26679643367` completed successfully and logged `npm run seo:gsc-evidence` with `priorityUrlCount: 6`.
