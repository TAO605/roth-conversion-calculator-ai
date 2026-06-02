import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const BLOG_SOURCE_PATH = path.join(PROJECT_ROOT, "src/content/blog.ts");
const baseUrl = (process.env.BLOG_DISCOVERY_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readBlogSlugs() {
  const source = fs.readFileSync(BLOG_SOURCE_PATH, "utf8");
  const slugs = [...source.matchAll(/\bslug:\s*"([^"]+)"/g)].map((match) => match[1]);
  const uniqueSlugs = Array.from(new Set(slugs));

  assert(uniqueSlugs.length > 0, "Blog source did not expose any slugs for discovery evidence");

  return uniqueSlugs;
}

async function fetchText(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      "user-agent": "roth-conversion-calculator-blog-discovery-evidence/1.0",
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

function countMatches(text, needles) {
  return needles.filter((needle) => text.includes(needle)).length;
}

async function run() {
  const slugs = readBlogSlugs();
  const absoluteBlogUrls = slugs.map((slug) => `${baseUrl}/blog/${slug}`);
  const relativeBlogUrls = slugs.map((slug) => `/blog/${slug}`);

  const [blogHub, sitemap, rss, llms] = await Promise.all([
    fetchText("/blog"),
    fetchText("/sitemap.xml"),
    fetchText("/feed.xml"),
    fetchText("/llms.txt"),
  ]);

  assert(blogHub.status === 200, `/blog returned ${blogHub.status}`);
  assert(blogHub.contentType.includes("text/html"), `/blog content-type was ${blogHub.contentType}`);
  assert(sitemap.status === 200, `/sitemap.xml returned ${sitemap.status}`);
  assert(rss.status === 200, `/feed.xml returned ${rss.status}`);
  assert(llms.status === 200, `/llms.txt returned ${llms.status}`);

  const missingFromHub = relativeBlogUrls.filter((url) => !blogHub.text.includes(`href="${url}"`));
  const missingFromSitemap = absoluteBlogUrls.filter((url) => !sitemap.text.includes(`<loc>${url}</loc>`));
  const missingFromRss = absoluteBlogUrls.filter(
    (url) => !rss.text.includes(`<guid>${url}</guid>`) || !rss.text.includes(`<link>${url}</link>`),
  );
  const llmsCoveredCount = countMatches(llms.text, absoluteBlogUrls);
  const expectedLlmsMinimum = Math.min(8, slugs.length);

  assert(missingFromHub.length === 0, `/blog missing article links: ${missingFromHub.join(", ")}`);
  assert(missingFromSitemap.length === 0, `/sitemap.xml missing blog URLs: ${missingFromSitemap.join(", ")}`);
  assert(missingFromRss.length === 0, `/feed.xml missing blog URLs: ${missingFromRss.join(", ")}`);
  assert(
    llmsCoveredCount >= expectedLlmsMinimum,
    `/llms.txt covered ${llmsCoveredCount} blog URLs, expected at least ${expectedLlmsMinimum}`,
  );

  console.log(
    JSON.stringify(
      {
        baseUrl,
        blogPostCount: slugs.length,
        checks: {
          blogHub: {
            coveredCount: slugs.length - missingFromHub.length,
            missing: missingFromHub,
            status: blogHub.status,
          },
          llms: {
            coveredCount: llmsCoveredCount,
            expectedMinimum: expectedLlmsMinimum,
            status: llms.status,
          },
          rss: {
            coveredCount: slugs.length - missingFromRss.length,
            missing: missingFromRss,
            status: rss.status,
          },
          sitemap: {
            coveredCount: slugs.length - missingFromSitemap.length,
            missing: missingFromSitemap,
            status: sitemap.status,
          },
        },
        ok: true,
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
