export interface PrivacyDataFlowCheck {
  label: string;
  dataSurface: string;
  action: string;
  evidence: string;
}

export interface PrivacyDataFlowGroup {
  id: string;
  title: string;
  goal: string;
  checks: PrivacyDataFlowCheck[];
}

function check(label: string, dataSurface: string, action: string, evidence: string): PrivacyDataFlowCheck {
  return { label, dataSurface, action, evidence };
}

export function buildPrivacyDataFlowGroups(): PrivacyDataFlowGroup[] {
  return [
    {
      id: "local-calculation",
      title: "Local Calculation Boundary",
      goal: "Verify calculator math runs in the browser and does not require uploading financial inputs.",
      checks: [
        check(
          "Confirm calculator runs locally",
          "Browser memory",
          "Change all calculator inputs with the network panel open and confirm no calculation request is sent.",
          "Network trace",
        ),
        check(
          "Inspect result recalculation path",
          "Browser memory",
          "Confirm result cards, warnings, charts, and tables update from client-side state.",
          "Code review note",
        ),
        check(
          "Verify no server persistence",
          "Browser memory",
          "Confirm there is no database write for raw conversion amount, income, basis, or account balance.",
          "Architecture note",
        ),
      ],
    },
    {
      id: "browser-storage",
      title: "Browser Storage",
      goal: "Make local convenience features transparent and bounded.",
      checks: [
        check(
          "Review localStorage contents",
          "localStorage",
          "Inspect saved scenario data and confirm it stays in the user's browser.",
          "Storage screenshot",
        ),
        check(
          "Confirm clear local data path",
          "localStorage",
          "Use the reset or clear path and verify cached calculator inputs are removed.",
          "Manual QA note",
        ),
        check(
          "Avoid sensitive identifiers",
          "localStorage",
          "Confirm storage never asks for or stores SSNs, account numbers, names, email addresses, or full tax returns.",
          "Privacy review note",
        ),
      ],
    },
    {
      id: "sharing",
      title: "Sharing and Export",
      goal: "Keep user-controlled sharing explicit and visible.",
      checks: [
        check(
          "Inspect share-link parameters",
          "URL hash",
          "Generate a share link and confirm encoded parameters are placed in the URL hash rather than silently uploaded.",
          "Share link sample",
        ),
        check(
          "Review print-ready report contents",
          "Downloaded HTML report",
          "Confirm report exports contain user-selected inputs, results, methodology notes, source links, and the required disclaimer before saving as PDF from the browser.",
          "Report sample",
        ),
        check(
          "Check copy-summary wording",
          "Clipboard",
          "Confirm copied summaries include educational framing and do not imply professional advice.",
          "Clipboard sample",
        ),
      ],
    },
    {
      id: "analytics",
      title: "Analytics and Monitoring",
      goal: "Measure product use without collecting exact personal financial inputs.",
      checks: [
        check(
          "Verify privacy-safe GA4 events",
          "GA4 event ranges",
          "Confirm analytics use ranges, completion signals, or feature events rather than exact conversion amounts.",
          "GA4 debug view",
        ),
        check(
          "Review health endpoint payload",
          "Public health JSON",
          "Confirm /api/health exposes only public operational metadata and no user data.",
          "Health payload",
        ),
      ],
    },
    {
      id: "ai-api",
      title: "AI API Boundary",
      goal: "Keep AI explanations useful while blocking sensitive data and preserving no-advice rules.",
      checks: [
        check(
          "Block sensitive data before AI requests",
          "Serverless AI route",
          "Send prompts containing SSNs, account numbers, or personal identifiers and confirm they are blocked or sanitized.",
          "AI guardrail test",
        ),
        check(
          "Review AI request payload",
          "Serverless AI route",
          "Confirm AI payloads contain only the minimum calculator context needed for educational explanation.",
          "Payload review",
        ),
        check(
          "Confirm AI fallback privacy",
          "Serverless AI route",
          "Simulate provider failure and confirm fallback responses do not leak prompts, stack traces, or secrets.",
          "Fallback test",
        ),
      ],
    },
  ];
}

export function getPrivacyDataFlowSummary(groups: PrivacyDataFlowGroup[]) {
  const checks = groups.flatMap((group) => group.checks);

  return {
    totalGroups: groups.length,
    totalChecks: checks.length,
    dataSurfaces: Array.from(new Set(checks.map((check) => check.dataSurface))),
  };
}
