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
