export interface ReleaseNote {
  version: string;
  date: string;
  type: "minor" | "patch";
  title: string;
  summary: string;
  affectedArea: string;
  rollbackPath: string;
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: "1.0.203",
    date: "2026-06-09",
    type: "patch",
    title: "AI response verifier",
    summary:
      "Added a deterministic AI response verifier so paid-model explainer output must pass advice-language, sensitive-data, disclaimer, length, and calculator-dollar consistency checks before it can be returned; otherwise the endpoint falls back to the static educational explanation.",
    affectedArea:
      "AI explainer API route, AI response verifier, AI security evidence, release notes, feature registry, task tracking, and regression tests",
    rollbackPath:
      "Remove the verifier only if paid-model explainer output retains an equivalent deterministic pass/fail guard before any model-generated answer reaches users.",
  },
  {
    version: "1.0.202",
    date: "2026-06-09",
    type: "patch",
    title: "State readiness completeness scoring",
    summary:
      "Added selected-state readiness completeness scoring for CA, NY, and NJ so users and tax professionals can see the percentage complete, provided fields, missing fields, and next review step before any state-specific amount review.",
    affectedArea:
      "State rules readiness prep, tax impact warnings, report export, professional handoff packet, release notes, feature registry, task tracking, and regression tests",
    rollbackPath:
      "Remove the completeness score only if selected-state worksheets retain another clear provided-field and missing-field handoff path that does not imply a final state-law amount calculation.",
  },
  {
    version: "1.0.201",
    date: "2026-06-09",
    type: "patch",
    title: "State readiness input fields",
    summary:
      "Added optional selected-state readiness input fields for CA, NY, and NJ so users can carry residency, state AGI, state IRA basis, local tax, other-state credit, and notes into warnings, reports, and CPA handoff without changing the state tax formula.",
    affectedArea:
      "Calculator input model, storage and share merge, state readiness input UI, state rules readiness prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the readiness input fields only if selected-state worksheets retain another user-provided information path for professional review handoff.",
  },
  {
    version: "1.0.200",
    date: "2026-06-09",
    type: "patch",
    title: "State amount readiness worksheets",
    summary:
      "Added selected-state amount-readiness worksheets for California, New York, and New Jersey with official source checklists and missing inputs, while keeping full state-law dollar calculation inactive.",
    affectedArea:
      "State rule registry, state rules readiness prep, tax impact warnings, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the selected-state worksheets only if CA, NY, and NJ keep another reviewed handoff path that prevents users from treating manual-rate state estimates as reviewed state-specific amounts.",
  },
  {
    version: "1.0.199",
    date: "2026-06-09",
    type: "patch",
    title: "State rule registry scaffold",
    summary:
      "Added a state rule registry scaffold with manual-only, no broad individual income tax, and needs-review statuses so selected state examples carry machine-readable review boundaries without activating a full state-law amount engine.",
    affectedArea:
      "State rule registry, state rules readiness prep, tax impact warnings, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the registry scaffold only if selected-state examples retain another reviewed status boundary that prevents no-income-tax and needs-review states from being treated as reviewed state-specific amount support.",
  },
  {
    version: "1.0.198",
    date: "2026-06-09",
    type: "patch",
    title: "Selected state data model",
    summary:
      "Added a selectedState calculator input so state shortcuts, share links, local storage, state readiness warnings, reports, and CPA handoff can carry the selected state example separately from the manually editable state marginal tax rate.",
    affectedArea:
      "Calculator input model, state shortcut selector, share and localStorage merge, state rules readiness prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove selectedState only if state shortcut selection still cannot be confused with a manually edited state marginal tax rate and future state-rule branches retain another validated state identifier.",
  },
  {
    version: "1.0.197",
    date: "2026-06-09",
    type: "patch",
    title: "State rules readiness",
    summary:
      "Added a state-rules readiness worksheet that shows the manual state marginal rate, simplified state tax estimate, supported state example pages, and missing residency, state AGI, deductions, credits, exclusions, local tax, and multi-state inputs before any full state-law amount review.",
    affectedArea:
      "Tax impact warnings, state rules readiness prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the state-rules readiness worksheet only if an equivalent reviewed boundary still prevents the calculator from implying full state-law modeling from a manually entered state marginal rate.",
  },
  {
    version: "1.0.196",
    date: "2026-06-09",
    type: "patch",
    title: "AMT impact review prep",
    summary:
      "Added an AMT amount-readiness worksheet that shows the conversion-driven AMT income proxy change, Form 6251 formula boundary, and missing adjustment, preference, exemption, phaseout, and regular-tax comparison inputs while keeping AMT dollars unestimated.",
    affectedArea:
      "Tax impact warnings, AMT impact review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the AMT review-prep worksheet only if an equivalent reviewed boundary still prevents the calculator from implying AMT owed without Form 6251 adjustment, preference, exemption, phaseout, tentative-minimum-tax, and regular-tax comparison inputs.",
  },
  {
    version: "1.0.195",
    date: "2026-06-09",
    type: "patch",
    title: "RMD Uniform Lifetime preview",
    summary:
      "Added a bounded RMD Uniform Lifetime Table preview using the entered age and traditional IRA balance proxy, while keeping prior-year balance, account-type, spouse-beneficiary, inherited-account, and custodian-record boundaries visible in warnings, reports, and CPA handoff.",
    affectedArea:
      "Tax impact warnings, RMD review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the RMD preview only if an equivalent reviewed boundary still prevents the calculator from implying a final required distribution amount without prior December 31 balance, account type, table, beneficiary, and custodian context.",
  },
  {
    version: "1.0.194",
    date: "2026-06-09",
    type: "patch",
    title: "NIIT amount review prep",
    summary:
      "Added a NIIT amount-readiness worksheet that shows the conversion-driven MAGI proxy change, filing-status NIIT threshold, proxy excess, and 3.8% formula boundary while keeping NIIT dollars unestimated until net investment income and Form 8960 inputs are available.",
    affectedArea:
      "Tax impact warnings, NIIT amount review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the NIIT review-prep worksheet only if an equivalent reviewed boundary still prevents the calculator from implying NIIT owed without net investment income, MAGI, and Form 8960 context.",
  },
  {
    version: "1.0.193",
    date: "2026-06-09",
    type: "patch",
    title: "Social Security taxation review prep",
    summary:
      "Added a Social Security benefit taxation review-prep worksheet that shows the conversion-driven non-Social-Security income proxy change, keeps taxable-benefit dollars unestimated until SSA-1099 and IRS Publication 915 inputs are available, and carries the boundary into the report and CPA handoff packet.",
    affectedArea:
      "Tax impact warnings, Social Security benefit taxation review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the Social Security review-prep worksheet only if an equivalent reviewed boundary still prevents the calculator from implying taxable Social Security benefit dollar changes without SSA-1099, tax-exempt interest, and Publication 915 context.",
  },
  {
    version: "1.0.192",
    date: "2026-06-08",
    type: "patch",
    title: "ACA premium tax credit review prep",
    summary:
      "Added an ACA premium tax credit review-prep worksheet that shows the conversion-driven income proxy change, keeps subsidy dollars unestimated until Marketplace-specific inputs are available, and carries the boundary into the report and CPA handoff packet.",
    affectedArea:
      "Tax impact warnings, ACA premium tax credit review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the ACA review-prep worksheet only if an equivalent reviewed boundary still prevents the calculator from implying ACA subsidy dollar changes without Marketplace, Form 1095-A, and Form 8962 context.",
  },
  {
    version: "1.0.191",
    date: "2026-06-08",
    type: "patch",
    title: "IRMAA Part B proxy estimator",
    summary:
      "Added a bounded 2026 Medicare Part B IRMAA proxy preview using official CMS monthly premium and adjustment amounts, while clearly stating that the preview uses calculator income proxy rather than SSA lookback-year MAGI.",
    affectedArea:
      "Tax impact warnings, IRMAA review prep, report export, professional handoff packet, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove the Part B proxy preview and keep the prior IRMAA review-prep warning if CMS amounts or professional-review boundaries cannot be verified.",
  },
  {
    version: "1.0.190",
    date: "2026-06-08",
    type: "patch",
    title: "Projection result boundary copy",
    summary:
      "Added visible homepage result copy clarifying that modeled break-even, projected after-tax difference, and projection bars are scenario estimates based on user-entered assumptions, not guaranteed outcomes or recommendations.",
    affectedArea:
      "Homepage result summary, projection chart, long-term result display wording, release notes, task tracking, and regression tests",
    rollbackPath:
      "Remove this copy only if an equivalent reviewed boundary remains visible near break-even, projected after-tax difference, and projection outputs.",
  },
  {
    version: "1.0.189",
    date: "2026-06-08",
    type: "patch",
    title: "Upfront cost result label",
    summary:
      "Renamed the homepage primary result label from estimated upfront tax to estimated upfront cost so the displayed total does not imply that modeled early-distribution penalties are tax.",
    affectedArea:
      "Homepage result summary, result display wording, operational readiness checks, release notes, task tracking, and regression tests",
    rollbackPath:
      "Restore the prior label only if the result total no longer includes modeled early-distribution penalties or a reviewed replacement keeps tax and penalty amounts clearly separated.",
  },
  {
    version: "1.0.188",
    date: "2026-06-08",
    type: "patch",
    title: "Invalid input result pause",
    summary:
      "Added a result-area validation boundary so invalid calculator inputs pause estimates, reports, projections, tax-payment comparison, professional handoff, and AI explanations until the user fixes the input errors.",
    affectedArea:
      "Homepage calculator results, input validation display, report actions, AI explanation boundary, projection display, release notes, task tracking, and regression tests",
    rollbackPath:
      "Restore the prior always-rendered result modules only if a reviewed replacement still prevents invalid calculator inputs from showing normal-looking tax estimates or exportable reports.",
  },
  {
    version: "1.0.187",
    date: "2026-06-08",
    type: "patch",
    title: "Tax payment withholding cap boundary",
    summary:
      "Updated the tax payment method comparison so IRA withholding is capped at the conversion amount, any tax amount outside that cap is identified as outside the withholding model, and the modeled penalty basis follows the same cap.",
    affectedArea:
      "Tax payment method comparison, result display boundaries, early-distribution penalty display, release notes, task tracking, and regression tests",
    rollbackPath:
      "Restore the prior tax payment comparison only if a reviewed replacement still prevents the IRA withholding scenario from implying that more than the conversion amount can be withheld from the IRA.",
  },
  {
    version: "1.0.186",
    date: "2026-06-08",
    type: "patch",
    title: "Withheld tax boundary guard",
    summary:
      "Added a core calculator boundary guard so withheld tax amounts above the conversion amount are rejected in input validation and capped defensively before early-distribution penalty math runs.",
    affectedArea:
      "Core Roth conversion calculator, input validation, early-distribution penalty modeling, release notes, task tracking, and regression tests",
    rollbackPath:
      "Restore the prior withheld-tax validation and penalty-basis behavior only if a reviewed replacement keeps invalid share-link or integration data from producing impossible modeled penalty amounts.",
  },
  {
    version: "1.0.185",
    date: "2026-06-08",
    type: "patch",
    title: "Tax impact warnings boundary feature registry",
    summary:
      "Registered the homepage Tax Impact Warnings panel as a locked YMYL boundary in the main feature registry and routed the mount through that locked registry entry so hidden tax-interaction review prompts cannot be disabled by normal feature overrides.",
    affectedArea:
      "Feature registry, homepage Tax Impact Warnings boundary, release notes, tax-impact placement guard, and task tracking",
    rollbackPath:
      "Keep equivalent visible IRMAA, ACA, Social Security, NIIT, RMD, and state-tax review warnings near the result summary, then revert the registry entry, homepage mount, release note, task, progress, and tests only after a reviewed replacement is in place.",
  },
  {
    version: "1.0.184",
    date: "2026-06-08",
    type: "patch",
    title: "Result scope boundary feature registry",
    summary:
      "Registered the homepage result scope badges as a locked YMYL boundary in the main feature registry and routed the mount through that locked registry entry so tax-year, educational-estimate, input-based, and not-tax-advice copy cannot be disabled by normal feature overrides.",
    affectedArea:
      "Feature registry, homepage result scope boundary, release notes, result-scope guard, and task tracking",
    rollbackPath:
      "Keep equivalent visible result-boundary copy before the result summary, then revert the registry entry, homepage mount, release note, task, progress, and tests only after a reviewed replacement is in place.",
  },
  {
    version: "1.0.183",
    date: "2026-06-08",
    type: "patch",
    title: "Tax payment comparison feature registry",
    summary:
      "Registered the homepage Tax Payment Method Comparison support panel in the main feature registry and gated the panel through that registry so tax-payment-comparison rollback is visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage tax payment comparison panel, release notes, tax payment comparison guard, and task tracking",
    rollbackPath:
      "Remove the tax-payment-comparison feature registry entry, restore the always-rendered TaxPaymentComparison panel in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.182",
    date: "2026-06-08",
    type: "patch",
    title: "Calculation breakdown feature registry",
    summary:
      "Registered the homepage Advanced calculation details module in the main feature registry and gated the disclosure through that registry so calculation-breakdown rollback is visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage Advanced calculation details, homepage performance guard, release notes, and task tracking",
    rollbackPath:
      "Remove the calculation-breakdown feature registry entry, restore the always-rendered Advanced calculation details disclosure in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.181",
    date: "2026-06-08",
    type: "patch",
    title: "Projection chart feature registry",
    summary:
      "Registered the homepage projection chart in the main feature registry and gated the Projection card through that registry so projection-chart rollback is visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage projection card, homepage performance guard, release notes, and task tracking",
    rollbackPath:
      "Remove the projection-chart feature registry entry, restore the always-rendered Projection card in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.180",
    date: "2026-06-08",
    type: "patch",
    title: "Professional handoff feature registry",
    summary:
      "Registered the CPA packet copy action in the main feature registry and gated the homepage Copy CPA packet action through that registry so professional-handoff rollback is visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage result actions, professional handoff tests, release notes, and task tracking",
    rollbackPath:
      "Remove the professional-handoff feature registry entry, restore the always-rendered CopyProfessionalHandoffButton in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.179",
    date: "2026-06-08",
    type: "patch",
    title: "Share link feature registry",
    summary:
      "Registered the share result link in the main feature registry and gated the homepage Share result action through that registry so share-link rollback and release review are visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage result actions, release notes, task tracking, and feature-registry regression tests",
    rollbackPath:
      "Remove the share-link feature registry entry, restore the always-rendered ShareResultButton in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.178",
    date: "2026-06-08",
    type: "patch",
    title: "Report export feature registry",
    summary:
      "Registered the print-ready report export in the main feature registry and gated the homepage report action through that registry so report export rollback and release review are visible in the modular rollback map.",
    affectedArea:
      "Feature registry, homepage result actions, release notes, task tracking, and feature-registry regression tests",
    rollbackPath:
      "Remove the pdf-report feature registry entry, restore the always-rendered PdfReportButton in HomeCalculatorClient, then revert the release note, task, progress, and tests.",
  },
  {
    version: "1.0.177",
    date: "2026-06-08",
    type: "patch",
    title: "Report wording consistency",
    summary:
      "Aligned current privacy, CPA handoff, tax forms, custodian, mistakes, LLM index, and review-packet copy with the print-ready HTML report export so users are not told the site directly generates a PDF file.",
    affectedArea:
      "Current report-related content pages, LLM discovery text, privacy data-flow playbook, CPA checklist, professional review packet, release notes, task tracking, and wording regression tests",
    rollbackPath:
      "Restore the previous PDF-oriented wording on current report-related content pages, then remove the report wording consistency test and revert release note, task, and progress updates.",
  },
  {
    version: "1.0.176",
    date: "2026-06-08",
    type: "patch",
    title: "Print-ready report export",
    summary:
      "Upgraded the result report download from a plain-text file to a print-ready HTML report with input verification, modeled outputs, tax-impact review items, IRMAA review prep, official source links, and the required educational boundary so users can save the report as PDF from their browser.",
    affectedArea:
      "Report export button, report HTML builder, feature config, release notes, task tracking, and report regression tests",
    rollbackPath:
      "Restore PdfReportButton to the previous text/plain report download, remove the report HTML builder and tests, then revert the release note, feature config version, task, and progress updates.",
  },
  {
    version: "1.0.175",
    date: "2026-06-08",
    type: "patch",
    title: "IRMAA review prep",
    summary:
      "Added an IRMAA review-prep module inside Tax Impact Warnings and the CPA packet so Medicare-related review now captures the usual lookback tax year, missing MAGI and Medicare inputs, official Medicare/SSA references, and a clear no-premium-amount boundary.",
    affectedArea:
      "Tax Impact Warnings, professional handoff packet, IRMAA review-prep helper, release notes, feature registry, task tracking, and engineering documentation",
    rollbackPath:
      "Remove buildIrmaaReviewPrep, remove the IRMAA Review Prep panel from TaxImpactWarnings, remove the IRMAA prep section from the professional handoff packet, then revert related tests, release note, feature registry entry, task, progress, and documentation updates.",
  },
  {
    version: "1.0.174",
    date: "2026-06-08",
    type: "patch",
    title: "SEO artifact review security checklist",
    summary:
      "Updated the SEO monitoring artifact review checklist so downloaded production-seo-evidence packages now explicitly include private evidence boundary proof, AI endpoint security proof, and the current 20-file manifest checksum contract.",
    affectedArea:
      "SEO monitoring artifact review copy, release notes, feature registry, task tracking, and progress documentation",
    rollbackPath:
      "Remove the private evidence boundary and AI security checklist items from buildSeoEvidenceArtifactReview, restore the previous manifest count copy, then revert the release note, feature registry version, task, and progress updates.",
  },
  {
    version: "1.0.173",
    date: "2026-06-08",
    type: "patch",
    title: "AI provider usage evidence records",
    summary:
      "Added sanitized OpenAI, Anthropic, and provider usage evidence templates plus validation and readiness commands so account-console spend observations can be reviewed without pasting API keys, tokens, cookies, card data, or private request bodies.",
    affectedArea:
      "AI provider usage evidence template, provider usage validators, operations scripts, package scripts, release notes, feature registry, task tracking, and recurrence documentation",
    rollbackPath:
      "Remove the provider usage evidence template and validation/readiness commands, then revert the package scripts, release note, feature registry version, task, progress, and recurrence documentation updates.",
  },
  {
    version: "1.0.172",
    date: "2026-06-08",
    type: "patch",
    title: "AI cost abuse evidence command",
    summary:
      "Added a repeatable operations command that checks recent Vercel AI endpoint logs, verifies same-origin fallback behavior, verifies cross-origin blocking, and clearly separates request evidence from OpenAI and Anthropic account-spend evidence.",
    affectedArea:
      "AI cost-abuse evidence command, operations scripts, package scripts, release notes, feature registry, task tracking, and recurrence documentation",
    rollbackPath:
      "Remove the AI cost-abuse evidence command and package script, then revert the release note, feature registry version, task, progress, and recurrence documentation updates.",
  },
  {
    version: "1.0.171",
    date: "2026-06-06",
    type: "patch",
    title: "AI explainer cost-abuse guard",
    summary:
      "Hardened the public AI explainer endpoint with same-origin request checks, a conservative configurable hourly limit, fallback-only default behavior, and an explicit paid-model opt-in fuse so deployed API keys cannot be spent by default.",
    affectedArea:
      "AI explainer API route, AI rate-limit helpers, content security policy, environment defaults, release notes, feature registry, task tracking, and security regression tests",
    rollbackPath:
      "Restore the previous AI explainer API route, rate-limit helper, CSP connect-src setting, and environment defaults, then revert the AI API security tests, release note, feature registry version, task, and progress updates.",
  },
  {
    version: "1.0.170",
    date: "2026-06-06",
    type: "patch",
    title: "GSC validation follow-up plan",
    summary:
      "Added a sanitized Google Search Console validation follow-up record and validator so Page indexing validation can be reviewed on a planned cadence without repeatedly clicking Validate fix or syncing account UI.",
    affectedArea:
      "GSC validation follow-up evidence command, SEO monitoring playbook, release notes, feature registry, task tracking, and progress documentation",
    rollbackPath:
      "Remove the GSC validation follow-up validator command, follow-up evidence record, and SEO monitoring section, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.169",
    date: "2026-06-06",
    type: "patch",
    title: "GSC validation action evidence",
    summary:
      "Added a sanitized Google Search Console validation-action record validator so Page indexing Validate fix actions can be recorded without syncing account UI, cookies, tokens, or raw private GSC text.",
    affectedArea:
      "GSC validation action evidence command, SEO monitoring playbook, release notes, feature registry, task tracking, and progress documentation",
    rollbackPath:
      "Remove the GSC validation action validator command and SEO monitoring section, then revert the release note, feature registry version, task, progress, and validation-action evidence updates.",
  },
  {
    version: "1.0.168",
    date: "2026-06-06",
    type: "patch",
    title: "GSC sample internal discovery evidence",
    summary:
      "Extended the GSC discovered sample evidence command so discovered-not-indexed sample URLs must also be linked from /site-index, turning crawl-priority follow-up into a repeatable internal-discovery check.",
    affectedArea:
      "GSC discovered sample evidence command, SEO evidence validator, SEO evidence manifest schema, Search Console monitoring playbook, release notes, task tracking, and progress documentation",
    rollbackPath:
      "Remove the /site-index linked-sample assertions from the GSC discovered sample evidence command and validator, restore the previous SEO evidence manifest schema version, then revert the release note, feature registry version, task, and progress updates.",
  },
  {
    version: "1.0.167",
    date: "2026-06-06",
    type: "patch",
    title: "GSC discovered sample evidence",
    summary:
      "Added a production evidence command for Google Search Console discovered-not-indexed sample URLs so each sample can be checked for status, canonical, sitemap inclusion, noindex, and title before indexing follow-up.",
    affectedArea:
      "GSC discovered sample evidence command, SEO Smoke artifact workflow, SEO evidence manifest schema, release notes, task tracking, and progress documentation",
    rollbackPath:
      "Remove the GSC discovered sample evidence command and workflow artifact step, restore the previous SEO evidence manifest schema version, then revert the release note, feature registry version, task, and progress updates.",
  },
  {
    version: "1.0.166",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console indexing evidence follow-up",
    summary:
      "Captured GSC Performance zero-data and Page indexing evidence, then fixed the About page canonical after the discovered-not-indexed sample check showed it inheriting the homepage canonical.",
    affectedArea:
      "About page SEO metadata, GSC priority URL evidence, Search Console evidence archive, release notes, task tracking, and progress documentation",
    rollbackPath:
      "Remove the About page canonical metadata, remove /about from the GSC priority URL evidence list, and revert the retained GSC evidence files, release note, task, and progress updates.",
  },
  {
    version: "1.0.165",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console query opportunity backlog",
    summary:
      "Added a GSC query opportunity backlog summary command that inventories local template, draft, and recorded query records by status, risk, cluster, priority score, and next action before content planning.",
    affectedArea:
      "Search Console query opportunity backlog command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the query opportunity backlog summary command and related SEO monitoring copy, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.164",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console query opportunity drafts",
    summary:
      "Added an AI-assisted GSC query opportunity draft generator that maps reviewer-supplied Search Console query rows to safe clusters, target surfaces, actions, review gates, and draft records without fetching private GSC data.",
    affectedArea:
      "Search Console query opportunity draft generator, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the query opportunity draft generator and related SEO monitoring copy, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.163",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console query opportunity readiness",
    summary:
      "Added a GSC query opportunity readiness command that lists reviewer-supplied query fields still missing from template or draft records and separates them from AI-fillable planning fields.",
    affectedArea:
      "Search Console query opportunity readiness command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the query opportunity readiness command and related SEO monitoring copy, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.162",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console query opportunity records",
    summary:
      "Added a GSC query opportunity record template and validator so private Search Console query observations can become review-gated content backlog items without turning keyword data into personal tax advice.",
    affectedArea:
      "Search Console query opportunity template, validator command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the query opportunity template and validator command, then revert the SEO monitoring copy, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.161",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console indexing records manifest",
    summary:
      "Added a GSC indexing records manifest command that inventories recorded URL Inspection evidence and screenshot hashes so archived Search Console proof stays traceable after private screenshots are synced.",
    affectedArea:
      "Search Console indexing records manifest command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the manifest command and generated GSC records manifest, then revert the SEO monitoring copy, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.160",
    date: "2026-06-06",
    type: "patch",
    title: "Search Console indexing record summary",
    summary:
      "Added a GSC indexing record summary command that turns completed URL Inspection records into archive-ready handoff text while refusing to infer private Search Console status from public site evidence.",
    affectedArea:
      "Search Console indexing record summary command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the summary command and related SEO monitoring copy, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.159",
    date: "2026-06-05",
    type: "patch",
    title: "Search Console indexing record readiness",
    summary:
      "Added a GSC indexing record readiness command that lists the reviewer-supplied Search Console fields still missing from template or draft records, so AI can prefill public evidence without pretending to know private URL Inspection status.",
    affectedArea:
      "Search Console indexing record readiness command, SEO monitoring playbook, release notes, feature registry, task tracking, E2E stability guard, and operations documentation",
    rollbackPath:
      "Remove the readiness command and related SEO monitoring copy, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.158",
    date: "2026-06-05",
    type: "patch",
    title: "Search Console indexing record drafts",
    summary:
      "Added an AI-assisted GSC indexing record draft generator that pre-fills public production SEO evidence from downloaded artifacts while keeping private Search Console URL Inspection fields as placeholders until a reviewer copies the real GSC result and screenshot.",
    affectedArea:
      "Search Console indexing record draft generator, validator states, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the draft generator command and draft validator state, then revert the SEO monitoring page, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.157",
    date: "2026-06-05",
    type: "patch",
    title: "Search Console indexing record template",
    summary:
      "Added a structured GSC indexing record template and validator so manual URL Inspection or Page indexing observations can be retained with screenshots, canonical state, request-indexing outcome, and linked production SEO evidence without inferring private Search Console status from site-side checks.",
    affectedArea:
      "Search Console indexing record template, validator command, SEO monitoring playbook, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the GSC indexing record template and validator command, then revert the SEO monitoring page, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.156",
    date: "2026-06-05",
    type: "patch",
    title: "Search Console verification evidence",
    summary:
      "Added retained Search Console verification evidence so production SEO proof packages verify the public domain TXT token, homepage Google verification meta tag, SPF retention, canonical host, and the boundary that private Search Console UI ownership is not asserted by site-side checks.",
    affectedArea:
      "Search Console verification evidence script, package scripts, SEO Smoke workflow, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the Search Console verification evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.155",
    date: "2026-06-05",
    type: "patch",
    title: "Professional review packet evidence",
    summary:
      "Added a professional review packet page and retained production evidence so CPA or EA handoff can verify review status, modeled scope, non-modeled tax interactions, source data, sitemap discovery, llms.txt discovery, and pending professional-review language.",
    affectedArea:
      "Professional review packet page, sitemap, llms.txt, site index, structured-data evidence, SEO Smoke workflow, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the professional review packet route and evidence script, restore the previous manifest schema version, then revert sitemap, llms.txt, site-index, release note, feature registry, task, progress, and documentation updates.",
  },
  {
    version: "1.0.154",
    date: "2026-06-05",
    type: "patch",
    title: "Production HTML quality evidence",
    summary:
      "Added retained production HTML quality evidence so SEO proof packages verify page status, html lang, single H1 coverage, titles, meta descriptions, canonical tags, image alt text, button names, and form labels.",
    affectedArea:
      "SEO Smoke workflow, HTML quality evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the HTML quality evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.153",
    date: "2026-06-05",
    type: "patch",
    title: "Production internal link evidence",
    summary:
      "Added retained production internal-link evidence so SEO proof packages verify sitemap URL health, canonical host retention, noindex absence, and site-index internal link coverage.",
    affectedArea:
      "SEO Smoke workflow, internal link evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the internal link evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.152",
    date: "2026-06-05",
    type: "patch",
    title: "Production crawl discovery evidence",
    summary:
      "Added retained production crawl-discovery evidence so SEO proof packages verify robots.txt discovery links, sitemap canonical URL coverage, RSS feed item coverage, and llms.txt core AI-discovery coverage.",
    affectedArea:
      "SEO Smoke workflow, crawl discovery evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the crawl discovery evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.151",
    date: "2026-06-04",
    type: "patch",
    title: "Production health endpoint evidence",
    summary:
      "Added retained production health-endpoint evidence so SEO proof packages verify live /api/health status, no-store caching, tax-year metadata, content counts, feature counts, pending professional-review status, and absence of secret-like keys.",
    affectedArea:
      "SEO Smoke workflow, health evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the health evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.150",
    date: "2026-06-04",
    type: "patch",
    title: "Production security headers evidence",
    summary:
      "Added retained production security-header evidence so SEO proof packages verify live CSP, HSTS, nosniff, referrer, permissions, frame, base URI, form-action, and framework-fingerprint protections.",
    affectedArea:
      "SEO Smoke workflow, security headers evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the security headers evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.149",
    date: "2026-06-04",
    type: "patch",
    title: "Production DNS evidence artifact",
    summary:
      "Added retained DNS and canonical-host evidence so production SEO proof packages verify the apex redirect, canonical www status, and Vercel CNAME routing after domain changes.",
    affectedArea:
      "SEO Smoke workflow, DNS evidence script, SEO evidence validator, manifest schema, SEO monitoring artifact review copy, release notes, feature registry, task tracking, and operations documentation",
    rollbackPath:
      "Remove the DNS evidence script and artifact wiring, restore the previous manifest schema version, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.148",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence GitHub server provenance validation",
    summary:
      "Added manifest GitHub server URL validation so retained production SEO evidence artifacts prove they were generated against the expected GitHub host.",
    affectedArea:
      "SEO evidence manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove gitHubServerUrl validation from the manifest validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.147",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence repository provenance validation",
    summary:
      "Added manifest repository provenance checks so retained production SEO evidence artifacts identify and validate the GitHub repository that generated them, and hardened calculator input state updates for rapid mobile entry.",
    affectedArea:
      "SEO evidence manifest generation, manifest checksum validator, SEO monitoring artifact review copy, calculator input state updates, release notes, feature registry, task tracking, progress evidence, E2E guard, and operations documentation",
    rollbackPath:
      "Remove gitHubRepository from the manifest generator and repository checks from the manifest validator, restore snapshot-style calculator input updates, then revert the release note, feature registry versions, task, progress, E2E guard, and documentation updates.",
  },
  {
    version: "1.0.146",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence workflow event validation",
    summary:
      "Added manifest workflow event checks so retained production SEO evidence artifacts validate their event name, workflow name, and run attempt.",
    affectedArea:
      "SEO evidence manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove workflow event and run-attempt checks from the manifest validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.145",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence provenance consistency validation",
    summary:
      "Added manifest provenance consistency checks so retained GitHub run URLs match their run IDs and retained commit URLs match their commit SHAs.",
    affectedArea:
      "SEO evidence manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove GitHub provenance consistency checks from the manifest validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.144",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence generated timestamp validation",
    summary:
      "Added manifest generatedAt timestamp validation so production SEO evidence artifacts retain a machine-checkable creation time.",
    affectedArea:
      "SEO evidence manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove generatedAt timestamp validation from the manifest validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.143",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence schema version",
    summary:
      "Added a machine-readable artifact schema version to the production SEO evidence manifest so reviewers and automation can distinguish proof-package contract changes.",
    affectedArea:
      "SEO evidence manifest generation, manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove artifactSchemaVersion from the manifest generator and validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.142",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence provenance URLs",
    summary:
      "Added direct GitHub Actions run and commit URLs to the production SEO evidence manifest so downloaded proof packages remain traceable without opening the Actions UI first.",
    affectedArea:
      "SEO evidence manifest generation, manifest checksum validator, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove the GitHub run and commit URL fields from the manifest generator and validator, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.141",
    date: "2026-06-04",
    type: "patch",
    title: "Retained checksum validation evidence",
    summary:
      "Retained the SEO evidence manifest checksum validator output inside the production SEO evidence artifact so downloaded proof packages include both the manifest and the manifest-validation result.",
    affectedArea:
      "SEO Smoke workflow, SEO evidence manifest, manifest checksum validator, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove the retained manifest validation result from the workflow upload, manifest metadata, monitoring checklist, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.140",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence checksum validator",
    summary:
      "Added a manifest validation command and CI step that verifies retained production SEO evidence byte counts and sha256 checksums before the proof package is uploaded.",
    affectedArea:
      "SEO evidence manifest validator, SEO Smoke workflow, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove the SEO evidence manifest validator script, package command, workflow step, monitoring copy, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.139",
    date: "2026-06-04",
    type: "patch",
    title: "SEO evidence manifest checksums",
    summary:
      "Added sha256 checksums to the production SEO evidence manifest so downloaded proof packages can be reviewed for file integrity as well as file presence, run identity, and retention metadata.",
    affectedArea:
      "SEO evidence manifest generation, SEO monitoring artifact review copy, release notes, feature registry, task tracking, progress evidence, and operations documentation",
    rollbackPath:
      "Remove sha256 generation from the SEO evidence manifest, then revert the SEO monitoring checksum review copy, release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.138",
    date: "2026-06-04",
    type: "patch",
    title: "SEO monitoring UI evidence review",
    summary:
      "Updated the SEO monitoring artifact review checklist so the visible operations playbook explains how to verify the retained professional UI source-guard evidence inside production SEO artifacts.",
    affectedArea:
      "SEO monitoring content, artifact review checklist, release notes, feature registry, task tracking, progress evidence, and UI documentation",
    rollbackPath:
      "Remove the professional UI evidence checklist item from SEO monitoring, then revert the release note, feature registry version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.137",
    date: "2026-06-04",
    type: "patch",
    title: "Professional UI evidence artifact",
    summary:
      "Added a production evidence command and CI artifact coverage for the global professional UI source guard so each SEO evidence package retains proof that app and feature code stayed free of old glass-template surface classes.",
    affectedArea:
      "Professional UI source guard evidence script, SEO Smoke workflow, SEO evidence validator, evidence manifest, release notes, feature registry, task tracking, progress evidence, and UI documentation",
    rollbackPath:
      "Remove the professional UI evidence command from the workflow, validator, manifest, package script, and tests, then revert the release note, feature registry version, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.136",
    date: "2026-06-03",
    type: "patch",
    title: "Global professional UI guard",
    summary:
      "Added a global source guard that scans app and feature code for old glass-template surface classes so future pages cannot reintroduce translucent cards, material shadows, hover-lift, or oversized custom radii.",
    affectedArea:
      "App routes, shared feature components, professional UI regression tests, release notes, feature registry, task tracking, progress evidence, and UI documentation",
    rollbackPath:
      "Remove the global professional UI guard test, then revert the release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.135",
    date: "2026-06-03",
    type: "patch",
    title: "Professional blog shell surfaces",
    summary:
      "Extended the professional no-glass UI system to the blog index and article shell by replacing translucent topic, author, calculator CTA, and related-guide cards with restrained bordered surfaces while leaving article body content unchanged.",
    affectedArea:
      "Blog index page, blog article shell, related guide links, calculator CTA, blog shell UI regression guard, release notes, feature registry, task tracking, progress evidence, and UI documentation",
    rollbackPath:
      "Restore the previous blog shell surface classes, then revert the blog-shell UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.134",
    date: "2026-06-03",
    type: "patch",
    title: "Launch readiness status surfaces",
    summary:
      "Tightened the operations page UI guard by converting Launch Readiness summary status blocks from oversized custom-radius surfaces to restrained bordered status panels.",
    affectedArea:
      "Launch readiness checklist, operations page UI regression guard, release notes, feature registry, task tracking, progress evidence, and UI documentation",
    rollbackPath:
      "Restore the previous Launch Readiness summary status block classes, then revert the operations UI guard update, release note, feature registry version, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.133",
    date: "2026-06-03",
    type: "patch",
    title: "Professional shared feature surfaces",
    summary:
      "Extended the professional no-glass UI system to shared calculator and methodology feature components by replacing translucent table wrappers, FAQ cards, scenario panels, and utility controls with plain bordered surfaces.",
    affectedArea:
      "Shared feature components, homepage FAQ, methodology tax table, bracket impact, sensitivity tables, scenario history, tax data freshness, theme toggle, shared feature UI regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous shared feature component surface classes, then revert the shared-feature UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.132",
    date: "2026-06-03",
    type: "patch",
    title: "Professional dynamic detail surfaces",
    summary:
      "Extended the professional no-glass UI system to non-blog dynamic detail pages by replacing translucent, large-radius, and heavy-shadow content panels with plain bordered review surfaces.",
    affectedArea:
      "Keyword landing, age scenario, basis, example, filing status, glossary, state, federal bracket, multi-year planning, tax interaction, tax payment method detail pages, dynamic detail UI regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous dynamic detail page container classes in the affected app routes, then revert the dynamic-detail UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.131",
    date: "2026-06-03",
    type: "patch",
    title: "Professional priority guide surfaces",
    summary:
      "Extended the professional no-glass UI system to priority educational and CPA-review guide pages by replacing translucent, large-radius, and heavy-shadow review cards with plain bordered YMYL review panels.",
    affectedArea:
      "Calculator assumptions guide, CPA review checklist, Roth conversion priority guide pages, guide page UI regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous priority guide page container classes in the affected app routes, then revert the priority-guide UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.130",
    date: "2026-06-03",
    type: "patch",
    title: "Professional content hub surfaces",
    summary:
      "Extended the professional no-glass UI system to top-level index and content hub pages by replacing translucent, large-radius, and hover-shadow link cards with plain bordered navigation panels.",
    affectedArea:
      "Site index, release notes, calculator hub, state hub, glossary hub, age scenarios, examples, filing status, basis, multi-year planning, tax interactions, tax payment methods, content hub UI regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous hub page card classes in the affected app routes, then revert the content-hub UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.129",
    date: "2026-06-03",
    type: "patch",
    title: "Professional operations page surfaces",
    summary:
      "Extended the no-AI professional UI pass to audit and operations playbook pages by replacing glass, large-radius, and heavy-shadow surfaces with plain bordered review panels and adding regression guards for the operations page shell.",
    affectedArea:
      "SEO monitoring, content operations, performance audit, accessibility audit, AI compliance audit, privacy data flow, production launch, launch readiness, feedback roadmap, tax data update, operations page UI tests, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous operations page container classes in the affected app routes, then revert the operations-page UI regression test, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.128",
    date: "2026-06-03",
    type: "patch",
    title: "Mobile input disclosure touch targets",
    summary:
      "Improved the calculator input disclosures by giving Projection assumptions and Advanced assumptions larger mobile touch targets, clear chevron affordances, and native details/summary behavior for keyboard and screen-reader compatibility.",
    affectedArea:
      "Calculator input disclosures, mobile touch targets, projection assumptions, advanced assumptions, input layout regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the previous plain summary elements in CalculatorInput, remove the chevron disclosure summary helper, then revert the related calculator input layout tests, release note, feature version, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.127",
    date: "2026-06-03",
    type: "patch",
    title: "Compact mobile input assumptions",
    summary:
      "Refined the homepage Quick Estimate input flow by moving retirement age and expected annual return into a collapsed Projection assumptions section, keeping the assumptions available while reducing default mobile input density.",
    affectedArea:
      "Calculator input layout, mobile first-screen density, projection assumptions, input layout regression guards, release notes, feature registry, UI documentation, and engineering progress tracking",
    rollbackPath:
      "Move retirement age and expected annual return back into the always-visible Quick Estimate field list, then revert the related calculator input layout tests, release note, feature registry entry, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.126",
    date: "2026-06-03",
    type: "patch",
    title: "Stable result action toolbar",
    summary:
      "Refined the homepage result action toolbar so dynamically loaded report and CPA packet actions keep stable disabled placeholders and the mobile-to-desktop toolbar stays on a predictable two-to-four column grid.",
    affectedArea:
      "Homepage result actions, lazy action fallbacks, mobile calculator detail polish, layout-shift regression guards, release notes, feature registry, and UI documentation",
    rollbackPath:
      "Restore the result action toolbar classes and dynamic button loading fallbacks in HomeCalculatorClient, then revert the related result action layout test, release note, feature version, task, progress, and UI documentation updates.",
  },
  {
    version: "1.0.125",
    date: "2026-06-03",
    type: "patch",
    title: "Professional support panel UI",
    summary:
      "Extended the no-AI professional UI pass to the supporting calculator panels by demoting AI-first explainer language, removing glass/tinted card styling from warnings, payment comparison, projection, breakdown, and scope badges, and adding regression guards for the support panel surface.",
    affectedArea:
      "Explanation assistant, tax impact warnings, tax payment comparison, projection chart, calculation breakdown, result scope badges, homepage lazy fallbacks, UI tests, and engineering documentation",
    rollbackPath:
      "Restore the previous support panel classes and explainer headings in the affected feature components, then revert the related support-panel UI test, release note, feature version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.124",
    date: "2026-06-03",
    type: "patch",
    title: "No-AI SEO metadata branding",
    summary:
      "Aligned homepage metadata, Open Graph, Twitter card, RSS site name, and homepage WebPage JSON-LD with the professional Roth Conversion Calculator brand while preserving the optional educational AI explainer feature.",
    affectedArea:
      "Root metadata, social previews, site configuration, RSS feed title, homepage WebPage JSON-LD, structured-data guards, and no-AI SEO regression tests",
    rollbackPath:
      "Restore the previous AI-first metadata strings in src/app/layout.tsx, src/core/seo/site-config.ts, and src/core/seo/json-ld.ts, then revert the related SEO tests, release note, feature version, task, progress, and documentation updates.",
  },
  {
    version: "1.0.123",
    date: "2026-06-02",
    type: "patch",
    title: "Professional calculator UI pass",
    summary:
      "Adapted the no-AI UI refactor brief into a scoped homepage calculator pass with plain financial-tool surfaces, calculator-first hero copy, a 40/60 input/result layout, and worksheet-style primary result numbers while preserving calculation and SEO behavior.",
    affectedArea:
      "Homepage hero, shared Card/Button/Field primitives, calculator input surface, result summary cards, UI regression guards, and V1.3 engineering documentation",
    rollbackPath:
      "Restore the previous homepage hero copy and shared UI primitive classes, revert the calculator layout and result-summary style changes, then remove the UI no-AI regression test and documentation addendum.",
  },
  {
    version: "1.0.122",
    date: "2026-06-02",
    type: "patch",
    title: "Performance warning playbook",
    summary:
      "Updated the performance audit playbook so operators can interpret Lighthouse warningClassification values for clean samples, non-blocking Chrome temporary-directory cleanup warnings, and blocking runtime warnings.",
    affectedArea:
      "Performance audit playbook, Lighthouse evidence review, PageSpeed follow-up workflow, release regression checks, and lab-warning operations",
    rollbackPath:
      "Remove the Lighthouse runtime warning classification check from src/content/performance-audit.ts, then revert the related performance-audit test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.121",
    date: "2026-06-02",
    type: "patch",
    title: "Lighthouse warning classification",
    summary:
      "Added explicit warningClassification and samplePolicy warning summaries to mobile Lighthouse evidence so valid samples with Chrome temporary-directory cleanup warnings are distinguished from blocking runtime issues.",
    affectedArea:
      "Mobile Lighthouse evidence, GitHub Actions SEO artifacts, performance evidence review, PageSpeed follow-up workflow, and lab-warning triage",
    rollbackPath:
      "Remove classifyLighthouseWarning, warningClassification, and samplePolicy.warningSummary from scripts/performance-evidence.mjs, remove warningClassification validation, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.120",
    date: "2026-06-02",
    type: "patch",
    title: "Performance audit sample policy",
    summary:
      "Updated the performance audit playbook so operators can review the new multi-sample Lighthouse samplePolicy, retained attempts, valid sample count, and median TBT selection strategy from the live operations page.",
    affectedArea:
      "Performance audit playbook, Core Web Vitals operations, Lighthouse evidence review, PageSpeed follow-up workflow, and release regression checks",
    rollbackPath:
      "Remove the multi-sample Lighthouse evidence check from src/content/performance-audit.ts, then revert the related performance-audit test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.119",
    date: "2026-06-02",
    type: "patch",
    title: "Median Lighthouse performance evidence",
    summary:
      "Added multi-sample mobile Lighthouse collection so performance evidence records each attempt, ignores invalid SEO-category samples, and selects the valid median TBT sample for retained artifacts.",
    affectedArea:
      "Mobile Lighthouse evidence, GitHub Actions SEO artifacts, Core Web Vitals operations, PageSpeed follow-up monitoring, and TBT variance triage",
    rollbackPath:
      "Remove samplePolicy, collectSample, failedAttemptSummary, selectedMedianSample, and PERFORMANCE_EVIDENCE_SAMPLE_COUNT from scripts/performance-evidence.mjs, remove samplePolicy validation, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.118",
    date: "2026-06-02",
    type: "patch",
    title: "First-party TBT attribution",
    summary:
      "Added a compact attribution summary to mobile performance evidence so long tasks and script bootup are grouped by homepage document, Next.js chunks, first-party resources, third-party resources, or unattributable work.",
    affectedArea:
      "Mobile Lighthouse evidence, first-party TBT triage, GitHub Actions SEO artifacts, Core Web Vitals operations, and PageSpeed follow-up optimization",
    rollbackPath:
      "Remove attributionSummary, classifyUrl, addAttribution, and summarizeAttribution from scripts/performance-evidence.mjs, remove attributionSummary validation, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.117",
    date: "2026-06-02",
    type: "patch",
    title: "Deferred GA4 idle loader",
    summary:
      "Replaced immediate Next.js GA4 script scheduling with a small dataLayer queue and deferred external gtag.js injection after load, idle time, and a short fallback delay.",
    affectedArea:
      "Privacy-safe analytics, third-party script scheduling, mobile TBT readiness, Core Web Vitals operations, and PageSpeed follow-up optimization",
    rollbackPath:
      "Restore src/features/analytics/GoogleAnalytics.tsx to use Next.js Script with lazyOnload, remove buildDeferredGtagLoaderScript from src/core/analytics/ga.ts, then revert the related analytics test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.116",
    date: "2026-06-02",
    type: "patch",
    title: "Lazy GA4 loading",
    summary:
      "Moved the GA4 loader and config scripts to Next.js lazyOnload strategy so analytics runs after the load event instead of competing with the calculator's first interactive path.",
    affectedArea:
      "Privacy-safe analytics, mobile TBT readiness, GA4 script loading, Core Web Vitals operations, and PageSpeed follow-up optimization",
    rollbackPath:
      "Change the GA4 Script strategy values in src/features/analytics/GoogleAnalytics.tsx back to afterInteractive, then revert the related analytics test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.115",
    date: "2026-06-02",
    type: "patch",
    title: "TBT attribution diagnostics",
    summary:
      "Added compact Lighthouse diagnostics for long tasks, main-thread work, script bootup cost, and third-party main-thread time so TBT review evidence can distinguish page work from lab-runner variance.",
    affectedArea:
      "Mobile Lighthouse evidence, TBT triage, GitHub Actions SEO artifacts, Core Web Vitals operations, and performance review diagnostics",
    rollbackPath:
      "Remove tbtDiagnostics helpers and output from scripts/performance-evidence.mjs, remove tbtDiagnostics assertions from scripts/validate-seo-evidence.mjs, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.114",
    date: "2026-06-02",
    type: "patch",
    title: "Performance review trigger evidence",
    summary:
      "Added explicit reviewTriggers and reviewSummary fields to mobile Lighthouse evidence so CI performance variance identifies the exact metric that needs review before any production UX change.",
    affectedArea:
      "Mobile Lighthouse evidence, PageSpeed follow-up workflow, GitHub Actions SEO artifacts, Core Web Vitals operations, and performance review triage",
    rollbackPath:
      "Remove reviewTriggers and reviewSummary from scripts/performance-evidence.mjs, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.113",
    date: "2026-06-02",
    type: "patch",
    title: "Mobile result density refinement",
    summary:
      "Compressed the mobile result summary and moved secondary result actions after the core estimate so small-screen users see the main tax numbers before share, report, CPA packet, and reset controls.",
    affectedArea:
      "Homepage mobile result density, calculator result hierarchy, Core Web Vitals readiness, action layout, and PageSpeed follow-up optimization",
    rollbackPath:
      "Restore ResultSummary mobile padding, text sizing, and explanatory text visibility, move result actions back into the result header area in HomeCalculatorClient, then revert the related tests, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.112",
    date: "2026-06-02",
    type: "patch",
    title: "Mobile calculator-first layout",
    summary:
      "Moved the homepage workflow explainer cards after the calculator so mobile users reach the input surface sooner, while retaining the educational workflow content below the core calculator experience.",
    affectedArea:
      "Homepage mobile first-screen density, calculator access, Core Web Vitals readiness, educational workflow copy, and PageSpeed follow-up optimization",
    rollbackPath:
      "Move the AI calculator workflow section back above HomeCalculatorClient in src/app/page.tsx, then revert the related performance test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.111",
    date: "2026-06-02",
    type: "patch",
    title: "Mobile glass paint reduction",
    summary:
      "Reduced small-screen first-paint work by disabling backdrop blur and heavy material shadows on the shared card surface and primary navigation until the sm breakpoint, while preserving the desktop glass treatment.",
    affectedArea:
      "Homepage mobile rendering, shared card surface, primary navigation, Core Web Vitals readiness, LCP stability, and PageSpeed follow-up optimization",
    rollbackPath:
      "Restore the shared Card and homepage primary navigation classes to always use shadow-material and backdrop-blur-xl, then revert the related performance test, release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.110",
    date: "2026-06-02",
    type: "patch",
    title: "Mobile LCP paint simplification",
    summary:
      "Simplified the mobile homepage background paint path by removing the large radial gradient under the small-screen breakpoint while preserving the desktop visual treatment, reducing mobile render work without changing calculator behavior, structured data, or YMYL copy.",
    affectedArea:
      "Homepage mobile rendering, Core Web Vitals readiness, LCP stability, visual background paint, PageSpeed follow-up optimization, and regression tests",
    rollbackPath:
      "Remove the max-width 640px background override from src/app/globals.css, revert the homepage performance test, and restore the release note, feature version, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.109",
    date: "2026-06-02",
    type: "patch",
    title: "Homepage calculator client island",
    summary:
      "Converted the homepage back to a server component and moved the interactive calculator workflow into a dedicated HomeCalculatorClient island, keeping JSON-LD, navigation, source copy, FAQ, and footer content server-rendered while reducing first-load JavaScript.",
    affectedArea:
      "Homepage rendering architecture, Core Web Vitals readiness, client bundle size, structured-data rendering, calculator interactivity, and PageSpeed follow-up optimization",
    rollbackPath:
      "Move the HomeCalculatorClient content back into src/app/page.tsx with the previous use client boundary, remove src/app/HomeCalculatorClient.tsx, and revert the related tests, release note, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.108",
    date: "2026-06-02",
    type: "patch",
    title: "Homepage below-fold bundle split",
    summary:
      "Split below-the-fold homepage FAQ, calculation details, and tax-data freshness UI into dynamic chunks while keeping FAQ structured-data items available for JSON-LD, reducing the homepage client bundle without changing calculator behavior or YMYL copy.",
    affectedArea:
      "Homepage Core Web Vitals readiness, client bundle size, FAQ structured data, calculation details loading, tax-data trust UI, and PageSpeed follow-up optimization",
    rollbackPath:
      "Restore static imports for FaqSection, CalculationBreakdown, and TaxDataFreshnessCard in src/app/page.tsx, move FAQ items back into FaqSection if needed, and revert the related tests, release note, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.107",
    date: "2026-06-02",
    type: "patch",
    title: "Mobile performance evidence guard",
    summary:
      "Added a Lighthouse-backed mobile performance evidence command and retained CI artifact file so PageSpeed-style regression checks cover performance score, SEO score, LCP, TBT, and CLS alongside existing production SEO evidence.",
    affectedArea:
      "PageSpeed follow-up workflow, mobile Lighthouse lab evidence, production SEO evidence artifacts, CI performance regression checks, and Core Web Vitals operations",
    rollbackPath:
      "Remove scripts/performance-evidence.mjs, the seo:performance package script, the workflow performance evidence step and artifact file, the validator and manifest references, and the related tests, release note, task, progress, and performance documentation updates.",
  },
  {
    version: "1.0.106",
    date: "2026-06-02",
    type: "patch",
    title: "Blog publication manifest validator",
    summary:
      "Added a manifest validator for retained blog publication packages so archived readiness, final validation, SEO smoke, structured-data, and blog discovery evidence can be checked for required roles, Article/Breadcrumb coverage, byte counts, and SHA-256 hash integrity.",
    affectedArea:
      "Blog publication evidence retention, manifest integrity checks, reviewer handoff validation, release auditability, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/validate-blog-publication-manifest.mjs, the seo:blog-publication-manifest-validate package script, manifest validator references from content operations and blog workflow documentation, and the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.105",
    date: "2026-06-02",
    type: "patch",
    title: "Blog publication evidence manifest",
    summary:
      "Added a blog publication manifest command so each user-approved article release can retain a single inventory of readiness, final validation, production SEO smoke, structured-data, and blog discovery evidence with file sizes and SHA-256 hashes.",
    affectedArea:
      "Blog publication evidence retention, reviewer handoff packages, release auditability, content operations documentation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/generate-blog-publication-manifest.mjs, the seo:blog-publication-manifest package script, manifest references from content operations and blog workflow documentation, and the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.104",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final validation evidence output",
    summary:
      "Added --output support to the final blog publication package validator so approved article release packages can retain blog-final-publication-result.json alongside readiness, structured-data, discovery, and SEO smoke evidence.",
    affectedArea:
      "Blog final publication validation, retained release evidence, reviewer handoff artifacts, content operations documentation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove --output handling from scripts/validate-blog-final-publication.mjs, remove blog-final-publication-result.json references from content operations and blog workflow documentation, and revert the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.103",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final publication package validator",
    summary:
      "Added a final blog publication package validator so approved article releases can verify readiness evidence, manual-review acceptance, production SEO smoke, Article structured data, and blog discovery evidence before being treated as publishable.",
    affectedArea:
      "Blog publication QA automation, retained evidence validation, manual-review stop conditions, structured-data release checks, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/validate-blog-final-publication.mjs, the seo:blog-final-validate package script, its tests, the command references from content operations and blog workflow documentation, and the related release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.102",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final publication review gate",
    summary:
      "Added a visible final publication review gate to the Content Operations Playbook so user-owned blog drafts must retain readiness evidence, resolve manual-review stops, and pass post-deploy discovery and structured-data evidence before AI publishes them.",
    affectedArea:
      "Blog publishing operations, user-owned article approval, YMYL stop conditions, retained readiness evidence, discovery evidence, and release governance",
    rollbackPath:
      "Remove getBlogFinalPublicationReview, the Final publication review section from /content-operations, and the related tests, release note, documentation, task, progress, and content-operations feature version update.",
  },
  {
    version: "1.0.101",
    date: "2026-06-02",
    type: "patch",
    title: "Blog discovery evidence artifact",
    summary:
      "Added a production blog discovery evidence command and retained artifact file that verify every current blog post is discoverable from the blog hub, sitemap, and RSS feed while confirming llms.txt includes the expected recent-guide coverage.",
    affectedArea:
      "Blog publishing discovery, sitemap coverage, RSS coverage, llms.txt evidence, SEO Smoke artifacts, and source-driven content governance",
    rollbackPath:
      "Remove scripts/blog-discovery-evidence.mjs, the seo:blog-discovery package script, the workflow step, blog-discovery-evidence-result.json from the artifact manifest and validator, and the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.100",
    date: "2026-06-02",
    type: "patch",
    title: "Dynamic blog structured-data evidence",
    summary:
      "Changed production structured-data evidence from a hand-maintained blog path list to a source-driven blog slug reader so future blog posts are automatically required to expose Article and BreadcrumbList JSON-LD in retained SEO evidence.",
    affectedArea:
      "Blog Article schema monitoring, production structured-data evidence, SEO artifact validation, future blog publishing automation, and source-driven release governance",
    rollbackPath:
      "Restore the explicit blog path list in scripts/structured-data-evidence.mjs, remove the blog slug reader from the structured-data evidence validator, and revert the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.99",
    date: "2026-06-02",
    type: "patch",
    title: "Blog Article structured-data evidence",
    summary:
      "Expanded the production structured-data evidence command and retained SEO artifact validator to cover existing blog Article pages, requiring Article and BreadcrumbList JSON-LD across the current blog library while preserving the user-owned article writing boundary.",
    affectedArea:
      "Production structured-data evidence, blog Article JSON-LD monitoring, SEO Smoke artifacts, schema validation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove the blog paths from scripts/structured-data-evidence.mjs, lower the structured-data artifact pageCount requirement, remove the blog Article validator branch, and revert the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.98",
    date: "2026-06-02",
    type: "patch",
    title: "Blog link evidence publication guard",
    summary:
      "Added internal-link and official-source-link hard checks to the blog review, readiness, and publication evidence validation commands so user-written drafts must include both site discovery support and source-aligned YMYL trust evidence before publication.",
    affectedArea:
      "Blog draft QA automation, internal linking workflow, official source review, publication evidence validation, and YMYL-safe article release gates",
    rollbackPath:
      "Remove internal_link_presence, official_source_link_presence, linkSummary output, validator requirements, and the related tests, documentation, release note, and content operations copy.",
  },
  {
    version: "1.0.97",
    date: "2026-06-01",
    type: "patch",
    title: "Blog YMYL language publication guard",
    summary:
      "Added a hard YMYL language check to the blog review and readiness commands so drafts are blocked before publication when they contain personalized recommendations, best/optimal claims, guarantees, fake ratings, risk-free claims, or 100% accuracy claims.",
    affectedArea:
      "Blog draft QA automation, user-owned article review, publication evidence validation, content operations workflow, and YMYL-safe article release gates",
    rollbackPath:
      "Remove the no_high_risk_ymyl_language check, ymylRiskMatches output, validator requirement, and related documentation, tests, release note, and content operations copy.",
  },
  {
    version: "1.0.96",
    date: "2026-06-01",
    type: "patch",
    title: "Blog readiness evidence output file",
    summary:
      "Added an --output option to the one-step blog readiness command so publication readiness JSON can be saved directly without shell redirection while still printing the same evidence payload.",
    affectedArea:
      "Blog readiness automation, publication evidence retention, reviewer handoff workflow, content operations playbook, and YMYL-safe article release gates",
    rollbackPath:
      "Remove --output handling from scripts/blog-publication-readiness.mjs and revert the related tests, documentation, release note, and content operations command copy.",
  },
  {
    version: "1.0.95",
    date: "2026-06-01",
    type: "patch",
    title: "Blog readiness publication status",
    summary:
      "Added explicit publicationStatus and manualReviewRequired fields to the one-step blog readiness output so drafts with passing hard checks still pause for editorial review when preferred/manual SEO signals need attention.",
    affectedArea:
      "Blog readiness automation, editorial handoff evidence, content operations workflow, semantic SEO review, and YMYL-safe article publication gates",
    rollbackPath:
      "Remove publicationStatus and manualReviewRequired from scripts/blog-publication-readiness.mjs and revert the matching tests, documentation, release note, and content operations copy.",
  },
  {
    version: "1.0.94",
    date: "2026-06-01",
    type: "patch",
    title: "One-step blog publication readiness check",
    summary:
      "Added a one-step blog readiness command that runs draft SEO review and publication evidence validation together, returning a single JSON payload for quick pre-publication checks without manual redirection.",
    affectedArea:
      "Blog publication QA automation, content operations workflow, user-owned article review, semantic SEO evidence, and YMYL-safe release checks",
    rollbackPath:
      "Remove scripts/blog-publication-readiness.mjs, the seo:blog-ready package script, its tests, and the readiness command references from the blog workflow documentation and content operations page.",
  },
  {
    version: "1.0.93",
    date: "2026-06-01",
    type: "patch",
    title: "Blog publication evidence validator",
    summary:
      "Added a blog publication evidence validator so retained seo:blog-review JSON output can be checked for passing hard checks, semanticSummary evidence, word count, heading structure, and image alt readiness before article release.",
    affectedArea:
      "Blog publication QA automation, retained review evidence, content operations workflow, user-owned article publishing, and YMYL-safe release gates",
    rollbackPath:
      "Remove scripts/validate-blog-publication-evidence.mjs, the seo:blog-evidence-validate package script, its tests, and the evidence validation command from the blog workflow documentation and content operations page.",
  },
  {
    version: "1.0.92",
    date: "2026-06-01",
    type: "patch",
    title: "Semantic blog draft review evidence",
    summary:
      "Expanded the blog draft SEO review command to report heading hierarchy, paragraph structure, H2 outline readiness, and strong-emphasis usage so user-written drafts can be checked against semantic HTML expectations before publication.",
    affectedArea:
      "Blog draft QA automation, semantic HTML review, content operations playbook, user-owned article publishing workflow, and YMYL-safe SEO release checks",
    rollbackPath:
      "Remove the heading_hierarchy hard check, semanticSummary output, paragraph/strong/manual review checks, and matching documentation updates from the blog draft review workflow.",
  },
  {
    version: "1.0.91",
    date: "2026-06-01",
    type: "patch",
    title: "Visible blog review operations workflow",
    summary:
      "Added the user-owned blog draft SEO review gate to the Content Operations Playbook so article drafts have visible hard checks, manual review signals, and AI publication duties before release.",
    affectedArea:
      "Content operations page, blog publishing workflow, SEO review guardrails, YMYL-safe article publication, and release governance",
    rollbackPath:
      "Remove getBlogDraftReviewWorkflow and the Blog Draft SEO Review section from /content-operations, then return the content-operations feature registry version to the previous release.",
  },
  {
    version: "1.0.90",
    date: "2026-06-01",
    type: "patch",
    title: "Blog draft SEO review command",
    summary:
      "Added a local blog draft review command so user-written drafts can be checked for primary keyword placement, word count, heading structure, image alt text, and keyword-density review before engineering publication.",
    affectedArea:
      "User-owned blog writing workflow, SEO review operations, content QA automation, and YMYL-safe publication guardrails",
    rollbackPath:
      "Remove scripts/blog-seo-review.mjs, the seo:blog-review package script, the blog SEO review tests, and the draft command section from the blog authoring SEO review workflow.",
  },
  {
    version: "1.0.89",
    date: "2026-06-01",
    type: "patch",
    title: "Complete guide structured data evidence",
    summary:
      "Completed WebPage and BreadcrumbList structured-data coverage across the existing guide library without changing user-written blog content, then expanded the production evidence check so retained artifacts verify all monitored guide pages.",
    affectedArea:
      "Existing guide pages, structured-data monitoring, production SEO evidence artifacts, release guardrails, and V1.3 semantic SEO implementation",
    rollbackPath:
      "Remove contentWebPageJsonLd from the remaining guide pages, then remove those paths from scripts/structured-data-evidence.mjs and the SEO evidence validator if the evidence scope needs to return to the smaller monitored set.",
  },
  {
    version: "1.0.88",
    date: "2026-06-01",
    type: "patch",
    title: "Expanded guide structured data evidence",
    summary:
      "Expanded priority structured-data evidence to additional YMYL-sensitive guide pages covering NIIT, RMDs, Social Security taxable benefits, and estimated tax review, using source-aligned WebPage and BreadcrumbList schema without adding unsupported recommendation or review markup.",
    affectedArea:
      "Long-tail educational SEO pages, structured-data monitoring, retained production evidence artifacts, and V1.3 semantic SEO guardrails",
    rollbackPath:
      "Remove contentWebPageJsonLd from the NIIT, RMD, Social Security tax, and estimated tax guides, then remove those paths from scripts/structured-data-evidence.mjs and the SEO evidence validator.",
  },
  {
    version: "1.0.87",
    date: "2026-06-01",
    type: "patch",
    title: "Priority page structured data evidence",
    summary:
      "Extended structured-data monitoring beyond the homepage by adding source-aligned WebPage and BreadcrumbList JSON-LD to priority educational pages and requiring those pages in the retained production evidence artifact.",
    affectedArea:
      "Priority SEO pages, IRMAA and ACA education guides, 2026 federal tax brackets page, structured-data evidence automation, and V1.3 semantic SEO guardrails",
    rollbackPath:
      "Remove contentWebPageJsonLd from priority pages, remove the tax-brackets breadcrumb JSON-LD, and return scripts/structured-data-evidence.mjs plus the evidence validator to homepage-only checks.",
  },
  {
    version: "1.0.86",
    date: "2026-06-01",
    type: "patch",
    title: "Structured data evidence artifact",
    summary:
      "Added a production structured-data evidence command and wired it into the SEO Smoke workflow so the retained proof package now checks homepage JSON-LD types, canonical host consistency, fake review fields, unsupported feature claims, and unsafe YMYL phrases before artifact upload.",
    affectedArea:
      "Production SEO evidence automation, homepage structured-data monitoring, GitHub Actions artifacts, and V1.3 semantic structured-data SEO implementation",
    rollbackPath:
      "Remove scripts/structured-data-evidence.mjs, the seo:structured-data package script, the structured data workflow step, and structured-data-evidence-result.json from the evidence validator, manifest, and uploaded artifact.",
  },
  {
    version: "1.0.85",
    date: "2026-06-01",
    type: "patch",
    title: "Homepage semantic landmark audit",
    summary:
      "Added explicit semantic labels and heading associations to the homepage primary navigation, calculator region, input section, results article, and footer while preserving existing layout and calculator behavior.",
    affectedArea: "Homepage semantic HTML, accessibility landmarks, crawler-readable structure, and V1.3 semantic SEO implementation",
    rollbackPath:
      "Remove the added aria-label and aria-labelledby attributes and the homepage semantic landmark test if the page should return to its previous landmark annotations.",
  },
  {
    version: "1.0.84",
    date: "2026-06-01",
    type: "patch",
    title: "Safe homepage structured data graph",
    summary:
      "Added source-aligned WebSite and WebPage JSON-LD to the homepage, strengthened the WebApplication node with canonical IDs and visible feature references, and added structured-data guard tests that block fake ratings, unsupported voice features, non-canonical URLs, and unsafe YMYL phrases.",
    affectedArea: "Homepage structured data, semantic SEO guardrails, JSON-LD test coverage, and V1.3 structured-data implementation",
    rollbackPath:
      "Remove websiteJsonLd, homepageWebPageJsonLd, the added homepage JSON-LD scripts, and the structured-data guard test if the homepage should return to the previous WebApplication/HowTo/Organization-only schema set.",
  },
  {
    version: "1.0.83",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence artifact review checklist",
    summary:
      "Added a visible artifact review checklist to the SEO monitoring playbook so downloaded production-seo-evidence packages are checked for smoke status, GSC priority URL evidence, validator summary, and manifest traceability before Search Console or incident work.",
    affectedArea: "SEO monitoring page, Search Console retry operations, production evidence artifacts, and incident review workflow",
    rollbackPath:
      "Remove buildSeoEvidenceArtifactReview and the SEO evidence artifact review section from /seo-monitoring if downloaded artifact review should return to documentation-only handling.",
  },
  {
    version: "1.0.82",
    date: "2026-05-30",
    type: "patch",
    title: "Self-describing SEO evidence manifest",
    summary:
      "Updated the SEO evidence manifest so the artifact inventory lists all retained files, including the manifest itself as a self-describing generated file, while preserving byte counts for the three source evidence JSON files.",
    affectedArea: "SEO evidence artifact traceability, GitHub Actions proof-package auditability, Search Console retry records, and incident review records",
    rollbackPath:
      "Remove seo-evidence-manifest.json from the manifest file list in scripts/generate-seo-evidence-manifest.mjs if the manifest should only inventory source evidence files.",
  },
  {
    version: "1.0.81",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence manifest",
    summary:
      "Added a machine-readable manifest to the production SEO evidence artifact so each proof package records run metadata, commit identity, event type, retained files, file sizes, production host, and retention window.",
    affectedArea: "GitHub Actions SEO artifact traceability, Search Console evidence packages, incident review, and post-launch audit records",
    rollbackPath:
      "Remove scripts/generate-seo-evidence-manifest.mjs, the seo:evidence-manifest package script, the Generate SEO evidence manifest workflow step, and seo-evidence-manifest.json from the artifact upload path.",
  },
  {
    version: "1.0.80",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence validation summary artifact",
    summary:
      "Added the validator's JSON summary to the production SEO evidence artifact so downloaded proof packages include the smoke output, GSC priority URL evidence, and the machine-readable validation result together.",
    affectedArea: "GitHub Actions artifact contents, Search Console retry evidence, incident review records, and SEO proof-package completeness",
    rollbackPath:
      "Remove seo-evidence-validation-result.json from the SEO Smoke workflow and artifact upload path if the validation summary should no longer be retained.",
  },
  {
    version: "1.0.79",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence artifact validation",
    summary:
      "Added a local and CI validator for production SEO evidence artifacts so uploaded smoke and GSC JSON files are checked for parseability, expected host, priority URL coverage, sitemap inclusion, noindex absence, and fresh lastmod evidence before retention.",
    affectedArea: "GitHub Actions SEO evidence artifacts, Search Console proof packages, CI guardrails, and post-launch operations records",
    rollbackPath:
      "Remove scripts/validate-seo-evidence.mjs, the seo:evidence-validate package script, and the Validate SEO evidence artifact workflow step if artifact validation needs to be disabled.",
  },
  {
    version: "1.0.78",
    date: "2026-05-30",
    type: "patch",
    title: "Sitemap freshness operations playbook",
    summary:
      "Added a visible sitemap freshness evidence section to the SEO monitoring playbook so freshness-critical priority URLs, minimum lastmod dates, GSC evidence output, and CI artifact records are documented for Search Console operations.",
    affectedArea: "SEO monitoring page, V1.3 engineering documentation, Search Console retry workflow, and sitemap freshness evidence",
    rollbackPath:
      "Remove buildSitemapFreshnessEvidence, the sitemap freshness evidence section on /seo-monitoring, and the V1.3 sitemap freshness addendum if this operations documentation needs to be rolled back.",
  },
  {
    version: "1.0.77",
    date: "2026-05-30",
    type: "patch",
    title: "GSC sitemap freshness evidence",
    summary:
      "Extended the GSC priority URL evidence command to parse sitemap entries and fail when recently updated operational, methodology, tax-data, bracket, or homepage URLs lose fresh lastmod coverage.",
    affectedArea: "Search Console evidence automation, sitemap regression detection, priority URL crawl freshness, and production SEO artifacts",
    rollbackPath:
      "Remove the lastmod parsing and freshness assertions from scripts/gsc-evidence.mjs if the evidence check needs to return to sitemap-inclusion-only validation.",
  },
  {
    version: "1.0.76",
    date: "2026-05-30",
    type: "patch",
    title: "Sitemap lastmod freshness",
    summary:
      "Changed static sitemap entries from a single default lastmod date to per-page freshness metadata so recently updated SEO operations, methodology, tax-data, and release-note pages send accurate change signals.",
    affectedArea: "XML sitemap freshness, Search Console discovery signals, static SEO pages, and post-launch crawl evidence",
    rollbackPath:
      "Restore the previous static route array in src/app/sitemap.ts if per-page lastmod metadata needs to be rolled back.",
  },
  {
    version: "1.0.75",
    date: "2026-05-30",
    type: "patch",
    title: "Native Node 24 GitHub Actions",
    summary:
      "Upgraded the production SEO Smoke workflow to native Node 24 GitHub Actions versions for checkout, setup-node, and upload-artifact, removing the temporary forced Node 24 compatibility flag.",
    affectedArea: "GitHub Actions SEO automation, scheduled production evidence checks, dependency installation, and artifact upload runtime compatibility",
    rollbackPath:
      "Restore the previous action versions in .github/workflows/seo-smoke.yml and re-enable the forced Node 24 compatibility flag if a newer action regression appears.",
  },
  {
    version: "1.0.74",
    date: "2026-05-30",
    type: "patch",
    title: "Node 24 SEO workflow readiness",
    summary:
      "Moved the production SEO Smoke workflow to Node 24 and opted GitHub JavaScript actions into the Node 24 runtime so scheduled SEO evidence checks stay stable before GitHub's Node 20 action runtime removal window.",
    affectedArea: "GitHub Actions SEO automation, scheduled production evidence checks, artifact upload, and CI runtime compatibility",
    rollbackPath:
      "Restore the workflow node-version and remove FORCE_JAVASCRIPT_ACTIONS_TO_NODE24 from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.73",
    date: "2026-05-30",
    type: "patch",
    title: "Search Console indexing retry protocol",
    summary:
      "Added a Search Console retry protocol that requires production SEO evidence before URL Inspection retries, limits repeated Request indexing attempts after Google backend errors, and records when failures are Search Console-side rather than site-side.",
    affectedArea: "SEO monitoring playbook, Search Console retry operations, indexing evidence records, and post-launch incident routing",
    rollbackPath:
      "Remove the indexing retry protocol section and buildSearchConsoleRetryProtocol helper from the SEO monitoring playbook.",
  },
  {
    version: "1.0.72",
    date: "2026-05-30",
    type: "patch",
    title: "Downloadable SEO evidence artifacts",
    summary:
      "Updated the production SEO Smoke workflow to save SEO smoke and GSC priority URL evidence JSON outputs as a downloadable GitHub Actions artifact for post-launch records and Search Console retry support.",
    affectedArea: "GitHub Actions evidence retention, Search Console operations, SEO monitoring audit trail, and post-launch proof records",
    rollbackPath:
      "Remove the tee output files and actions/upload-artifact step from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.71",
    date: "2026-05-30",
    type: "patch",
    title: "Automated GSC evidence checks",
    summary:
      "Extended the production SEO Smoke GitHub Actions workflow to run the GSC priority URL evidence command after the regular smoke check, covering status, canonical, sitemap inclusion, and noindex signals on every main push and scheduled run.",
    affectedArea: "GitHub Actions SEO automation, Search Console retry readiness, canonical regression detection, and production monitoring",
    rollbackPath:
      "Remove the GSC_EVIDENCE_BASE_URL environment variable and npm run seo:gsc-evidence step from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.70",
    date: "2026-05-30",
    type: "patch",
    title: "GSC priority URL evidence command",
    summary:
      "Added a repeatable GSC evidence command that checks priority URL status, canonical tags, sitemap inclusion, and noindex signals before Search Console URL Inspection retries; also fixed the methodology page canonical.",
    affectedArea: "Search Console retry evidence, canonical metadata, sitemap verification, and SEO operations guardrails",
    rollbackPath:
      "Remove scripts/gsc-evidence.mjs, the seo:gsc-evidence package command, and the methodology canonical patch if the evidence workflow needs to be rolled back.",
  },
  {
    version: "1.0.69",
    date: "2026-05-30",
    type: "patch",
    title: "Search Console exception queue",
    summary:
      "Added a Search Console exception queue that records domain verification, sitemap submission, and URL Inspection request-indexing outcomes so transient Google workflow issues are separated from actual site crawlability problems.",
    affectedArea: "Search Console operations, indexing evidence, DNS verification routing, and SEO monitoring governance",
    rollbackPath:
      "Remove the exception queue from src/content/seo-monitoring and src/app/seo-monitoring while keeping the submission loop and query opportunity matrix.",
  },
  {
    version: "1.0.68",
    date: "2026-05-30",
    type: "minor",
    title: "Search Console query opportunity matrix",
    summary:
      "Enhanced the SEO monitoring playbook with a Search Console query opportunity matrix that maps calculator, bracket-room, hidden-tax, payment-method, state, filing-status, forms, and CPA handoff queries into safe content actions with compliance or professional review gates.",
    affectedArea: "Post-launch SEO operations, content prioritization, YMYL review routing, and Search Console growth loops",
    rollbackPath:
      "Revert the query opportunity matrix from src/content/seo-monitoring and src/app/seo-monitoring while keeping the base SEO monitoring playbook available.",
  },
  {
    version: "1.0.67",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion QCD guide",
    summary:
      "Added an educational QCD guide covering qualified charitable distribution basics, RMD coordination, why QCDs are not Roth conversions, taxable income assumption review, Form 1099-R and charity acknowledgment records, tax software classification, and calculator boundaries.",
    affectedArea: "Retiree charitable distribution education, RMD coordination, calculator input quality, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-qcd-guide in the feature registry and remove the QCD guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.66",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion recharacterization guide",
    summary:
      "Added an educational recharacterization guide covering the post-2017 Roth conversion recharacterization limit, the difference between conversion and contribution recharacterization, backdoor Roth transaction mapping, Form 8606 and basis records, custodian error review, tax form reconciliation, and calculator boundaries.",
    affectedArea: "Transaction correction education, pre-submission review quality, basis and backdoor Roth recordkeeping, calculator boundary language, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-recharacterization-guide in the feature registry and remove the recharacterization guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.65",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion estimated tax guide",
    summary:
      "Added an educational estimated tax guide covering Form 1040-ES payment review, Roth conversion income payment needs, IRA withholding versus estimated payments, state estimated tax questions, Form 2210 underpayment review, annualized income considerations, and calculator limits.",
    affectedArea: "Tax payment education, withholding and estimated payment review, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-estimated-tax-guide in the feature registry and remove the estimated tax guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.64",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion capital gains guide",
    summary:
      "Added an educational capital gains guide covering long-term capital gains, qualified dividends, ordinary-income stacking from Roth conversion income, Qualified Dividends and Capital Gain Tax Worksheet review, Schedule D records, portfolio events, NIIT overlap, and calculator limits.",
    affectedArea: "Investment-income education, taxable income assumption quality, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-capital-gains-guide in the feature registry and remove the capital gains guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.63",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion NIIT guide",
    summary:
      "Added an educational NIIT guide covering net investment income tax basics, the distinction between Roth conversion income and net investment income, MAGI threshold review, investment income classification, Form 8960 review, and calculator limits.",
    affectedArea: "Investment-income tax education, MAGI assumption quality, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-niit-guide in the feature registry and remove the NIIT guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.62",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion ACA premium tax credit guide",
    summary:
      "Added an educational ACA premium tax credit guide covering Marketplace income estimates, Roth conversion income effects, advance premium tax credit reconciliation, Form 1095-A and Form 8962 records, household and coverage details, and calculator limits.",
    affectedArea: "Marketplace coverage education, subsidy-sensitive income review, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-aca-premium-tax-credit-guide in the feature registry and remove the ACA premium tax credit guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.61",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion IRMAA guide",
    summary:
      "Added an educational IRMAA guide covering Medicare income-related monthly adjustment amount basics, Roth conversion income and MAGI review, lookback-year timing, life-changing event review, Part B and Part D premium context, retiree cash-flow boundaries, and calculator limits.",
    affectedArea: "Medicare premium education, retiree income review, calculator boundary language, professional review preparation, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-irmaa-guide in the feature registry and remove the IRMAA guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.60",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion Social Security tax guide",
    summary:
      "Added an educational Social Security tax guide covering taxable benefit basics, Roth conversion income interactions, IRS Publication 915 worksheet review, retiree scenario review, RMD and IRMAA context, and calculator boundaries for users whose taxable income assumptions may need benefit-tax review.",
    affectedArea: "Retiree education, taxable income assumption quality, calculator boundary language, professional review preparation, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-social-security-tax-guide in the feature registry and remove the Social Security tax guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.59",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion RMD guide",
    summary:
      "Added an educational RMD guide covering required minimum distribution basics, conversion sequencing, the distinction between RMD amounts and eligible conversion amounts, Roth IRA owner lifetime RMD treatment, inherited account review, taxable income assumption updates, and calculator boundaries.",
    affectedArea: "RMD education, conversion sequence review, taxable income assumption quality, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-rmd-guide in the feature registry and remove the RMD guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.58",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion 5-year rules guide",
    summary:
      "Added an educational Roth conversion 5-year rules guide covering qualified distribution clocks, separate conversion-specific 5-year periods, Roth IRA ordering rules, age 59 1/2 and exception review, records to save, and calculator boundaries for later withdrawal treatment.",
    affectedArea: "Roth IRA rule education, withdrawal-treatment boundary language, professional review preparation, recordkeeping guidance, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-five-year-rules-guide in the feature registry and remove the 5-year rules route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.57",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion CPA questions guide",
    summary:
      "Added an educational CPA questions guide covering taxable income verification, after-tax basis and Form 8606 records, IRA aggregation, withholding and estimated tax payment review, state tax assumptions, IRMAA/ACA/NIIT/RMD interaction questions, filing records, and post-filing comparison.",
    affectedArea: "Professional review preparation, compliance boundary reinforcement, calculator assumption quality, tax record handoff, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-cpa-questions-guide in the feature registry and remove the CPA questions route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.56",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion custodian process guide",
    summary:
      "Added an educational custodian process guide covering account eligibility notes, conversion request submission records, outside-funds versus withholding assumptions, confirmation review, 1099-R/5498/8606 reconciliation, CPA handoff packets, and post-process calculator updates.",
    affectedArea: "Operational user education, custodian processing records, tax form reconciliation, privacy-safe workflow guidance, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-custodian-process-guide in the feature registry and remove the custodian process guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.55",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion timeline guide",
    summary:
      "Added an educational Roth conversion timeline guide covering pre-year-end taxable income estimates, custodian processing deadlines, conversion confirmations, estimated tax payment review, 1099-R/5498/8606 reconciliation, CPA review packages, and post-filing comparison.",
    affectedArea: "User planning sequence, year-end deadline education, tax form reconciliation, CPA handoff, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-timeline-guide in the feature registry and remove the timeline guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.54",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion tax forms guide",
    summary:
      "Added an educational tax forms guide covering Form 1099-R, Form 5498, Form 8606, prior-year tax returns, nondeductible IRA contribution records, IRA statements, withholding confirmations, calculator PDFs, CPA question lists, and decision records.",
    affectedArea: "Tax-record education, basis review, CPA handoff preparation, long-tail SEO, and calculator assumption validation",
    rollbackPath:
      "Disable roth-conversion-tax-forms-guide in the feature registry and remove the tax forms guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.53",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion mistakes guide",
    summary:
      "Added an educational guide to common Roth conversion modeling mistakes covering gross income vs taxable income, filing status, state tax assumptions, after-tax basis, IRA balance aggregation, IRMAA/ACA/NIIT/RMD limits, IRA withholding, penalty assumptions, single-scenario decisions, and treating calculator output as advice.",
    affectedArea: "User education, SEO mistake-intent coverage, calculator input quality, compliance boundaries, and CPA review routing",
    rollbackPath:
      "Disable roth-conversion-mistakes-guide in the feature registry and remove the mistakes guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.52",
    date: "2026-05-03",
    type: "minor",
    title: "Calculator assumptions guide",
    summary:
      "Added a plain-English assumptions guide covering filing status, taxable income, state rate, conversion amount, traditional IRA balance, after-tax basis, age, tax payment method, withholding, expected return, retirement age, retirement tax rate, and inflation assumptions.",
    affectedArea: "Calculator onboarding, input comprehension, SEO educational intent, professional review notes, and user completion quality",
    rollbackPath:
      "Disable calculator-assumptions-guide in the feature registry and remove the assumptions guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.51",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion planning checklist",
    summary:
      "Added a pre-calculator Roth conversion planning checklist covering filing status, taxable income, age, state tax assumptions, IRA balance, after-tax basis, conversion amount, tax payment method, return assumptions, model limits, saved scenarios, and professional review planning.",
    affectedArea: "User onboarding, calculator input preparation, SEO checklist intent, professional review flow, and compliance framing",
    rollbackPath:
      "Disable roth-conversion-planning-checklist in the feature registry and remove the planning checklist route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.50",
    date: "2026-05-03",
    type: "minor",
    title: "Privacy data flow playbook",
    summary:
      "Added a privacy and data-flow audit playbook covering local calculator execution, browser storage, share-link hashes, PDF exports, copy summaries, privacy-safe GA4 events, health endpoint payloads, AI request boundaries, sensitive-data blocking, and fallback privacy.",
    affectedArea: "Privacy architecture, browser-local calculation, analytics data minimization, AI API boundaries, and compliance evidence",
    rollbackPath:
      "Disable privacy-data-flow-playbook in the feature registry and remove the privacy-data-flow route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.49",
    date: "2026-05-03",
    type: "minor",
    title: "Feedback roadmap playbook",
    summary:
      "Added a small-version feedback roadmap playbook covering feedback capture, workflow tagging, compliance-risk classification, priority scoring, small-version boundaries, acceptance tests, feature registry rollout, release notes, and follow-up monitoring.",
    affectedArea: "User feedback operations, small-version planning, compliance triage, feature registry releases, and roadmap governance",
    rollbackPath:
      "Disable feedback-roadmap-playbook in the feature registry and remove the feedback-roadmap route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.48",
    date: "2026-05-03",
    type: "minor",
    title: "CPA review checklist",
    summary:
      "Added a professional review handoff checklist for calculator users covering result summaries, scenario assumptions, IRA basis records, tax documents, state assumptions, IRMAA/ACA/model-limit questions, written advisor recommendations, and post-filing recordkeeping.",
    affectedArea: "User handoff workflow, compliance boundary reinforcement, CPA/advisor review preparation, and calculator result usability",
    rollbackPath:
      "Disable cpa-review-checklist in the feature registry and remove the cpa-review-checklist route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.47",
    date: "2026-05-03",
    type: "minor",
    title: "Content operations playbook",
    summary:
      "Added an editorial operations playbook covering GSC query research, keyword-intent mapping, educational drafting, calculator internal links, compliance copy review, disclaimer checks, sitemap coverage, release notes, and refresh/pruning workflows.",
    affectedArea: "SEO content operations, editorial governance, compliance review, internal linking, and content refresh process",
    rollbackPath:
      "Disable content-operations-playbook in the feature registry and remove the content-operations route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.46",
    date: "2026-05-03",
    type: "minor",
    title: "AI compliance audit playbook",
    summary:
      "Added an AI compliance audit playbook covering no-advice prompt boundaries, personalized decision refusals, required disclaimer enforcement, sensitive data blocking, model upgrade regression prompts, static fallback responses, feature shutdown, and unsafe-output incident evidence.",
    affectedArea: "AI assistant compliance governance, model upgrade review, sensitive-data protection, fallback operations, and audit trails",
    rollbackPath:
      "Disable ai-compliance-audit-playbook in the feature registry and remove the ai-compliance-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.45",
    date: "2026-05-03",
    type: "minor",
    title: "Tax data update playbook",
    summary:
      "Added an annual IRS tax-data update playbook covering source review, federal bracket table updates, tax-year freshness messaging, AI knowledge boundaries, calculation regression tests, CPA review evidence, release notes, sitemap submission, and rollback preparation.",
    affectedArea: "Annual tax-data governance, calculator accuracy review, compliance review, SEO freshness, and release rollback",
    rollbackPath:
      "Disable tax-data-update-playbook in the feature registry and remove the tax-data-update route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.44",
    date: "2026-05-03",
    type: "minor",
    title: "Accessibility audit playbook",
    summary:
      "Added a WCAG-focused accessibility audit playbook covering keyboard navigation, visible focus states, screen reader labels, heading hierarchy, chart alternatives, light and dark contrast, reduced motion, mobile input labels, touch targets, and disclaimer readability.",
    affectedArea: "Accessibility QA, Apple-style VoiceOver readiness, mobile form usability, and WCAG 2.1 AA review",
    rollbackPath:
      "Disable accessibility-audit-playbook in the feature registry and remove the accessibility-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.43",
    date: "2026-05-03",
    type: "minor",
    title: "Performance audit playbook",
    summary:
      "Added a Core Web Vitals and Lighthouse audit playbook covering homepage LCP, calculator interaction responsiveness, CLS, SEO landing pages, mobile input ergonomics, navigation wrapping, bundle-size comparison, and static route generation.",
    affectedArea: "Performance operations, Core Web Vitals review, Lighthouse checks, mobile usability, and release regression gates",
    rollbackPath:
      "Disable performance-audit-playbook in the feature registry and remove the performance-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.42",
    date: "2026-05-03",
    type: "minor",
    title: "SEO monitoring playbook",
    summary:
      "Added a post-launch SEO monitoring playbook covering Google Search Console coverage, query impressions and CTR, GA4 privacy-safe events, Core Web Vitals, sitemap coverage, content refresh cadence, and incident rollback review.",
    affectedArea: "Post-launch SEO operations, Google monitoring, content cadence, and rollback governance",
    rollbackPath:
      "Disable seo-monitoring-playbook in the feature registry and remove the seo-monitoring route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.41",
    date: "2026-05-03",
    type: "minor",
    title: "Production launch guide",
    summary:
      "Added a production launch guide covering domain connection, Vercel environment variables, Google Search Console, GA4, sitemap submission, launch verification, health checks, and rollback evidence.",
    affectedArea: "Production deployment, Google launch workflow, operational handoff, and crawl readiness",
    rollbackPath:
      "Disable production-launch-guide in the feature registry and remove the production-launch route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.40",
    date: "2026-05-03",
    type: "minor",
    title: "Site index",
    summary:
      "Added a crawlable human-readable site index covering calculator entry points, education pages, reference pages, compliance pages, operations resources, and machine-readable feeds.",
    affectedArea: "Internal linking, launch review, AI discovery, and Google crawl coverage",
    rollbackPath:
      "Disable site-index in the feature registry and remove the site-index route, sitemap entry, homepage link, and llms.txt link.",
  },
  {
    version: "1.0.39",
    date: "2026-05-03",
    type: "minor",
    title: "Launch readiness checklist",
    summary:
      "Added a production handoff checklist covering domain setup, Google Search Console, analytics, SEO discovery, compliance review, testing evidence, health checks, and rollback readiness.",
    affectedArea: "Launch operations, production handoff, and post-development delivery tracking",
    rollbackPath:
      "Disable launch-readiness-checklist in the feature registry and remove the launch-readiness route, sitemap entry, and homepage link.",
  },
  {
    version: "1.0.38",
    date: "2026-05-03",
    type: "minor",
    title: "Tax interaction SEO pages",
    summary:
      "Added a tax interaction hub and four crawlable pages explaining IRMAA, ACA premium tax credits, NIIT, and RMD limits that the calculator does not model.",
    affectedArea: "Calculator model limits, compliance transparency, and long-tail SEO",
    rollbackPath: "Disable tax-interaction-pages in the feature registry and remove tax-interactions routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.37",
    date: "2026-05-03",
    type: "minor",
    title: "Multi-year planning SEO pages",
    summary:
      "Added a multi-year planning hub and four crawlable educational pages for lump-sum, 2-year, 3-year, and 5-year Roth conversion schedule examples.",
    affectedArea: "Multi-year conversion education, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable multi-year-planning-pages in the feature registry and remove multi-year planning routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.36",
    date: "2026-05-03",
    type: "minor",
    title: "Social preview image",
    summary:
      "Added a local SVG social preview image and wired OpenGraph/Twitter metadata to use a large branded card when links are shared.",
    affectedArea: "Social sharing metadata, OpenGraph previews, and brand consistency",
    rollbackPath: "Disable social-preview-image in the feature registry and remove social image metadata plus the local SVG asset.",
  },
  {
    version: "1.0.35",
    date: "2026-05-03",
    type: "minor",
    title: "LLM text index",
    summary:
      "Added a machine-readable llms.txt index that summarizes the calculator, compliance pages, content hubs, and recent guides for AI search and answer engines.",
    affectedArea: "AI discoverability, content indexing, and machine-readable site navigation",
    rollbackPath: "Disable llms-text-index in the feature registry and remove the llms.txt route plus robots metadata entry.",
  },
  {
    version: "1.0.34",
    date: "2026-05-03",
    type: "minor",
    title: "Basis planning SEO pages",
    summary:
      "Added a basis hub and three crawlable pages for after-tax basis, the pro-rata rule, and Form 8606 concepts with calculator prefill links.",
    affectedArea: "Basis education, pro-rata modeling, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable basis-planning-pages in the feature registry and remove basis routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.33",
    date: "2026-05-03",
    type: "minor",
    title: "Tax payment method SEO pages",
    summary:
      "Added a tax payment method hub and three crawlable pages explaining outside-funds, IRA withholding, and not-sure calculator assumptions with prefilled calculator links.",
    affectedArea: "Penalty-assumption education, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable tax-payment-method-pages in the feature registry and remove tax-payment-method routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.32",
    date: "2026-05-03",
    type: "minor",
    title: "Sitemap priority hints",
    summary:
      "Added sitemap changeFrequency and priority hints so homepage, calculator hubs, keyword pages, and educational content expose clearer crawl importance signals.",
    affectedArea: "Sitemap generation and crawl discovery",
    rollbackPath: "Disable sitemap-priority-hints in the feature registry and remove priority/changeFrequency fields from sitemap entries.",
  },
  {
    version: "1.0.31",
    date: "2026-05-03",
    type: "minor",
    title: "Tax bracket rate SEO pages",
    summary:
      "Added seven crawlable 2026 federal tax-bracket rate pages that show income ranges by filing status and link back to the Roth conversion calculator.",
    affectedArea: "Tax bracket SEO, internal links, and calculator discovery paths",
    rollbackPath: "Disable tax-bracket-rate-pages in the feature registry and remove rate routes, sitemap entries, and bracket-index links.",
  },
  {
    version: "1.0.30",
    date: "2026-05-03",
    type: "minor",
    title: "Social preview metadata",
    summary:
      "Added root Twitter/X summary card metadata so shared links have a consistent title and description preview.",
    affectedArea: "Root SEO metadata and social sharing previews",
    rollbackPath: "Disable social-preview-metadata in the feature registry and remove twitter metadata from the root layout.",
  },
  {
    version: "1.0.29",
    date: "2026-05-03",
    type: "minor",
    title: "Core keyword landing pages",
    summary:
      "Added a calculator landing hub and four root-level keyword pages for Roth IRA conversion, conversion tax, break-even, and 2026 search intents.",
    affectedArea: "High-intent SEO entry points and calculator discovery paths",
    rollbackPath: "Disable keyword-landing-pages in the feature registry and remove calculator keyword routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.28",
    date: "2026-05-02",
    type: "minor",
    title: "PWA install icons",
    summary:
      "Added local SVG app icons and manifest icon entries so the calculator has a stable branded icon when installed or saved to a device home screen.",
    affectedArea: "PWA manifest, Apple home-screen readiness, and install experience",
    rollbackPath: "Disable pwa-install-icons in the feature registry and remove manifest icon entries plus the local SVG assets.",
  },
  {
    version: "1.0.27",
    date: "2026-05-02",
    type: "minor",
    title: "Homepage HowTo structured data",
    summary:
      "Added homepage HowTo and Organization JSON-LD so search engines can better understand calculator usage steps and the publishing entity.",
    affectedArea: "Homepage structured data and technical SEO",
    rollbackPath: "Disable homepage-howto-structured-data in the feature registry or remove the HowTo and Organization JSON-LD scripts from the homepage.",
  },
  {
    version: "1.0.26",
    date: "2026-05-02",
    type: "minor",
    title: "Example scenario SEO pages",
    summary:
      "Added a crawlable examples hub and three prefilled calculator scenario pages for young professional, near-retirement, and estate-planning educational examples.",
    affectedArea: "Scenario presets, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable example-scenario-seo-pages in the feature registry and remove examples routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.25",
    date: "2026-05-02",
    type: "minor",
    title: "Age scenario SEO pages",
    summary:
      "Added a crawlable age-scenario hub and four age-specific Roth conversion calculator pages with calculator prefill links for under 59 1/2, after 59 1/2, near-retirement, and retired scenarios.",
    affectedArea: "Long-tail SEO, age-based calculator entry paths, and educational penalty context",
    rollbackPath: "Disable age-scenario-seo-pages in the feature registry and remove age-scenarios routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.24",
    date: "2026-05-02",
    type: "minor",
    title: "Filing status SEO hub",
    summary:
      "Added a crawlable filing status hub page that links to all four Roth conversion filing-status calculators and exposed it from sitemap and homepage navigation.",
    affectedArea: "Filing status SEO architecture and homepage internal links",
    rollbackPath: "Disable filing-status-hub in the feature registry and remove the /filing-status route, sitemap entry, and homepage links.",
  },
  {
    version: "1.0.23",
    date: "2026-05-02",
    type: "minor",
    title: "Filing status SEO pages",
    summary:
      "Added four crawlable Roth conversion calculator pages for Single, Married Filing Jointly, Married Filing Separately, and Head of Household scenarios with calculator prefill links.",
    affectedArea: "Long-tail SEO and calculator entry paths",
    rollbackPath: "Disable filing-status-seo-pages in the feature registry and remove filing-status routes, content, and sitemap entries.",
  },
  {
    version: "1.0.22",
    date: "2026-05-02",
    type: "minor",
    title: "2026 federal tax brackets page",
    summary:
      "Added a crawlable 2026 federal tax brackets reference page with tables for all filing statuses and calculator CTAs.",
    affectedArea: "Tax data transparency and long-tail SEO",
    rollbackPath: "Disable federal-tax-brackets-page in the feature registry and remove the route, sitemap entry, and homepage links.",
  },
  {
    version: "1.0.21",
    date: "2026-05-02",
    type: "minor",
    title: "Operational health check endpoint",
    summary:
      "Added /api/health with public operational status, tax-year metadata, content counts, and feature counts for uptime monitoring.",
    affectedArea: "Production monitoring and operations",
    rollbackPath: "Disable health-check-endpoint in the feature registry and remove the api/health route and payload builder.",
  },
  {
    version: "1.0.20",
    date: "2026-05-02",
    type: "minor",
    title: "Roth conversion glossary hub",
    summary:
      "Added a glossary index, 16 educational term pages, DefinedTermSet structured data, related-term links, calculator CTAs, and sitemap coverage.",
    affectedArea: "Educational content SEO and user onboarding",
    rollbackPath: "Disable glossary-hub in the feature registry and remove glossary routes, sitemap entries, and homepage glossary links.",
  },
  {
    version: "1.0.19",
    date: "2026-05-02",
    type: "minor",
    title: "Homepage lazy loading",
    summary:
      "Moved non-critical homepage modules such as the projection chart, PDF report button, AI explainer, and analysis tables behind dynamic imports to reduce initial bundle pressure.",
    affectedArea: "Homepage performance and Core Web Vitals readiness",
    rollbackPath: "Disable homepage-lazy-loading in the feature registry and restore the previous static homepage imports.",
  },
  {
    version: "1.0.18",
    date: "2026-05-02",
    type: "minor",
    title: "Blog RSS feed",
    summary:
      "Added a static feed.xml route for blog content distribution and exposed the feed from robots metadata alongside the sitemap.",
    affectedArea: "Content distribution and crawl discovery",
    rollbackPath: "Disable rss-feed in the feature registry and remove the feed.xml route and robots feed entry.",
  },
  {
    version: "1.0.17",
    date: "2026-05-02",
    type: "minor",
    title: "Google Search Console verification",
    summary:
      "Added validated Google site-verification metadata support through NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION for production domain verification.",
    affectedArea: "Root metadata and launch SEO configuration",
    rollbackPath: "Disable search-console-verification in the feature registry and remove metadata.verification from the root layout.",
  },
  {
    version: "1.0.16",
    date: "2026-05-02",
    type: "minor",
    title: "Blog internal linking system",
    summary:
      "Added blog topic groups, related guide links, and calculator CTAs to strengthen crawl paths and user movement from content to the calculator.",
    affectedArea: "Blog hub, blog article pages, internal SEO links",
    rollbackPath: "Disable blog-internal-linking in the feature registry and remove topic groups, related guide links, and calculator CTAs.",
  },
  {
    version: "1.0.15",
    date: "2026-05-02",
    type: "minor",
    title: "Privacy-safe analytics",
    summary:
      "Added optional GA4 loading and calculator-result event tracking that uses financial ranges instead of exact user-entered amounts.",
    affectedArea: "Analytics foundation and homepage calculator telemetry",
    rollbackPath: "Disable privacy-safe-analytics in the feature registry and remove the GA scripts and calculator analytics beacon.",
  },
  {
    version: "1.0.14",
    date: "2026-05-02",
    type: "minor",
    title: "Production readiness checks",
    summary:
      "Added global browser security headers and Playwright operational-readiness coverage for calculator workflows, mobile usability, AI fallback behavior, and SEO pages.",
    affectedArea: "Production deployment configuration and E2E test suite",
    rollbackPath: "Disable production-readiness in the feature registry, remove the global headers, and remove the operational-readiness Playwright spec.",
  },
  {
    version: "1.0.13",
    date: "2026-05-02",
    type: "minor",
    title: "SEO structured content matrix",
    summary:
      "Added Article and Breadcrumb structured data for content pages and expanded the Roth conversion guide library to 12 long-tail educational pages.",
    affectedArea: "Blog SEO, state page SEO, sitemap content depth",
    rollbackPath: "Disable seo-structured-content in the feature registry, remove the JSON-LD scripts, and revert the added blog entries.",
  },
  {
    version: "1.0.12",
    date: "2026-05-02",
    type: "minor",
    title: "AI compliance gateway",
    summary:
      "Added centralized AI request validation, sensitive-data prompt blocking, unsafe-output fallback, API rate limiting, and frontend failure recovery.",
    affectedArea: "AI explainer API and user interface",
    rollbackPath: "Disable the ai-compliance-gateway registry item and route AI requests through the previous guardrails-only flow.",
  },
  {
    version: "1.0.11",
    date: "2026-05-02",
    type: "minor",
    title: "Multi-year conversion schedule",
    summary:
      "Added an educational equal-split schedule table comparing lump-sum, 2-year, 3-year, and 5-year Roth conversion tax-cost timing.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable multi-year-schedule in the feature registry or remove MultiYearScheduleTable from the homepage.",
  },
  {
    version: "1.0.10",
    date: "2026-05-02",
    type: "minor",
    title: "Federal bracket capacity table",
    summary:
      "Added an educational table showing remaining taxable income room and gross conversion capacity for each 2026 federal bracket.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable bracket-capacity in the feature registry or remove FederalBracketCapacityTable from the homepage.",
  },
  {
    version: "1.0.9",
    date: "2026-05-01",
    type: "minor",
    title: "Conversion sensitivity table",
    summary:
      "Added an educational table comparing nearby conversion amounts, upfront cost, break-even estimate, after-tax difference, and federal bracket impact.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable conversion-sensitivity in the feature registry or remove ConversionSensitivityTable from the homepage.",
  },
  {
    version: "1.0.8",
    date: "2026-05-01",
    type: "minor",
    title: "Tax data freshness card",
    summary: "Added visible tax-year, source-scope, and update-window messaging on the homepage and methodology page.",
    affectedArea: "SEO trust content and methodology disclosure",
    rollbackPath: "Remove the TaxDataFreshnessCard mount points and keep the core calculator unchanged.",
  },
  {
    version: "1.0.7",
    date: "2026-05-01",
    type: "minor",
    title: "State-rate calculator prefill links",
    summary: "State SEO pages can now send visitors back to the calculator with the example state tax rate prefilled.",
    affectedArea: "State landing pages and calculator hash restore flow",
    rollbackPath: "Change the state CTA href back to /#calculator.",
  },
  {
    version: "1.0.6",
    date: "2026-05-01",
    type: "minor",
    title: "FAQPage structured data",
    summary: "Homepage FAQ content now powers matching FAQPage JSON-LD for search engine understanding.",
    affectedArea: "Homepage SEO metadata",
    rollbackPath: "Remove the faqJsonLd script from the homepage.",
  },
  {
    version: "1.0.5",
    date: "2026-05-01",
    type: "minor",
    title: "Copy summary",
    summary: "Users can copy an educational result summary with the required disclaimer for CPA review.",
    affectedArea: "Results action toolbar",
    rollbackPath: "Remove CopyResultButton from the results actions.",
  },
];
