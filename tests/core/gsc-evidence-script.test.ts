import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildDiscoveredSampleEvidence } from "../../scripts/gsc-discovered-sample-evidence.mjs";

describe("GSC evidence script", () => {
  it("exposes a repeatable priority URL evidence command for Search Console retries", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/gsc-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:gsc-evidence"]).toBe("node scripts/gsc-evidence.mjs");
    expect(packageJson.scripts["seo:gsc-discovered-samples"]).toBe(
      "node scripts/gsc-discovered-sample-evidence.mjs",
    );
    expect(script).toContain("GSC_EVIDENCE_BASE_URL");
    expect(script).toContain("https://www.roth-conversion-calculator-ai.shop");
    expect(script).toContain("/about");
    expect(script).toContain("/seo-monitoring");
    expect(script).toContain("/methodology");
    expect(script).toContain("/tax-data-update");
    expect(script).toContain("/tax-brackets/2026");
    expect(script).toContain("/roth-conversion-irmaa-guide");
    expect(script).toContain("rel=[\"']canonical");
    expect(script).toContain("sitemap.xml");
    expect(script).toContain("noindex");
    expect(script).toContain("priorityUrlCount");
    expect(script).toContain("minFreshLastmod");
    expect(script).toContain("2026-05-30");
    expect(script).toContain("freshnessCriticalPaths");
    expect(script).toContain("lastmodFresh");
  });

  it("keeps priority URL pages from inheriting the homepage canonical", () => {
    const methodologyPage = fs.readFileSync(path.join(process.cwd(), "src/app/methodology/page.tsx"), "utf8");
    const aboutPage = fs.readFileSync(path.join(process.cwd(), "src/app/about/page.tsx"), "utf8");

    expect(methodologyPage).toContain('canonical: "/methodology"');
    expect(aboutPage).toContain('canonical: "/about"');
  });

  it("requires fresh sitemap lastmod evidence for recently updated priority pages", () => {
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/gsc-evidence.mjs"), "utf8");

    expect(script).toContain('"/seo-monitoring"');
    expect(script).toContain('"/methodology"');
    expect(script).toContain('"/tax-data-update"');
    expect(script).toContain('"/tax-brackets/2026"');
    expect(script).toContain("sitemap lastmod");
    expect(script).toContain("is older than");
  });

  it("checks GSC discovered-not-indexed sample URLs for site-side indexing signals", async () => {
    const evidencePath = path.join(process.cwd(), "test-results/gsc-sample-about-only.json");
    fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
    fs.writeFileSync(
      evidencePath,
      JSON.stringify({
        issue: { state: "discovered_not_indexed" },
        sampleUrls: ["https://www.roth-conversion-calculator-ai.shop/about"],
      }),
      "utf8",
    );
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.roth-conversion-calculator-ai.shop/about</loc><lastmod>2026-05-01</lastmod></url>
</urlset>`;
    const html =
      '<!doctype html><html><head><title>About | Roth Conversion Calculator</title><link rel="canonical" href="https://www.roth-conversion-calculator-ai.shop/about"></head><body><h1>About</h1></body></html>';
    const fetchImpl = async (url: string) =>
      ({
        headers: {
          get: (name: string) => (name === "content-type" ? (url.endsWith("sitemap.xml") ? "application/xml" : "text/html; charset=utf-8") : ""),
        },
        status: 200,
        text: async () => (url.endsWith("sitemap.xml") ? sitemap : html),
        url,
      }) as Response;

    const result = await buildDiscoveredSampleEvidence({
      evidenceFile: evidencePath,
      fetchImpl,
      maxUrls: 1,
    });

    expect(result).toMatchObject({
      evidenceType: "gsc-discovered-sample-url-evidence",
      ok: true,
      resultCount: 1,
      sourceIssueState: "discovered_not_indexed",
    });
    expect(result.results[0]).toMatchObject({
      canonical: "https://www.roth-conversion-calculator-ai.shop/about",
      inSitemap: true,
      noindex: false,
      status: 200,
    });
  });

  it("fails GSC sample evidence when a discovered URL inherits the wrong canonical", async () => {
    const evidencePath = path.join(process.cwd(), "test-results/gsc-sample-about-wrong-canonical.json");
    fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
    fs.writeFileSync(
      evidencePath,
      JSON.stringify({
        issue: { state: "discovered_not_indexed" },
        sampleUrls: ["https://www.roth-conversion-calculator-ai.shop/about"],
      }),
      "utf8",
    );
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.roth-conversion-calculator-ai.shop/about</loc><lastmod>2026-05-01</lastmod></url>
</urlset>`;
    const html =
      '<!doctype html><html><head><title>About</title><link rel="canonical" href="https://www.roth-conversion-calculator-ai.shop"></head><body><h1>About</h1></body></html>';
    const fetchImpl = async (url: string) =>
      ({
        headers: {
          get: (name: string) => (name === "content-type" ? (url.endsWith("sitemap.xml") ? "application/xml" : "text/html; charset=utf-8") : ""),
        },
        status: 200,
        text: async () => (url.endsWith("sitemap.xml") ? sitemap : html),
        url,
      }) as Response;

    const result = await buildDiscoveredSampleEvidence({
      evidenceFile: evidencePath,
      fetchImpl,
      maxUrls: 1,
    });

    expect(result.ok).toBe(false);
    expect(result.failures[0]).toMatchObject({
      canonical: "https://www.roth-conversion-calculator-ai.shop",
      url: "https://www.roth-conversion-calculator-ai.shop/about",
    });
  });
});
