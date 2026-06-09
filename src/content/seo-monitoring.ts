export type SeoMonitoringCadence = "daily" | "weekly" | "monthly" | "incident";

export interface SeoMonitoringCheck {
  label: string;
  tool: string;
  cadence: SeoMonitoringCadence;
  action: string;
  escalation: string;
}

export interface SearchConsoleSubmissionStep {
  label: string;
  tool: string;
  action: string;
  evidence: string;
}

export interface SearchConsoleSource {
  label: string;
  url: string;
}

export type SeoOpportunityRisk = "low" | "review" | "professional";

export interface SeoQueryOpportunity {
  cluster: string;
  exampleQueries: string[];
  intent: string;
  targetSurface: string;
  action: string;
  reviewGate: string;
  risk: SeoOpportunityRisk;
}

export interface SearchConsoleException {
  label: string;
  observedStatus: string;
  likelyCause: string;
  nextAction: string;
  retryWindow: string;
  evidenceToRecord: string;
}

export interface SearchConsoleRetryProtocol {
  label: string;
  trigger: string;
  preflight: string;
  action: string;
  stopCondition: string;
  record: string;
}

export interface SitemapFreshnessEvidence {
  label: string;
  path: string;
  minimumLastmod: string;
  validation: string;
  evidence: string;
}

export interface SeoEvidenceArtifactReview {
  label: string;
  artifactFile: string;
  check: string;
  passSignal: string;
  useBefore: string;
}

export interface SearchConsoleIndexingRecordField {
  field: string;
  source: string;
  requiredWhen: string;
  validation: string;
}

export interface SearchConsoleValidationActionRecordField {
  field: string;
  source: string;
  requiredWhen: string;
  validation: string;
}

export interface SearchConsoleValidationFollowUpField {
  field: string;
  source: string;
  requiredWhen: string;
  validation: string;
}

export interface SearchConsoleQueryOpportunityRecordField {
  field: string;
  source: string;
  requiredWhen: string;
  validation: string;
}

export interface SeoMonitoringGroup {
  id: SeoMonitoringCadence;
  title: string;
  goal: string;
  checks: SeoMonitoringCheck[];
}

function check(
  label: string,
  tool: string,
  cadence: SeoMonitoringCadence,
  action: string,
  escalation: string,
): SeoMonitoringCheck {
  return { label, tool, cadence, action, escalation };
}

export function buildSeoMonitoringGroups(): SeoMonitoringGroup[] {
  return [
    {
      id: "daily",
      title: "Daily Launch Watch",
      goal: "Catch indexing, uptime, analytics, and crawl issues during the first launch window.",
      checks: [
        check(
          "Check Google Search Console coverage",
          "Google Search Console",
          "daily",
          "Review indexing status, sitemap fetch state, and newly discovered pages.",
          "If valid pages are excluded unexpectedly, inspect canonical tags, robots rules, and sitemap URLs.",
        ),
        check(
          "Review query impressions and CTR",
          "Google Search Console",
          "daily",
          "Track early impressions for Roth Conversion Calculator, Roth IRA Conversion Calculator, and long-tail pages.",
          "If impressions appear but CTR is weak, review title and meta description clarity.",
        ),
        check(
          "Confirm calculator event flow",
          "GA4",
          "daily",
          "Verify privacy-safe calculator events and page views without sending exact financial inputs.",
          "If events disappear, check NEXT_PUBLIC_GA_MEASUREMENT_ID and production consent/privacy settings.",
        ),
        check(
          "Check health endpoint",
          "Vercel Analytics",
          "daily",
          "Open /api/health and review production status, feature counts, and tax-year metadata.",
          "If the endpoint fails, inspect Vercel deployment status and recent release notes.",
        ),
      ],
    },
    {
      id: "weekly",
      title: "Weekly SEO Review",
      goal: "Improve crawl depth, content coverage, and performance after initial indexing begins.",
      checks: [
        check(
          "Review Core Web Vitals",
          "PageSpeed Insights",
          "weekly",
          "Run production Lighthouse/PageSpeed checks for homepage, calculator hubs, and content hubs.",
          "If LCP, INP, or CLS regresses, review recent UI modules and bundle changes.",
        ),
        check(
          "Audit sitemap coverage",
          "Google Search Console",
          "weekly",
          "Compare submitted sitemap URLs with indexed URLs and inspect important missing routes.",
          "If route groups are missing, confirm static generation, internal links, and canonical metadata.",
        ),
        check(
          "Review internal links",
          "Manual crawl",
          "weekly",
          "Check that site-index, blog, glossary, state, and tax-reference pages link users back to the calculator.",
          "If a cluster is isolated, add a contextual link from a hub page rather than modifying the calculator core.",
        ),
        check(
          "Publish or refresh long-tail content",
          "Editorial calendar",
          "weekly",
          "Add or update educational pages based on GSC query data and user questions.",
          "If a topic touches personal tax decisions, keep content educational and route users to professional review.",
        ),
      ],
    },
    {
      id: "monthly",
      title: "Monthly Growth Review",
      goal: "Use search data to plan content, technical SEO, and product improvements without changing locked core logic.",
      checks: [
        check(
          "Review page clusters",
          "Google Search Console",
          "monthly",
          "Group performance by calculators, blog, glossary, states, tax brackets, basis, and operations pages.",
          "If a cluster underperforms, improve hub copy, internal links, and metadata before creating new features.",
        ),
        check(
          "Inspect crawl stats",
          "Google Search Console",
          "monthly",
          "Review crawl requests, response codes, and large changes in crawl behavior.",
          "If crawl errors spike, compare against recent release notes and Vercel logs.",
        ),
        check(
          "Review dependency and tax-data freshness",
          "Release notes",
          "monthly",
          "Check dependencies, tax-year labels, methodology notes, and IRS update windows.",
          "If tax rules change, route work through a reviewed tax-data update rather than a small content-only release.",
        ),
      ],
    },
    {
      id: "incident",
      title: "Incident Response",
      goal: "Respond quickly when rankings, crawlability, compliance, or production health deteriorates.",
      checks: [
        check(
          "Trigger rollback review",
          "Vercel",
          "incident",
          "Compare the incident time with the latest deployment and feature registry entry.",
          "If a new module caused the issue, disable or roll back that module before changing unrelated code.",
        ),
        check(
          "Freeze risky content changes",
          "Release notes",
          "incident",
          "Pause tax-sensitive copy edits until compliance language and source assumptions are reviewed.",
          "If AI or calculator pages are involved, verify disclaimer visibility and no-advice boundaries first.",
        ),
        check(
          "Document recovery evidence",
          "Launch evidence",
          "incident",
          "Record affected URLs, symptoms, action taken, rollback path, and verification output.",
          "If the same class of incident repeats, convert the finding into a regression test or launch checklist item.",
        ),
      ],
    },
  ];
}

export function buildSearchConsoleSubmissionLoop(): SearchConsoleSubmissionStep[] {
  return [
    {
      label: "Run production SEO smoke before submitting",
      tool: "npm run seo:smoke",
      action:
        "Confirm homepage, canonical, robots.txt, sitemap.xml, llms.txt, trust copy, and high-risk YMYL phrase checks pass before touching Search Console.",
      evidence: "Passing command output",
    },
    {
      label: "Submit or resubmit sitemap.xml",
      tool: "Google Search Console Sitemaps report",
      action:
        "Submit https://www.roth-conversion-calculator-ai.shop/sitemap.xml and confirm Search Console can fetch it without parsing errors.",
      evidence: "Submitted sitemap row and last-read status",
    },
    {
      label: "Run priority URL evidence check",
      tool: "npm run seo:gsc-evidence",
      action:
        "Confirm priority URLs return 200, expose the expected canonical URL, appear in sitemap.xml, and do not send noindex signals before URL Inspection retries.",
      evidence: "Passing JSON output with priority URL status, canonical, sitemap, and noindex fields",
    },
    {
      label: "Inspect priority URLs",
      tool: "Google Search Console URL Inspection",
      action:
        "Inspect homepage, /methodology, /tax-data-update, /tax-brackets/2026, /roth-conversion-irmaa-guide, and /seo-monitoring after major releases.",
      evidence: "Inspection result, Google-selected canonical, and crawl/index state",
    },
    {
      label: "Request indexing only after material changes",
      tool: "Google Search Console URL Inspection",
      action:
        "Use request indexing for newly published or materially updated priority URLs after the live page, canonical, and sitemap are correct.",
      evidence: "Requested indexing confirmation or reason not requested",
    },
    {
      label: "Review Page indexing report",
      tool: "Google Search Console Page indexing report",
      action:
        "Compare indexed, not indexed, discovered, crawled, duplicate, and alternate canonical statuses against sitemap and internal-link expectations.",
      evidence: "Affected URL examples and status trend",
    },
    {
      label: "Record and route exceptions",
      tool: "PROGRESS.md and release notes",
      action:
        "Record affected URLs, status, likely cause, corrective action, and follow-up date; convert repeated issues into tests or smoke checks.",
      evidence: "Progress entry, issue note, or regression guard",
    },
  ];
}

export function getSearchConsoleSources(): SearchConsoleSource[] {
  return [
    {
      label: "Google Search Console Sitemaps report",
      url: "https://support.google.com/webmasters/answer/7451001",
    },
    {
      label: "Google Search Console URL Inspection tool",
      url: "https://support.google.com/webmasters/answer/9012289",
    },
    {
      label: "Google Search Console Page indexing report",
      url: "https://support.google.com/webmasters/answer/7440203",
    },
    {
      label: "Google Search Central sitemap guidance",
      url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
    },
  ];
}

export function buildSearchConsoleOpportunityMatrix(): SeoQueryOpportunity[] {
  return [
    {
      cluster: "Core calculator intent",
      exampleQueries: [
        "roth conversion calculator",
        "roth ira conversion calculator",
        "roth conversion tax calculator 2026",
      ],
      intent: "User wants an immediate estimate and clear assumptions before reading a guide.",
      targetSurface: "Homepage calculator, /calculators, keyword landing pages",
      action:
        "Keep the calculator visible in the first viewport, review title/meta CTR, and route users to methodology after results instead of before calculation.",
      reviewGate: "Run SEO smoke and YMYL language guard before changing primary calculator copy.",
      risk: "review",
    },
    {
      cluster: "Bracket room questions",
      exampleQueries: [
        "how much can i convert without going into the next tax bracket",
        "roth conversion tax bracket calculator",
        "convert to top of bracket",
      ],
      intent: "User is modeling bracket capacity and wants the result translated into a planning range.",
      targetSurface: "Result summary, /tax-brackets/2026, tax bracket rate pages",
      action:
        "Use educational bracket-room language, expose tax-year source links, and avoid phrasing that tells the user what amount to convert.",
      reviewGate: "Professional review required before adding new bracket formulas or tax-year data.",
      risk: "professional",
    },
    {
      cluster: "Hidden tax interaction questions",
      exampleQueries: [
        "roth conversion irmaa impact",
        "roth conversion aca subsidy",
        "roth conversion social security tax",
      ],
      intent: "User suspects a conversion may affect income-linked taxes, premiums, or credits beyond regular brackets.",
      targetSurface: "Tax Impact Warnings, IRMAA/ACA/Social Security/NIIT/RMD guides",
      action:
        "Prioritize review warnings from inputs, link to deeper educational guides, and do not estimate unsupported external program amounts.",
      reviewGate: "New interaction logic needs a dedicated rule engine, source links, and regression tests.",
      risk: "professional",
    },
    {
      cluster: "Payment and withholding questions",
      exampleQueries: [
        "pay roth conversion tax from ira",
        "roth conversion withholding calculator",
        "pay conversion tax with outside funds",
      ],
      intent: "User is comparing how tax payment method changes modeled after-tax value and cash needs.",
      targetSurface: "Tax Payment Method Comparison and /tax-payment-methods pages",
      action:
        "Show side-by-side educational scenarios and document penalty or cash-flow review items without choosing for the user.",
      reviewGate: "Keep recommendation and optimal-action phrases blocked by the YMYL guard.",
      risk: "review",
    },
    {
      cluster: "State and filing-status questions",
      exampleQueries: [
        "roth conversion state tax calculator",
        "roth conversion married filing jointly",
        "roth conversion tax by state",
      ],
      intent: "User needs state-rate and filing-status assumptions reflected without expecting full state tax law modeling.",
      targetSurface: "/states, /filing-status, calculator state tax input",
      action:
        "Keep state inputs assumption-based, link to state and filing-status pages, and mark exclusions plainly where state rules are not modeled.",
      reviewGate: "Professional review required before adding state-specific deductions, credits, or retirement-income exclusions.",
      risk: "professional",
    },
    {
      cluster: "Process, forms, and CPA handoff questions",
      exampleQueries: [
        "roth conversion tax forms",
        "how to report roth conversion",
        "questions to ask cpa about roth conversion",
      ],
      intent: "User is preparing records, filing review, or advisor conversation after running an estimate.",
      targetSurface: "CPA packet, forms guide, timeline guide, CPA questions guide",
      action:
        "Turn these queries into handoff checklists, document lists, and review prompts rather than filing instructions for a specific taxpayer.",
      reviewGate: "No personalized filing instructions without qualified professional review.",
      risk: "review",
    },
  ];
}

export function buildSearchConsoleQueryOpportunityRecordTemplate(): SearchConsoleQueryOpportunityRecordField[] {
  return [
    {
      field: "recordStatus",
      source: "Reviewer",
      requiredWhen: "Always",
      validation:
        "Use docs/search-console-query-opportunity-template.json with recordStatus template before capture, npm run seo:gsc-query-opportunity-draft after a reviewer supplies a real query row, npm run seo:gsc-query-opportunity-ready to list missing reviewer fields, recorded only after a real GSC query row or screenshot is attached, and npm run seo:gsc-query-opportunity-validate before content work begins.",
    },
    {
      field: "source",
      source: "Google Search Console Performance report",
      requiredWhen: "Always",
      validation:
        "Keep the canonical https://www URL-prefix property, date range, exportedAt when available, and sourceType as gsc_performance_export, gsc_screenshot, or manual_gsc_review.",
    },
    {
      field: "query",
      source: "GSC query row",
      requiredWhen: "Draft or recorded status",
      validation:
        "Copy the observed query exactly enough for review, but do not publish private Search Console exports directly on the site.",
    },
    {
      field: "metrics",
      source: "GSC Performance report",
      requiredWhen: "When exported",
      validation:
        "Record clicks, impressions, CTR, and average position as non-negative numbers or null when the screenshot does not show the metric.",
    },
    {
      field: "matchedCluster",
      source: "Query opportunity matrix",
      requiredWhen: "Recorded status",
      validation:
        "Map the query to an existing safe cluster such as core calculator, bracket room, hidden tax interaction, payment, state, or CPA handoff before choosing a content action. The draft generator can prefill this from the reviewer-supplied query, but the reviewer still confirms it before publication work.",
    },
    {
      field: "recommendedAction",
      source: "SEO reviewer",
      requiredWhen: "Recorded status",
      validation:
        "Use educational actions such as metadata review, internal-link update, guide refresh, or professional-review handoff. Do not use best amount, should convert, guaranteed, absolute-accuracy, optimal conversion, or convert exactly phrasing.",
    },
    {
      field: "riskLevel",
      source: "SEO reviewer",
      requiredWhen: "Always",
      validation:
        "Use low, review, or professional. Use professional when the query implies state-specific rules, new formulas, exact tax planning, or unsupported tax interactions.",
    },
    {
      field: "reviewGate",
      source: "Compliance or professional reviewer",
      requiredWhen: "Recorded status",
      validation:
        "Professional-risk records must explicitly retain professional review before content, calculator logic, tax data, or state-specific modeling changes.",
    },
    {
      field: "evidence",
      source: "GSC screenshot or export plus production SEO evidence",
      requiredWhen: "Recorded status",
      validation:
        "Attach screenshotOrExportPath and, when used for production work, link the latest production SEO evidence run id and commit SHA.",
    },
    {
      field: "decision",
      source: "Content operations",
      requiredWhen: "Always",
      validation:
        "Use needs_review, planned, published, deferred, or rejected so query observations become an auditable backlog instead of ad hoc keyword chasing. Run npm run seo:gsc-query-opportunity-backlog to summarize local query records by status, risk, cluster, and next action before content planning.",
    },
  ];
}

export function buildSearchConsoleExceptionQueue(): SearchConsoleException[] {
  return [
    {
      label: "Domain property verification",
      observedStatus:
        "The sc-domain property was not verified because Google found only the SPF TXT record and not the Google verification token.",
      likelyCause:
        "DNS TXT records are incomplete or the verification token was not added as a separate TXT record at the domain provider.",
      nextAction:
        "Continue operating the verified https://www URL-prefix property; fix DNS only when domain-wide reporting is needed.",
      retryWindow: "After DNS is edited, wait for propagation before rechecking the sc-domain property.",
      evidenceToRecord: "Verification method, Google error text, visible TXT records, and provider save timestamp.",
    },
    {
      label: "Sitemap submission",
      observedStatus: "The URL-prefix property accepted /sitemap.xml and reported a successful read on 2026-05-30.",
      likelyCause: "The sitemap is reachable, valid, and tied to the verified canonical host.",
      nextAction:
        "Use the submitted sitemap as the primary discovery surface; review indexed URL count during the daily launch watch.",
      retryWindow: "Resubmit only after sitemap URL count or canonical host changes materially.",
      evidenceToRecord: "Submitted sitemap path, last-read date, status, and discovered URL count.",
    },
    {
      label: "URL Inspection indexing request",
      observedStatus:
        "The /seo-monitoring live test passed as indexable, but two Request indexing attempts returned Google's transient error.",
      likelyCause:
        "Search Console request-indexing endpoint or account/session state failed after the live test, not a site crawlability failure.",
      nextAction:
        "Run npm run seo:gsc-evidence, retry once during the next operations window, and if it fails again let sitemap discovery proceed while Page indexing trends are inspected.",
      retryWindow: "Wait at least several hours before retrying to avoid repeated request-indexing failures.",
      evidenceToRecord: "Inspected URL, live-test result, HTTP status, resource loading result, console messages, and request-indexing response.",
    },
  ];
}

export function buildSearchConsoleRetryProtocol(): SearchConsoleRetryProtocol[] {
  return [
    {
      label: "Confirm the site before touching GSC",
      trigger: "Before any manual URL Inspection retry or after a Search Console backend error.",
      preflight:
        "Run npm run seo:smoke and npm run seo:gsc-evidence; continue only when canonical, sitemap, noindex, and priority URL status checks pass.",
      action:
        "Treat passing evidence as the site-side source of truth and avoid changing calculator, metadata, or sitemap code just because Request indexing failed.",
      stopCondition: "Stop immediately if either command fails and fix the site-side regression first.",
      record: "Command output, affected URL, timestamp, and the failing field if a command fails.",
    },
    {
      label: "Use the verified URL-prefix property",
      trigger: "When inspecting www-host URLs while the domain property remains unverified.",
      preflight:
        "Open the verified https://www URL-prefix property and paste the full canonical URL into URL Inspection.",
      action:
        "Inspect the live page, note the indexed state, Google-selected canonical, and whether live testing reports the URL can be indexed.",
      stopCondition:
        "Do not switch to the sc-domain property until DNS verification is complete and visible in Search Console.",
      record: "Property used, inspected URL, indexed state, live-test result, and canonical result.",
    },
    {
      label: "Retry indexing once per operations window",
      trigger: "A materially updated priority URL is still not indexed or shows Discovered - currently not indexed.",
      preflight:
        "Confirm the URL is in sitemap.xml, linked internally, returns HTTP 200, and has no noindex signal.",
      action:
        "Click Request indexing once. If Google returns a transient submission error, let sitemap discovery continue and schedule the next retry window.",
      stopCondition:
        "Stop after one failed Request indexing attempt in the same operations window to avoid repeating Google backend failures.",
      record:
        "Request indexing response, exact Google error text, retry date, and whether the failure is site-side or Search Console-side.",
    },
    {
      label: "Escalate only when evidence changes",
      trigger: "The same URL remains unindexed across repeated review windows.",
      preflight:
        "Compare Page indexing report status, sitemap last-read date, internal links, server status, and canonical signals.",
      action:
        "Escalate to content depth, internal-linking, or canonical investigation only when Search Console evidence points beyond a transient request-indexing error.",
      stopCondition:
        "Do not rewrite YMYL calculator copy or tax logic unless query data, compliance review, and tests support a specific content need.",
      record: "Page indexing trend, affected URL examples, chosen corrective action, test coverage, and follow-up date.",
    },
  ];
}

export function buildSearchConsoleIndexingRecordTemplate(): SearchConsoleIndexingRecordField[] {
  return [
    {
      field: "recordStatus",
      source: "Reviewer",
      requiredWhen: "Always",
      validation:
        "Use docs/search-console-indexing-record-template.json with recordStatus template before capture, generate a draft with npm run seo:gsc-indexing-record-draft, run npm run seo:gsc-indexing-record-ready to list missing reviewer fields, run npm run seo:gsc-indexing-record-summary after recording, run npm run seo:gsc-indexing-records-manifest to inventory archived evidence, and use recorded only after a real GSC URL Inspection result is copied in.",
    },
    {
      field: "inspectedUrl",
      source: "Google Search Console URL Inspection",
      requiredWhen: "Always",
      validation: "Must be an https URL on www.roth-conversion-calculator-ai.shop.",
    },
    {
      field: "indexingState",
      source: "URL Inspection result",
      requiredWhen: "Recorded status",
      validation:
        "Use the observed state such as indexed, not_on_google, discovered_not_indexed, crawled_not_indexed, alternate_canonical, blocked, or duplicate_without_user_selected_canonical.",
    },
    {
      field: "liveTestState",
      source: "URL Inspection live test",
      requiredWhen: "When live test is run",
      validation: "Use can_be_indexed, cannot_be_indexed, not_run, or unknown.",
    },
    {
      field: "googleSelectedCanonical",
      source: "URL Inspection canonical panel",
      requiredWhen: "Recorded status",
      validation: "Copy the exact Google-selected canonical value or leave empty only when GSC does not show it.",
    },
    {
      field: "requestIndexing",
      source: "Request indexing action",
      requiredWhen: "Every retry window",
      validation:
        "Record attempted, attemptedAt, outcome, and the exact Google message so transient errors do not become site-side regressions.",
    },
    {
      field: "siteEvidence",
      source: "Downloaded production-seo-evidence artifact",
      requiredWhen: "Every recorded status",
      validation:
        "Link the GitHub Actions run id and commit SHA and confirm gscEvidenceOk, searchConsoleVerificationOk, internalLinkEvidenceOk, and htmlQualityEvidenceOk. The draft generator can prefill these from a downloaded production-seo-evidence artifact.",
    },
    {
      field: "screenshots",
      source: "GSC screenshot or exported evidence",
      requiredWhen: "Recorded status",
      validation:
        "Include at least one real screenshot path or URL before treating the record as final evidence. Use the readiness command to confirm no reviewer-supplied GSC fields remain missing, then use the summary command and records manifest for archive or retry notes. Do not infer private GSC status from site-side evidence.",
    },
  ];
}

export function buildSearchConsoleValidationActionRecord(): SearchConsoleValidationActionRecordField[] {
  return [
    {
      field: "evidenceType",
      source: "Sanitized GSC validation action record",
      requiredWhen: "Every Page indexing validation action",
      validation:
        "Use gsc-indexing-validation-action and validate it with npm run seo:gsc-validation-action-validate before syncing the record.",
    },
    {
      field: "gscResult.validationStarted",
      source: "Google Search Console Page indexing issue detail",
      requiredWhen: "After clicking Validate fix",
      validation:
        "Must be true only after the issue detail page visibly changes to Validation started with a retained validationStartDate.",
    },
    {
      field: "siteEvidenceLinked",
      source: "Production technical evidence",
      requiredWhen: "Before and after GSC validation is started",
      validation:
        "Link docs/evidence/gsc-discovered-sample-evidence-2026-06-06.json and require sampleTechnicalEvidenceOk, sampleCount, and siteIndexLinkedSampleCount to match the observed sample URLs.",
    },
    {
      field: "privacyBoundary",
      source: "Reviewer",
      requiredWhen: "Always",
      validation:
        "State that screenshots stay local when they contain account UI and that the public JSON excludes account identifiers, cookies, tokens, raw private UI text, and screenshot paths.",
    },
  ];
}

export function buildSearchConsoleValidationFollowUpRecord(): SearchConsoleValidationFollowUpField[] {
  return [
    {
      field: "sourceValidationAction",
      source: "Sanitized GSC validation action record",
      requiredWhen: "Every follow-up plan",
      validation:
        "Link docs/evidence/gsc-discovered-validation-final-2026-06-06.json so the follow-up plan starts from a validated Validate fix action.",
    },
    {
      field: "followUpPlan",
      source: "Operations reviewer",
      requiredWhen: "After Validation started",
      validation:
        "Record firstReviewDate, secondReviewDate, cadence, and reviewSurface. Validate with npm run seo:gsc-validation-follow-up-validate before treating the issue as scheduled for follow-up.",
    },
    {
      field: "reviewChecklist",
      source: "Search Console Page indexing issue detail plus site-side evidence",
      requiredWhen: "Each GSC follow-up",
      validation:
        "Check validation status, affected URL count, changed sample URLs, and failed samples. If sample URLs change, rerun seo:gsc-discovered-samples before editing site code.",
    },
    {
      field: "blockedActions",
      source: "Google SEO operations boundary",
      requiredWhen: "Always",
      validation:
        "Prevent repeated Validate fix clicks, scaled request-indexing attempts, indexing-status inference from site-side evidence, and syncing account-UI screenshots without explicit approval.",
    },
    {
      field: "privacyBoundary",
      source: "Reviewer",
      requiredWhen: "Always",
      validation:
        "Public follow-up JSON must exclude account identifiers, cookies, tokens, raw private GSC UI text, and screenshot paths.",
    },
  ];
}

export function buildSitemapFreshnessEvidence(): SitemapFreshnessEvidence[] {
  return [
    {
      label: "Homepage calculator",
      path: "/",
      minimumLastmod: "2026-05-30",
      validation: "Must remain fresh after result-positioning, trust-copy, or first-viewport calculator updates.",
      evidence: "`npm run seo:gsc-evidence` returns lastmodFresh: true for the canonical homepage URL.",
    },
    {
      label: "SEO monitoring playbook",
      path: "/seo-monitoring",
      minimumLastmod: "2026-05-30",
      validation: "Must remain fresh after Search Console retry, exception, or evidence-loop changes.",
      evidence: "CI artifact `production-seo-evidence` includes the parsed sitemap lastmod for /seo-monitoring.",
    },
    {
      label: "Methodology page",
      path: "/methodology",
      minimumLastmod: "2026-05-30",
      validation: "Must remain fresh after methodology, canonical, or tax-data source disclosure changes.",
      evidence: "`npm run seo:gsc-evidence` verifies canonical, sitemap inclusion, noindex absence, and lastmodFresh.",
    },
    {
      label: "Tax-data update playbook",
      path: "/tax-data-update",
      minimumLastmod: "2026-05-30",
      validation: "Must remain fresh when tax-year update operations or IRS-source review workflows change.",
      evidence: "The sitemap entry is parsed directly instead of relying on a broad text match.",
    },
    {
      label: "2026 tax brackets",
      path: "/tax-brackets/2026",
      minimumLastmod: "2026-05-30",
      validation: "Must remain fresh after bracket-data, bracket-room, or tax-year reference updates.",
      evidence: "Search Console retry work must use the latest passing GSC evidence JSON before manual URL Inspection.",
    },
  ];
}

export function buildSeoEvidenceArtifactReview(): SeoEvidenceArtifactReview[] {
  return [
    {
      label: "Confirm production smoke status",
      artifactFile: "seo-smoke-result.json",
      check: "Open the downloaded production-seo-evidence artifact and confirm the smoke result has ok: true for the canonical production host.",
      passSignal: "Homepage, robots.txt, sitemap.xml, llms.txt, canonical host, and trust-copy checks all pass.",
      useBefore: "Use before any Search Console sitemap resubmission or URL Inspection retry.",
    },
    {
      label: "Confirm priority URL crawl signals",
      artifactFile: "gsc-evidence-result.json",
      check: "Review the priority URL array for statusCode, canonicalUrl, inSitemap, noindex, sitemapLastmod, and lastmodFresh fields.",
      passSignal: "Every priority URL returns HTTP 200, appears in sitemap.xml, has no noindex signal, and keeps lastmodFresh: true where required.",
      useBefore: "Use before deciding whether an indexing delay is site-side or Search Console-side.",
    },
    {
      label: "Confirm discovered sample URL signals",
      artifactFile: "gsc-discovered-sample-evidence-result.json",
      check:
        "Review the GSC discovered-not-indexed sample URLs for HTTP status, canonical URL, sitemap inclusion, /site-index internal discovery, noindex status, lastmod, and title coverage.",
      passSignal:
        "The evidence has ok: true, failureCount: 0, sourceIssueState: discovered_not_indexed, siteIndex.linkedSampleCount equal to resultCount, and every sample URL returns 200, appears in sitemap.xml, is linked from /site-index, has no noindex signal, and keeps a self-canonical URL.",
      useBefore:
        "Use before deciding whether a discovered-not-indexed cluster needs a site-side canonical/sitemap fix or should remain in Google crawl-priority monitoring.",
    },
    {
      label: "Confirm GSC validation action record",
      artifactFile: "docs/evidence/gsc-discovered-validation-final-2026-06-06.json",
      check:
        "Review the sanitized Page indexing validation action record after clicking Validate fix in Google Search Console.",
      passSignal:
        "The record validates with npm run seo:gsc-validation-action-validate, has evidenceType: gsc-indexing-validation-action, action: validate_fix_started, validationStarted: true, validationStartDate, affectedUrlCount, sampleTechnicalEvidenceOk: true, siteIndexLinkedSampleCount matching sampleCount, and a privacyBoundary excluding account identifiers, cookies, tokens, raw private UI text, and screenshot paths.",
      useBefore:
        "Use before treating the GSC Discovered - currently not indexed issue as in validation, before syncing evidence to GitHub, or before scheduling the next GSC follow-up.",
    },
    {
      label: "Confirm GSC validation follow-up plan",
      artifactFile: "docs/evidence/gsc-discovered-validation-follow-up-2026-06-06.json",
      check:
        "Review the sanitized follow-up plan after the Page indexing validation action starts, before checking GSC again.",
      passSignal:
        "The record validates with npm run seo:gsc-validation-follow-up-validate, has evidenceType: gsc-indexing-validation-follow-up, validation start date, first and second review dates, allowed outcomes, blocked repeated Validate fix actions, linked sample evidence, linked validation-action evidence, and a privacyBoundary excluding account identifiers, cookies, tokens, raw private UI text, and screenshot paths.",
      useBefore:
        "Use before returning to GSC after Validation started, before recording validation passed or failed, or before deciding whether changed samples need new site-side evidence.",
    },
    {
      label: "Confirm Search Console verification signals",
      artifactFile: "search-console-verification-evidence-result.json",
      check:
        "Review the site-side Search Console verification evidence after Google property, DNS, or HTML verification changes.",
      passSignal:
        "The evidence has ok: true, domainTxtVerified: true, htmlMetaVerified: true, spfRecordRetained: true, canonicalHostRetained: true, and gscUiOwnershipNotAsserted: true so reviewers know this proves public DNS and HTML signals, not the private Search Console UI ownership state.",
      useBefore:
        "Use before retrying domain property verification, switching between URL-prefix and domain properties, or diagnosing Search Console ownership warnings.",
    },
    {
      label: "Confirm DNS and canonical host routing",
      artifactFile: "dns-evidence-result.json",
      check:
        "Review DNS and HTTPS evidence for the apex host and canonical www host after domain-provider changes or Vercel domain warnings.",
      passSignal:
        "The DNS evidence has ok: true, expectedCnameRetained: true, apexRedirectsToCanonical: true, wwwReturnsOk: true, apex HTTPS status 308, and canonical www HTTPS status 200.",
      useBefore: "Use before changing DNS records, resubmitting sitemap.xml, or diagnosing Search Console host verification warnings.",
    },
    {
      label: "Confirm production security headers",
      artifactFile: "security-headers-evidence-result.json",
      check:
        "Review the live production response headers for CSP, HSTS, nosniff, referrer policy, permissions policy, frame ancestors, base URI, form action, and framework fingerprinting.",
      passSignal:
        "The security headers evidence has ok: true, securityHeadersOk: true, contentSecurityPolicyRetained: true, hstsRetained: true, nosniffRetained: true, frameAncestorsNone: true, baseUriSelf: true, formActionSelf: true, permissionsPolicyRetained: true, referrerPolicyRetained: true, and noPoweredByHeader: true.",
      useBefore: "Use before security, privacy, launch-readiness, or YMYL trust reviews.",
    },
    {
      label: "Confirm production health endpoint",
      artifactFile: "health-evidence-result.json",
      check:
        "Review the live /api/health evidence for HTTP status, no-store cache control, tax-year metadata, content counts, enabled feature counts, pending professional-review status, and secret-key exposure checks.",
      passSignal:
        "The health evidence has ok: true, healthEndpointOk: true, statusOk: true, cacheNoStoreRetained: true, taxYearRetained: true, taxDataLastUpdatedRetained: true, professionalReviewPending: true, blogCoverageRetained: true, glossaryCoverageRetained: true, enabledFeatureCoverageRetained: true, and noSecretLikeKeys: true.",
      useBefore: "Use before launch-readiness, uptime, privacy, or production incident reviews.",
    },
    {
      label: "Confirm crawl discovery endpoints",
      artifactFile: "crawl-discovery-evidence-result.json",
      check:
        "Review robots.txt, sitemap.xml, feed.xml, and llms.txt evidence for status, canonical host coverage, URL counts, RSS item counts, and AI-discovery coverage.",
      passSignal:
        "The crawl discovery evidence has ok: true, robotsDiscoveryRetained: true, sitemapUrlCountRetained: true, sitemapCanonicalHostRetained: true, sitemapRequiredPathsRetained: true, feedItemsRetained: true, feedBlogCoverageRetained: true, llmsCoreCoverageRetained: true, llmsBoundaryRetained: true, sitemap.urlCount at least 120, and feed.itemCount at least 13.",
      useBefore: "Use before sitemap resubmission, crawl-discovery incident review, RSS checks, or AI-search discovery review.",
    },
    {
      label: "Confirm internal link health",
      artifactFile: "internal-link-evidence-result.json",
      check:
        "Review sitemap URL health and site-index coverage to confirm production internal discovery pages return HTTP 200, retain the canonical host, avoid noindex, and expose core internal links.",
      passSignal:
        "The internal link evidence has ok: true, allSitemapUrlsOk: true, canonicalHostRetained: true, noNoindexRetained: true, sitemapUrlHealthRetained: true, siteIndexInternalLinksRetained: true, siteIndexCorePathsRetained: true, sitemap.checkedUrlCount at least 120, and siteIndex.internalLinkCount at least 100.",
      useBefore: "Use before diagnosing crawl-depth, orphan-page, sitemap-health, or Search Console discovered-not-indexed issues.",
    },
    {
      label: "Confirm HTML quality signals",
      artifactFile: "html-quality-evidence-result.json",
      check:
        "Review production HTML quality evidence for HTTP 200 status, html lang, one H1 per page, title and meta description coverage, canonical tags, image alt text, button names, and form labels.",
      passSignal:
        "The HTML quality evidence has ok: true, pageStatusRetained: true, htmlLangRetained: true, singleH1Retained: true, titleRetained: true, metaDescriptionRetained: true, canonicalRetained: true, imageAltRetained: true, buttonNameRetained: true, formLabelRetained: true, pageCount at least 120, and maxFailureCount: 0.",
      useBefore: "Use before diagnosing HTML SEO, accessibility, page-template, or rich-result eligibility regressions.",
    },
    {
      label: "Confirm professional review packet",
      artifactFile: "professional-review-packet-evidence-result.json",
      check:
        "Review the professional review packet evidence before changing public review status or sending the site to a CPA, EA, or qualified tax professional.",
      passSignal:
        "The professional review packet evidence has ok: true, pageStatusOk: true, pageTermsRetained: true, sitemapRetained: true, llmsRetained: true, healthPendingReviewRetained: true, taxYearRetained: true, and professionalReviewPacketOk: true in the validator summary.",
      useBefore: "Use before professional review handoff, tax-data signoff, or changing review-pending language.",
    },
    {
      label: "Confirm private evidence boundary",
      artifactFile: "privacy-evidence-boundary-result.json",
      check:
        "Review the GitHub main evidence scan before syncing private GSC screenshots, account UI images, or docs/evidence image files.",
      passSignal:
        "The privacy boundary evidence has ok: true, privacyEvidenceBoundaryOk: true, repository: TAO605/roth-conversion-calculator-ai, branch: main, allowlistRetained: true, gitignoreRulesRetained: true, remotePrivateEvidenceCount: 2, approvedRemotePrivateEvidenceCount: 2, unapprovedRemotePrivateEvidenceCount: 0, and privacyUnapprovedRemoteEvidenceCount: 0.",
      useBefore:
        "Use before syncing evidence to GitHub, attaching Search Console screenshots to public records, or reviewing private/public evidence boundaries.",
    },
    {
      label: "Confirm AI endpoint security guard",
      artifactFile: "ai-security-evidence-result.json",
      check:
        "Review the CI-safe AI endpoint security evidence after AI route, CSP, rate-limit, or environment-default changes.",
      passSignal:
        "The AI security evidence has ok: true, aiSecurityOk: true, paidModelFuseRetained: true, originGuardRetained: true, rateLimitRetained: true, fallbackProviderHeaderRetained: true, envExampleSecretHygieneRetained: true, crossOriginProbeBlocked: true, crossOriginProbeStatus: 403, crossOriginProbeProvider: fallback, crossOriginProbeReason: origin_blocked, and homepageCspBlocksBrowserOpenAi: true.",
      useBefore:
        "Use before diagnosing API-key abuse, changing AI explainer model settings, or treating short site visits as paid provider spend evidence.",
    },
    {
      label: "Confirm AI verifier regression stats",
      artifactFile: "ai-verifier-regression-evidence-result.json",
      check:
        "Review deterministic AI verifier pass, fail, and fallback evidence after AI route, verifier, disclaimer, or model-fuse changes.",
      passSignal:
        "The AI verifier regression evidence has ok: true, aiVerifierRegressionOk: true, aiVerifierRegressionScenarioCount: 6, statsPanel.totalFixtures: 6, statsPanel.passFixtures: 1, statsPanel.failFixtures: 4, statsPanel.fallbackFixtures: 1, deterministicCoverage: pass/fail/fallback, routeFailsClosedToFallback: true, and sameOriginFallbackProbeRetained: true.",
      useBefore:
        "Use before enabling paid-model explainer output, reviewing AI compliance changes, or treating model-generated explanations as production-safe.",
    },
    {
      label: "Confirm validator summary",
      artifactFile: "seo-evidence-validation-result.json",
      check:
        "Confirm the retained validator result reports ok: true after checking smoke, GSC priority URLs, GSC discovered samples, DNS, security headers, health, crawl discovery, internal links, HTML quality, professional review packet, performance, structured data, blog discovery, professional UI evidence, private evidence boundary, AI security evidence, and AI verifier regression evidence together.",
      passSignal:
        "The validation summary records the expected host, gscDiscoveredSampleCount, searchConsoleVerificationOk: true, dnsCanonicalOk: true, securityHeadersOk: true, healthEndpointOk: true, crawlDiscoveryUrlCount, internalLinkCheckedUrlCount, htmlQualityPageCount, professionalReviewPacketOk: true, professionalUiScannedFileCount, privacyEvidenceBoundaryOk: true, privacyUnapprovedRemoteEvidenceCount: 0, aiSecurityOk: true, aiVerifierRegressionOk: true, aiVerifierRegressionScenarioCount: 6, and no contract failures.",
      useBefore: "Use before attaching the artifact to incident review or a GSC retry note.",
    },
    {
      label: "Confirm professional UI source guard",
      artifactFile: "professional-ui-evidence-result.json",
      check: "Confirm the retained UI source guard scanned src/app and src/features for old glass-template surface classes.",
      passSignal: "The professional UI evidence has ok: true, scannedFileCount above zero, violationCount: 0, and an empty violations array.",
      useBefore: "Use before approving UI, route, or component changes as compliant with the no-glass professional surface system.",
    },
    {
      label: "Confirm manifest traceability",
      artifactFile: "seo-evidence-manifest.json",
      check: "Confirm the manifest records artifactName, artifactSchemaVersion, generatedAt, eventName, gitHubRepository, gitHubServerUrl, gitHubRunId, gitHubRunAttempt, gitHubRunUrl, gitHubSha, gitHubCommitUrl, gitHubWorkflow, retentionDays, retained file names, byte sizes, and sha256 checksums for each source evidence file. Re-run npm run seo:evidence-manifest-validate after downloading the artifact.",
      passSignal: "The manifest includes artifactSchemaVersion, a valid generatedAt ISO timestamp, an allowed eventName, the expected gitHubRepository, the expected gitHubServerUrl, direct GitHub run and commit provenance URLs that match gitHubRunId and gitHubSha, a retained gitHubWorkflow and numeric gitHubRunAttempt for Actions runs, sha256 for every retained source evidence file, includes seo-evidence-manifest.json with selfDescribing: true, includes seo-evidence-manifest-validation-result.json with postManifestValidation: true, records the same run SHA as the workflow, and the checksum validator returns ok: true.",
      useBefore: "Use before treating the downloaded artifact as the durable proof package for that deployment.",
    },
    {
      label: "Confirm manifest checksum validation result",
      artifactFile: "seo-evidence-manifest-validation-result.json",
      check: "Open the retained manifest checksum validation result after downloading the production-seo-evidence artifact.",
      passSignal:
        "The validation result has ok: true, generatedAtRetained: true, gitHubProvenanceConsistent: true, gitHubRepositoryRetained: true, gitHubServerUrlRetained: true, gitHubWorkflowRetained: true, runAttemptRetained: true, checkedFileCount: 19, sha256CheckedCount: 19, manifestFileCount: 21, and manifestValidationResultRetained: true.",
      useBefore: "Use before relying on the manifest checksum contract in Search Console retry notes or incident review.",
    },
  ];
}

export function getSeoMonitoringSummary(groups: SeoMonitoringGroup[]) {
  const checks = groups.flatMap((group) => group.checks);

  return {
    totalGroups: groups.length,
    totalChecks: checks.length,
    tools: Array.from(new Set(checks.map((check) => check.tool))),
  };
}
