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
