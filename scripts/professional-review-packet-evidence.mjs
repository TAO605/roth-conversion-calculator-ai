const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.PROFESSIONAL_REVIEW_PACKET_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
const packetPath = "/professional-review-packet";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      "user-agent": "roth-conversion-calculator-professional-review-evidence/1.0",
    },
    redirect: "follow",
  });

  return {
    contentType: response.headers.get("content-type") || "",
    status: response.status,
    text: await response.text(),
    url: response.url,
  };
}

async function fetchJson(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      "user-agent": "roth-conversion-calculator-professional-review-evidence/1.0",
    },
    redirect: "follow",
  });

  return {
    body: await response.json(),
    contentType: response.headers.get("content-type") || "",
    status: response.status,
    url: response.url,
  };
}

function containsAll(text, terms) {
  return terms.every((term) => text.toLowerCase().includes(term.toLowerCase()));
}

async function run() {
  const [page, sitemap, llms, health] = await Promise.all([
    fetchText(packetPath),
    fetchText("/sitemap.xml"),
    fetchText("/llms.txt"),
    fetchJson("/api/health"),
  ]);

  assert(page.status === 200, "Professional review packet page must return HTTP 200");
  assert(page.contentType.includes("text/html"), "Professional review packet must return HTML");
  assert(
    page.url === `${baseUrl}${packetPath}` || page.url === `${baseUrl}${packetPath}/`,
    "Professional review packet final URL must stay on the canonical host",
  );
  assert(sitemap.status === 200, "sitemap.xml must return HTTP 200");
  assert(llms.status === 200, "llms.txt must return HTTP 200");
  assert(health.status === 200, "/api/health must return HTTP 200");

  const pageTerms = [
    "Professional Review Packet",
    "Tax professional review pending",
    "Modeled Calculation Scope",
    "Items Not Fully Modeled",
    "Production Evidence Package",
    "professional-review-packet-evidence-result.json",
    "IRMAA",
    "ACA premium tax credits",
    "NIIT, AMT, RMD",
    "State-specific special rules",
  ];
  const pageTermsRetained = containsAll(page.text, pageTerms);
  const sitemapRetained = sitemap.text.includes(`${baseUrl}${packetPath}`);
  const llmsRetained = llms.text.includes(`${baseUrl}${packetPath}`);
  const healthPendingReviewRetained = String(
    health.body?.taxData?.professionalReviewStatus || "",
  )
    .toLowerCase()
    .includes("pending");
  const taxYearRetained = health.body?.taxYear === 2026;

  const checks = {
    healthPendingReviewRetained,
    llmsRetained,
    pageStatusOk: page.status === 200,
    pageTermsRetained,
    sitemapRetained,
    taxYearRetained,
  };

  assert(pageTermsRetained, "Professional review packet must retain required review terms");
  assert(sitemapRetained, "Professional review packet must be included in sitemap.xml");
  assert(llmsRetained, "Professional review packet must be included in llms.txt");
  assert(healthPendingReviewRetained, "Health payload must retain pending professional-review status");
  assert(taxYearRetained, "Health payload must retain taxYear 2026");

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checks,
        evidenceType: "professional-review-packet",
        health: {
          professionalReviewStatus: health.body?.taxData?.professionalReviewStatus || "",
          taxYear: health.body?.taxYear,
        },
        ok: true,
        page: {
          contentType: page.contentType,
          path: packetPath,
          status: page.status,
          termCount: pageTerms.length,
          url: page.url,
        },
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
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "professional-review-packet",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
