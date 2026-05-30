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
      label: "Confirm validator summary",
      artifactFile: "seo-evidence-validation-result.json",
      check: "Confirm the retained validator result reports ok: true after checking the smoke and GSC JSON files together.",
      passSignal: "The validation summary records the expected host, checked file count, and no contract failures.",
      useBefore: "Use before attaching the artifact to incident review or a GSC retry note.",
    },
    {
      label: "Confirm manifest traceability",
      artifactFile: "seo-evidence-manifest.json",
      check: "Confirm the manifest records artifactName, gitHubRunId, gitHubSha, gitHubWorkflow, retentionDays, and the retained file list.",
      passSignal: "The manifest includes seo-evidence-manifest.json with selfDescribing: true and records the same run SHA as the workflow.",
      useBefore: "Use before treating the downloaded artifact as the durable proof package for that deployment.",
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
