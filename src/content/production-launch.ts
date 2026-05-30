export interface ProductionLaunchStep {
  label: string;
  detail: string;
  evidence: string;
}

export interface ProductionLaunchGroup {
  id: string;
  title: string;
  objective: string;
  steps: ProductionLaunchStep[];
}

function step(label: string, detail: string, evidence: string): ProductionLaunchStep {
  return { label, detail, evidence };
}

export function buildProductionLaunchGroups(): ProductionLaunchGroup[] {
  return [
    {
      id: "hosting",
      title: "Hosting and Domain",
      objective: "Move the calculator from local development to a stable HTTPS production URL.",
      steps: [
        step(
          "Connect production domain",
          "Point roth-conversion-calculator-ai.shop and www.roth-conversion-calculator-ai.shop to the Vercel project, with www.roth-conversion-calculator-ai.shop as the canonical host.",
          "Production URL",
        ),
        step(
          "Confirm HTTPS and redirects",
          "Check that HTTP redirects to HTTPS and duplicate hostnames resolve to the canonical domain.",
          "Redirect check",
        ),
        step(
          "Deploy production branch",
          "Use the reviewed production branch or tagged release as the Vercel production deployment source.",
          "Vercel deployment",
        ),
      ],
    },
    {
      id: "environment",
      title: "Environment Variables",
      objective: "Set only launch-safe public variables and keep AI/API secrets server-side.",
      steps: [
        step(
          "Configure Vercel environment variables",
          "Set NEXT_PUBLIC_SITE_URL=https://www.roth-conversion-calculator-ai.shop, NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2YJ3V38RGJ, and NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q.",
          "Environment variable screenshot",
        ),
        step(
          "Verify API key isolation",
          "Confirm model provider keys are only configured as server-side variables and never exposed to client bundles.",
          "Secret review",
        ),
        step(
          "Check production site URL",
          "Open sitemap.xml, robots.txt, feed.xml, llms.txt, and social metadata using the final domain.",
          "Production URL",
        ),
      ],
    },
    {
      id: "google",
      title: "Google Search Setup",
      objective: "Make the site discoverable, measurable, and ready for Google crawling.",
      steps: [
        step(
          "Verify Google Search Console",
          "Create or verify the domain property using the configured site-verification token or DNS verification.",
          "GSC property",
        ),
        step("Submit sitemap.xml", "Submit the production /sitemap.xml URL in Google Search Console.", "GSC sitemap"),
        step(
          "Connect GA4 measurement",
          "Confirm optional GA4 events fire without sending exact financial input values.",
          "GA4 realtime check",
        ),
      ],
    },
    {
      id: "verification",
      title: "Launch Verification",
      objective: "Record proof that the public build is usable, fast, crawlable, and compliant.",
      steps: [
        step("Run full test suite", "Run Vitest after production configuration is finalized.", "Test output"),
        step(
          "Run production build",
          "Run next build and confirm all expected static pages are generated.",
          "Build output",
        ),
        step(
          "Run Lighthouse checks",
          "Measure performance, SEO, accessibility, and best-practices scores against the production URL.",
          "Lighthouse report",
        ),
        step(
          "Review compliance pages",
          "Confirm Privacy, Terms, Disclaimer, About, Editorial Policy, Methodology, and AI disclaimer boundaries are live.",
          "Compliance review notes",
        ),
      ],
    },
    {
      id: "rollback",
      title: "Rollback and Monitoring",
      objective: "Ensure launch issues can be detected and reversed without changing the calculator engine.",
      steps: [
        step(
          "Confirm rollback deployment",
          "Identify the previous stable Vercel deployment and confirm the rollback process before launch traffic ramps.",
          "Rollback URL",
        ),
        step(
          "Check health endpoint",
          "Open /api/health on production and verify public status, feature counts, and tax-year metadata.",
          "Health payload",
        ),
        step(
          "Archive launch evidence",
          "Save domain, GSC, GA4, test, build, Lighthouse, and rollback evidence for handoff.",
          "Launch evidence folder",
        ),
      ],
    },
  ];
}

export function getProductionLaunchSummary(groups: ProductionLaunchGroup[]) {
  const steps = groups.flatMap((group) => group.steps);

  return {
    totalGroups: groups.length,
    totalSteps: steps.length,
    requiredEvidence: Array.from(new Set(steps.map((step) => step.evidence))),
  };
}
