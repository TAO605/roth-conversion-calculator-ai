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

function item(label: string, detail: string): LaunchReadinessItem {
  return { label, detail, status: "pending" };
}

export function buildLaunchReadinessGroups(): LaunchReadinessGroup[] {
  return [
    {
      id: "domain",
      title: "Domain and hosting",
      items: [
        item("Production domain", "Replace NEXT_PUBLIC_SITE_URL and sitemap host with the final .com domain."),
        item("Vercel production deployment", "Deploy from the production branch and verify HTTPS, redirects, and environment variables."),
      ],
    },
    {
      id: "analytics",
      title: "Analytics and search console",
      items: [
        item("Google Search Console", "Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION and verify the production domain."),
        item("GA4 measurement ID", "Set NEXT_PUBLIC_GA_MEASUREMENT_ID and confirm privacy-safe calculator events."),
      ],
    },
    {
      id: "seo",
      title: "SEO discovery",
      items: [
        item("Sitemap submission", "Submit /sitemap.xml in Google Search Console after the production domain is live."),
        item("Robots and feeds", "Verify /robots.txt, /feed.xml, /llms.txt, and social preview metadata on production."),
      ],
    },
    {
      id: "compliance",
      title: "Compliance review",
      items: [
        item("Disclaimer review", "Confirm every calculator, AI, and educational page keeps the required disclaimer boundary."),
        item("CPA review", "Have a qualified US tax professional review tax-language scope and 2026 data assumptions."),
      ],
    },
    {
      id: "testing",
      title: "Testing and quality",
      items: [
        item("Unit and integration tests", "Run the full Vitest suite and archive passing output for delivery."),
        item("E2E browser tests", "Install Playwright Chromium and run the operational readiness journey tests."),
        item("Lighthouse audit", "Run production Lighthouse for performance, SEO, accessibility, and best practices."),
      ],
    },
    {
      id: "operations",
      title: "Operations",
      items: [
        item("Health endpoint", "Verify /api/health returns public operational status with no secrets."),
        item("Rollback path", "Confirm release notes and feature registry document rollback paths for small-version modules."),
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
