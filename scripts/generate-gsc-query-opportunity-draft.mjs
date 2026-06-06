import fs from "node:fs";
import path from "node:path";
import { validateGscQueryOpportunityRecord } from "./validate-gsc-query-opportunity-record.mjs";

const DEFAULT_TEMPLATE_PATH = "docs/search-console-query-opportunity-template.json";
const DEFAULT_PROPERTY_URL = "https://www.roth-conversion-calculator-ai.shop/";

const CLUSTERS = [
  {
    cluster: "Bracket room questions",
    patterns: [/bracket/i, /next tax bracket/i, /top of bracket/i, /how much can/i],
    intentSummary: "User is modeling bracket capacity and wants educational bracket-room context.",
    targetSurface: "Result summary, /tax-brackets/2026, tax bracket rate pages",
    recommendedAction:
      "Refresh educational bracket-room language, expose tax-year source links, and avoid exact conversion directives.",
    reviewGate: "Professional review required before adding new bracket formulas or tax-year data.",
    riskLevel: "professional",
  },
  {
    cluster: "Hidden tax interaction questions",
    patterns: [/irmaa/i, /aca/i, /subsidy/i, /premium tax credit/i, /social security/i, /niit/i, /rmd/i],
    intentSummary: "User suspects a Roth conversion may affect income-linked taxes, premiums, credits, or RMD planning.",
    targetSurface: "Tax Impact Warnings, IRMAA/ACA/Social Security/NIIT/RMD guides",
    recommendedAction:
      "Prioritize educational warning copy and internal links to deeper guides without estimating unsupported external program amounts.",
    reviewGate: "New interaction logic needs source links, regression tests, and professional review.",
    riskLevel: "professional",
  },
  {
    cluster: "Payment and withholding questions",
    patterns: [/withholding/i, /outside funds/i, /pay.*tax/i, /payment/i],
    intentSummary: "User is comparing how tax payment method changes modeled after-tax value and cash needs.",
    targetSurface: "Tax Payment Method Comparison and /tax-payment-methods pages",
    recommendedAction:
      "Review side-by-side educational payment scenarios and keep penalty or cash-flow items framed as review prompts.",
    reviewGate: "Keep recommendation and optimal-action phrases blocked by the YMYL guard.",
    riskLevel: "review",
  },
  {
    cluster: "State and filing-status questions",
    patterns: [/state/i, /married/i, /filing/i, /jointly/i, /california/i, /texas/i, /florida/i],
    intentSummary: "User needs state-rate or filing-status assumptions reflected without expecting full state-law modeling.",
    targetSurface: "/states, /filing-status, calculator state tax input",
    recommendedAction:
      "Keep state inputs assumption-based, link to state and filing-status pages, and mark non-modeled state rules plainly.",
    reviewGate: "Professional review required before adding state-specific deductions, credits, or exclusions.",
    riskLevel: "professional",
  },
  {
    cluster: "Process, forms, and CPA handoff questions",
    patterns: [/form/i, /8606/i, /1099-r/i, /report/i, /cpa/i, /custodian/i, /timeline/i],
    intentSummary: "User is preparing records, filing review, or an advisor conversation after running an estimate.",
    targetSurface: "CPA packet, forms guide, timeline guide, CPA questions guide",
    recommendedAction:
      "Turn the query into handoff checklists, document lists, or review prompts rather than personalized filing instructions.",
    reviewGate: "No personalized filing instructions without qualified professional review.",
    riskLevel: "review",
  },
  {
    cluster: "Core calculator intent",
    patterns: [/calculator/i, /estimate/i, /tax calculator/i],
    intentSummary: "User wants an immediate Roth conversion estimate with clear assumptions before reading a guide.",
    targetSurface: "Homepage calculator, /calculators, keyword landing pages",
    recommendedAction:
      "Review calculator-first copy, title/meta CTR, and internal links to methodology after the result flow.",
    reviewGate: "Run SEO smoke and YMYL language guard before changing primary calculator copy.",
    riskLevel: "review",
  },
];

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function readJsonIfExists(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function parseMetric(value, field) {
  if (value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${field} must be a non-negative number when supplied.`);
  }

  return parsed;
}

function normalizeCtr(value) {
  const parsed = parseMetric(value, "ctr");

  if (parsed === null) {
    return null;
  }

  return parsed > 1 ? parsed / 100 : parsed;
}

function pickCluster(query) {
  const matched = CLUSTERS.find((cluster) => cluster.patterns.some((pattern) => pattern.test(query)));

  return (
    matched || {
      cluster: "Core calculator intent",
      intentSummary: "User intent needs review against the existing calculator and guide surfaces.",
      targetSurface: "SEO reviewer to map to the closest existing calculator, guide, or operations page",
      recommendedAction:
        "Review the query against existing educational pages before creating new content or changing calculator copy.",
      reviewGate: "SEO and YMYL review required before turning this query into published content work.",
      riskLevel: "review",
    }
  );
}

function loadArtifactEvidence(artifactDir) {
  if (!artifactDir) {
    return {};
  }

  return {
    manifest: readJsonIfExists(path.join(artifactDir, "seo-evidence-manifest.json")),
    validation: readJsonIfExists(path.join(artifactDir, "seo-evidence-validation-result.json")),
  };
}

function buildDraft({
  artifactDir,
  averagePosition,
  clicks,
  ctr,
  dateEnd,
  dateStart,
  evidencePath,
  exportedAt,
  impressions,
  owner,
  query,
  sourceType,
  templatePath,
}) {
  if (!query || !query.trim()) {
    throw new Error("Provide --query from a real GSC Performance row before generating a draft.");
  }

  const template = readJsonIfExists(templatePath);

  if (!template) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const cluster = pickCluster(query);
  const artifact = loadArtifactEvidence(artifactDir);

  const draft = {
    ...template,
    recordStatus: "draft",
    source: {
      ...template.source,
      property: DEFAULT_PROPERTY_URL,
      dateRange: {
        start: dateStart || "",
        end: dateEnd || "",
      },
      exportedAt: exportedAt || new Date().toISOString(),
      sourceType: sourceType || template.source?.sourceType || "manual_gsc_review",
    },
    query: query.trim(),
    metrics: {
      clicks: parseMetric(clicks, "clicks"),
      impressions: parseMetric(impressions, "impressions"),
      ctr: normalizeCtr(ctr),
      averagePosition: parseMetric(averagePosition, "averagePosition"),
    },
    matchedCluster: cluster.cluster,
    intentSummary: cluster.intentSummary,
    targetSurface: cluster.targetSurface,
    recommendedAction: cluster.recommendedAction,
    riskLevel: cluster.riskLevel,
    reviewGate: cluster.reviewGate,
    evidence: {
      screenshotOrExportPath: evidencePath || "",
      productionSeoEvidenceRunId:
        artifact.manifest?.gitHubRunId || template.evidence?.productionSeoEvidenceRunId || "",
      productionSeoEvidenceCommitSha:
        artifact.manifest?.gitHubSha || template.evidence?.productionSeoEvidenceCommitSha || "",
    },
    decision: {
      ...template.decision,
      status: "needs_review",
      owner: owner || template.decision?.owner || "",
      notes:
        "AI drafted cluster, intent, target surface, action, and review gate from the supplied query. Keep recordStatus as draft until reviewer attaches real GSC evidence and accepts the content decision.",
    },
  };

  const validation = validateGscQueryOpportunityRecord(draft);

  return {
    draft,
    generationEvidence: {
      blockingValidatorFailures: validation.failures,
      evidenceType: "gsc-query-opportunity-draft-generation",
      matchedCluster: draft.matchedCluster,
      ok: validation.ok,
      query: draft.query,
      reviewBoundary:
        "This generator only drafts AI-fillable planning fields from a reviewer-supplied query; it does not fetch private Search Console data or create personal tax advice.",
      riskLevel: draft.riskLevel,
    },
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { draft, generationEvidence } = buildDraft({
    artifactDir: args.artifact,
    averagePosition: args.position || args.averagePosition,
    clicks: args.clicks,
    ctr: args.ctr,
    dateEnd: args.end,
    dateStart: args.start,
    evidencePath: args.evidence,
    exportedAt: args.exportedAt,
    impressions: args.impressions,
    owner: args.owner,
    query: args.query,
    sourceType: args.sourceType,
    templatePath: args.template || DEFAULT_TEMPLATE_PATH,
  });
  const output = `${JSON.stringify(draft, null, 2)}\n`;

  if (args.out) {
    fs.writeFileSync(args.out, output, "utf8");
  }

  process.stdout.write(output);

  if (args.evidenceOut) {
    fs.writeFileSync(args.evidenceOut, `${JSON.stringify(generationEvidence, null, 2)}\n`, "utf8");
  }

  if (!generationEvidence.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("generate-gsc-query-opportunity-draft.mjs")) {
  try {
    main();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          evidenceType: "gsc-query-opportunity-draft-generation",
          error: error instanceof Error ? error.message : String(error),
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}

export { buildDraft as buildGscQueryOpportunityDraft, pickCluster as pickGscQueryOpportunityCluster };
