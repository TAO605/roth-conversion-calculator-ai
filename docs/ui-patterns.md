# UI Patterns

## V1.3 Safe Result Summary

- Put the three highest-intent calculator outputs first: `Estimated upfront tax`, `Modeled bracket room`, and `Projected after-tax difference`.
- Use educational, assumption-based labels. Do not use `Optimal Conversion Amount`, direct recommendations, or absolute-accuracy claims.
- Keep detailed tax components below the primary estimates so the result area scans quickly without hiding the underlying math.
- Pair each large number with a short caveat that names what is included or which assumptions drive it.

## Quick Estimate Input Split

- Put the most common planning fields in a `Quick Estimate` block: conversion amount, current taxable income, filing status, state marginal tax rate, retirement age, expected annual return, and traditional IRA balance.
- Keep less frequent or higher-complexity assumptions in a collapsed `Advanced assumptions` section: after-tax basis, current age, retirement marginal tax rate, tax payment method, IRA withholding, penalty exception, and sample presets.
- Do not remove advanced fields; hide complexity progressively so the calculator remains complete and auditable.

## Result-Adjacent Tax Impact Warnings

- Place hidden-cost warnings directly after the primary result summary, before AI, projection, or advanced details.
- Frame IRMAA, ACA premium tax credits, Social Security benefit taxation, NIIT, AMT, RMDs, and state-specific rules as professional-review items unless a full rules engine exists.
- Use review-oriented language instead of alarm language; the purpose is to prevent blind spots, not to make a recommendation.

## Tax Payment Method Comparison

- Compare `Pay with outside funds` and `Withhold from IRA distribution` as educational scenarios, not recommendations.
- Use current estimated federal and state tax as the modeled tax amount, then show how IRA withholding may reduce Roth principal.
- Mention possible early-distribution penalty when applicable, but keep the decision language neutral.

## Result Scope Badges

- Show compact scope badges before the result numbers: tax year, educational estimate, based on user inputs, and not tax advice.
- Keep the badges visually light so they reinforce trust without competing with primary results.
- Do not use badges to claim accuracy guarantees.

## Tax Data Trust Card

- Show tax-data freshness as operational trust metadata: active tax year, last updated date, source basis, update window, and known exclusions.
- Link directly to official IRS source pages when tax-year data or IRA rules are referenced.
- State professional-review status plainly. If no qualified tax professional review evidence is recorded, say review is pending instead of implying CPA/EA approval.
- Keep trust copy close to methodology and homepage calculator context so users can audit assumptions without leaving the workflow.

## Input-Prioritized Tax Impact Warnings

- Keep hidden tax interactions result-adjacent, but rank them with `Input-triggered review` when current inputs suggest closer review.
- Use the calculator's taxable-income and age inputs only as prioritization signals. Do not calculate IRMAA premiums, ACA subsidy changes, Social Security taxable benefits, NIIT owed, RMDs, or state-specific deductions without dedicated inputs and rule engines.
- Link each warning to a deeper guide so the result card stays concise while preserving crawlable education pages.
- Preserve neutral language: the panel identifies review items, not decisions or recommendations.

## Professional Handoff Packet

- Put professional handoff actions next to result actions such as share and report download.
- Generate a plain-text packet rather than a styled modal so users can paste it into email, notes, or advisor intake forms.
- Include inputs, modeled outputs, triggered review items, records to bring, and the required disclaimer.
- Avoid decision language. The packet supports a qualified professional conversation; it does not decide whether a conversion fits the user.

## Responsive Result Actions

- When result actions grow beyond two buttons, use a responsive action group instead of free-form wrapping.
- Mobile: one full-width button per row.
- Tablet: two columns so paired actions scan cleanly.
- Desktop: horizontal wrapping row aligned with the result heading.
- Keep destructive actions visually distinct and icon-backed.

## Homepage Performance Boundaries

- Keep non-critical modules out of the initial homepage bundle with `next/dynamic`.
- Analytics beacons should load after the app shell, not as static homepage imports.
- Lazy fallbacks for below-the-fold panels should reserve a stable height close to the final component height.
- Do not trade away the calculator's first-screen usability for decorative motion or extra tracking code.

## SEO Smoke Verification

- Keep production SEO smoke checks command-driven, not manual-only.
- Verify homepage trust copy, canonical host, robots discovery, sitemap host consistency, llms.txt discovery, and banned YMYL wording.
- Allow the same command to run against preview URLs through an environment variable.
- Use smoke output as deployment evidence in `PROGRESS.md`.

## Automated SEO Smoke

- After a smoke command is proven locally, wire it into CI with manual, push, and scheduled triggers.
- Add a short post-push delay when production deployment is handled by an external platform.
- Keep the workflow read-only and secret-free when checking public URLs.
- Test workflow text so future edits do not accidentally remove triggers or the production URL.

## Search Console Submission Loop

- Treat Search Console as a follow-up verification surface after local/production smoke checks pass.
- Keep sitemap submission, URL Inspection, request indexing, Page indexing review, and exception routing in one ordered loop.
- Link to official Google documentation from the operations page.
- Record evidence and repeated exceptions in project memory or tests instead of relying on screenshots alone.

## Search Console Query Opportunity Matrix

- Group GSC queries by user intent before changing pages: calculator, bracket-room, hidden tax interactions, payment method, state/filing status, and process/forms/CPA handoff.
- Pair every query cluster with a target surface, concrete content action, and review gate.
- Mark clusters that touch unsupported tax calculations or state-specific law with professional review gates before adding formulas or stronger claims.
- Keep query examples as examples, not keyword stuffing inside primary user workflows.

## Search Console Exception Queue

- Separate Search Console workflow failures from site crawlability failures before changing production code.
- Record observed status, likely cause, next action, retry window, and evidence for each GSC exception.
- If live URL Inspection passes, sitemap submission succeeds, and production SEO smoke passes, treat request-indexing errors as Google-side retry items.
- Keep DNS domain-property verification as an operations item when the URL-prefix property already covers the canonical `www` site.

## GSC Priority URL Evidence

- Before retrying URL Inspection, run a public evidence command that checks status code, HTML content type, canonical URL, sitemap inclusion, and noindex signals.
- Include the same priority URL set used in Search Console operations: homepage, `/seo-monitoring`, `/methodology`, `/tax-data-update`, `/tax-brackets/2026`, and `/roth-conversion-irmaa-guide`.
- Treat command failures as SEO source issues to fix before using Search Console request-indexing again.
- Keep the command environment-variable driven so preview or production hosts can be checked with the same guard.
- Run the evidence command in CI after the production smoke check so canonical drift is caught without waiting for manual Search Console work.

## Sitemap Freshness Evidence

- When a priority SEO operations page changes, document the minimum expected sitemap `lastmod` on `/seo-monitoring`.
- Pair the visible operations playbook with the automated `npm run seo:gsc-evidence` parser so human review and CI enforce the same freshness-critical URL list.
- Store freshness proof in the `production-seo-evidence` artifact; do not rely on screenshots or broad sitemap text matches alone.
- If `lastmodFresh` fails, fix sitemap metadata and redeploy before using Search Console URL Inspection or request-indexing.

## SEO Evidence Artifact Validation

- Treat the uploaded `production-seo-evidence` artifact as a structured contract, not just saved console output.
- Validate artifact JSON before upload so parse errors, missing priority URLs, stale `lastmodFresh`, noindex drift, or host mismatches fail CI while the run context is still visible.
- Keep validator defaults aligned with workflow output filenames: `seo-smoke-result.json` and `gsc-evidence-result.json`.
- Retain `seo-evidence-validation-result.json` in the artifact so downloaded evidence packages include the validator's machine-readable summary.
- Use the validator locally when downloading an artifact for Search Console retry evidence or incident review.
