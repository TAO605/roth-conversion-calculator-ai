const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.STRUCTURED_DATA_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

const requiredTypes = ["WebApplication", "WebSite", "WebPage", "HowTo", "Organization", "FAQPage"];
const forbiddenKeyPattern = /^(aggregateRating|review|reviewRating|ratingValue|reviewCount)$/i;
const forbiddenTextPattern = /optimal conversion amount|hidden fees|100%\s+accurate|guaranteed|voiceInput|voiceOutput/gi;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchHomepage() {
  const response = await fetch(`${baseUrl}/`, {
    headers: {
      "user-agent": "roth-conversion-calculator-structured-data-evidence/1.0",
    },
    redirect: "follow",
  });
  const text = await response.text();

  return {
    contentType: response.headers.get("content-type") || "",
    status: response.status,
    text,
  };
}

function extractJsonLdScripts(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => match[1].trim(),
  );
}

function flattenNodes(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenNodes);
  }

  const graph = Array.isArray(value["@graph"]) ? value["@graph"] : [];

  return [value, ...graph.flatMap(flattenNodes)];
}

function walkEntries(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(walkEntries);
  }

  return Object.entries(value).flatMap(([key, item]) => [{ key, value: item }, ...walkEntries(item)]);
}

function getTypes(nodes) {
  return Array.from(
    new Set(
      nodes
        .flatMap((node) => node["@type"])
        .filter((type) => typeof type === "string")
        .sort(),
    ),
  );
}

function getSiteUrls(entries) {
  const siteUrlKeys = new Set(["@id", "url", "item", "mainEntityOfPage"]);

  return entries
    .filter(
      (entry) =>
        siteUrlKeys.has(entry.key) && typeof entry.value === "string" && /^https?:\/\//i.test(entry.value),
    )
    .map((entry) => entry.value);
}

async function run() {
  const homepage = await fetchHomepage();
  assert(homepage.status === 200, `Homepage returned ${homepage.status}`);
  assert(homepage.contentType.includes("text/html"), `Homepage content-type was ${homepage.contentType}`);

  const scripts = extractJsonLdScripts(homepage.text);
  assert(scripts.length >= requiredTypes.length, `Expected at least ${requiredTypes.length} JSON-LD scripts`);

  const parsed = scripts.map((script, index) => {
    try {
      return JSON.parse(script);
    } catch (error) {
      throw new Error(`JSON-LD script ${index + 1} is not parseable: ${error instanceof Error ? error.message : error}`);
    }
  });
  const nodes = parsed.flatMap(flattenNodes);
  const entries = nodes.flatMap(walkEntries);
  const types = getTypes(nodes);
  const forbiddenKeys = entries.filter((entry) => forbiddenKeyPattern.test(entry.key)).map((entry) => entry.key);
  const serialized = JSON.stringify(parsed);
  const forbiddenTextMatches = serialized.match(forbiddenTextPattern) ?? [];
  const siteUrls = getSiteUrls(entries);

  for (const type of requiredTypes) {
    assert(types.includes(type), `Structured data missing ${type}`);
  }

  assert(forbiddenKeys.length === 0, `Structured data includes forbidden review/rating keys: ${forbiddenKeys.join(", ")}`);
  assert(forbiddenTextMatches.length === 0, `Structured data includes unsafe text: ${forbiddenTextMatches.join(", ")}`);
  assert(siteUrls.length > 0, "Structured data did not expose any site URLs");
  assert(siteUrls.every((url) => url.startsWith(baseUrl)), "Structured data contains non-canonical site URL");

  console.log(
    JSON.stringify(
      {
        baseUrl,
        forbiddenKeys,
        forbiddenTextMatches,
        jsonLdScriptCount: scripts.length,
        ok: true,
        siteUrlCount: siteUrls.length,
        types,
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
