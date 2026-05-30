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
