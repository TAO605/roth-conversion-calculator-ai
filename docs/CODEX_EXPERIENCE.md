# Codex Experience

Project-specific lessons learned by fixing real issues.

Each entry should be short, concrete, and reusable.

## 2026-05-30 - Guard V1.3 YMYL Language Before UI Work

**Symptom:**

The V1.3 execution manual proposed high-risk tax/finance claims such as direct conversion recommendations, optimal conversion amounts, and absolute accuracy language.

**Root cause:**

Product strategy language from a planning document could be copied into user-facing SEO content, result copy, or AI output without a deterministic guard.

**Fix:**

Extended AI guardrails for recommendation, optimal-action, and absolute-accuracy phrases; added a source-content test that scans user-facing `src/app`, `src/content`, and `src/features` files.

**Guard:**

`tests/core/ymyl-language-guard.test.ts` fails if direct tax advice or absolute accuracy claims enter scanned source content; AI guardrail tests assert risky V1.3 phrases are blocked.

**Validation:**

`npm test -- --run tests/core/ai-guardrails.test.ts tests/core/ai-compliance-gateway.test.ts tests/core/ymyl-language-guard.test.ts`, `npm test`, and `npm run build` passed.

**Future trigger words:**

V1.3 execution, 100% accurate, optimal conversion amount, strongly recommend, you should convert, tax advice wording, YMYL SEO compliance.

## 2026-05-30 - Result Hierarchy Must Preserve YMYL Boundaries

**Symptom:**

The product needed V1.3-style stronger result hierarchy without turning the calculator into a personal tax recommendation engine.

**Root cause:**

High-intent financial UI often wants a single decisive number, but tax calculators need to show scenario estimates and assumptions rather than individual action instructions.

**Fix:**

Reworked the result summary to lead with `Estimated upfront tax`, `Modeled bracket room`, and `Projected after-tax difference`, followed by a scenario reading and detailed tax components.

**Guard:**

`tests/core/result-summary-layout.test.ts` verifies the primary metrics exist and blocks direct recommendation or absolute-accuracy language in the component copy.

**Validation:**

Targeted result/YMYL tests, full `npm test`, `npm run build`, and desktop/mobile Playwright screenshot smoke passed.

**Future trigger words:**

result summary redesign, V1.3 metrics, optimal conversion amount, homepage calculator results, financial UI recommendation wording.

## 2026-05-30 - Use Progressive Disclosure For Tax Calculator Inputs

**Symptom:**

The full calculator input list was complete but dense, making the first calculator interaction feel slower than V1.3's focused tool goal.

**Root cause:**

All inputs were displayed with equal weight, so advanced assumptions competed with the fields most users need for an initial estimate.

**Fix:**

Split inputs into a visible `Quick Estimate` block and a collapsed `Advanced assumptions` section while preserving every original field.

**Guard:**

`tests/core/calculator-input-layout.test.ts` verifies the quick fields are visible and advanced assumptions are collapsed by default. `tests/core/ymyl-language-guard.test.ts` normalizes whitespace before scanning so risky phrases split across JSX lines are still caught.

**Validation:**

Targeted input/homepage/YMYL tests, full `npm test`, `npm run build`, and desktop/mobile Playwright screenshot smoke passed.

**Future trigger words:**

Quick Estimate, input density, advanced assumptions, mobile calculator first screen, V1.3 input split.

## 2026-05-30 - Place Unsupported Tax Interactions Beside Results

**Symptom:**

Hidden-cost warnings for IRMAA, ACA credits, NIIT, AMT, RMDs, and state-specific rules existed, but they appeared after AI, projection, and advanced details.

**Root cause:**

The warning module was technically present but placed too late in the result flow, so users could read the main estimate without seeing important scope limits.

**Fix:**

Moved `Tax Impact Warnings` into the Results card directly after the primary result summary and before AI/projection/advanced details.

**Guard:**

`tests/core/tax-impact-warning-placement.test.ts` verifies the panel content, placement after `ResultSummary`, and single-instance rendering.

**Validation:**

Targeted warning/result/YMYL tests, full `npm test`, `npm run build`, and desktop/mobile Playwright screenshot smoke passed.

**Future trigger words:**

Tax Impact Warnings placement, IRMAA warning buried, ACA hidden cost, result scope limits, unsupported tax interactions.

## 2026-05-30 - Payment Method Comparisons Need Neutral Scenario Language

**Symptom:**

V1.3 asked to compare paying Roth conversion tax with IRA funds versus outside funds, but the original wording leaned toward a direct recommendation.

**Root cause:**

Tax payment method choice depends on personal liquidity, age, penalty rules, tax planning, and professional review, so a calculator should compare modeled effects without instructing the user.

**Fix:**

Added `Tax Payment Method Comparison` with outside-funds and IRA-withholding scenarios, projected Roth value impact, and separate possible penalty wording.

**Guard:**

`tests/core/tax-payment-comparison.test.ts` checks the model, rendered comparison, and absence of recommendation phrases.

**Validation:**

Targeted comparison/YMYL/calculator tests, full `npm test`, `npm run build`, and desktop/mobile Playwright screenshot smoke passed.

**Future trigger words:**

tax payment method comparison, outside funds, IRA withholding, strong recommendation, best payment method, Roth tax payment advice.

## 2026-05-30 - Put YMYL Scope Before Primary Numbers

**Symptom:**

The result area had disclaimers and cautious copy, but users could reach the primary dollar figures before seeing the estimate boundary.

**Root cause:**

Compliance language was present in surrounding copy, but not directly attached to the first result-reading moment.

**Fix:**

Added compact result scope badges before the primary estimates: tax year, educational estimate, based on inputs, and not tax advice.

**Guard:**

`tests/core/result-scope-badges.test.ts` verifies badge content and placement before `ResultSummary`.

**Validation:**

Targeted scope/result/YMYL tests, full `npm test`, `npm run build`, and desktop/mobile Playwright screenshot smoke passed.

**Future trigger words:**

result scope, educational estimate badge, not tax advice, YMYL boundary, before result numbers.

## 2026-05-30 - Tax Data Trust Needs Verifiable Source Metadata

**Symptom:**

The site showed tax-data freshness but did not expose a precise last-updated date, direct IRS source URLs, or the current professional-review status in the reusable metadata.

**Root cause:**

YMYL trust copy can become vague when source links and review status live only in prose instead of a shared data module and tests.

**Fix:**

Extended `TAX_DATA_FRESHNESS` with last-updated metadata, official IRS source URLs, and an explicit pending professional-review status; rendered that data in the freshness card and public health payload.

**Guard:**

`tests/core/tax-data-freshness.test.ts` verifies source URLs and review status. `tests/core/health.test.ts` verifies public operational traceability.

**Validation:**

Targeted tax-data, health, homepage SEO, and YMYL tests passed before full-suite validation.

**Future trigger words:**

tax data freshness, IRS source links, CPA review, professional review status, annual tax update, YMYL trust metadata.

## 2026-05-30 - Hidden Tax Interactions Need Prioritization Without Amount Claims

**Symptom:**

The result-adjacent tax warning panel listed important items, but every item had equal weight even when user inputs suggested some review areas were more relevant.

**Root cause:**

The calculator intentionally does not model IRMAA, ACA premium tax credits, Social Security taxable benefits, NIIT owed, RMDs, or state-specific rules, so a static warning list was safer but less helpful.

**Fix:**

Added `buildTaxImpactReviewItems` to prioritize review items from age, retirement age, state-tax input, and a taxable-income proxy while still avoiding unsupported amount calculations.

**Guard:**

`tests/core/tax-impact-warning-placement.test.ts` verifies input-triggered labeling, guide links, result-card placement, and absence of unsupported NIIT amount wording.

**Validation:**

Targeted warning/result/YMYL tests passed before full-suite validation.

**Future trigger words:**

IRMAA warning, ACA subsidy review, NIIT threshold, hidden tax interaction, input-triggered review, unsupported amount calculation.

## 2026-05-30 - Professional Handoff Should Be Deterministic And Copyable

**Symptom:**

Users can see estimates and warnings, but they still need a structured way to carry the scenario to a CPA or qualified tax professional.

**Root cause:**

A financial calculator can produce useful context without being allowed to make the personal tax decision. The missing workflow was packaging that context safely.

**Fix:**

Added a `Copy CPA packet` action that builds a deterministic plain-text packet from inputs, modeled outputs, input-triggered review items, documents to bring, and the required disclaimer.

**Guard:**

`tests/core/professional-handoff.test.ts` verifies packet sections, clipboard behavior, homepage mounting, required disclaimer, and absence of high-risk recommendation or accuracy claims.

**Validation:**

Targeted professional-handoff, warning, and YMYL tests passed before full-suite validation.

**Future trigger words:**

CPA packet, professional handoff, advisor checklist, copy packet, tax review materials, CPA questions.

## 2026-05-30 - Growing Result Actions Need Explicit Responsive Layout

**Symptom:**

The result card accumulated share, report, CPA packet, and reset actions, which could wrap unevenly on mobile.

**Root cause:**

The original action row used simple flex wrapping, which was fine for two actions but less predictable after the action set grew.

**Fix:**

Changed the action group to mobile single-column, tablet two-column, and desktop flex wrapping; added a lucide reset icon.

**Guard:**

`tests/core/result-actions-layout.test.ts` verifies the responsive classes, action ordering, and reset icon.

**Validation:**

Targeted result-action, professional-handoff, homepage-performance, and YMYL tests passed before full-suite validation.

**Future trigger words:**

result buttons crowded, mobile action layout, Copy CPA packet button, result action group, reset button icon.

## 2026-05-30 - Non-Critical Homepage Work Belongs Behind Dynamic Imports

**Symptom:**

The homepage kept adding useful modules, increasing the risk that non-render-critical work would enter the initial bundle.

**Root cause:**

Analytics and below-the-fold helpers are easy to import statically because they are small in isolation, but their cumulative effect matters for Core Web Vitals.

**Fix:**

Moved `CalculatorAnalyticsBeacon` behind `next/dynamic` with `ssr: false` and gave projection/AI lazy fallbacks stable heights.

**Guard:**

`tests/core/homepage-performance.test.ts` verifies dynamic imports for non-critical modules and size-stable fallbacks.

**Validation:**

Targeted homepage-performance, result-action, and YMYL tests passed before full-suite validation.

**Future trigger words:**

homepage performance, Core Web Vitals, first load JS, analytics beacon, lazy fallback, CLS.

## 2026-05-30 - SEO Smoke Checks Should Be Re-runnable

**Symptom:**

Deployment checks were being performed manually with ad hoc commands, which made it easy to miss canonical, robots, sitemap, llms.txt, or high-risk wording regressions.

**Root cause:**

The project had strong unit tests but lacked a single production smoke command for post-deploy SEO verification.

**Fix:**

Added `scripts/seo-smoke.mjs` and `npm run seo:smoke` to fetch production pages, validate status codes, homepage canonical, required trust copy, robots discovery links, sitemap canonical host, llms.txt entries, and banned YMYL phrases.

**Guard:**

`tests/core/seo-smoke-script.test.ts` verifies the command and key checks remain present.

**Validation:**

Targeted SEO/YMYL tests and `npm run seo:smoke` passed against production.

**Future trigger words:**

SEO smoke, production check, sitemap regression, robots regression, canonical mismatch, post-deploy verification.

## 2026-05-30 - SEO Smoke Needs Automation After Manual Proof

**Symptom:**

`npm run seo:smoke` made production checks repeatable, but still depended on a human or agent remembering to run it after deployment.

**Root cause:**

Manual post-deploy verification closes one release loop but does not provide ongoing regression detection.

**Fix:**

Added `.github/workflows/seo-smoke.yml` to run the SEO smoke command on pushes to `main`, manual dispatch, and a daily schedule.

**Guard:**

`tests/core/seo-smoke-workflow.test.ts` verifies the workflow triggers, production URL, Node setup, delay after push, and smoke command.

**Validation:**

Targeted workflow and SEO smoke tests passed locally before deployment.

**Future trigger words:**

GitHub Actions SEO, automated smoke check, scheduled SEO monitor, post-deploy SEO automation.

## 2026-05-30 - Search Console Work Needs An Evidence Loop

**Symptom:**

The project had a repeatable SEO smoke command, but Search Console operations were still described broadly rather than as a submission and indexing loop.

**Root cause:**

Sitemap submission, URL Inspection, request indexing, and Page indexing reports are related steps, but treating them separately makes it harder to record evidence or route exceptions into engineering fixes.

**Fix:**

Added a Search Console submission loop to `/seo-monitoring` and official Google source links for Sitemaps, URL Inspection, Page indexing, and sitemap guidance.

**Guard:**

`tests/core/seo-monitoring.test.ts` verifies the loop labels, tools, source URLs, and page exposure.

**Validation:**

Targeted SEO monitoring, SEO smoke, and YMYL tests passed before full-suite validation.

**Future trigger words:**

Search Console, sitemap submission, URL Inspection, Page indexing, request indexing, indexing exception.

## 2026-05-30 - Query Growth Needs Review Gates

**Symptom:**

Search Console query review can easily become a keyword list, which risks publishing tax-sensitive pages before the intent, modeled scope, and review boundary are clear.

**Root cause:**

High-intent Roth conversion queries often ask for personalized decisions, bracket limits, state tax effects, or income-linked program impacts that the calculator should not answer as direct advice.

**Fix:**

Added a Search Console query opportunity matrix to `/seo-monitoring` that maps query clusters to target surfaces, safe actions, and compliance or professional-review gates.

**Guard:**

`tests/core/seo-monitoring.test.ts` verifies the opportunity clusters, example queries, review gates, professional-risk routing, and banned YMYL phrasing boundary.

**Validation:**

Targeted SEO monitoring and YMYL language tests passed before full validation.

**Future trigger words:**

GSC query, keyword opportunity, content backlog, bracket room query, state tax query, IRMAA query, SEO growth loop.

## 2026-05-30 - Search Console Failures Are Not Always Site Failures

**Symptom:**

Search Console accepted the sitemap and live-tested `/seo-monitoring` as indexable, but `Request indexing` returned a transient Google error. The domain property also failed DNS verification while the URL-prefix property worked.

**Root cause:**

Google Search Console has separate operational surfaces: DNS verification, sitemap processing, live URL testing, and request-indexing submission. A failure in one surface can be account, DNS, propagation, or Google workflow state rather than a production crawlability defect.

**Fix:**

Added a Search Console exception queue to `/seo-monitoring` with observed status, likely cause, next action, retry window, and required evidence for domain verification, sitemap submission, and request-indexing.

**Guard:**

`tests/core/seo-monitoring.test.ts` verifies the exception queue includes URL-prefix property continuity, sitemap success evidence, live-test indexability, and delayed retry guidance.

**Validation:**

Targeted SEO monitoring tests should pass before deployment, followed by full tests, build, and production smoke.

**Future trigger words:**

request indexing failed, GSC transient error, domain verification failed, DNS TXT, sitemap submitted, URL Inspection live test.

## 2026-05-30 - Priority URL Evidence Can Reveal Canonical Drift

**Symptom:**

The new GSC evidence command failed on production because `/methodology` returned a homepage canonical instead of a self canonical.

**Root cause:**

The root layout defines the homepage canonical, and `/methodology` did not override `alternates.canonical`, so the page inherited the root canonical.

**Fix:**

Added `alternates: { canonical: "/methodology" }` to the methodology page and added `npm run seo:gsc-evidence` to check priority URL status, canonical, sitemap inclusion, and noindex signals.

**Guard:**

`tests/core/gsc-evidence-script.test.ts` verifies the script, priority URLs, noindex check, and methodology canonical source guard.

**Validation:**

Run targeted GSC evidence tests, full tests, build, production smoke, then run `npm run seo:gsc-evidence` after deployment.

**Future trigger words:**

canonical drift, GSC evidence, priority URL check, methodology canonical, request indexing readiness.

## 2026-05-30 - GSC Evidence Should Run Automatically

**Symptom:**

`npm run seo:gsc-evidence` caught a canonical issue, but it still depended on a human or agent remembering to run it before Search Console retries.

**Root cause:**

Manual evidence commands close the immediate loop but do not provide ongoing regression detection for canonical, sitemap, or noindex drift on priority URLs.

**Fix:**

Added `npm run seo:gsc-evidence` to the existing GitHub Actions SEO Smoke workflow after `npm run seo:smoke`.

**Guard:**

`tests/core/seo-smoke-workflow.test.ts` verifies the workflow includes `GSC_EVIDENCE_BASE_URL` and the GSC evidence command.

**Validation:**

Targeted workflow/release/YMYL tests, full tests, build, production smoke, production GSC evidence, and the push-triggered GitHub Actions run must pass.

**Future trigger words:**

automated GSC evidence, canonical CI, priority URL CI, SEO Smoke workflow, Search Console retry readiness.

## 2026-05-30 - CI Evidence Should Be Downloadable

**Symptom:**

GitHub Actions proved SEO checks were green, but the evidence lived only in logs, making Search Console retry support and incident review harder to preserve.

**Root cause:**

Plain `npm run` CI steps print JSON mixed with command output and do not retain structured proof files by default.

**Fix:**

Updated the SEO Smoke workflow to run the scripts directly with `node`, pipe JSON to `seo-smoke-result.json` and `gsc-evidence-result.json`, and upload them as a `production-seo-evidence` artifact retained for 30 days.

**Guard:**

`tests/core/seo-smoke-workflow.test.ts` verifies the artifact upload step, output filenames, and retention period.

**Validation:**

Targeted workflow/release/YMYL tests, full tests, build, production smoke, production GSC evidence, and the push-triggered GitHub Actions run must pass.

**Future trigger words:**

SEO evidence artifact, downloadable GSC evidence, CI proof package, Search Console retry support, production-seo-evidence.
