import dns from "node:dns/promises";

const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const DEFAULT_DOMAIN_HOST = "roth-conversion-calculator-ai.shop";
const DEFAULT_EXPECTED_TOKEN = "bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q";
const GOOGLE_SITE_VERIFICATION_PREFIX = "google-site-verification=";
const SPF_PREFIX = "v=spf1";
const publicResolver = new dns.Resolver();

publicResolver.setServers(["1.1.1.1", "8.8.8.8"]);

const baseUrl = (process.env.SEARCH_CONSOLE_VERIFICATION_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const domainHost = process.env.SEARCH_CONSOLE_VERIFICATION_DOMAIN || DEFAULT_DOMAIN_HOST;
const expectedToken = process.env.SEARCH_CONSOLE_VERIFICATION_TOKEN || DEFAULT_EXPECTED_TOKEN;
const expectedTxtRecord = `${GOOGLE_SITE_VERIFICATION_PREFIX}${expectedToken}`;
const expectedCanonicalUrls = [baseUrl, `${baseUrl}/`];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function flattenTxtRecords(records) {
  return records.map((parts) => parts.join(""));
}

function unique(values) {
  return Array.from(new Set(values));
}

async function safeResolveTxt(label, resolverFn, host) {
  try {
    return {
      label,
      ok: true,
      values: flattenTxtRecords(await resolverFn(host)),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      label,
      ok: false,
      values: [],
    };
  }
}

async function resolveTxtEvidence(host) {
  const resolvers = await Promise.all([
    safeResolveTxt("system", (target) => dns.resolveTxt(target), host),
    safeResolveTxt("public", (target) => publicResolver.resolveTxt(target), host),
  ]);
  const values = unique(resolvers.flatMap((resolver) => resolver.values));

  assert(
    values.length > 0 || resolvers.some((resolver) => resolver.ok === true),
    "No TXT records could be resolved from system or public DNS resolvers",
  );

  return {
    resolvers,
    values,
  };
}

function extractMetaVerificationToken(html) {
  const match = html.match(
    /<meta\s+[^>]*(?:name=["']google-site-verification["'][^>]*content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*name=["']google-site-verification["'])[^>]*>/i,
  );

  return match?.[1] || match?.[2] || "";
}

async function fetchHomepageEvidence(url) {
  const response = await fetch(`${url}/`, {
    headers: {
      "user-agent": "roth-conversion-calculator-search-console-verification-evidence/1.0",
    },
    redirect: "follow",
  });
  const html = await response.text();
  const metaToken = extractMetaVerificationToken(html);
  const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] || "";

  return {
    canonical,
    contentType: response.headers.get("content-type") || "",
    htmlMetaVerified: metaToken === expectedToken,
    metaToken,
    status: response.status,
    url: response.url,
  };
}

async function run() {
  const txtRecordsResult = await resolveTxtEvidence(domainHost);
  const txtRecords = txtRecordsResult.values;
  const domainTxtVerified = txtRecords.includes(expectedTxtRecord);
  const spfRecordRetained = txtRecords.some((record) => record.toLowerCase().startsWith(SPF_PREFIX));
  const googleVerificationRecords = txtRecords.filter((record) => record.startsWith(GOOGLE_SITE_VERIFICATION_PREFIX));
  const homepage = await fetchHomepageEvidence(baseUrl);
  const canonicalHostRetained = expectedCanonicalUrls.includes(homepage.canonical);

  assert(domainTxtVerified, "Search Console domain verification TXT token is not visible in DNS");
  assert(spfRecordRetained, "SPF TXT record was not retained alongside Google verification");
  assert(homepage.status === 200, "Homepage did not return HTTP 200 for Search Console verification evidence");
  assert(homepage.htmlMetaVerified, "Homepage Google site verification meta token is missing or mismatched");
  assert(canonicalHostRetained, "Homepage canonical URL did not match the expected production host");

  console.log(
    JSON.stringify(
      {
        baseUrl,
        canonicalHostRetained,
        domainHost,
        domainTxtVerified,
        evidenceScope:
          "Site-side verification evidence only; this does not assert the current Google Search Console UI ownership state.",
        evidenceType: "search-console-verification",
        expectedTxtRecord,
        expectedCanonicalUrls,
        fetchedAt: new Date().toISOString(),
        googleVerificationRecordCount: googleVerificationRecords.length,
        googleVerificationRecords,
        gscUiOwnershipNotAsserted: true,
        homepage,
        ok: true,
        resolverEvidence: txtRecordsResult.resolvers,
        spfRecordRetained,
        txtRecords,
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
        baseUrl,
        domainHost,
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "search-console-verification",
        gscUiOwnershipNotAsserted: true,
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
