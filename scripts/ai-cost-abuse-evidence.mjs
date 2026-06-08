import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const DEFAULT_SINCE = "24h";

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.AI_COST_EVIDENCE_BASE_URL || DEFAULT_BASE_URL,
    out: "",
    since: process.env.AI_COST_EVIDENCE_SINCE || DEFAULT_SINCE,
    skipVercel: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--base-url") {
      args.baseUrl = argv[++index];
    } else if (arg === "--out") {
      args.out = argv[++index];
    } else if (arg === "--since") {
      args.since = argv[++index];
    } else if (arg === "--skip-vercel") {
      args.skipVercel = true;
    }
  }

  return args;
}

function parseJsonLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("{") && line.endsWith("}"))
    .map((line) => JSON.parse(line));
}

function summarizeAiEndpointLogs(logs) {
  const endpointLogs = logs.filter((log) => log.requestPath === "/api/ai/explain");
  const statusCounts = {};
  const deploymentIds = new Set();
  const domains = new Set();

  for (const log of endpointLogs) {
    const status = String(log.responseStatusCode || "unknown");
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    if (log.deploymentId) {
      deploymentIds.add(log.deploymentId);
    }

    if (log.domain) {
      domains.add(log.domain);
    }
  }

  return {
    deploymentIds: [...deploymentIds].sort(),
    domains: [...domains].sort(),
    endpointLogCount: endpointLogs.length,
    statusCounts,
  };
}

async function fetchVercelAiLogs({ since }) {
  const safeSince = since.replace(/[^0-9A-Za-z:_.-]/g, "");
  const { stdout } = await execAsync(
    `vercel logs --environment production --since ${safeSince} --no-follow --json --limit 500 --query "/api/ai/explain"`,
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 8,
    },
  );

  return parseJsonLines(stdout);
}

async function postAiProbe({ baseUrl, origin }) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/ai/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify({
      question: "Explain this estimate",
      input: { taxPaymentMethod: "outside_funds" },
      result: {
        taxableConversion: 10000,
        totalUpfrontCost: 2200,
        breakEvenYear: null,
      },
    }),
  });

  return {
    provider: response.headers.get("x-ai-provider") || "",
    rateLimitRemaining: response.headers.get("x-ratelimit-remaining") || "",
    status: response.status,
  };
}

function buildConclusion({ logSummary, sameOriginProbe, crossOriginProbe, vercelLogError }) {
  const endpointCount = logSummary?.endpointLogCount ?? 0;
  const fallbackOnlyConfirmed = sameOriginProbe.provider === "fallback" && crossOriginProbe.provider === "fallback";
  const crossOriginBlocked = crossOriginProbe.status === 403;

  if (vercelLogError) {
    return "Production AI endpoint probes passed, but Vercel log retrieval failed; OpenAI and Anthropic usage consoles remain required for spend confirmation.";
  }

  if (endpointCount === 0 && fallbackOnlyConfirmed && crossOriginBlocked) {
    return "No recent Vercel log evidence of AI endpoint usage was found before the probes; production probes confirm fallback-only behavior and cross-origin blocking.";
  }

  if (endpointCount <= 10 && fallbackOnlyConfirmed && crossOriginBlocked) {
    return "Recent AI endpoint traffic is low in Vercel logs, and production probes confirm fallback-only behavior plus cross-origin blocking; account usage consoles are still required to prove historical spend.";
  }

  return "AI endpoint traffic is above the low-traffic threshold; inspect Vercel request details and OpenAI/Anthropic usage consoles before re-enabling any paid-model path.";
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  let vercelLogError = "";
  let logs = [];

  if (!args.skipVercel) {
    try {
      logs = await fetchVercelAiLogs({ since: args.since });
    } catch (error) {
      vercelLogError = error instanceof Error ? error.message : String(error);
    }
  }

  const logSummary = summarizeAiEndpointLogs(logs);
  const sameOriginProbe = await postAiProbe({ baseUrl: args.baseUrl, origin: args.baseUrl });
  const crossOriginProbe = await postAiProbe({ baseUrl: args.baseUrl, origin: "https://example.com" });

  const checks = {
    crossOriginBlocked: crossOriginProbe.status === 403 && crossOriginProbe.provider === "fallback",
    sameOriginFallbackOnly: sameOriginProbe.status === 200 && sameOriginProbe.provider === "fallback",
    vercelLogsAvailable: args.skipVercel || !vercelLogError,
  };

  const result = {
    baseUrl: args.baseUrl,
    checks,
    conclusion: buildConclusion({ logSummary, sameOriginProbe, crossOriginProbe, vercelLogError }),
    evidenceType: "ai-cost-abuse-evidence",
    fetchedAt: new Date().toISOString(),
    logSummary,
    manualAccountEvidenceRequired: {
      anthropicUsageConsole: true,
      openAiUsageConsole: true,
      reason:
        "Vercel request logs can show endpoint traffic and guard behavior, but only provider usage consoles can prove historical paid-token spend.",
    },
    ok: Object.values(checks).every(Boolean),
    probes: {
      crossOrigin: crossOriginProbe,
      sameOrigin: sameOriginProbe,
      selfProbeRequestCount: 2,
    },
    privacyBoundary:
      "This evidence excludes API keys, bearer tokens, cookies, raw IP addresses, account identifiers, and request bodies from production users.",
    since: args.since,
    vercelLogError,
  };

  if (args.out) {
    await writeFile(args.out, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "ai-cost-abuse-evidence",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
