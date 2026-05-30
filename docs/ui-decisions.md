# UI Decisions

## 2026-05-30 - Result Summary Uses Safe V1.3 Metrics

V1.3 asked for a top result area with three dominant numbers. The production implementation keeps that hierarchy but changes the risky `Optimal Conversion Amount` concept into `Modeled bracket room`.

Decision:

- Use `Estimated upfront tax` for immediate cost.
- Use `Modeled bracket room` for tax-bracket capacity without implying personal advice.
- Use `Projected after-tax difference` for long-term scenario comparison.
- Preserve detail cards below the primary row for auditability.
