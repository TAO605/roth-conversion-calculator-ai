export interface FeedbackRoadmapStep {
  label: string;
  artifact: string;
  detail: string;
}

export interface FeedbackRoadmapGroup {
  id: string;
  title: string;
  goal: string;
  steps: FeedbackRoadmapStep[];
}

function step(label: string, artifact: string, detail: string): FeedbackRoadmapStep {
  return { label, artifact, detail };
}

export function buildFeedbackRoadmapGroups(): FeedbackRoadmapGroup[] {
  return [
    {
      id: "collection",
      title: "Feedback Collection",
      goal: "Capture user requests without losing the context needed for safe prioritization.",
      steps: [
        step(
          "Capture user feedback source",
          "Feedback record",
          "Record whether the request came from email, analytics, GSC query data, CPA feedback, or support notes.",
        ),
        step(
          "Record affected workflow",
          "Feedback record",
          "Tag the request as calculator input, result interpretation, SEO content, AI assistant, export/share, or operations.",
        ),
        step(
          "Preserve user language",
          "Feedback record",
          "Keep the original wording so product, SEO, and compliance reviewers can understand the actual user pain.",
        ),
      ],
    },
    {
      id: "triage",
      title: "Triage and Risk",
      goal: "Separate high-value product signals from requests that would create compliance or calculation risk.",
      steps: [
        step(
          "Classify compliance risk",
          "Priority score",
          "Mark whether the request touches tax advice, investment advice, legal claims, AI output, or exact financial data.",
        ),
        step(
          "Score user impact",
          "Priority score",
          "Rate frequency, severity, SEO value, calculator completion impact, and professional-review value.",
        ),
        step(
          "Identify review owner",
          "Priority score",
          "Assign product, engineering, SEO/editorial, compliance, or CPA review before implementation begins.",
        ),
      ],
    },
    {
      id: "scope",
      title: "Small-Version Scope",
      goal: "Keep feedback-driven releases modular and reversible.",
      steps: [
        step(
          "Confirm small-version boundary",
          "Small-version spec",
          "Verify the change can be implemented in an isolated feature/content module without editing locked calculator logic.",
        ),
        step(
          "Define acceptance tests",
          "Small-version spec",
          "Write tests for the user-visible behavior, sitemap/discovery changes, feature registry entry, and rollback path.",
        ),
        step(
          "Document non-goals",
          "Small-version spec",
          "List what the release will not change, especially core tax formulas, disclaimer language, and AI advice boundaries.",
        ),
      ],
    },
    {
      id: "release",
      title: "Release and Rollout",
      goal: "Ship feedback-driven improvements through the same release controls as the rest of the site.",
      steps: [
        step(
          "Ship behind feature registry",
          "Rollback note",
          "Register the feature with owner area, version, gray rate, and a clear rollback path.",
        ),
        step(
          "Run focused and full verification",
          "Test output",
          "Run targeted tests for the change, then full Vitest and production build before claiming readiness.",
        ),
        step(
          "Update release notes",
          "Rollback note",
          "Record version, affected area, user-facing change, and rollback instructions.",
        ),
      ],
    },
    {
      id: "follow-up",
      title: "Follow-Up and Learning",
      goal: "Close the loop with evidence after a feedback-driven change ships.",
      steps: [
        step(
          "Record user-facing outcome",
          "Outcome note",
          "Document whether the release improved the workflow, reduced confusion, or created follow-up feedback.",
        ),
        step(
          "Monitor usage or SEO signals",
          "Outcome note",
          "Review GA4, GSC, support feedback, or completion signals after launch.",
        ),
        step(
          "Promote repeated requests to roadmap",
          "Roadmap note",
          "If similar requests recur, group them into a larger V2 candidate rather than stacking unrelated micro-changes.",
        ),
      ],
    },
  ];
}

export function getFeedbackRoadmapSummary(groups: FeedbackRoadmapGroup[]) {
  const steps = groups.flatMap((group) => group.steps);

  return {
    totalGroups: groups.length,
    totalSteps: steps.length,
    artifacts: Array.from(new Set(steps.map((step) => step.artifact))),
  };
}
