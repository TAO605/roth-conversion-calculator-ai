export interface PerformanceAuditCheck {
  label: string;
  target: string;
  routeSample: string;
  action: string;
}

export interface PerformanceAuditGroup {
  id: string;
  title: string;
  goal: string;
  checks: PerformanceAuditCheck[];
}

function check(label: string, target: string, routeSample: string, action: string): PerformanceAuditCheck {
  return { label, target, routeSample, action };
}

export function buildPerformanceAuditGroups(): PerformanceAuditGroup[] {
  return [
    {
      id: "core-web-vitals",
      title: "Core Web Vitals",
      goal: "Keep the calculator and SEO entry pages inside Google-friendly user experience thresholds.",
      checks: [
        check(
          "Measure LCP on the calculator homepage",
          "LCP under 2.5s",
          "/",
          "Run PageSpeed Insights against the production homepage and inspect the largest rendered element.",
        ),
        check(
          "Check INP-sensitive calculator interactions",
          "INP under 200ms",
          "/#calculator",
          "Change conversion amount, filing status, state rate, and return assumptions while watching interaction delay.",
        ),
        check(
          "Verify layout stability",
          "CLS under 0.1",
          "/",
          "Reload mobile and desktop viewports and confirm charts, lazy panels, and nav wrapping do not shift content unexpectedly.",
        ),
      ],
    },
    {
      id: "page-samples",
      title: "Page Sample Audits",
      goal: "Audit representative route types instead of relying only on the homepage.",
      checks: [
        check(
          "Run Lighthouse on SEO landing pages",
          "Lighthouse SEO over 90",
          "/roth-conversion-tax-calculator",
          "Test one high-intent keyword page and confirm metadata, headings, links, and crawlability remain strong.",
        ),
        check(
          "Audit content hubs",
          "Lighthouse Performance over 90",
          "/site-index",
          "Check a dense internal-linking page for render cost, accessible link text, and crawl depth.",
        ),
        check(
          "Audit blog article template",
          "Lighthouse Accessibility over 90",
          "/blog/what-is-a-roth-conversion-2026",
          "Confirm article pages preserve readable typography, structured data, and calculator CTAs.",
        ),
      ],
    },
    {
      id: "mobile",
      title: "Mobile and Apple-Style UX",
      goal: "Keep the mobile calculator usable for search visitors arriving from phones.",
      checks: [
        check(
          "Verify mobile input ergonomics",
          "No cramped primary inputs",
          "/#calculator",
          "Test numeric inputs, select controls, and result actions on a narrow viewport.",
        ),
        check(
          "Check nav wrapping",
          "No overlapping header links",
          "/",
          "Confirm the expanded SEO navigation wraps cleanly without covering the hero or calculator.",
        ),
        check(
          "Review dark mode contrast",
          "WCAG AA visual contrast",
          "/seo-monitoring",
          "Toggle dark mode and inspect cards, badges, warning panels, and links.",
        ),
      ],
    },
    {
      id: "regression",
      title: "Release Regression Gate",
      goal: "Prevent small content releases from degrading the production calculator experience.",
      checks: [
        check(
          "Compare bundle size after each release",
          "Homepage first load JS remains controlled",
          "/",
          "Read next build output and compare homepage First Load JS with the previous release notes.",
        ),
        check(
          "Confirm static route generation",
          "All expected static routes generated",
          "/sitemap.xml",
          "Run next build and verify the new route appears in the generated route table.",
        ),
        check(
          "Re-run SEO discovery files",
          "robots, sitemap, feed, llms available",
          "/llms.txt",
          "Open robots.txt, sitemap.xml, feed.xml, and llms.txt after deployment.",
        ),
        check(
          "Archive verification output",
          "Fresh test and build evidence",
          "/release-notes",
          "Store Vitest and build output alongside the small-version release record.",
        ),
      ],
    },
  ];
}

export function getPerformanceAuditSummary(groups: PerformanceAuditGroup[]) {
  const checks = groups.flatMap((group) => group.checks);

  return {
    totalGroups: groups.length,
    totalChecks: checks.length,
    targetMetrics: Array.from(new Set(checks.map((check) => check.target))),
  };
}
