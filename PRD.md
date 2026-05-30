# PRD

## Goal

- Keep the Roth Conversion Calculator deployable as a compliant, SEO-focused tax education tool.

## Current Focus

- Feature or guard: prevent unsafe YMYL recommendation and absolute-accuracy language from entering user-facing content or AI output.
- Affected surface: compliance guardrails, source content, SEO copy, AI explainer copy.
- User-visible result: the site remains educational and assumption-based, without personal tax recommendations.

## Acceptance Criteria

- [ ] AI guardrails detect recommendation, optimal-action, and absolute-accuracy phrasing.
- [ ] A source-content test scans user-facing `src` files for high-risk direct claims.
- [ ] Project memory records the guard so future V1.3 work keeps the same boundary.
