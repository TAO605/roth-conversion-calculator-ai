const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.INTERNAL_LINK_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const CONCURRENCY = Number.parseInt(process.env.INTERNAL_LINK_EVIDENCE_CONCURRENCY || "8", 10);
const requiredSiteIndexPaths = [
  "/",
  "/methodology",
  "/seo-monitoring",
  "/tax-brackets/2026",
  "/blog/what-is-a-roth-conversion-2026",
  "/states/california",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html, application/xml, */*",
      "user-agent": "roth-conversion-calculator-internal-link-evidence/1.0",
    },
  });

  return {
    contentType: response.headers.get("content-type") || "",
    finalUrl: response.url,
    status: response.status,
    text: await response.text(),
    url,
  };
}

function extractTags(xml, tagName) {
  return [...xml.matchAll(new RegExp(`<${tagName}>(.*?)</${tagName}>`, "gis"))].map((match) => match[1].trim());
}

function extractHrefValues(html) {
  return [...html.matchAll(/\shref=["']([^"']+)["']/gi)].map((match) => match[1].trim());
}

function normalizeInternalHref(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return "";
  }

  if (href.startsWith(baseUrl)) {
    return href.slice(baseUrl.length).split("#")[0] || "/";
  }

  if (href.startsWith("/")) {
    return href.split("#")[0] || "/";
  }

  return "";
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

async function mapConcurrent(items, limit, mapper) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  const workerCount = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workerCount }, worker));

  return results;
}

async function checkPage(url) {
  const page = await fetchText(url);
  const ok =
    page.status === 200 &&
    page.finalUrl.startsWith(baseUrl) &&
    page.contentType.includes("text/html") &&
    !hasNoindex(page.text);

  return {
    contentType: page.contentType,
    finalUrl: page.finalUrl,
    noindex: hasNoindex(page.text),
    ok,
    status: page.status,
    url,
  };
}

async function run() {
  const sitemap = await fetchText(`${baseUrl}/sitemap.xml`);
  assert(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);

  const sitemapUrls = extractTags(sitemap.text, "loc");
  const uniqueSitemapUrls = Array.from(new Set(sitemapUrls));
  assert(uniqueSitemapUrls.length >= 120, `sitemap.xml exposed ${uniqueSitemapUrls.length} unique URLs, expected at least 120`);

  const nonCanonicalSitemapUrls = uniqueSitemapUrls.filter((url) => !url.startsWith(baseUrl));
  assert(nonCanonicalSitemapUrls.length === 0, `sitemap.xml has non-canonical URLs: ${nonCanonicalSitemapUrls.join(", ")}`);

  const pageResults = await mapConcurrent(uniqueSitemapUrls, CONCURRENCY, checkPage);
  const failedPages = pageResults.filter((result) => !result.ok);
  assert(failedPages.length === 0, `Sitemap URL health failures: ${failedPages.map((page) => `${page.url} ${page.status}`).join(", ")}`);

  const siteIndex = await fetchText(`${baseUrl}/site-index`);
  assert(siteIndex.status === 200, `/site-index returned ${siteIndex.status}`);

  const siteIndexLinks = Array.from(new Set(extractHrefValues(siteIndex.text).map(normalizeInternalHref).filter(Boolean)));
  const missingSiteIndexPaths = requiredSiteIndexPaths.filter((pathname) => !siteIndexLinks.includes(pathname));
  assert(siteIndexLinks.length >= 100, `/site-index exposed ${siteIndexLinks.length} internal links, expected at least 100`);
  assert(missingSiteIndexPaths.length === 0, `/site-index missing required paths: ${missingSiteIndexPaths.join(", ")}`);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checks: {
          allSitemapUrlsOk: failedPages.length === 0,
          canonicalHostRetained: nonCanonicalSitemapUrls.length === 0,
          noNoindexRetained: pageResults.every((result) => result.noindex === false),
          siteIndexCorePathsRetained: missingSiteIndexPaths.length === 0,
          siteIndexInternalLinksRetained: siteIndexLinks.length >= 100,
          sitemapUrlHealthRetained: pageResults.length === uniqueSitemapUrls.length,
        },
        evidenceType: "production-internal-link-health",
        fetchedAt: new Date().toISOString(),
        ok: true,
        sampledFailures: failedPages.slice(0, 10),
        siteIndex: {
          internalLinkCount: siteIndexLinks.length,
          requiredPathCount: requiredSiteIndexPaths.length,
          status: siteIndex.status,
          url: siteIndex.url,
        },
        sitemap: {
          checkedUrlCount: pageResults.length,
          nonCanonicalUrlCount: nonCanonicalSitemapUrls.length,
          status: sitemap.status,
          uniqueUrlCount: uniqueSitemapUrls.length,
          url: sitemap.url,
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
        evidenceType: "production-internal-link-health",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
