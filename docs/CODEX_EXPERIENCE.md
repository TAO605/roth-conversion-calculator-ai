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
