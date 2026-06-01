export interface ContentOperationsStep {
  label: string;
  output: string;
  detail: string;
}

export interface ContentOperationsGroup {
  id: string;
  title: string;
  goal: string;
  steps: ContentOperationsStep[];
}

export interface BlogDraftReviewWorkflow {
  command: string;
  evidenceCommand: string;
  ownershipBoundary: string;
  readinessCommand: string;
  hardChecks: string[];
  manualReview: string[];
  publicationDuties: string[];
}

function step(label: string, output: string, detail: string): ContentOperationsStep {
  return { label, output, detail };
}

export function buildContentOperationsGroups(): ContentOperationsGroup[] {
  return [
    {
      id: "research",
      title: "Keyword and User Research",
      goal: "Turn search data and user questions into a controlled editorial queue.",
      steps: [
        step(
          "Collect GSC query opportunities",
          "Keyword brief",
          "Review queries with impressions, low CTR, or missing dedicated pages in Google Search Console.",
        ),
        step(
          "Map keyword intent to page type",
          "Keyword brief",
          "Classify each opportunity as calculator landing page, glossary term, state page, tax interaction, blog guide, or operations page.",
        ),
        step(
          "Prioritize professional-review topics",
          "Editorial queue",
          "Flag tax-sensitive topics such as penalties, basis, RMDs, IRMAA, and tax credits for additional review.",
        ),
      ],
    },
    {
      id: "production",
      title: "Content Production",
      goal: "Create useful pages that support the calculator without making personal recommendations.",
      steps: [
        step(
          "Draft educational copy",
          "Draft page",
          "Write plain-English explanations, assumptions, model limits, and calculator entry paths.",
        ),
        step(
          "Add internal links to calculator",
          "Internal link checklist",
          "Link users back to /#calculator and relevant methodology, glossary, or tax-reference pages.",
        ),
        step(
          "Add metadata and structured data",
          "SEO checklist",
          "Set title, description, canonical path, breadcrumbs, and applicable Article or DefinedTerm data.",
        ),
      ],
    },
    {
      id: "review",
      title: "Editorial and Compliance Review",
      goal: "Protect trust and avoid drifting into tax, financial, legal, or investment advice.",
      steps: [
        step(
          "Run compliance copy review",
          "Compliance review",
          "Remove should/should not recommendations, guarantees, filing instructions, and personalized tax conclusions.",
        ),
        step(
          "Verify disclaimer placement",
          "Compliance review",
          "Confirm the required educational disclaimer appears on calculator-adjacent and tax-sensitive pages.",
        ),
        step(
          "Check source freshness",
          "Source note",
          "Confirm tax-year references, IRS source links, and methodology assumptions match the current release.",
        ),
      ],
    },
    {
      id: "publishing",
      title: "Publishing and Discovery",
      goal: "Ship new pages through the same discoverability and rollback systems as product features.",
      steps: [
        step(
          "Add sitemap coverage",
          "Sitemap diff",
          "Ensure new pages are included in sitemap generation and reachable from at least one hub.",
        ),
        step(
          "Update site index and llms.txt when needed",
          "Discovery diff",
          "Add strategic operations or hub pages to human-readable and AI-readable discovery files.",
        ),
        step(
          "Record release notes",
          "Release note",
          "Document affected area, version, rollback path, and validation evidence.",
        ),
      ],
    },
    {
      id: "refresh",
      title: "Refresh and Pruning",
      goal: "Improve existing pages before adding unnecessary new pages.",
      steps: [
        step(
          "Refresh declining pages",
          "Refresh brief",
          "Use GSC trends to identify pages losing impressions, CTR, or ranking coverage.",
        ),
        step(
          "Consolidate duplicate intent",
          "Content merge note",
          "Merge or redirect overlapping topics when pages compete for the same search intent.",
        ),
        step(
          "Archive content evidence",
          "Content changelog",
          "Save query source, edits made, review notes, and post-update monitoring date.",
        ),
      ],
    },
  ];
}

export function getBlogDraftReviewWorkflow(): BlogDraftReviewWorkflow {
  return {
    command: 'npm run seo:blog-review -- --file path/to/draft.md --keyword "primary keyword"',
    evidenceCommand: "npm run seo:blog-evidence-validate -- blog-review-result.json",
    ownershipBoundary:
      "The user writes or approves the blog article body; AI reviews, formats, validates, and publishes only after approval.",
    readinessCommand: 'npm run seo:blog-ready -- --file path/to/draft.md --keyword "primary keyword"',
    hardChecks: [
      "Primary keyword appears within the first 100 words.",
      "Primary keyword appears within the final 100 words.",
      "Draft has at least 800 words.",
      "Exactly one H1 appears on the page.",
      "Heading levels do not skip from H1 directly to H3 or deeper.",
      "H1 contains the primary keyword.",
      "At least one H2 contains the primary keyword when it reads naturally.",
      "Every uploaded image includes descriptive alt text.",
    ],
    manualReview: [
      "1,500+ words is preferred for blog articles when the topic supports it.",
      "Keyword density target is reviewed as 2% to 4% without keyword stuffing.",
      "H2 sections form the article outline; H3 and H4 support real subsections.",
      "Normal body text is represented as paragraphs, not oversized heading text.",
      "Strong emphasis is reserved for important terms or high-value phrases.",
      "Tax, Medicare, ACA, IRS, and state-tax claims stay source-aligned and educational.",
      "No personalized recommendations, best/optimal claims, guarantees, fake ratings, or 100% accuracy claims.",
    ],
    publicationDuties: [
      "Add metadata, canonical URL, Article JSON-LD, and Breadcrumb JSON-LD from real article data.",
      "Add sitemap, RSS, llms.txt, and internal-link discovery paths when the article is approved.",
      "Retain and validate the blog review JSON evidence before engineering publication.",
      "Use the one-step readiness command for quick pre-publication checks when a retained JSON file is not needed yet.",
      "Run blog review, YMYL language tests, production build, SEO smoke, and structured-data evidence before release.",
    ],
  };
}

export function getContentOperationsSummary(groups: ContentOperationsGroup[]) {
  const steps = groups.flatMap((group) => group.steps);

  return {
    totalGroups: groups.length,
    totalSteps: steps.length,
    outputs: Array.from(new Set(steps.map((step) => step.output))),
  };
}
