export type LaunchReadinessStatus = "pending" | "complete";

export interface LaunchReadinessItem {
  label: string;
  detail: string;
  status: LaunchReadinessStatus;
}

export interface LaunchReadinessGroup {
  id: string;
  title: string;
  items: LaunchReadinessItem[];
}

function item(label: string, detail: string, status: LaunchReadinessStatus = "pending"): LaunchReadinessItem {
  return { label, detail, status };
}

export function buildLaunchReadinessGroups(): LaunchReadinessGroup[] {
  return [
    {
      id: "domain",
      title: "Domain and hosting",
      items: [
        item(
          "Production domain",
          "Production evidence verifies the canonical www domain, HTTPS, sitemap host, and DNS/canonical checks.",
          "complete",
        ),
        item(
          "Vercel production deployment",
          "GitHub main triggers the production deployment and SEO Smoke waits for the production alias before evidence checks.",
          "complete",
        ),
      ],
    },
    {
      id: "analytics",
      title: "Analytics and search console",
      items: [
        item(
          "Google Search Console",
          "Production evidence verifies the Search Console ownership signal; query-driven content work remains blocked until real query rows appear.",
          "complete",
        ),
        item("GA4 measurement ID", "Set NEXT_PUBLIC_GA_MEASUREMENT_ID and confirm privacy-safe calculator events."),
      ],
    },
    {
      id: "seo",
      title: "SEO discovery",
      items: [
        item(
          "Sitemap submission",
          "Production evidence verifies sitemap availability and crawl discovery; manual GSC submission status remains an external-account review item.",
          "complete",
        ),
        item(
          "Robots and feeds",
          "Production evidence verifies /robots.txt, /feed.xml, /llms.txt, internal links, structured data, and HTML quality.",
          "complete",
        ),
      ],
    },
    {
      id: "compliance",
      title: "Compliance review",
      items: [
        item(
          "Disclaimer review",
          "Automated YMYL, AI guardrail, professional handoff, and report tests verify the educational boundary across calculator surfaces.",
          "complete",
        ),
        item("CPA review", "Have a qualified US tax professional review tax-language scope and 2026 data assumptions."),
      ],
    },
    {
      id: "testing",
      title: "Testing and quality",
      items: [
        item(
          "Unit and integration tests",
          "Full Vitest validation passes and is recorded in progress evidence before production sync.",
          "complete",
        ),
        item(
          "E2E browser tests",
          "Operational readiness browser coverage has passed in prior release rounds and remains guarded by Playwright tests.",
          "complete",
        ),
        item(
          "Lighthouse audit",
          "Production SEO Smoke retains mobile performance evidence with a current performance score in the evidence artifact.",
          "complete",
        ),
      ],
    },
    {
      id: "operations",
      title: "Operations",
      items: [
        item(
          "Health endpoint",
          "Production /api/health returns public status, tax year, content counts, feature counts, and no secret-like fields.",
          "complete",
        ),
        item(
          "Rollback path",
          "Release notes and feature registry entries retain rollback guidance for scoped modules.",
          "complete",
        ),
      ],
    },
  ];
}

export function getLaunchReadinessSummary(groups: LaunchReadinessGroup[]) {
  const items = groups.flatMap((group) => group.items);
  const completed = items.filter((entry) => entry.status === "complete").length;

  return {
    total: items.length,
    completed,
    pending: items.length - completed,
  };
}
