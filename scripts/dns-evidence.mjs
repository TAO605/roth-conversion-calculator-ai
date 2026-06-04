import dns from "node:dns/promises";

const DEFAULT_APEX_HOST = "roth-conversion-calculator-ai.shop";
const DEFAULT_WWW_HOST = "www.roth-conversion-calculator-ai.shop";
const EXPECTED_VERCEL_CNAME = "cname.vercel-dns.com";
const EXPECTED_CANONICAL_URL = "https://www.roth-conversion-calculator-ai.shop/";
const publicResolver = new dns.Resolver();

publicResolver.setServers(["1.1.1.1", "8.8.8.8"]);

const apexHost = process.env.DNS_EVIDENCE_APEX_HOST || DEFAULT_APEX_HOST;
const wwwHost = process.env.DNS_EVIDENCE_WWW_HOST || DEFAULT_WWW_HOST;
const canonicalUrl = (process.env.DNS_EVIDENCE_CANONICAL_URL || EXPECTED_CANONICAL_URL).replace(/\/?$/, "/");

function normalizeDnsValue(value) {
  return value.replace(/\.$/, "").toLowerCase();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function resolveWithFallback(host, systemResolver, publicResolverFn) {
  try {
    return {
      resolver: "system",
      values: (await systemResolver(host)).map(normalizeDnsValue),
    };
  } catch (systemError) {
    if (systemError?.code === "ENODATA" || systemError?.code === "ENOTFOUND") {
      return {
        resolver: "system",
        values: [],
      };
    }

    try {
      return {
        resolver: "public",
        values: (await publicResolverFn(host)).map(normalizeDnsValue),
      };
    } catch (publicError) {
      publicError.message = `${publicError.message}; system resolver failed first: ${systemError.message}`;
      throw publicError;
    }
  }
}

async function fetchHead(url, redirect) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "roth-conversion-calculator-dns-evidence/1.0",
    },
    method: "HEAD",
    redirect,
  });

  return {
    location: response.headers.get("location") || "",
    status: response.status,
    url,
  };
}

async function run() {
  const apexCnameResult = await resolveWithFallback(
    apexHost,
    (host) => dns.resolveCname(host),
    (host) => publicResolver.resolveCname(host),
  );
  const apexAResult = await resolveWithFallback(
    apexHost,
    (host) => dns.resolve4(host),
    (host) => publicResolver.resolve4(host),
  );
  const wwwCnameResult = await resolveWithFallback(
    wwwHost,
    (host) => dns.resolveCname(host),
    (host) => publicResolver.resolveCname(host),
  );
  const wwwAResult = await resolveWithFallback(
    wwwHost,
    (host) => dns.resolve4(host),
    (host) => publicResolver.resolve4(host),
  );
  const apexCname = apexCnameResult.values;
  const apexA = apexAResult.values;
  const wwwCname = wwwCnameResult.values;
  const wwwA = wwwAResult.values;
  const apexHttps = await fetchHead(`https://${apexHost}/`, "manual");
  const wwwHttps = await fetchHead(canonicalUrl, "follow");

  const expectedCnameRetained =
    apexCname.includes(EXPECTED_VERCEL_CNAME) || wwwCname.includes(EXPECTED_VERCEL_CNAME);
  const apexRedirectsToCanonical = apexHttps.status === 308 && apexHttps.location === canonicalUrl;
  const wwwReturnsOk = wwwHttps.status === 200;

  assert(expectedCnameRetained, "DNS evidence did not retain the expected Vercel CNAME");
  assert(apexA.length > 0 || apexCname.length > 0, "Apex host did not resolve");
  assert(wwwA.length > 0 || wwwCname.length > 0, "www host did not resolve");
  assert(apexRedirectsToCanonical, `Apex HTTPS did not redirect to ${canonicalUrl}`);
  assert(wwwReturnsOk, "Canonical www HTTPS URL did not return 200");

  console.log(
    JSON.stringify(
      {
        apexHost,
        apexHttps,
        apexRecords: {
          a: apexA,
          aResolver: apexAResult.resolver,
          cname: apexCname,
          cnameResolver: apexCnameResult.resolver,
        },
        apexRedirectsToCanonical,
        canonicalUrl,
        expectedCname: EXPECTED_VERCEL_CNAME,
        expectedCnameRetained,
        fetchedAt: new Date().toISOString(),
        ok: true,
        wwwHost,
        wwwHttps,
        wwwRecords: {
          a: wwwA,
          aResolver: wwwAResult.resolver,
          cname: wwwCname,
          cnameResolver: wwwCnameResult.resolver,
        },
        wwwReturnsOk,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(
    JSON.stringify(
      {
        apexHost,
        canonicalUrl,
        error: error instanceof Error ? error.message : String(error),
        ok: false,
        wwwHost,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
