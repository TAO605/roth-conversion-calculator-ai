import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.AI_SECURITY_EVIDENCE_BASE_URL || DEFAULT_BASE_URL,
  };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base-url") {
      args.baseUrl = argv[++index];
    }
  }

  return args;
}

function readSource(repoPath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, repoPath), "utf8");
}

async function fetchHomepage(baseUrl) {
  const response = await fetch(baseUrl);

  return {
    contentSecurityPolicy: response.headers.get("content-security-policy") || "",
    status: response.status,
    xPoweredBy: response.headers.get("x-powered-by") || "",
  };
}

async function postCrossOriginProbe(baseUrl) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/ai/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://example.com",
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
  let reason = "";

  try {
    const payload = await response.json();
    reason = typeof payload.reason === "string" ? payload.reason : "";
  } catch {
    reason = "";
  }

  return {
    provider: response.headers.get("x-ai-provider") || "",
    reason,
    status: response.status,
  };
}

function sourceChecks() {
  const routeSource = readSource("src/app/api/ai/explain/route.ts");
  const nextConfigSource = readSource("next.config.ts");
  const envExampleSource = readSource(".env.example");

  return {
    browserOpenAiConnectBlockedInSource:
      nextConfigSource.includes("connect-src 'self'") && !nextConfigSource.includes("https://api.openai.com"),
    envExampleDoesNotExposeApiKey: !/OPENAI_API_KEY\s*=/.test(envExampleSource) && !/sk-[A-Za-z0-9_-]+/.test(envExampleSource),
    fallbackProviderHeaderRetained: routeSource.includes("X-AI-Provider") && routeSource.includes('"fallback"'),
    originGuardRetained: routeSource.includes("isAllowedAiRequestOrigin") && routeSource.includes("origin_blocked"),
    paidModelFuseRetained:
      routeSource.includes("AI_EXPLAINER_PAID_MODEL_ENABLED") &&
      routeSource.includes('process.env.AI_EXPLAINER_PAID_MODEL_ENABLED === "true"') &&
      routeSource.includes("paidModelEnabled && apiKey"),
    rateLimitRetained: routeSource.includes("createInMemoryRateLimiter") && routeSource.includes("getAiExplainerMaxRequestsPerHour"),
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const source = sourceChecks();
  const homepage = await fetchHomepage(args.baseUrl);
  const crossOriginProbe = await postCrossOriginProbe(args.baseUrl);

  const checks = {
    ...source,
    crossOriginProbeBlocked: crossOriginProbe.status === 403 && crossOriginProbe.provider === "fallback",
    homepageCspBlocksBrowserOpenAi:
      homepage.status === 200 &&
      homepage.contentSecurityPolicy.includes("connect-src 'self'") &&
      !homepage.contentSecurityPolicy.includes("https://api.openai.com"),
  };

  const result = {
    baseUrl: args.baseUrl,
    checks,
    crossOriginProbe,
    evidenceType: "ai-security-evidence",
    fetchedAt: new Date().toISOString(),
    homepage,
    ok: Object.values(checks).every(Boolean),
    privacyBoundary:
      "This evidence uses source inspection plus one cross-origin production probe. It excludes API keys, bearer tokens, cookies, raw IP addresses, account identifiers, provider usage data, and production user request bodies.",
    spendBoundary:
      "This check proves the public endpoint guard and fallback-only source posture. Provider billing or usage consoles remain the source of truth for historical paid-token spend.",
  };

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
        evidenceType: "ai-security-evidence",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
