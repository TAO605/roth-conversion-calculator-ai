const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.SEO_SMOKE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

const highRiskPattern = /100%\s+accurate|you should convert|strongly recommend|optimal for you/gi;

const requiredHomeSnippets = [
  "Roth Conversion Calculator 2026",
  "Educational estimate",
  "Not tax advice",
  "Copy CPA packet",
  "Tax professional review pending",
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
      "user-agent": "roth-conversion-calculator-seo-smoke/1.0",
    },
    redirect: "follow",
  });
  const text = await response.text();

  return {
    contentType: response.headers.get("content-type") || "",
    status: response.status,
    text,
    url,
  };
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

async function run() {
  const results = [];

  const home = await fetchText("/");
  assert(home.status === 200, `Homepage returned ${home.status}`);
  assert(home.contentType.includes("text/html"), `Homepage content-type was ${home.contentType}`);
  const canonical = extractCanonical(home.text);
  assert(canonical === baseUrl || canonical === `${baseUrl}/`, `Homepage canonical was "${canonical}"`);
  for (const snippet of requiredHomeSnippets) {
    assert(home.text.includes(snippet), `Homepage missing required snippet: ${snippet}`);
  }
  assert(!highRiskPattern.test(home.text), "Homepage contains high-risk YMYL wording");
  results.push({ check: "homepage", status: home.status, canonical });

  const robots = await fetchText("/robots.txt");
  assert(robots.status === 200, `robots.txt returned ${robots.status}`);
  assert(robots.text.includes(`${baseUrl}/sitemap.xml`), "robots.txt missing sitemap.xml");
  assert(robots.text.includes(`${baseUrl}/feed.xml`), "robots.txt missing feed.xml");
  assert(robots.text.includes(`${baseUrl}/llms.txt`), "robots.txt missing llms.txt");
  results.push({ check: "robots", status: robots.status });

  const sitemap = await fetchText("/sitemap.xml");
  assert(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);
  assert(sitemap.contentType.includes("xml"), `sitemap content-type was ${sitemap.contentType}`);
  assert(
    sitemap.text.includes(`<loc>${baseUrl}</loc>`) || sitemap.text.includes(`<loc>${baseUrl}/</loc>`),
    "sitemap missing canonical homepage URL",
  );
  assert(!/https:\/\/roth-conversion-calculator-ai\.shop\//.test(sitemap.text), "sitemap contains bare-domain URL");
  results.push({ check: "sitemap", status: sitemap.status });

  const llms = await fetchText("/llms.txt");
  assert(llms.status === 200, `llms.txt returned ${llms.status}`);
  assert(llms.text.includes(`${baseUrl}/methodology`), "llms.txt missing methodology URL");
  assert(llms.text.includes(`${baseUrl}/tax-data-update`), "llms.txt missing tax data update URL");
  results.push({ check: "llms", status: llms.status });

  console.log(
    JSON.stringify(
      {
        baseUrl,
        ok: true,
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
