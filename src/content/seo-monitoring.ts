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

export function getSeoMonitoringSummary(groups: SeoMonitoringGroup[]) {
  const checks = groups.flatMap((group) => group.checks);

  return {
    totalGroups: groups.length,
    totalChecks: checks.length,
    tools: Array.from(new Set(checks.map((check) => check.tool))),
  };
}
