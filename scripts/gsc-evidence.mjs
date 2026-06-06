const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.GSC_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

const priorityPaths = [
  "/",
  "/about",
  "/seo-monitoring",
  "/methodology",
  "/tax-data-update",
  "/tax-brackets/2026",
  "/roth-conversion-irmaa-guide",
];

const minFreshLastmod = "2026-05-30";
const freshnessCriticalPaths = new Set([
  "/",
  "/seo-monitoring",
  "/methodology",
  "/tax-data-update",
  "/tax-brackets/2026",
]);

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

function extractSitemapEntry(sitemapXml, sitemapUrl, pathname) {
  const urls = pathname === "/" ? [sitemapUrl, `${sitemapUrl}/`] : [sitemapUrl];

  for (const url of urls) {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = sitemapXml.match(new RegExp(`<url>\\s*<loc>${escapedUrl}</loc>([\\s\\S]*?)</url>`, "i"));

    if (match) {
      const lastmod = match[1].match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1] ?? "";

      return {
        inSitemap: true,
        lastmod,
      };
    }
  }

  return {
    inSitemap: false,
    lastmod: "",
  };
}

function isFreshEnough(lastmod) {
  return Boolean(lastmod) && lastmod >= minFreshLastmod;
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
    const sitemapEntry = extractSitemapEntry(sitemap.text, sitemapUrl, pathname);
    const needsFreshLastmod = freshnessCriticalPaths.has(pathname);
    const lastmodFresh = !needsFreshLastmod || isFreshEnough(sitemapEntry.lastmod);

    assert(page.status === 200, `${pathname} returned ${page.status}`);
    assert(page.contentType.includes("text/html"), `${pathname} content-type was ${page.contentType}`);
    assert(canonical === expected || (pathname === "/" && canonical === `${expected}/`), `${pathname} canonical was "${canonical}"`);
    assert(sitemapEntry.inSitemap, `${pathname} missing from sitemap.xml`);
    assert(lastmodFresh, `${pathname} sitemap lastmod "${sitemapEntry.lastmod}" is older than ${minFreshLastmod}`);
    assert(!hasNoIndex(page), `${pathname} contains noindex`);

    results.push({
      canonical,
      inSitemap: sitemapEntry.inSitemap,
      lastmod: sitemapEntry.lastmod,
      lastmodFresh,
      noindex: false,
      path: pathname,
      status: page.status,
    });
  }

  console.log(
    JSON.stringify(
      {
        baseUrl,
        minFreshLastmod,
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
