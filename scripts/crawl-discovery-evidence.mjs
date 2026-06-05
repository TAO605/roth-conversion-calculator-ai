const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.CRAWL_DISCOVERY_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const expectedDiscoveryUrls = [`${baseUrl}/sitemap.xml`, `${baseUrl}/feed.xml`, `${baseUrl}/llms.txt`];
const requiredSitemapPaths = [
  "/",
  "/seo-monitoring",
  "/methodology",
  "/tax-data-update",
  "/tax-brackets/2026",
  "/blog/what-is-a-roth-conversion-2026",
];
const requiredLlmsPaths = [
  "/#calculator",
  "/methodology",
  "/tax-data-update",
  "/seo-monitoring",
  "/content-operations",
  "/cpa-review-checklist",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(pathname) {
  const url = `${baseUrl}${pathname}`;
  const response = await fetch(url, {
    headers: {
      accept: "text/plain, application/xml, application/rss+xml, */*",
      "user-agent": "roth-conversion-calculator-crawl-discovery-evidence/1.0",
    },
  });

  return {
    contentType: response.headers.get("content-type") || "",
    status: response.status,
    text: await response.text(),
    url,
  };
}

function extractTags(xml, tagName) {
  return [...xml.matchAll(new RegExp(`<${tagName}>(.*?)</${tagName}>`, "gis"))].map((match) => match[1].trim());
}

function countMatches(text, urls) {
  return urls.filter((url) => text.includes(url)).length;
}

async function run() {
  const [robots, sitemap, feed, llms] = await Promise.all([
    fetchText("/robots.txt"),
    fetchText("/sitemap.xml"),
    fetchText("/feed.xml"),
    fetchText("/llms.txt"),
  ]);

  assert(robots.status === 200, `/robots.txt returned ${robots.status}`);
  assert(sitemap.status === 200, `/sitemap.xml returned ${sitemap.status}`);
  assert(feed.status === 200, `/feed.xml returned ${feed.status}`);
  assert(llms.status === 200, `/llms.txt returned ${llms.status}`);

  const robotsDiscoveryCount = countMatches(robots.text, expectedDiscoveryUrls);
  assert(robotsDiscoveryCount === expectedDiscoveryUrls.length, "robots.txt must list sitemap.xml, feed.xml, and llms.txt");

  const sitemapUrls = extractTags(sitemap.text, "loc");
  const nonCanonicalSitemapUrls = sitemapUrls.filter((url) => !url.startsWith(baseUrl));
  const missingSitemapPaths = requiredSitemapPaths.filter((pathname) => !sitemapUrls.includes(`${baseUrl}${pathname === "/" ? "" : pathname}`));
  assert(sitemapUrls.length >= 120, `sitemap.xml exposed ${sitemapUrls.length} URLs, expected at least 120`);
  assert(nonCanonicalSitemapUrls.length === 0, `sitemap.xml has non-canonical URLs: ${nonCanonicalSitemapUrls.join(", ")}`);
  assert(missingSitemapPaths.length === 0, `sitemap.xml missing required paths: ${missingSitemapPaths.join(", ")}`);

  const feedItems = extractTags(feed.text, "item");
  assert(feed.contentType.includes("application/rss+xml"), "feed.xml must retain RSS content type");
  assert(feedItems.length >= 13, `feed.xml exposed ${feedItems.length} items, expected at least 13`);
  assert(feed.text.includes(`${baseUrl}/blog/what-is-a-roth-conversion-2026`), "feed.xml missing current blog URL coverage");

  const missingLlmsPaths = requiredLlmsPaths.filter((pathname) => !llms.text.includes(`${baseUrl}${pathname}`));
  assert(llms.contentType.includes("text/plain"), "llms.txt must retain text/plain content type");
  assert(missingLlmsPaths.length === 0, `llms.txt missing required paths: ${missingLlmsPaths.join(", ")}`);
  assert(llms.text.includes("Educational and illustrative purposes only"), "llms.txt must retain educational boundary language");

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checks: {
          feedBlogCoverageRetained: feed.text.includes(`${baseUrl}/blog/what-is-a-roth-conversion-2026`),
          feedItemsRetained: feedItems.length >= 13,
          feedStatusOk: feed.status === 200,
          llmsBoundaryRetained: llms.text.includes("Educational and illustrative purposes only"),
          llmsCoreCoverageRetained: missingLlmsPaths.length === 0,
          llmsStatusOk: llms.status === 200,
          robotsDiscoveryRetained: robotsDiscoveryCount === expectedDiscoveryUrls.length,
          robotsStatusOk: robots.status === 200,
          sitemapCanonicalHostRetained: nonCanonicalSitemapUrls.length === 0,
          sitemapRequiredPathsRetained: missingSitemapPaths.length === 0,
          sitemapStatusOk: sitemap.status === 200,
          sitemapUrlCountRetained: sitemapUrls.length >= 120,
        },
        evidenceType: "production-crawl-discovery",
        fetchedAt: new Date().toISOString(),
        feed: {
          contentType: feed.contentType,
          itemCount: feedItems.length,
          status: feed.status,
          url: feed.url,
        },
        llms: {
          contentType: llms.contentType,
          requiredPathCount: requiredLlmsPaths.length,
          status: llms.status,
          url: llms.url,
        },
        ok: true,
        robots: {
          discoveryCount: robotsDiscoveryCount,
          expectedDiscoveryUrls,
          status: robots.status,
          url: robots.url,
        },
        sitemap: {
          requiredPathCount: requiredSitemapPaths.length,
          status: sitemap.status,
          url: sitemap.url,
          urlCount: sitemapUrls.length,
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
        evidenceType: "production-crawl-discovery",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
