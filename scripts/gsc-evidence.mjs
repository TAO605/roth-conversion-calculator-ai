const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.GSC_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

const priorityPaths = [
  "/",
  "/seo-monitoring",
  "/methodology",
  "/tax-data-update",
  "/tax-brackets/2026",
  "/roth-conversion-irmaa-guide",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function expectedCanonical(pathname) {
  return pathname === "/" ? baseUrl : `${baseUrl}${pathname}`;
}

async function fetchText(pathname) {
  const url = `${baseUrl}${pathname}`;
  const response = await fetch(url, {
    headers: {
      "user-agent": "roth-conversion-calculator-gsc-evidence/1.0",
    },
    redirect: "follow",
  });
  const text = await response.text();

  return {
    contentType: response.headers.get("content-type") || "",
    xRobotsTag: response.headers.get("x-robots-tag") || "",
    status: response.status,
    text,
    url,
  };
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function hasNoIndex(response) {
  return /noindex/i.test(response.xRobotsTag) || /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(response.text);
}

async function run() {
  const sitemap = await fetchText("/sitemap.xml");
  assert(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);
  assert(sitemap.contentType.includes("xml"), `sitemap content-type was ${sitemap.contentType}`);

  const results = [];

  for (const pathname of priorityPaths) {
    const page = await fetchText(pathname);
    const canonical = extractCanonical(page.text);
    const expected = expectedCanonical(pathname);
    const sitemapUrl = expected;
    const inSitemap =
      sitemap.text.includes(`<loc>${sitemapUrl}</loc>`) ||
      (pathname === "/" && sitemap.text.includes(`<loc>${sitemapUrl}/</loc>`));

    assert(page.status === 200, `${pathname} returned ${page.status}`);
    assert(page.contentType.includes("text/html"), `${pathname} content-type was ${page.contentType}`);
    assert(canonical === expected || (pathname === "/" && canonical === `${expected}/`), `${pathname} canonical was "${canonical}"`);
    assert(inSitemap, `${pathname} missing from sitemap.xml`);
    assert(!hasNoIndex(page), `${pathname} contains noindex`);

    results.push({
      canonical,
      inSitemap,
      noindex: false,
      path: pathname,
      status: page.status,
    });
  }

  console.log(
    JSON.stringify(
      {
        baseUrl,
        ok: true,
        priorityUrlCount: priorityPaths.length,
        results,
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
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
