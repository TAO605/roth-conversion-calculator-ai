const DEFAULT_URL = "https://www.roth-conversion-calculator-ai.shop/";
const url = process.env.SECURITY_HEADERS_EVIDENCE_URL || DEFAULT_URL;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getHeader(headers, name) {
  return headers.get(name) || "";
}

async function run() {
  const response = await fetch(url, {
    headers: {
      "user-agent": "roth-conversion-calculator-security-headers-evidence/1.0",
    },
    redirect: "follow",
  });

  const headers = {
    contentSecurityPolicy: getHeader(response.headers, "content-security-policy"),
    permissionsPolicy: getHeader(response.headers, "permissions-policy"),
    referrerPolicy: getHeader(response.headers, "referrer-policy"),
    strictTransportSecurity: getHeader(response.headers, "strict-transport-security"),
    xContentTypeOptions: getHeader(response.headers, "x-content-type-options"),
    xPoweredBy: getHeader(response.headers, "x-powered-by"),
  };

  const checks = {
    baseUriSelf: headers.contentSecurityPolicy.includes("base-uri 'self'"),
    connectSourcesLimited:
      headers.contentSecurityPolicy.includes("connect-src 'self'") &&
      headers.contentSecurityPolicy.includes("https://www.google-analytics.com"),
    contentSecurityPolicyRetained:
      headers.contentSecurityPolicy.includes("default-src 'self'") &&
      headers.contentSecurityPolicy.includes("script-src 'self'") &&
      headers.contentSecurityPolicy.includes("frame-ancestors 'none'"),
    formActionSelf: headers.contentSecurityPolicy.includes("form-action 'self'"),
    frameAncestorsNone: headers.contentSecurityPolicy.includes("frame-ancestors 'none'"),
    hstsRetained: headers.strictTransportSecurity.includes("max-age=63072000"),
    noPoweredByHeader: headers.xPoweredBy === "",
    nosniffRetained: headers.xContentTypeOptions.toLowerCase() === "nosniff",
    permissionsPolicyRetained:
      headers.permissionsPolicy.includes("camera=()") &&
      headers.permissionsPolicy.includes("microphone=()") &&
      headers.permissionsPolicy.includes("geolocation=()") &&
      headers.permissionsPolicy.includes("payment=()"),
    referrerPolicyRetained: headers.referrerPolicy === "strict-origin-when-cross-origin",
  };

  assert(response.status === 200, `Security header URL returned ${response.status}`);
  for (const [name, passed] of Object.entries(checks)) {
    assert(passed, `Security header check failed: ${name}`);
  }

  console.log(
    JSON.stringify(
      {
        checks,
        evidenceType: "production-security-headers",
        fetchedAt: new Date().toISOString(),
        headers,
        ok: true,
        status: response.status,
        url,
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
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "production-security-headers",
        ok: false,
        url,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
