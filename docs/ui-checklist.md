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
- [ ] Operations summary/status blocks use small-radius bordered panels, not oversized custom-radius status cards.
- [ ] Operations page UI changes do not alter blog article bodies, tax calculation logic, or structured-data evidence.

## Content Hub Pages

- [ ] Top-level hub cards use plain bordered navigation panels instead of translucent hover-lift cards.
- [ ] Hub pages preserve breadcrumbs, H1s, route links, JSON-LD, and disclaimers.
- [ ] Hub page UI changes do not alter blog article bodies or guide/article body copy.

## Priority Guide Pages

- [ ] Priority YMYL guide pages use plain bordered review panels instead of glass, large-radius, or heavy-shadow containers.
- [ ] Guide page UI changes preserve JSON-LD, breadcrumbs, source links, disclaimer text, and professional-review boundaries.
- [ ] Guide page UI changes do not alter blog article bodies or tax calculation logic.

## Dynamic Detail Pages

- [ ] Non-blog dynamic detail pages use plain bordered review panels instead of glass, large-radius, or heavy-shadow containers.
- [ ] Dynamic detail page UI changes preserve JSON-LD, breadcrumbs, CTA targets, disclaimer text, and existing body copy.
- [ ] Dynamic detail page UI changes do not alter blog article bodies or tax calculation logic.

## Shared Feature Components

- [ ] Shared feature components use plain bordered surfaces instead of glass, blur, large-radius, translucent, or heavy-shadow containers.
- [ ] Shared table wrappers, FAQ items, scenario panels, and utility controls preserve existing semantics, labels, and interaction behavior.
- [ ] Shared feature UI changes do not alter tax calculation logic, storage behavior, blog article bodies, or SEO evidence scripts.

## Blog Shell Pages

- [ ] Blog index topic groups, post cards, article author metadata, calculator CTA, and related-guide links use plain bordered surfaces.
- [ ] Blog shell UI changes preserve article body text, Article JSON-LD, Breadcrumb JSON-LD, canonical metadata, and required disclaimer text.
- [ ] Blog shell UI changes do not alter tax calculation logic, blog publication validators, or user-owned article writing workflow.

## Global Professional UI Guard

- [ ] App and feature source stays free of old glass-template classes: `backdrop-blur-xl`, `shadow-material`, hover-lift, oversized custom radii, and translucent white surface classes.
- [ ] New route or feature UI work either follows the plain bordered surface system or updates the design docs and guard intentionally.
- [ ] Production SEO artifacts retain `professional-ui-evidence-result.json` so source-level UI guard status can be reviewed without rerunning local tests.
- [ ] Global UI guard changes do not alter page content, tax calculation logic, structured-data output, or blog article bodies.

## Acceptance Checks For P9 Dynamic Detail Page Surfaces

- Keyword landing, age scenario, basis, example, filing status, glossary, state, federal bracket, multi-year planning, tax interaction, and tax payment method detail pages no longer use `backdrop-blur-xl`, `shadow-material`, hover-lift, oversized custom radii, `bg-white/75`, `bg-white/70`, or `bg-white/60`.
- Dynamic detail panels use `rounded-lg border border-neutral-200 bg-white`; nested metric, table, and link surfaces use `rounded-md` instead of custom oversized radii.
- Existing dynamic page tests, release-note tests, feature-registry tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P10 Shared Feature Component Surfaces

- Shared feature components no longer use `backdrop-blur-xl`, `shadow-material`, hover-lift, oversized custom radii, `bg-white/75`, `bg-white/70`, `bg-white/65`, `bg-white/60`, or `bg-white/55`.
- Table wrappers, FAQ items, bracket impact cards, tax data freshness notes, scenario history rows, and theme toggle surfaces use restrained bordered surfaces.
- Existing shared feature tests, homepage E2E, release-note tests, feature-registry tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P11 Blog Shell Surfaces

- Blog index and blog article shell pages no longer use `backdrop-blur-xl`, `shadow-material`, hover-lift, oversized custom radii, `bg-white/75`, `bg-white/70`, or `bg-white/60`.
- Topic groups, article metadata, calculator CTA, and related-guide links use `rounded-lg` or `rounded-md` bordered surfaces.
- Existing blog content tests, blog discovery evidence, release-note tests, feature-registry tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P12 Global Professional UI Guard

- `tests/core/professional-ui-global-guard.test.ts` scans `src/app` and `src/features` recursively.
- The guard fails on old glass-template surface classes including material shadows, hover lift, oversized custom radii, and translucent white surfaces.
- Existing page-specific UI guards, release-note tests, feature-registry tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P13 Professional UI Evidence Artifact

- `npm run seo:professional-ui-evidence` emits machine-readable JSON with `evidenceType: professional-ui-source-guard`, scanned roots, forbidden classes, scanned file count, and violations.
- GitHub Actions uploads `professional-ui-evidence-result.json` inside `production-seo-evidence`.
- `scripts/validate-seo-evidence.mjs` and `scripts/generate-seo-evidence-manifest.mjs` require and list the professional UI evidence file.
- Existing global UI guard tests, release-note tests, feature-registry tests, workflow tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P14 SEO Monitoring UI Evidence Review

- `/seo-monitoring` artifact review checklist includes `professional-ui-evidence-result.json`.
- The checklist explains `ok: true`, `scannedFileCount`, `violationCount: 0`, and empty `violations` as the pass signal for the professional UI source guard.
- The validator checklist copy references `professionalUiScannedFileCount` so human review matches the retained JSON contract.
- Existing SEO monitoring tests, release-note tests, feature-registry tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P15 SEO Evidence Manifest Checksums

- `seo-evidence-manifest.json` records `sha256` for each retained source evidence file in `production-seo-evidence`.
- The manifest self-entry remains `selfDescribing: true` instead of hashing itself.
- `/seo-monitoring` tells reviewers to verify retained file names, byte sizes, `sha256` checksums, run identity, and retention metadata before using an artifact for Search Console or incident work.
- Existing SEO evidence workflow tests, SEO monitoring tests, release-note tests, feature-registry tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P16 SEO Evidence Manifest Checksum Validator

- `npm run seo:evidence-manifest-validate` verifies downloaded `production-seo-evidence` file byte counts and `sha256` hashes against `seo-evidence-manifest.json`.
- GitHub Actions runs the manifest checksum validator after manifest generation and before artifact upload.
- `/seo-monitoring` tells reviewers to re-run the checksum validator after downloading a production evidence artifact.
- Existing SEO evidence workflow tests, SEO monitoring tests, release-note tests, feature-registry tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.

## Acceptance Checks For P17 Retained Manifest Checksum Validation Result

- GitHub Actions retains `seo-evidence-manifest-validation-result.json` inside `production-seo-evidence`.
- `seo-evidence-manifest.json` lists the retained validation result as `postManifestValidation: true`.
- `/seo-monitoring` includes a separate artifact review item for `seo-evidence-manifest-validation-result.json`.
- `seo-evidence-manifest.json` records direct `gitHubRunUrl` and `gitHubCommitUrl` provenance links when generated inside GitHub Actions.
- `seo-evidence-manifest.json` records `artifactSchemaVersion` so artifact contract changes are machine-readable.
- `seo-evidence-manifest-validation-result.json` records `generatedAtRetained: true` after validating the manifest `generatedAt` ISO timestamp.
- `seo-evidence-manifest-validation-result.json` records `gitHubProvenanceConsistent: true` after confirming the run URL matches `gitHubRunId` and the commit URL matches `gitHubSha`.
- `seo-evidence-manifest-validation-result.json` records `gitHubWorkflowRetained: true` and `runAttemptRetained: true` for GitHub Actions artifacts after validating `eventName`, `gitHubWorkflow`, and numeric `gitHubRunAttempt`.
- `seo-evidence-manifest-validation-result.json` records `gitHubRepositoryRetained: true` for GitHub Actions artifacts after validating the manifest was generated by `TAO605/roth-conversion-calculator-ai`.
- `seo-evidence-manifest-validation-result.json` records `gitHubServerUrlRetained: true` after validating the manifest was generated against `https://github.com`.
- Existing SEO evidence workflow tests, SEO monitoring tests, release-note tests, feature-registry tests, full tests, build, production SEO evidence, structured data, and Lighthouse evidence continue to pass.
