# UI Checklist

## Professional Calculator UI

- [ ] Homepage H1 stays focused on `Roth Conversion Calculator 2026`, not AI-first branding.
- [ ] Shared Card/Button/Field primitives stay plain: small radius, neutral border, white surface, no backdrop blur, no material shadow, no active scale.
- [ ] Desktop calculator layout stays close to 40/60 input/result weighting when both columns are visible.
- [ ] AI explanation language stays lower in hierarchy than the calculator, result, sources, and compliance boundaries.
- [ ] Primary result money values use monospace worksheet-style numbers.
- [ ] Supporting calculator panels avoid glass, heavy shadows, translucent backgrounds, and AI-first headings.

## Result Summary

- [ ] Primary result row shows upfront tax, bracket room, and after-tax difference.
- [ ] Result copy avoids `you should convert`, `strongly recommend`, `optimal conversion amount`, and absolute-accuracy claims.
- [ ] Desktop layout shows the primary result row without overlap.
- [ ] Mobile layout has no horizontal overflow.
- [ ] Details remain available below the primary estimates.

## Calculator Inputs

- [ ] Quick Estimate is visible before advanced assumptions.
- [ ] Quick Estimate keeps projection-only assumptions behind a collapsed disclosure on first load.
- [ ] Projection and advanced disclosure summaries have mobile-friendly touch targets.
- [ ] Disclosure summaries have a visible expand affordance and preserve native details/summary behavior.
- [ ] Advanced assumptions are collapsed by default.
- [ ] All original calculation inputs remain available.
- [ ] Mobile layout has no horizontal overflow.

## Tax Impact Warnings

- [ ] Warning panel appears immediately after the result summary.
- [ ] Warning panel appears before AI, projection, and advanced calculation details.
- [ ] Warning copy describes professional-review boundaries without estimating unsupported costs.
- [ ] Warning panel has no horizontal overflow on mobile.

## Tax Payment Comparison

- [ ] Comparison appears near the result summary.
- [ ] Copy says it is educational and not a recommendation.
- [ ] Outside funds and IRA withholding scenarios are both visible.
- [ ] Copy avoids direct advice such as `you should`, `strongly recommend`, or `best move`.

## Result Scope

- [ ] Scope badges appear before primary result numbers.
- [ ] Scope badges include tax year, educational estimate, based on inputs, and not tax advice.
- [ ] Scope badges do not claim guaranteed accuracy.

## Result Actions

- [ ] Result actions appear after the primary result estimates.
- [ ] Lazy-loaded report and CPA packet buttons use disabled placeholders instead of disappearing while loading.
- [ ] Mobile result actions stay in a stable two-column grid.
- [ ] Wider result actions stay in a stable four-column grid.
- [ ] Action labels avoid personalized recommendations or tax-advice language.

## Operations Pages

- [ ] Audit and playbook pages use plain bordered surfaces instead of glass, large-radius, or heavy-shadow containers.
- [ ] Operations pages keep breadcrumbs, H1, summary badges, evidence sections, and required disclaimers visible.
- [ ] Operations page UI changes do not alter blog article bodies, tax calculation logic, or structured-data evidence.

## Content Hub Pages

- [ ] Top-level hub cards use plain bordered navigation panels instead of translucent hover-lift cards.
- [ ] Hub pages preserve breadcrumbs, H1s, route links, JSON-LD, and disclaimers.
- [ ] Hub page UI changes do not alter blog article bodies or guide/article body copy.
