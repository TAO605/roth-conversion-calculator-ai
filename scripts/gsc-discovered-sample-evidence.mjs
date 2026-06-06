import fs from "node:fs";
import path from "node:path";

const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const DEFAULT_EVIDENCE_DIR = "docs/evidence";
const DEFAULT_PATTERN = /^gsc-discovered-not-indexed-detail-.*\.json$/;
const EVIDENCE_TYPE = "gsc-discovered-sample-url-evidence";

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
}

function discoverLatestEvidenceFile(evidenceDir = DEFAULT_EVIDENCE_DIR) {
  if (!fs.existsSync(evidenceDir)) {
    throw new Error(`Evidence directory not found: ${evidenceDir}`);
  }

  const files = fs
    .readdirSync(evidenceDir)
    .filter((name) => DEFAULT_PATTERN.test(name))
    .map((name) => path.join(evidenceDir, name))
    .sort();

  if (files.length === 0) {
    throw new Error(`No discovered-not-indexed evidence files found in ${evidenceDir}`);
  }

  return files.at(-1);
}

function normalizeBaseUrl(value = DEFAULT_BASE_URL) {
  return value.replace(/\/+$/, "");
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match?.[1] ?? "";
}

function extractTitle(html) {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
}

function hasNoIndex({ html, xRobotsTag }) {
  return /noindex/i.test(xRobotsTag) || /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
}

function extractSitemapEntry(sitemapXml, url) {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sitemapXml.match(new RegExp(`<url>\\s*<loc>${escapedUrl}</loc>([\\s\\S]*?)</url>`, "i"));

  if (!match) {
    return { inSitemap: false, lastmod: "" };
  }

  return {
    inSitemap: true,
    lastmod: match[1].match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1] ?? "",
  };
}

function assertExpectedUrl(url, baseUrl) {
  const parsed = new URL(url);
  const expected = new URL(baseUrl);

  if (parsed.protocol !== "https:" || parsed.hostname !== expected.hostname) {
    throw new Error(`Sample URL must be an https URL on ${expected.hostname}: ${url}`);
  }

  return parsed.toString();
}

async function fetchText(fetchImpl, url) {
  const response = await fetchImpl(url, {
    headers: {
      "user-agent": "roth-conversion-calculator-gsc-sample-evidence/1.0",
    },
    redirect: "follow",
  });
  const text = await response.text();

  return {
    contentType: response.headers.get("content-type") || "",
    finalUrl: response.url || url,
    status: response.status,
    text,
    xRobotsTag: response.headers.get("x-robots-tag") || "",
  };
}

async function buildDiscoveredSampleEvidence({
  baseUrl = DEFAULT_BASE_URL,
  evidenceFile,
  fetchImpl = fetch,
  maxUrls,
} = {}) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const sourceEvidenceFile = evidenceFile || discoverLatestEvidenceFile();
  const sourceEvidence = readJson(sourceEvidenceFile);
  const sampleUrls = (sourceEvidence.sampleUrls || []).slice(0, maxUrls ? Number(maxUrls) : undefined);

  if (sampleUrls.length === 0) {
    throw new Error(`No sampleUrls found in ${sourceEvidenceFile}`);
  }

  const sitemapUrl = `${normalizedBaseUrl}/sitemap.xml`;
  const sitemap = await fetchText(fetchImpl, sitemapUrl);

  const results = [];

  for (const sampleUrl of sampleUrls) {
    const url = assertExpectedUrl(sampleUrl, normalizedBaseUrl);
    const page = await fetchText(fetchImpl, url);
    const canonical = extractCanonical(page.text);
    const title = extractTitle(page.text);
    const sitemapEntry = extractSitemapEntry(sitemap.text, url);
    const noindex = hasNoIndex({ html: page.text, xRobotsTag: page.xRobotsTag });
    const expectedCanonical = url.replace(/\/$/, "");
    const normalizedCanonical = canonical.replace(/\/$/, "");
    const pass =
      page.status === 200 &&
      page.contentType.includes("text/html") &&
      normalizedCanonical === expectedCanonical &&
      sitemapEntry.inSitemap &&
      !noindex;

    results.push({
      canonical,
      contentType: page.contentType,
      finalUrl: page.finalUrl,
      inSitemap: sitemapEntry.inSitemap,
      lastmod: sitemapEntry.lastmod,
      noindex,
      ok: pass,
      status: page.status,
      title,
      url,
    });
  }

  const failures = results
    .filter((result) => !result.ok)
    .map((result) => ({
      canonical: result.canonical,
      inSitemap: result.inSitemap,
      noindex: result.noindex,
      status: result.status,
      url: result.url,
    }));

  return {
    baseUrl: normalizedBaseUrl,
    evidenceType: EVIDENCE_TYPE,
    failureCount: failures.length,
    failures,
    ok: failures.length === 0,
    resultCount: results.length,
    results,
    reviewBoundary:
      "This command checks site-side technical signals for GSC discovered-not-indexed sample URLs; it does not fetch private Search Console data or request indexing.",
    sourceEvidenceFile,
    sourceIssueState: sourceEvidence.issue?.state || "",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await buildDiscoveredSampleEvidence({
    baseUrl: args.baseUrl || DEFAULT_BASE_URL,
    evidenceFile: args.evidence || undefined,
    maxUrls: args.maxUrls || undefined,
  });
  const output = `${JSON.stringify(result, null, 2)}\n`;

  if (args.out) {
    fs.writeFileSync(args.out, output, "utf8");
  }

  process.stdout.write(output);

  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith("gsc-discovered-sample-evidence.mjs")) {
  main().catch((error) => {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          evidenceType: EVIDENCE_TYPE,
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  });
}

export { buildDiscoveredSampleEvidence, discoverLatestEvidenceFile };
