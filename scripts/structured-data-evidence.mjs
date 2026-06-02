import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.STRUCTURED_DATA_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const BLOG_SOURCE_PATH = path.join(PROJECT_ROOT, "src/content/blog.ts");

const homepagePath = "/";
const staticMonitoredPages = [
  {
    path: "/",
    requiredTypes: ["WebApplication", "WebSite", "WebPage", "HowTo", "Organization", "FAQPage"],
  },
  {
    path: "/roth-conversion-irmaa-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-aca-premium-tax-credit-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/tax-brackets/2026",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-niit-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-rmd-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-social-security-tax-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-estimated-tax-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/calculator-assumptions-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/cpa-review-checklist",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-5-year-rules",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-capital-gains-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-cpa-questions",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-custodian-process",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-mistakes",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-planning-checklist",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-qcd-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-recharacterization-guide",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-tax-forms",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
  {
    path: "/roth-conversion-timeline",
    requiredTypes: ["BreadcrumbList", "WebPage"],
  },
];
const forbiddenKeyPattern = /^(aggregateRating|review|reviewRating|ratingValue|reviewCount)$/i;
const forbiddenTextPattern = /optimal conversion amount|hidden fees|100%\s+accurate|guaranteed|voiceInput|voiceOutput/gi;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readBlogArticlePages() {
  const source = fs.readFileSync(BLOG_SOURCE_PATH, "utf8");
  const slugs = [...source.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const uniqueSlugs = Array.from(new Set(slugs));

  assert(uniqueSlugs.length > 0, "Blog source did not expose any slugs for structured data evidence");

  return uniqueSlugs.map((slug) => ({
    path: `/blog/${slug}`,
    requiredTypes: ["Article", "BreadcrumbList"],
  }));
}

function buildMonitoredPages() {
  return [...staticMonitoredPages, ...readBlogArticlePages()];
}

async function fetchPage(pathname) {
  const response = await fetch(`${baseUrl}${pathname === "/" ? "/" : pathname}`, {
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

async function inspectPage(page) {
  const response = await fetchPage(page.path);
  assert(response.status === 200, `${page.path} returned ${response.status}`);
  assert(response.contentType.includes("text/html"), `${page.path} content-type was ${response.contentType}`);

  const scripts = extractJsonLdScripts(response.text);
  assert(scripts.length >= page.requiredTypes.length, `${page.path} expected at least ${page.requiredTypes.length} JSON-LD scripts`);

  const parsed = scripts.map((script, index) => {
    try {
      return JSON.parse(script);
    } catch (error) {
      throw new Error(
        `${page.path} JSON-LD script ${index + 1} is not parseable: ${error instanceof Error ? error.message : error}`,
      );
    }
  });
  const nodes = parsed.flatMap(flattenNodes);
  const entries = nodes.flatMap(walkEntries);
  const types = getTypes(nodes);
  const forbiddenKeys = entries.filter((entry) => forbiddenKeyPattern.test(entry.key)).map((entry) => entry.key);
  const serialized = JSON.stringify(parsed);
  const forbiddenTextMatches = serialized.match(forbiddenTextPattern) ?? [];
  const siteUrls = getSiteUrls(entries);

  for (const type of page.requiredTypes) {
    assert(types.includes(type), `${page.path} structured data missing ${type}`);
  }

  assert(
    forbiddenKeys.length === 0,
    `${page.path} structured data includes forbidden review/rating keys: ${forbiddenKeys.join(", ")}`,
  );
  assert(forbiddenTextMatches.length === 0, `${page.path} structured data includes unsafe text: ${forbiddenTextMatches.join(", ")}`);
  assert(siteUrls.length > 0, `${page.path} structured data did not expose any site URLs`);
  assert(siteUrls.every((url) => url.startsWith(baseUrl)), `${page.path} structured data contains non-canonical site URL`);

  return {
    forbiddenKeys,
    forbiddenTextMatches,
    jsonLdScriptCount: scripts.length,
    path: page.path,
    siteUrlCount: siteUrls.length,
    types,
  };
}

async function run() {
  const pages = [];
  const monitoredPages = buildMonitoredPages();

  for (const page of monitoredPages) {
    pages.push(await inspectPage(page));
  }

  const homepage = pages.find((page) => page.path === homepagePath);
  assert(homepage, "Homepage structured data evidence is missing");

  console.log(
    JSON.stringify(
      {
        baseUrl,
        forbiddenKeys: pages.flatMap((page) => page.forbiddenKeys),
        forbiddenTextMatches: pages.flatMap((page) => page.forbiddenTextMatches),
        jsonLdScriptCount: homepage.jsonLdScriptCount,
        ok: true,
        pageCount: pages.length,
        pages,
        siteUrlCount: homepage.siteUrlCount,
        types: homepage.types,
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
