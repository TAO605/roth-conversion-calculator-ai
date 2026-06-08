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

## 2026-05-30 - Sitemap Freshness Needs Evidence, Not Just Metadata

**Symptom:**

Per-page sitemap `lastmod` values were added for updated SEO pages, but the production GSC evidence command only checked sitemap inclusion and could miss stale freshness metadata.

**Root cause:**

The evidence script treated `<loc>` presence as enough. For Search Console operations, recently updated priority pages also need a deterministic guard that their sitemap `lastmod` did not regress below the current update date.

**Fix:**

Extended `scripts/gsc-evidence.mjs` to parse sitemap `<url>` entries, report `lastmod`, and fail when freshness-critical priority paths have `lastmod` older than `2026-05-30`.

**Guard:**

`tests/core/gsc-evidence-script.test.ts` verifies the freshness-critical paths, `minFreshLastmod`, `lastmodFresh`, and stale-lastmod failure wording stay in the evidence command.

**Validation:**

Run targeted GSC evidence, sitemap, release, and feature tests; full tests; build; production SEO smoke; and production GSC evidence after deployment.

**Future trigger words:**

sitemap freshness regression, stale lastmod, GSC evidence lastmod, priority URL freshness, Search Console sitemap proof.

## 2026-06-02 - Playwright Must Avoid Stale Port Reuse

**Symptom:**

Homepage E2E failed after the calculator client-island split because Playwright reused an existing `127.0.0.1:3000` server from a different project, so the accessibility snapshot showed an unrelated organic supplier site.

**Root cause:**

The Playwright config hard-coded port `3000` with `reuseExistingServer: true`, which is convenient locally but unsafe when another app already occupies the default port.

**Fix:**

Added `PLAYWRIGHT_PORT` support to `playwright.config.ts` and validated the homepage smoke on an isolated port. Updated stale homepage assertions to match current compliant copy and user-like number replacement behavior.

**Guard:**

Run E2E with an explicit clean port when validating release work, for example `$env:PLAYWRIGHT_PORT='3107'; npx playwright test tests/e2e/home.spec.ts`.

**Validation:**

Desktop and mobile homepage E2E passed on the isolated port, followed by full `npm test` and `npm run build`.

**Future trigger words:**

Playwright wrong app, stale localhost, port collision, E2E snapshot mismatch, homepage smoke false failure.

## 2026-06-02 - CI Lighthouse Variance Needs Metric-Level Triggers

**Symptom:**

Production mobile Lighthouse checks passed locally, but GitHub Actions sometimes marked performance evidence as `manualReviewRequired` because TBT spiked on the hosted runner.

**Root cause:**

The retained evidence only exposed `manualReviewRequired` and threshold rows. Reviewers had to inspect the whole performance payload to determine whether the trigger was TBT, LCP, CLS, SEO score, or overall performance score.

**Fix:**

Added `reviewTriggers` and `reviewSummary` to `scripts/performance-evidence.mjs`, then hardened `scripts/validate-seo-evidence.mjs` so uploaded production artifacts must retain those diagnostic fields.

**Guard:**

`tests/core/performance-evidence.test.ts` and `tests/core/seo-evidence-validation.test.ts` require the new fields in the performance evidence command and artifact validator.

**Validation:**

Targeted performance/evidence/release/feature tests, full `npm test`, `npm run build`, local production evidence validation, production SEO evidence commands, and GitHub Actions artifact download all passed.

**Future trigger words:**

Lighthouse variance, CI TBT spike, manualReviewRequired performance, reviewTriggers missing, performance evidence triage.

## 2026-06-02 - Lazy Analytics Helps Production But Does Not Eliminate CI TBT Variance

**Symptom:**

GA4/GTM appeared in local Lighthouse long-task and script-bootup diagnostics, so the GA4 scripts were moved from `afterInteractive` to `lazyOnload`. Production Lighthouse improved, but a later GitHub Actions run still produced a high TBT manual-review artifact.

**Root cause:**

Third-party analytics can contribute to measured long tasks, but GitHub-hosted Lighthouse runs also show runner-specific TBT variance. In the post-change CI artifact, the top script-bootup row was the homepage document rather than GTM, so the issue was not a simple analytics-only bottleneck.

**Fix:**

Keep GA4 on `lazyOnload` and keep the performance evidence artifact retaining `reviewTriggers`, `reviewSummary`, and `tbtDiagnostics` so reviewers can distinguish production findings from CI lab noise.

**Guard:**

`tests/core/analytics.test.ts` prevents GA4 from regressing to `afterInteractive`, and `scripts/validate-seo-evidence.mjs` requires retained TBT diagnostics in uploaded artifacts.

**Validation:**

Targeted analytics/performance/evidence tests, full `npm test`, build, production SEO evidence commands, Vercel production deployment, and GitHub Actions artifact validation all passed.

**Future trigger words:**

GA4 TBT, lazyOnload analytics, GTM long task, CI Lighthouse lab noise, scriptBootupTop homepage.

## 2026-06-02 - Defer Third-Party Analytics With A Queue, Not Just Script Strategy

**Symptom:**

Even after GA4 moved to Next.js `lazyOnload`, production Lighthouse diagnostics could still capture `googletagmanager.com` long tasks and script bootup inside the measured window.

**Root cause:**

`lazyOnload` delays the script until after load, but the external third-party script can still start early enough to overlap Lighthouse's performance window and compete with calculator interactivity on slower lab runs.

**Fix:**

Replaced the direct Next.js GA4 script scheduling with a tiny inline dataLayer/gtag queue and deferred external `gtag.js` injection after page load, browser idle time, and a short fallback delay.

**Guard:**

`tests/core/analytics.test.ts` requires `buildDeferredGtagLoaderScript`, `requestIdleCallback`, the load listener, `window.gtag` queueing, and the removal of `next/script` for GA4.

**Validation:**

Targeted analytics/performance/evidence tests, full `npm test`, build, production SEO evidence commands, Vercel deployment, and live homepage marker checks passed. Production Lighthouse returned TBT `67ms` and no `googletagmanager.com` rows in retained long-task or script-bootup diagnostics.

**Future trigger words:**

deferred analytics queue, GA4 idle loader, third-party script TBT, GTM removed from long tasks, analytics script strategy.

## 2026-06-02 - Use Multi-Sample Lighthouse Evidence For CI Variance

**Symptom:**

Single Lighthouse runs could fail or overstate risk when the SEO category returned `null` transiently or when GitHub Actions produced an isolated TBT spike that did not reproduce in production local checks.

**Root cause:**

The performance evidence artifact previously represented only one Lighthouse sample, so a transient lab condition could become the whole retained performance story.

**Fix:**

Added `samplePolicy` to `scripts/performance-evidence.mjs`: collect up to three mobile Lighthouse samples by default, retain every attempt, discard invalid SEO-category samples from selection, and choose the valid median TBT sample for the final evidence payload.

**Guard:**

`scripts/validate-seo-evidence.mjs` now requires `samplePolicy`, and `tests/core/performance-evidence.test.ts` plus `tests/core/seo-evidence-validation.test.ts` guard the multi-sample fields and selection strategy.

**Validation:**

Targeted performance/evidence/release/feature tests, full `npm test`, `npm run build`, local production evidence package validation, Vercel production deployment, production SEO evidence commands, and GitHub Actions artifact download all passed. Final CI evidence retained three valid attempts with performance `0.99`, SEO `1.00`, LCP about `1664ms`, TBT about `80ms`, CLS `0`, and `manualReviewRequired: false`.

**Future trigger words:**

Lighthouse null SEO category, CI TBT variance, single-sample performance evidence, median Lighthouse sample, samplePolicy missing.
## 2026-06-02 - Separate Visible No-AI UI From SEO Metadata Changes

**Symptom:**

A no-AI visual refactor can remove AI-first hero copy while the live HTML still contains legacy AI branding in metadata or JSON-LD.

**Root cause:**

Visible UI, SEO title/meta, site config, and structured data are separate surfaces. A source document that says "UI only" should not silently change SEO metadata, but the remaining metadata match can still look like a missed no-AI cleanup if it is not recorded.

**Fix:**

Treat the first pass as homepage/core calculator UI only: remove AI-first visible hero and CTA language, preserve SEO architecture, and explicitly document remaining metadata as a separate review item.

**Guard:**

`tests/core/ui-no-ai-style.test.ts` guards visible homepage copy and core calculator styling. A future SEO-title pass should add separate tests for `src/app/layout.tsx`, `src/core/seo/site-config.ts`, and `src/core/seo/json-ld.ts`.

**Validation:**

Targeted UI/release/feature tests, full `npm test`, `npm run build`, Vercel production deployment, production SEO smoke, GSC evidence, structured-data evidence, blog discovery evidence, and mobile Lighthouse evidence passed.

**Future trigger words:**

no-AI UI, AI metadata remains, SEO title debranding, structured data site name, visible hero versus JSON-LD.

## 2026-06-03 - No-AI Branding Needs Dedicated Metadata Guards

**Symptom:**

After the visible homepage UI was debranded, production HTML could still expose the old AI-first brand through `<title>`, Open Graph, Twitter card, RSS title, Organization JSON-LD, WebSite JSON-LD, and homepage WebPage JSON-LD.

**Root cause:**

Search snippets and structured-data names are driven by shared SEO configuration and layout metadata, not by the visible H1 alone.

**Fix:**

Updated root metadata, social metadata, `siteConfig.siteName`, RSS-derived site naming, and homepage WebPage JSON-LD to the professional `Roth Conversion Calculator` brand while preserving the optional AI explainer feature.

**Guard:**

`tests/core/seo-no-ai-branding.test.ts` blocks the old `AI Roth Conversion Calculator` brand from global metadata and homepage structured data.

**Validation:**

Targeted SEO metadata tests, full `npm test`, and `npm run build` passed before deployment.

**Future trigger words:**

Google title still says AI, Open Graph AI title, Twitter card AI title, RSS title AI, Organization JSON-LD brand, WebPage JSON-LD name.

### 2026-06-03 - Stable placeholders for lazy action buttons

**Symptom:**

Homepage result action toolbar could change width/count while dynamically imported report and CPA packet buttons loaded.

**Root cause:**

Dynamic action button imports returned null loading states while the toolbar used a layout that changed shape after hydration.

**Fix:**

Added disabled size-stable LazyActionButtonFallback placeholders and changed result actions to a stable two-to-four column grid.

**Guard:**

Added result-actions-layout regression checks for placeholders and stable grid classes; ran targeted tests, full Vitest, build, and homepage Playwright E2E.

**Validation:**

Targeted tests passed 4 files / 16 tests; full npm test passed 101 files / 295 tests; npm run build passed with 130 static pages; Playwright homepage passed on PLAYWRIGHT_PORT=3116.

**Future trigger words:**

lazy-loaded button layout shift; mobile action toolbar jumps; dynamic import returns null in UI actions

### 2026-06-03 - Keep projection assumptions collapsible in mobile calculator inputs

**Symptom:**

Quick Estimate exposed projection-only fields together with core tax estimate fields, increasing mobile input density before users reached results.

**Root cause:**

Retirement age and expected annual return are important assumptions but not always needed for the first tax estimate read, so showing them with core income and conversion fields made the first mobile form longer.

**Fix:**

Moved retirement age and expected annual return into a collapsed Projection assumptions disclosure inside Quick Estimate while preserving defaults and editability.

**Guard:**

Updated calculator-input-layout tests to require the collapsed projection assumptions disclosure and field availability; ran targeted tests, full Vitest, build, and homepage Playwright E2E.

**Validation:**

Targeted tests passed 4 files / 17 tests; full npm test passed 101 files / 296 tests; npm run build passed with 130 static pages; Playwright homepage passed on PLAYWRIGHT_PORT=3117.

**Future trigger words:**

mobile input density; Quick Estimate too long; projection assumptions; retirement age field placement; expected annual return field placement

### 2026-06-03 - Native details summaries need mobile touch affordances

**Symptom:**

Projection and advanced calculator disclosures were native and functional but had small plain summary rows that were easy to miss on mobile.

**Root cause:**

The previous details/summary implementation preserved accessibility but did not style the summary as a full-width mobile touch target or provide a visible expand affordance.

**Fix:**

Added a shared DisclosureSummary with min-h-11, hidden default markers, visible ChevronDown affordance, and group-open rotation while preserving native details/summary behavior.

**Guard:**

Updated calculator-input-layout tests to require mobile touch target classes, ChevronDown, marker hiding, and open-state rotation; ran targeted tests, full Vitest, build, and homepage Playwright E2E.

**Validation:**

Targeted tests passed 4 files / 18 tests; full npm test passed 101 files / 297 tests; npm run build passed with 130 static pages; Playwright homepage passed on PLAYWRIGHT_PORT=3118.

**Future trigger words:**

details summary touch target; disclosure too small on mobile; missing expand chevron; advanced assumptions affordance; projection assumptions affordance

### 2026-06-03 - Operations playbooks should not inherit marketing glass surfaces

**Symptom:**

Audit and operations playbook routes still used translucent white panels, large custom radii, material shadows, and backdrop blur after the core calculator had moved to a professional financial-tool surface.

**Root cause:**

The no-AI UI pass initially focused on the homepage calculator and support panels, leaving secondary operations pages with older template-style presentation classes.

**Fix:**

Converted the operations and audit page shells to plain bordered review panels with `rounded-lg` page sections and `rounded-md` nested evidence panels while preserving page copy, breadcrumbs, JSON-LD, and disclaimers.

**Guard:**

Added an operations-page UI regression test that scans the operations routes for old glass, large-radius, translucent, and heavy-shadow classes.

**Validation:**

Run targeted operations UI, release-note, feature-registry, and operations content tests; then run full Vitest, build, Playwright, and production SEO evidence before closing the release.

**Future trigger words:**

operations page glass; audit page looks like landing page; playbook card styling; large rounded operations surface; shadow-material returned

### 2026-06-03 - Content hub cards should behave like navigation panels

**Symptom:**

Top-level hub and index routes still used translucent cards, hover lift, custom large radii, and material shadows after the calculator and operations pages moved to professional bordered surfaces.

**Root cause:**

Content hubs were created as SEO navigation surfaces but inherited landing-card styling that made them feel more decorative than scannable.

**Fix:**

Converted hub cards and index sections to plain bordered panels with restrained hover borders while preserving route links, H1s, JSON-LD, and disclaimers.

**Guard:**

Added a content-hub UI regression test that scans top-level hub routes for old glass, hover-lift, translucent, and custom large-radius classes.

**Validation:**

Run targeted content hub UI, release-note, feature-registry, and hub content tests; then run full Vitest, build, Playwright, and production SEO evidence before closing the release.

**Future trigger words:**

hub cards look like landing page; content index glass; hover lift on SEO hubs; site index shadow-material; glossary translucent cards

### 2026-06-03 - Priority YMYL guide pages need review-panel surfaces

**Symptom:**

Priority educational guide pages and CPA-review pages still used translucent headers, large custom radii, material shadows, and glass-like nested cards after the calculator, operations pages, and content hubs had moved to professional bordered surfaces.

**Root cause:**

Guide pages were generated from an earlier content-page template, so their trust-critical review notes inherited decorative card styling instead of audit-style review panels.

**Fix:**

Converted guide headers, sections, nested points, and review-note callouts to plain bordered review panels while preserving guide copy, source links, JSON-LD, breadcrumbs, and disclaimers.

**Guard:**

Added a priority-guide UI regression test that scans monitored YMYL guide routes for old glass, heavy-shadow, translucent, and custom large-radius classes.

**Validation:**

Run targeted priority guide UI, release-note, feature-registry, and guide content tests; then run full Vitest, build, Playwright, and production SEO evidence before closing the release.

**Future trigger words:**

guide page glass; YMYL guide card styling; CPA checklist translucent; review note shadow-material; priority guide oversized radius

### 2026-06-03 - Dynamic detail pages should not inherit landing-card styling

**Symptom:**

Non-blog dynamic detail pages still used translucent panels, custom large radii, and material shadows after hub and priority guide routes had moved to professional bordered surfaces.

**Root cause:**

Dynamic SEO/detail routes were generated from earlier landing-card templates, so route-specific worksheet sections and calculator CTAs inherited decorative surfaces.

**Fix:**

Converted keyword, age scenario, basis, example, filing status, glossary, state, federal bracket, multi-year planning, tax interaction, and tax payment method detail panels to plain bordered surfaces while preserving body copy, JSON-LD, breadcrumbs, disclaimers, and CTA targets.

**Guard:**

Added a dynamic-detail UI regression test that scans non-blog dynamic detail routes for old glass, heavy-shadow, translucent, hover-lift, and custom large-radius classes.

**Validation:**

Run targeted dynamic detail UI, release-note, feature-registry, and relevant content tests; then run full Vitest, build, Playwright, and production SEO evidence before closing the release.

**Future trigger words:**

dynamic detail glass; SEO detail page shadow-material; bracket page translucent table; state page oversized radius; keyword page landing-card styling

### 2026-06-03 - Shared feature components multiply surface regressions

**Symptom:**

Reusable feature components still carried translucent table wrappers, glass-like FAQ cards, oversized radii, backdrop blur, and light material shadows after page-level surfaces had been cleaned up.

**Root cause:**

Shared components were outside the page-route UI guards, so their old template classes continued to appear across homepage, methodology, and result surfaces.

**Fix:**

Converted shared table wrappers, FAQ items, bracket impact cards, tax data freshness notes, scenario history rows, and theme toggle surfaces to plain bordered UI while preserving interactions, labels, links, storage behavior, and calculated values.

**Guard:**

Added a shared-feature UI regression test that scans reusable feature components for old glass, heavy-shadow, translucent, hover-lift, and custom large-radius classes.

**Validation:**

Run targeted shared feature UI, release-note, feature-registry, theme, scenario history, tax-data freshness, homepage performance, and homepage E2E tests; then run full Vitest, build, and production SEO evidence before closing the release.

**Future trigger words:**

shared component glass; FAQ translucent cards; table wrapper bg-white/60; theme toggle backdrop blur; scenario history oversized radius

### 2026-06-03 - Operations guards must include status counters

**Symptom:**

The Launch Readiness page still had oversized custom-radius status counters after the operations page surface cleanup, even though the route was already part of the operations UI guard.

**Root cause:**

The operations UI guard blocked several old classes but omitted `rounded-[18px]`, so status counters could keep template-era geometry while page-level panels were cleaned up.

**Fix:**

Converted Launch Readiness total, complete, and pending counters to small-radius bordered status panels and tightened the operations UI guard to block `rounded-[18px]`.

**Guard:**

Updated `tests/core/operations-page-ui.test.ts` so operations routes fail when custom `rounded-[18px]` status cards return.

**Validation:**

Run operations UI, launch readiness, release-note, feature-registry, full Vitest, build, homepage E2E, and production SEO evidence before closing the release.

**Future trigger words:**

launch readiness status card; operations counter oversized radius; rounded-[18px] operations; status block template surface

### 2026-06-03 - Blog shell UI must be separated from article authorship

**Symptom:**

The blog index and article shell still used translucent cards, custom large radii, hover lift, and material shadows after the rest of the non-blog UI had moved to professional bordered surfaces.

**Root cause:**

Blog article bodies were correctly treated as user-owned writing, but the surrounding blog shell was left outside the UI cleanup guards, so old template classes remained in topic groups, metadata panels, calculator CTA, and related-guide links.

**Fix:**

Converted blog shell surfaces to plain bordered editorial panels while leaving `post.body`, Article JSON-LD, Breadcrumb JSON-LD, canonical metadata, and disclaimer text unchanged.

**Guard:**

Added `tests/core/blog-shell-ui.test.ts` to scan blog shell routes for old glass, heavy-shadow, translucent, hover-lift, and custom large-radius classes.

**Validation:**

Run blog shell UI, blog content, blog discovery evidence, release-note, feature-registry, full Vitest, build, homepage E2E, and production SEO evidence before closing the release.

**Future trigger words:**

blog shell glass; blog card shadow-material; related guide hover lift; article metadata bg-white/70; blog topic oversized radius

### 2026-06-03 - Page-specific UI guards need a global source baseline

**Symptom:**

After the professional UI cleanup reached app routes, dynamic detail pages, shared feature components, and blog shells, old glass-template classes were gone from source but only protected by multiple scoped tests.

**Root cause:**

Scoped UI guards are good for route semantics, but future routes or feature components could still add old template classes without being included in one of the existing page-specific lists.

**Fix:**

Added a global professional UI guard that recursively scans `src/app` and `src/features` for old glass, material-shadow, hover-lift, translucent, and oversized custom-radius classes.

**Guard:**

`tests/core/professional-ui-global-guard.test.ts` fails with file-level violation messages whenever old template surface classes return to app or feature source.

**Validation:**

Run the global guard together with page-specific UI guards, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, and production SEO evidence before closing the release.

**Future trigger words:**

new route glass class; feature component shadow-material; global UI guard; old template class returned; professional surface regression

### 2026-06-04 - Source-level UI guards should be retained in production evidence

**Symptom:**

The global professional UI guard protected local and CI test runs, but the downloadable `production-seo-evidence` artifact did not retain a machine-readable UI source health result.

**Root cause:**

The SEO Smoke workflow uploaded live SEO, GSC, structured data, blog discovery, performance, validator, and manifest evidence, but source-level UI guard status was only represented by tests outside the retained artifact.

**Fix:**

Added `scripts/professional-ui-evidence.mjs`, wired it into `npm run seo:professional-ui-evidence`, the SEO Smoke workflow, the evidence validator, and the evidence manifest.

**Guard:**

Added `tests/core/professional-ui-evidence.test.ts` so the package script, workflow artifact path, validator, manifest, and source guard metadata stay wired together.

**Validation:**

Run professional UI evidence, evidence validator, manifest generation, workflow wiring tests, global UI guard tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

UI guard not in artifact; professional UI evidence missing; production-seo-evidence lacks source guard; validator missing UI evidence; manifest missing professional UI result

### 2026-06-04 - Visible operations copy must track artifact contract changes

**Symptom:**

The production SEO artifact expanded to include `professional-ui-evidence-result.json`, but the `/seo-monitoring` artifact review checklist still described only the older evidence files.

**Root cause:**

Automation and artifact retention changed faster than the human-facing operations playbook, leaving reviewers without visible instructions for the new source-level UI evidence.

**Fix:**

Updated the SEO monitoring artifact checklist to include the professional UI source guard file and its pass signals, including `ok: true`, scanned source roots, `violationCount: 0`, and empty violations.

**Guard:**

Updated `tests/core/seo-monitoring.test.ts` so the checklist must include `professional-ui-evidence-result.json`, `professionalUiScannedFileCount`, and `violationCount: 0`.

**Validation:**

Run SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

artifact checklist stale; SEO monitoring missing new evidence file; professional UI evidence review missing; operations page artifact contract drift

### 2026-06-04 - Evidence manifests should include content checksums

**Symptom:**

The production SEO evidence manifest listed retained files and byte sizes, but it did not include a content hash for each source evidence file.

**Root cause:**

The manifest started as a traceability inventory for workflow run metadata and artifact contents. Once the artifact became the durable proof package for SEO, GSC, performance, structured data, blog discovery, and UI source evidence, file presence alone was weaker than an integrity check.

**Fix:**

Added `sha256` checksums to each retained source evidence file record in `seo-evidence-manifest.json` while keeping the manifest self-entry as `selfDescribing: true`.

**Guard:**

Updated SEO evidence workflow tests and SEO monitoring tests so the checksum contract and visible artifact review copy must keep mentioning `sha256`.

**Validation:**

Run manifest generation, SEO evidence validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest lacks checksum; artifact integrity unclear; production SEO evidence hash missing; downloaded evidence package tamper check; sha256 missing

### 2026-06-04 - Evidence checksums need an executable validator

**Symptom:**

The production SEO evidence manifest recorded `sha256` values, but CI did not yet execute a checksum validator against the retained files before uploading the artifact.

**Root cause:**

Adding hashes made the manifest stronger as a record, but the workflow still treated checksum review as a manual activity instead of an automated gate.

**Fix:**

Added `scripts/validate-seo-evidence-manifest.mjs`, exposed it as `npm run seo:evidence-manifest-validate`, and ran it in SEO Smoke after manifest generation and before artifact upload.

**Guard:**

Updated SEO evidence workflow tests and SEO monitoring tests so the validator command, workflow step, byte-count checks, `sha256` checks, and downloaded-artifact review copy stay wired together.

**Validation:**

Run manifest generation, manifest validation, SEO evidence validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

checksum recorded but not verified; manifest validator missing; production SEO artifact hash mismatch; seo:evidence-manifest-validate missing; artifact upload before checksum validation

### 2026-06-04 - Manifest validation output should be retained with the artifact

**Symptom:**

CI validated the SEO evidence manifest checksums, but the validator result itself only lived in workflow logs.

**Root cause:**

The workflow uploaded source evidence, the main evidence validator, and the manifest, but did not retain the manifest checksum validator output as a JSON artifact file.

**Fix:**

Retained `seo-evidence-manifest-validation-result.json` in `production-seo-evidence` and listed it in the manifest as `postManifestValidation: true`.

**Guard:**

Updated workflow and monitoring tests so the artifact upload path, manifest metadata, and `/seo-monitoring` review checklist all include the retained manifest validation result.

**Validation:**

Run manifest generation, manifest validation, SEO evidence validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest validation result missing; checksum validator only in logs; postManifestValidation missing; retained checksum evidence missing

### 2026-06-04 - SEO evidence artifacts need direct provenance links

**Symptom:**

Downloaded production SEO evidence artifacts retained run IDs and commit SHAs, but reviewers still needed to reconstruct the exact GitHub Actions and commit URLs manually.

**Root cause:**

The manifest treated GitHub identity as raw metadata rather than review-ready provenance links.

**Fix:**

Added `gitHubRunUrl` and `gitHubCommitUrl` to `seo-evidence-manifest.json` and URL-shape checks to the manifest validator.

**Guard:**

Updated SEO evidence manifest tests and `/seo-monitoring` artifact review tests so provenance URL fields remain present and validated.

**Validation:**

Run simulated GitHub Actions manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, homepage E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

artifact provenance unclear; manifest missing run URL; manifest missing commit URL; downloaded SEO evidence cannot link back to Actions; gitHubRunUrl missing; gitHubCommitUrl missing

### 2026-06-04 - SEO evidence manifests need schema versions

**Symptom:**

The production SEO evidence manifest kept gaining useful fields, but the artifact contract had no explicit machine-readable version.

**Root cause:**

Manifest evolution was tracked in release notes and tests, but downloaded artifacts did not identify which manifest shape they conformed to.

**Fix:**

Added `artifactSchemaVersion` to `seo-evidence-manifest.json` and required the expected value in the manifest validator.

**Guard:**

Updated SEO evidence and SEO monitoring tests so the schema version remains visible in both automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest schema unclear; artifact contract changed; artifactSchemaVersion missing; evidence manifest version drift; proof package schema mismatch

### 2026-06-04 - SEO evidence manifests need validated creation timestamps

**Symptom:**

The production SEO evidence manifest included `generatedAt`, but the checksum validator did not prove that the field was present and parseable.

**Root cause:**

Manifest integrity checks focused on file inventory, checksums, schema version, and GitHub provenance before validating the artifact creation timestamp.

**Fix:**

Added ISO timestamp validation for `generatedAt` and retained `generatedAtRetained: true` plus the timestamp in the manifest validation result.

**Guard:**

Updated SEO evidence and SEO monitoring tests so timestamp validation remains visible in automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest generatedAt missing; artifact creation time unclear; SEO evidence timestamp drift; generatedAtRetained missing; proof package generated time unverified

### 2026-06-04 - SEO evidence provenance URLs must match raw GitHub IDs

**Symptom:**

The production SEO evidence manifest retained both raw GitHub identifiers and direct URLs, but the validator only checked URL shape.

**Root cause:**

Run and commit provenance fields were treated as independently valid fields instead of a single consistency contract.

**Fix:**

Validated that `gitHubRunUrl` ends with `gitHubRunId` and `gitHubCommitUrl` ends with `gitHubSha`, then retained `gitHubProvenanceConsistent: true`.

**Guard:**

Updated SEO evidence and SEO monitoring tests so provenance consistency remains visible in automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest provenance mismatch; run URL does not match run ID; commit URL does not match SHA; gitHubProvenanceConsistent missing; evidence artifact links wrong commit

### 2026-06-04 - SEO evidence artifacts need workflow event metadata checks

**Symptom:**

The production SEO evidence manifest retained event and workflow fields, but the validator did not prove the event name, workflow name, or run attempt were usable.

**Root cause:**

Workflow provenance was split across raw metadata fields without a validator contract for allowed event names or Actions attempt identity.

**Fix:**

Restricted `eventName` to known generation contexts and required `gitHubWorkflow` plus numeric `gitHubRunAttempt` for GitHub Actions artifacts.

**Guard:**

Updated SEO evidence and SEO monitoring tests so workflow event metadata stays visible in automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest eventName invalid; gitHubWorkflow missing; gitHubRunAttempt missing; runAttemptRetained missing; workflow event metadata unverified

### 2026-06-04 - SEO evidence artifacts need repository provenance checks

**Symptom:**

The production SEO evidence manifest could prove a GitHub run URL, commit URL, workflow, and run attempt, but it did not explicitly prove which repository generated the artifact.

**Root cause:**

Repository identity was only implicit in generated URLs. The manifest lacked a retained `gitHubRepository` field and the validator had no expected-repository contract.

**Fix:**

Added `gitHubRepository` to the manifest generator, validated it against `TAO605/roth-conversion-calculator-ai`, and retained `gitHubRepositoryRetained: true` in the manifest validation result.

**Guard:**

Updated SEO evidence and SEO monitoring tests so repository provenance remains visible in automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest repository missing; gitHubRepositoryRetained missing; wrong repository artifact; SEO evidence from wrong repo; repository provenance unverified

### 2026-06-04 - Calculator inputs need functional updates for rapid entry

**Symptom:**

The mobile Playwright readiness flow filled conversion amount, taxable income, and state rate quickly, but the conversion amount later returned to its default while the later fields remained changed.

**Root cause:**

`CalculatorInput.update()` merged changes with the render-time `value` prop. Rapid consecutive input events could reuse an older snapshot and overwrite a field that had just changed.

**Fix:**

Changed calculator input and preset updates to use React functional state updates so each field merges with the latest current input state.

**Guard:**

Added unit coverage for functional input updaters and kept the Playwright workflow asserting the final calculation breakdown after rapid entry.

**Validation:**

Run calculator input tests, state shortcut tests, E2E, full Vitest, build, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

rapid input overwrites field; mobile calculator fill reset; conversion amount returns to default; stale input snapshot; E2E amount mismatch

### 2026-06-04 - SEO evidence artifacts need GitHub server host checks

**Symptom:**

The production SEO evidence manifest retained `gitHubServerUrl`, but the validator did not explicitly prove it was the expected GitHub host.

**Root cause:**

Artifact provenance checks validated repository, run, commit, workflow, and attempt metadata before treating the GitHub server URL as part of the same identity contract.

**Fix:**

Validated `gitHubServerUrl` as `https://github.com` and retained `gitHubServerUrlRetained: true` in the manifest validation result.

**Guard:**

Updated SEO evidence and SEO monitoring tests so server-host provenance remains visible in automation and artifact review instructions.

**Validation:**

Run manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

manifest GitHub server changed; gitHubServerUrlRetained missing; wrong GitHub host; artifact server provenance unverified; unexpected GitHub server URL

### 2026-06-04 - DNS screenshots need retained production evidence

**Symptom:**

Domain-provider screenshots showed Vercel CNAME records and Google TXT verification, but the durable SEO evidence artifact did not prove the live apex redirect or canonical www response.

**Root cause:**

DNS health was manually checked with resolver and curl commands outside the retained `production-seo-evidence` package.

**Fix:**

Added `dns-evidence-result.json` to the SEO Smoke artifact contract, validating Vercel CNAME retention, apex-to-www 308 redirect, and canonical www 200 response.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so DNS evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run DNS evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

DNS screenshot only; Vercel domain warning; apex redirect unknown; www host down; dns-evidence missing; expectedCnameRetained missing

### 2026-06-04 - Security headers need retained production evidence

**Symptom:**

Security headers were configured and unit-tested, but the durable production SEO evidence artifact did not prove the live Vercel response retained them.

**Root cause:**

The artifact focused on SEO smoke, GSC, DNS, Lighthouse, structured data, blog discovery, and UI source guard evidence before treating browser security headers as a first-class production trust signal.

**Fix:**

Added `security-headers-evidence-result.json` to the SEO Smoke artifact contract, validating live CSP, HSTS, nosniff, referrer policy, permissions policy, frame ancestors, base URI, form action, and absence of `X-Powered-By`.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so security-header evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run security-header evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

security headers only in config; CSP missing in production; HSTS missing; X-Powered-By exposed; security-headers evidence missing; frameAncestorsNone missing

### 2026-06-04 - Health endpoint needs retained production evidence

**Symptom:**

The launch and SEO monitoring playbooks referenced `/api/health`, but the durable `production-seo-evidence` artifact did not retain the live health payload or prove it stayed public, cache-safe, and free of secret-like keys.

**Root cause:**

Operational health was treated as a manual URL to open instead of a first-class production evidence file in the same artifact contract as SEO smoke, DNS, security headers, structured data, blog discovery, performance, and UI guard evidence.

**Fix:**

Added `health-evidence-result.json` to the SEO Smoke artifact contract, validating live HTTP 200 JSON, `no-store` cache control, app identity, tax year 2026, tax-data freshness, pending professional-review language, blog/glossary/feature counts, and absence of secret-like keys.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so health evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run health evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, health tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

health endpoint only manual; /api/health not in artifact; healthEndpointOk missing; no-store missing; secret key exposed in health payload; taxYear missing in health evidence

### 2026-06-04 - Crawl discovery endpoints need retained production evidence

**Symptom:**

The production SEO smoke check verified robots.txt, sitemap.xml, feed.xml, and llms.txt at a high level, but the durable `production-seo-evidence` artifact did not retain detailed discovery counts, canonical-host coverage, RSS item coverage, or llms.txt core coverage.

**Root cause:**

Discovery endpoints were treated as smoke status checks instead of a first-class production evidence file that reviewers can inspect before sitemap resubmission, crawl incident notes, RSS checks, or AI-search discovery review.

**Fix:**

Added `crawl-discovery-evidence-result.json` to the SEO Smoke artifact contract, validating robots discovery links, sitemap canonical-host URL coverage and required paths, RSS content type and blog item count, and llms.txt core paths plus educational boundary language.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so crawl discovery evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run crawl discovery evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

robots only smoke checked; sitemap URL count unknown; feed.xml item count missing; llms core coverage missing; crawlDiscoveryUrlCount missing; crawl discovery not in artifact

### 2026-06-05 - Internal link health needs retained production evidence

**Symptom:**

The production evidence artifact proved discovery endpoints existed, but it did not prove that all sitemap URLs were live, canonical-host HTML pages without noindex or that `/site-index` retained core internal links.

**Root cause:**

Internal linking and crawl-depth health were treated as weekly manual SEO review items rather than first-class retained production evidence.

**Fix:**

Added `internal-link-evidence-result.json` to the SEO Smoke artifact contract, validating sitemap URL status, canonical host retention, noindex absence, checked URL count, and `/site-index` internal-link coverage.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so internal-link evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run internal-link evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

orphan pages; crawl depth unknown; sitemap URLs not checked; site-index links missing; internalLinkCheckedUrlCount missing; discovered not indexed without internal link evidence

### 2026-06-05 - HTML quality needs retained production evidence

**Symptom:**

Source tests and page templates covered SEO semantics, but the durable `production-seo-evidence` artifact did not prove the deployed pages retained `lang`, one H1, titles, meta descriptions, canonical tags, image alt text, button names, and form labels.

**Root cause:**

HTML quality was treated as source-level or manual review evidence instead of a first-class production artifact contract checked after deployment.

**Fix:**

Added `html-quality-evidence-result.json` to the SEO Smoke artifact contract, validating production HTML quality across sitemap URLs. The checker recognizes both explicit `label for=id` and valid implicit `<label>...<input>...</label>` form labeling.

**Guard:**

Updated SEO evidence, manifest, workflow, and SEO monitoring tests so HTML quality evidence remains generated, uploaded, validated, checksummed, and visible in the artifact review checklist.

**Validation:**

Run HTML quality evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

missing H1 in production; title missing; meta description missing; canonical missing; image alt missing; form labels missing; htmlQualityPageCount missing; HTML quality not in artifact

### 2026-06-05 - Professional review readiness needs retained evidence

**Symptom:**

Professional review readiness can drift when it exists only as page copy, a checklist, or a chat recommendation.

**Root cause:**

The site had pending professional-review status and CPA handoff content, but no dedicated production evidence file proving the review packet page, sitemap, llms.txt, health tax year, and pending status stayed aligned.

**Fix:**

Added `/professional-review-packet` and retained `professional-review-packet-evidence-result.json` in the production SEO artifact contract.

**Guard:**

The SEO evidence validator and manifest checksum validator require the professional review packet evidence file before artifact upload.

**Validation:**

Run professional review packet evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

professional review packet missing; CPA handoff not discoverable; pending review status changed; professionalReviewPacketOk missing; review packet not in sitemap; review packet not in llms

### 2026-06-05 - Search Console verification needs public evidence with a clear boundary

**Symptom:**

Search Console property verification can be confused with DNS or HTML signal readiness when only screenshots or manual notes are retained.

**Root cause:**

The production evidence artifact proved crawlability, DNS routing, and GSC priority URL signals, but did not separately prove the Google verification TXT record, homepage verification meta tag, SPF retention, and the boundary that private GSC UI ownership is not machine-asserted.

**Fix:**

Added `search-console-verification-evidence-result.json` to the production SEO artifact contract.

**Guard:**

The SEO evidence validator, manifest checksum validator, workflow tests, and `/seo-monitoring` checklist now require the Search Console verification evidence file and the `gscUiOwnershipNotAsserted: true` boundary.

**Validation:**

Run Search Console verification evidence, SEO evidence validation, manifest generation, manifest validation, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, production SEO evidence, and final GitHub artifact download.

**Future trigger words:**

GSC property not verified; Google verification token missing; SPF conflict; domain TXT not visible; HTML verification missing; searchConsoleVerificationOk missing; claiming GSC ownership without UI proof

### 2026-06-05 - GSC indexing observations need structured external records

**Symptom:**

Manual Search Console URL Inspection results can be lost in screenshots, chat notes, or ambiguous statements such as "not indexed" without the exact URL, Google-selected canonical, request-indexing response, or supporting site evidence.

**Root cause:**

The site had strong production SEO artifacts, but no structured template for retaining private GSC UI observations that cannot be machine-asserted from the public site.

**Fix:**

Added `docs/search-console-indexing-record-template.json`, `npm run seo:gsc-indexing-record-validate`, and a visible `/seo-monitoring` indexing record section.

**Guard:**

The validator allows placeholder template records but requires real ISO timestamps, reviewer identity, indexing state, canonical field, production evidence run id, commit SHA, notes, and screenshot evidence before a record can be marked `recorded`.

**Validation:**

Run the GSC indexing record validator tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

URL Inspection screenshot; Page indexing status; discovered currently not indexed; Google-selected canonical; request indexing result; GSC indexing record; private Search Console state

### 2026-06-05 - GSC indexing draft records need public/private evidence separation

**Symptom:**

Creating a Search Console indexing record from scratch wastes review time and tempts automation to overstate private GSC UI status.

**Root cause:**

Public production SEO evidence can be machine-read from artifacts, but indexing status, Google-selected canonical, request-indexing messages, and screenshots are private GSC observations that must be copied by a reviewer.

**Fix:**

Added `npm run seo:gsc-indexing-record-draft` to prefill public evidence and keep private GSC fields as placeholders under `recordStatus: "draft"`.

**Guard:**

The validator accepts `draft` only when it keeps private GSC fields unclaimed, and it still requires real timestamps, reviewer identity, status, canonical, screenshot, and notes before `recorded`.

**Validation:**

Run the draft generator test, GSC indexing record validator, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

generate GSC record; indexing draft; Search Console evidence from artifact; do not infer GSC status; URL Inspection private field

### 2026-06-05 - GSC indexing records need a missing-field readiness report

**Symptom:**

Draft records can be valid as drafts while still missing the reviewer-supplied fields required before archive or Search Console retry notes.

**Root cause:**

The validator correctly separates `draft` from `recorded`, but reviewers still need a direct checklist of missing GSC UI fields rather than reading the whole JSON by hand.

**Fix:**

Added `npm run seo:gsc-indexing-record-ready` to list missing reviewer fields and return `readyForRecordedEvidence: true` only for complete recorded records.

**Guard:**

Tests cover both an AI-assisted draft with missing private GSC fields and a completed recorded entry with no missing fields.

**Validation:**

Run the readiness command, GSC indexing record tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

what is missing in GSC record; indexing record readiness; readyForRecordedEvidence; missingReviewerFields; Search Console retry note checklist

### 2026-06-06 - Completed GSC indexing records need archive-safe summaries

**Symptom:**

After a reviewer fills a GSC indexing record, the evidence still needs to be copied into progress notes, retry notes, or incident handoff text without accidentally adding interpretation.

**Root cause:**

The draft and readiness tools prepare the record, but there was no machine-generated summary that restates recorded fields and blocks incomplete drafts from sounding final.

**Fix:**

Added `npm run seo:gsc-indexing-record-summary` to produce archive-ready summary text only from recorded fields and linked production evidence.

**Guard:**

Tests cover a complete recorded record with `readyForHandoff: true` and a draft record that remains `readyForHandoff: false` with blocking fields.

**Validation:**

Run the summary command, GSC indexing record tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC handoff summary; archive indexing record; retry note summary; readyForHandoff; summarize URL Inspection record

### 2026-06-06 - Archived GSC screenshots need a manifest

**Symptom:**

Private Search Console screenshots can be synced successfully but later become hard to audit if paths, byte sizes, or hashes are not tracked.

**Root cause:**

Recorded GSC JSON files reference screenshot paths, but there was no machine-readable inventory proving the screenshot files existed after sync or preserving their content hashes.

**Fix:**

Added `npm run seo:gsc-indexing-records-manifest` to inventory recorded GSC indexing records and screenshot sha256 values.

**Guard:**

Tests generate a temporary recorded GSC record with a screenshot file and require the manifest to return `ok: true`, `recordCount`, screenshot existence, and 64-character sha256 hashes.

**Validation:**

Run the manifest command, GSC indexing record tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC evidence manifest; screenshot hash; archived Search Console screenshots; private evidence inventory; GSC record manifest

### 2026-06-06 - GSC query rows need review-gated records

**Symptom:**

Search Console query observations can easily turn into ad hoc keyword chasing or tax-sensitive page changes if they are copied from screenshots directly into content work.

**Root cause:**

The site had a safe query opportunity matrix, but no structured record for a real GSC query row, metrics, evidence path, risk level, review gate, and final content decision.

**Fix:**

Added `docs/search-console-query-opportunity-template.json` and `npm run seo:gsc-query-opportunity-validate` so query observations become review-gated backlog items before metadata, internal-link, guide-refresh, or professional-review work begins.

**Guard:**

The validator accepts empty templates, accepts recorded professional-risk items only when evidence and professional review gates are present, and blocks recommendation or absolute-accuracy phrasing such as best amount, should convert, guaranteed, 100% accurate, optimal conversion, or convert exactly.

**Validation:**

Run the query opportunity record tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC query opportunity; Search Console query row; keyword backlog; query screenshot; content action from GSC; CTR opportunity; GSC Performance export

### 2026-06-06 - Query opportunity records need readiness before content work

**Symptom:**

Template or draft GSC query opportunity records can validate structurally while still missing the private query row, date range, screenshot/export evidence, owner, or follow-up fields needed before content work starts.

**Root cause:**

The validator catches malformed records and YMYL phrasing, but reviewers also need a direct checklist separating AI-fillable planning fields from fields that must come from Search Console or content operations.

**Fix:**

Added `npm run seo:gsc-query-opportunity-ready` to report missing reviewer fields, AI-fillable fields, blocking validator failures, and `readyForRecordedEvidence`.

**Guard:**

Tests require the shipped template to report missing reviewer fields, a complete professional-risk record to return `readyForRecordedEvidence: true`, and recommendation-like query records to remain blocked.

**Validation:**

Run the readiness command, GSC query opportunity tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC query readiness; missing query fields; AI fill what; query opportunity missing fields; readyForRecordedEvidence; Search Console query backlog readiness

### 2026-06-06 - Production domain can serve an incomplete old Vercel build

**Symptom:**

GitHub Actions SEO Smoke failed at structured-data evidence even though local tests and build passed. The formal domain homepage exposed only two JSON-LD scripts, and operational routes such as `/release-notes` and `/seo-monitoring` returned 404.

**Root cause:**

The production alias was serving an incomplete or stale Vercel production build rather than the current full Next.js site output.

**Fix:**

Re-deployed from the correct project root with `vercel --prod --yes`, confirmed the build generated 131 static pages, and verified the formal domain was re-aliased to the new deployment before re-running GitHub Actions.

**Guard:**

Before treating structured-data failures as code failures, check the formal domain for key operational routes and homepage JSON-LD count, then inspect the Vercel deployment output count and aliases.

**Validation:**

Run live route checks for `/`, `/release-notes`, and `/seo-monitoring`, then run `npm run seo:structured-data`, `npm run seo:smoke`, re-run SEO Smoke in GitHub Actions, download `production-seo-evidence`, and validate the manifest.

**Future trigger words:**

Vercel alias stale; production domain old build; release-notes 404 after deploy; seo-monitoring 404; homepage JSON-LD count dropped; structured-data evidence alias failure

### 2026-06-06 - Query rows need an AI draft step before recorded evidence

**Symptom:**

The query opportunity template and readiness command showed what was missing, but a reviewer-supplied GSC query row still had to be manually mapped to cluster, intent, target surface, action, risk, and review gate.

**Root cause:**

The workflow separated AI-fillable fields from private reviewer fields, but it did not yet provide a deterministic way for AI to fill those fields after the reviewer supplies the real query row.

**Fix:**

Added `npm run seo:gsc-query-opportunity-draft` to generate draft records from reviewer-supplied query rows, optional metrics, evidence paths, and production SEO artifacts.

**Guard:**

Tests require query-to-cluster mapping, safe non-advisory action text, draft validation, and readiness remaining false until reviewer-controlled evidence fields are accepted.

**Validation:**

Run the draft command, GSC query opportunity tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC query draft; Search Console query row draft; AI fill query opportunity; query cluster mapping; draft from GSC screenshot; query opportunity generator

### 2026-06-06 - Query opportunity records need backlog summarization

**Symptom:**

Individual query opportunity templates, drafts, and recorded files can become scattered JSON records without a single view of status, risk, cluster, priority, and next action.

**Root cause:**

The workflow had creation, validation, readiness, and draft generation, but no deterministic local inventory step before content planning.

**Fix:**

Added `npm run seo:gsc-query-opportunity-backlog` to summarize local query records into counts, risk distribution, cluster distribution, actionable records, priority scores, missing reviewer fields, and next actions.

**Guard:**

Tests require the backlog summary to separate template-only state from actionable draft or recorded records and preserve review-gated status before content work.

**Validation:**

Run the backlog command, GSC query opportunity tests, SEO monitoring tests, release-note tests, feature-registry tests, full Vitest, build, E2E, and live `/seo-monitoring` smoke after deployment.

**Future trigger words:**

GSC query backlog; query opportunity inventory; Search Console query planning; keyword backlog summary; query records summary; content planning from GSC records

### 2026-06-06 - Helpful-content fixes need source identity and live guard closure

**Symptom:**

A cross-site helpful-content guard found Roth `/methodology` had enough references but too few internal continuation links for users and crawlers.

**Root cause:**

The page explained formulas and external IRS sources but did not connect users to the local assumption guide, bracket tables, examples, or professional review handoff. A previous wrong-source deployment also showed that a correct content patch can become dangerous if deployed from an incomplete local source tree.

**Fix:**

Added a related-reference section to `src/app/methodology/page.tsx` linking to `/calculator-assumptions-guide`, `/tax-brackets/2026`, `/examples`, and `/cpa-review-checklist`, then deployed only after confirming `.vercel/project.json` was bound to `roth-conversion-calculator-ai`.

**Guard:**

Use the global helpful-content guard for live closure and confirm local build output before deployment. For Roth production deploys, also confirm the source tree generates the expected full static page count and the live sitemap remains at 121 URLs after deployment.

**Validation:**

`npm run build` passed with 131 static pages; `npm test` passed with 113 files / 327 tests; local built `/methodology` retained 7 internal links and all four expected related links; post-deploy `live-three-site-seo-check.mjs` passed 54/54 and `helpful-content-signal-check.mjs` passed 114/114.

**Future trigger words:**

helpful-content internal links; Roth methodology thin link graph; wrong Roth source; sitemap dropped after deploy; deploy source identity; related-reference links

### 2026-06-06 - Later production deploys can overwrite live SEO fixes

**Symptom:**

Roth `/methodology` source still contained the helpful related-reference links, but the live page again exposed only one internal link and failed the cross-site helpful-content guard.

**Root cause:**

A newer Vercel production deployment replaced the previously fixed artifact. The problem was not missing source code; it was production alias drift to a build that did not contain the expected changed-page evidence.

**Fix:**

Verified the correct source tree and Vercel project binding, rebuilt the full app, confirmed the expected static page and sitemap counts, then redeployed from `D:\roth-conversion-calculator-ai-github\roth-conversion-calculator-ai-main`.

**Guard:**

After any production deploy that could touch SEO pages, fetch the custom-domain page that was previously fixed and assert the exact changed-page markers, not just generic SEO smoke status.

**Validation:**

`npm run build` generated 131 static pages, sitemap output retained 121 URLs, `npm test` passed 113 files / 330 tests, direct live `/methodology` fetch returned the related-reference heading and all four expected internal links, and global guards passed: helpful-content 114/114, three-site SEO 54/54, route structured data 121/121, homepage performance signal 18/18.

**Future trigger words:**

production alias drift; later deployment overwrote fix; changed-page marker missing; custom domain old artifact; helpful-content regression after deploy; Vercel deploy replaced SEO fix

### 2026-06-06 - GSC validation needs a follow-up plan, not repeated clicks

**Symptom:**

After Google Search Console showed `Validation started` for `Discovered - currently not indexed`, the project had sanitized evidence for the click action but no deterministic schedule for the next review window, allowed outcomes, or blocked actions.

**Root cause:**

The workflow validated the initial `Validate fix` action but still relied on chat memory for when to re-check GSC. A first follow-up validator also used an over-broad `/session/i` privacy pattern that rejected explanatory text containing "private session text".

**Fix:**

Added `docs/evidence/gsc-discovered-validation-follow-up-2026-06-06.json`, `scripts/validate-gsc-validation-follow-up.mjs`, and `npm run seo:gsc-validation-follow-up-validate`. Narrowed sensitive-session detection to real `session_id` or `session_token` field shapes while keeping cookies, tokens, authorization, and password fields blocked.

**Guard:**

Tests now validate the shipped follow-up plan and verify that a real private field such as `session_id=abc123` is rejected. `/seo-monitoring` documents the follow-up plan so reviewers do not repeatedly click `Validate fix` while validation is already in progress.

**Validation:**

Run `npm run seo:gsc-validation-follow-up-validate`, targeted GSC indexing/SEO monitoring/release/feature tests, full Vitest, build, and live `/seo-monitoring` plus `/release-notes` smoke after deployment.

**Future trigger words:**

GSC validation follow-up; Validation started next step; don't click Validate fix again; discovered not indexed review date; Search Console follow-up plan; session privacy false positive

### 2026-06-07 - Public paid-model endpoints need a default-off cost fuse

**Symptom:**

The user worried that short visits might mean visitors were abusing the site's GPT or Claude API keys through the public calculator.

**Root cause:**

Source inspection did not show frontend key exposure or production Claude integration, but `/api/ai/explain` could call OpenAI server-side whenever `OPENAI_API_KEY` existed. In-memory per-IP limiting alone is not enough for a public serverless endpoint that can spend paid model quota.

**Fix:**

Added same-origin/referer enforcement, a conservative configurable hourly limit, fallback-only default behavior, an explicit `AI_EXPLAINER_PAID_MODEL_ENABLED=true` cost fuse, invalid JSON handling, and `X-AI-Provider` response evidence. Removed browser CSP permission for direct OpenAI API connections.

**Guard:**

Added AI API security tests that require the paid-model opt-in fuse, same-origin guard, fallback provider evidence, fallback-only env defaults, and no browser `connect-src` permission for `https://api.openai.com`.

**Validation:**

Targeted AI/security/release/feature tests passed with 6 files / 18 tests; full Vitest passed with 114 files / 343 tests; `npm run build` passed with 131 static pages; production checks confirmed cross-origin POST returns 403 and same-origin POST returns `X-AI-Provider: fallback`.

**Future trigger words:**

API key abuse; users are using my API key; AI endpoint cost spike; public OpenAI endpoint; Claude key abuse; short visits API spend; paid model fuse; fallback-only AI

### 2026-06-08 - Windows ops scripts should shell CLI commands deliberately

**Symptom:**

The first AI cost-abuse evidence command passed production probes but failed to fetch Vercel logs on Windows with `spawn vercel ENOENT` and then `spawn EINVAL`.

**Root cause:**

The script used `execFile` for a globally installed CLI. On Windows, command shims such as `vercel` / `vercel.cmd` can behave differently from POSIX binaries when launched without a shell.

**Fix:**

Changed the Vercel log collection path to use a shell command through `exec`, with a conservative character whitelist for the user-controlled `--since` value.

**Guard:**

The AI cost-abuse evidence command now has source tests requiring the package script, endpoint guard checks, manual account-evidence boundary, and privacy boundary. Production execution also proves the Vercel log path works on the current Windows workspace.

**Validation:**

`npm test -- tests/core/ai-cost-abuse-evidence.test.ts tests/core/ai-api-security.test.ts tests/core/ai-rate-limit.test.ts` passed with 3 files / 10 tests. `npm run ops:ai-cost-abuse-evidence -- --since 24h --out ai-cost-abuse-evidence-result.json` returned `ok: true`.

**Future trigger words:**

spawn vercel ENOENT; spawn EINVAL; Windows CLI script; execFile CLI shim; Vercel logs script; ops command failed on Windows

### 2026-06-08 - Secret scanners must distinguish examples from real tokens

**Symptom:**

The first AI provider usage evidence validator rejected the safe template because the privacy-boundary sentence contained the words "bearer tokens".

**Root cause:**

The Bearer-token pattern matched explanatory prose instead of requiring a real token-shaped value after `Bearer`.

**Fix:**

Narrowed the pattern from any word after `Bearer` to `Bearer` followed by at least eight token characters. The validator still blocks real bearer values, API key field shapes, authorization fields, cookies, passwords, card-number language, and long payment-card-like numbers.

**Guard:**

The provider usage evidence tests require the template to validate, require recorded sanitized OpenAI evidence to validate, and require a fake `sk-...` value to be blocked.

**Validation:**

`npm run ops:ai-provider-usage-validate` returned `ok: true`; `npm run ops:ai-provider-usage-ready` returned `ok: true`; targeted provider/cost/security/release/feature tests passed with 5 files / 17 tests.

**Future trigger words:**

Bearer token false positive; secret scanner prose; provider usage evidence template; privacyBoundary false positive; API key evidence validator
