# Roth Conversion Calculator MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP Roth Conversion Calculator Google tool site from the V1.3 PRD, including core calculation, Apple-inspired UI, SEO pages, compliant AI explainer shell, reports, feature flags, and tests.

**Architecture:** Use a Next.js App Router project with strict TypeScript. Keep deterministic tax math in `src/core`, reusable UI and utilities in `src/common`, and independently switchable product modules in `src/features`. AI, PDF, sharing, and non-core UX live behind feature flags so small versions can be disabled without touching the core calculator.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, Vitest, Testing Library, Playwright, Recharts, React Hook Form, Zod, jsPDF/html2canvas, server-side OpenAI provider interface.

---

## File Structure

Create the following project structure:

```text
package.json
next.config.ts
tsconfig.json
postcss.config.mjs
tailwind.config.ts
vitest.config.ts
playwright.config.ts
src/app/layout.tsx
src/app/page.tsx
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/app/disclaimer/page.tsx
src/app/about/page.tsx
src/app/methodology/page.tsx
src/app/editorial-policy/page.tsx
src/app/blog/[slug]/page.tsx
src/app/api/ai/explain/route.ts
src/app/robots.ts
src/app/sitemap.ts
src/core/calculator/types.ts
src/core/calculator/federal-tax.ts
src/core/calculator/roth-conversion.ts
src/core/calculator/validation.ts
src/core/tax-data/2026.ts
src/core/compliance/disclaimer.ts
src/core/compliance/ai-guardrails.ts
src/core/seo/json-ld.ts
src/common/format/currency.ts
src/common/storage/share-code.ts
src/common/ui/button.tsx
src/common/ui/card.tsx
src/common/ui/field.tsx
src/config/feature.config.ts
src/features/calculator-input/CalculatorInput.tsx
src/features/result-summary/ResultSummary.tsx
src/features/charts/ProjectionChart.tsx
src/features/tax-impact-warnings/TaxImpactWarnings.tsx
src/features/ai-assistant/AiExplainer.tsx
src/features/pdf-report/PdfReportButton.tsx
src/features/share-link/ShareResultButton.tsx
src/features/faq/FaqSection.tsx
src/content/blog.ts
tests/core/roth-conversion.test.ts
tests/core/ai-guardrails.test.ts
tests/e2e/home.spec.ts
```

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create package and config files**

`package.json` must include scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "next lint"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: dependencies install successfully and `package-lock.json` is created.

- [ ] **Step 3: Create minimal app shell**

`src/app/page.tsx` initially renders:

```tsx
export default function HomePage() {
  return <main>Roth Conversion Calculator</main>;
}
```

- [ ] **Step 4: Verify app compiles**

Run: `npm run build`

Expected: Next.js production build completes.

## Task 2: Core Calculator With TDD

**Files:**
- Create: `tests/core/roth-conversion.test.ts`
- Create: `src/core/calculator/types.ts`
- Create: `src/core/tax-data/2026.ts`
- Create: `src/core/calculator/federal-tax.ts`
- Create: `src/core/calculator/roth-conversion.ts`

- [ ] **Step 1: Write failing federal tax tests**

Test these behaviors:

```ts
import { calculateFederalTaxDelta } from "@/core/calculator/federal-tax";

it("calculates federal tax delta using progressive brackets for single filers", () => {
  expect(calculateFederalTaxDelta({
    filingStatus: "single",
    currentTaxableIncome: 85000,
    additionalTaxableIncome: 50000,
    taxYear: 2026
  })).toBeGreaterThan(0);
});

it("returns zero federal tax when additional taxable income is zero", () => {
  expect(calculateFederalTaxDelta({
    filingStatus: "married_joint",
    currentTaxableIncome: 100000,
    additionalTaxableIncome: 0,
    taxYear: 2026
  })).toBe(0);
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/core/roth-conversion.test.ts`

Expected: FAIL because calculator modules do not exist.

- [ ] **Step 3: Implement tax data and progressive calculation**

Define `FilingStatus`, `TaxBracket`, and 2026 tax brackets. Implement:

```ts
export function calculateFederalTaxDelta(input: FederalTaxDeltaInput): number
```

The function calculates `tax(base + additional) - tax(base)`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/core/roth-conversion.test.ts`

Expected: PASS.

- [ ] **Step 5: Add Roth conversion tests**

Cover basis ratio, outside-funds penalty behavior, withheld-tax penalty behavior, future value, and break-even simulation.

- [ ] **Step 6: Implement `calculateRothConversion`**

Return:

```ts
{
  taxableConversion: number;
  federalTax: number;
  stateTax: number;
  earlyDistributionPenalty: number;
  totalUpfrontCost: number;
  rothFutureValue: number;
  traditionalAfterTaxValue: number;
  afterTaxDifference: number;
  breakEvenYear: number | null;
  accuracyNotes: string[];
}
```

- [ ] **Step 7: Verify calculator tests**

Run: `npm test -- tests/core/roth-conversion.test.ts`

Expected: PASS.

## Task 3: Validation, Feature Flags, Formatting, and Share Codes

**Files:**
- Create: `src/core/calculator/validation.ts`
- Create: `src/config/feature.config.ts`
- Create: `src/common/format/currency.ts`
- Create: `src/common/storage/share-code.ts`
- Test: `tests/core/roth-conversion.test.ts`

- [ ] **Step 1: Write failing tests for validation**

Test that negative conversion amounts and impossible basis values produce field errors without throwing.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/core/roth-conversion.test.ts`

Expected: FAIL because validation does not exist.

- [ ] **Step 3: Implement validation and formatting**

Implement `validateCalculatorInput`, `formatCurrency`, `formatPercent`, `encodeShareCode`, and `decodeShareCode`.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/core/roth-conversion.test.ts`

Expected: PASS.

## Task 4: Apple-Inspired UI Foundation

**Files:**
- Create: `src/common/ui/button.tsx`
- Create: `src/common/ui/card.tsx`
- Create: `src/common/ui/field.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create UI primitives**

Build accessible Button, Card, and Field components using CSS classes, system fonts, Apple blue, responsive spacing, dark mode, and reduced motion.

- [ ] **Step 2: Wire global layout**

Add SEO metadata, canonical placeholder, app shell, skip link, and global disclaimer footer.

- [ ] **Step 3: Verify build**

Run: `npm run build`

Expected: PASS.

## Task 5: Calculator Input and Result UI

**Files:**
- Create: `src/features/calculator-input/CalculatorInput.tsx`
- Create: `src/features/result-summary/ResultSummary.tsx`
- Create: `src/features/tax-impact-warnings/TaxImpactWarnings.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build controlled calculator page**

Use React state for MVP form values. Inputs must include conversion amount, IRA balance, basis, filing status, income, state tax rate, age, penalty exception, retirement age, return rate, retirement tax rate, inflation, and tax payment method.

- [ ] **Step 2: Render live results**

Call `calculateRothConversion` whenever inputs change and render result cards.

- [ ] **Step 3: Add warnings and accuracy labels**

Render High confidence, User-estimated, and Professional review required labels plus Tax Impact Warnings.

- [ ] **Step 4: Verify build**

Run: `npm run build`

Expected: PASS.

## Task 6: Charts, FAQ, Share, and PDF

**Files:**
- Create: `src/features/charts/ProjectionChart.tsx`
- Create: `src/features/faq/FaqSection.tsx`
- Create: `src/features/share-link/ShareResultButton.tsx`
- Create: `src/features/pdf-report/PdfReportButton.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add projection chart**

Render Roth vs traditional projection with Recharts. Include text fallback for screen readers.

- [ ] **Step 2: Add FAQ**

Create visible FAQ content covering Roth conversion basics, taxes, 5-year rule, penalties, and AI disclaimer.

- [ ] **Step 3: Add share link**

Encode current form values into URL hash and allow copying.

- [ ] **Step 4: Add PDF button**

Generate a lightweight report from visible result content. If PDF dependencies are too heavy during MVP, lazy-load this feature behind `featureConfig.pdfReport`.

- [ ] **Step 5: Verify build**

Run: `npm run build`

Expected: PASS.

## Task 7: AI Explainer Shell and Guardrails

**Files:**
- Create: `tests/core/ai-guardrails.test.ts`
- Create: `src/core/compliance/disclaimer.ts`
- Create: `src/core/compliance/ai-guardrails.ts`
- Create: `src/app/api/ai/explain/route.ts`
- Create: `src/features/ai-assistant/AiExplainer.tsx`

- [ ] **Step 1: Write failing guardrail tests**

Test that decision questions are rejected, unrelated questions are rejected, and all allowed replies include the required disclaimer.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/core/ai-guardrails.test.ts`

Expected: FAIL because guardrail module does not exist.

- [ ] **Step 3: Implement deterministic guardrails**

Implement `classifyAiQuestion`, `appendDisclaimer`, and `containsForbiddenAdvice`.

- [ ] **Step 4: Implement API route**

Return a static compliant explanation if no API key exists. If `OPENAI_API_KEY` exists, call the provider through server code only.

- [ ] **Step 5: Add UI assistant**

Render `AI Roth Conversion Explainer`, preset questions, loading state, refusal state, and disclaimer.

- [ ] **Step 6: Verify tests and build**

Run: `npm test -- tests/core/ai-guardrails.test.ts` and `npm run build`

Expected: PASS.

## Task 8: SEO and Static Pages

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Create: `src/app/disclaimer/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/methodology/page.tsx`
- Create: `src/app/editorial-policy/page.tsx`
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/core/seo/json-ld.ts`
- Create: `src/content/blog.ts`
- Create: `src/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Add legal and trust pages**

Create Privacy, Terms, Disclaimer, About, Methodology, and Editorial Policy pages with unique metadata.

- [ ] **Step 2: Add blog content data**

Add 5 PRD-required article entries with author, reviewer status, last updated, title, description, slug, and body.

- [ ] **Step 3: Add JSON-LD**

Render WebApplication, FAQPage, Article, and BreadcrumbList where appropriate.

- [ ] **Step 4: Add sitemap and robots**

Include homepage, static pages, and blog pages.

- [ ] **Step 5: Verify SEO build**

Run: `npm run build`

Expected: PASS and sitemap/robots routes compile.

## Task 9: E2E and Final Verification

**Files:**
- Create: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Write E2E smoke test**

Test that homepage loads, changing conversion amount updates total tax, AI explainer opens, share button exists, FAQ exists, and disclaimer text is visible.

- [ ] **Step 2: Run unit tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 3: Run build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Run E2E**

Run: `npm run test:e2e`

Expected: PASS after Playwright browser install is available.

- [ ] **Step 5: Start local dev server**

Run: `npm run dev`

Expected: site is available at `http://localhost:3000` or the next free port.

## Self-Review

Spec coverage:
- Core calculation, tax payment method, penalty boundary, accuracy labels, and Tax Impact Warnings are covered in Tasks 2, 3, and 5.
- Apple-inspired UI and responsive tool-first page are covered in Tasks 4 and 5.
- AI naming, guardrails, fallback, and server proxy are covered in Task 7.
- SEO, E-E-A-T, methodology, editorial policy, sitemap, robots, and blog pages are covered in Task 8.
- Small-version maintenance is covered through `feature.config.ts` and modular `src/features/*` ownership in Tasks 3 and 10 structure.
- Tests and verification are covered in Tasks 2, 3, 7, and 9.

Placeholder scan:
- No TBD/TODO placeholders remain in the implementation tasks.

Type consistency:
- `TaxPaymentMethod`, `FilingStatus`, calculator result names, and feature directory names are consistent across tasks.
