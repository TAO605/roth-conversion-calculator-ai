const DEFAULT_BASE_URL = "https://www.roth-conversion-calculator-ai.shop";
const baseUrl = (process.env.HTML_QUALITY_EVIDENCE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const CONCURRENCY = Number.parseInt(process.env.HTML_QUALITY_EVIDENCE_CONCURRENCY || "8", 10);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(url, accept = "text/html, application/xml, */*") {
  const response = await fetch(url, {
    headers: {
      accept,
      "user-agent": "roth-conversion-calculator-html-quality-evidence/1.0",
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

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2]?.trim() || "";
}

function extractTitle(html) {
  return stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function extractMetaDescription(html) {
  const tag = html.match(/<meta[^>]+name=(["'])description\1[^>]*>/i)?.[0] || "";
  return getAttribute(tag, "content");
}

function extractCanonical(html) {
  const tag = html.match(/<link[^>]+rel=(["'])canonical\1[^>]*>/i)?.[0] || "";
  return getAttribute(tag, "href");
}

function countH1(html) {
  return (html.match(/<h1\b/gi) || []).length;
}

function htmlLang(html) {
  const tag = html.match(/<html[^>]*>/i)?.[0] || "";
  return getAttribute(tag, "lang");
}

function imageAltFailures(html) {
  return (html.match(/<img\b[^>]*>/gi) || []).filter((tag) => !getAttribute(tag, "alt"));
}

function unnamedButtonFailures(html) {
  return (html.match(/<button\b[\s\S]*?<\/button>/gi) || []).filter((tag) => {
    const ariaLabel = getAttribute(tag, "aria-label");
    const text = stripTags(tag);

    return !ariaLabel && text.length === 0;
  });
}

function unlabeledFormControlFailures(html) {
  const labelsFor = new Set((html.match(/<label\b[^>]*>/gi) || []).map((tag) => getAttribute(tag, "for")).filter(Boolean));
  const controls = html.match(/<(input|select|textarea)\b[^>]*>/gi) || [];
  const implicitLabelControlTags = new Set(
    (html.match(/<label\b[\s\S]*?<\/label>/gi) || [])
      .flatMap((label) => label.match(/<(input|select|textarea)\b[^>]*>/gi) || []),
  );

  return controls.filter((tag) => {
    const type = getAttribute(tag, "type").toLowerCase();

    if (type === "hidden" || type === "submit" || type === "button") {
      return false;
    }

    const id = getAttribute(tag, "id");
    const ariaLabel = getAttribute(tag, "aria-label");
    const ariaLabelledBy = getAttribute(tag, "aria-labelledby");

    return !ariaLabel && !ariaLabelledBy && !implicitLabelControlTags.has(tag) && (!id || !labelsFor.has(id));
  });
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
  const title = extractTitle(page.text);
  const metaDescription = extractMetaDescription(page.text);
  const canonical = extractCanonical(page.text);
  const h1Count = countH1(page.text);
  const lang = htmlLang(page.text);
  const imageFailures = imageAltFailures(page.text);
  const buttonFailures = unnamedButtonFailures(page.text);
  const formControlFailures = unlabeledFormControlFailures(page.text);

  const failures = [];

  if (page.status !== 200) failures.push(`status:${page.status}`);
  if (!page.finalUrl.startsWith(baseUrl)) failures.push("final-url-host");
  if (!page.contentType.includes("text/html")) failures.push("content-type");
  if (lang !== "en") failures.push("html-lang");
  if (h1Count !== 1) failures.push(`h1-count:${h1Count}`);
  if (title.length < 10) failures.push("title");
  if (metaDescription.length < 50) failures.push("meta-description");
  if (!canonical.startsWith(baseUrl)) failures.push("canonical");
  if (imageFailures.length > 0) failures.push(`image-alt:${imageFailures.length}`);
  if (buttonFailures.length > 0) failures.push(`button-name:${buttonFailures.length}`);
  if (formControlFailures.length > 0) failures.push(`form-label:${formControlFailures.length}`);

  return {
    canonical,
    contentType: page.contentType,
    failureCount: failures.length,
    failures,
    finalUrl: page.finalUrl,
    h1Count,
    htmlLang: lang,
    imageAltFailureCount: imageFailures.length,
    metaDescriptionLength: metaDescription.length,
    status: page.status,
    titleLength: title.length,
    url,
  };
}

async function run() {
  const sitemap = await fetchText(`${baseUrl}/sitemap.xml`, "application/xml, */*");
  assert(sitemap.status === 200, `sitemap.xml returned ${sitemap.status}`);

  const urls = Array.from(new Set(extractTags(sitemap.text, "loc")));
  assert(urls.length >= 120, `sitemap.xml exposed ${urls.length} unique URLs, expected at least 120`);

  const results = await mapConcurrent(urls, CONCURRENCY, checkPage);
  const failedPages = results.filter((result) => result.failureCount > 0);

  assert(failedPages.length === 0, `HTML quality failures: ${failedPages.map((page) => `${page.url} ${page.failures.join("|")}`).join(", ")}`);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        checks: {
          buttonNameRetained: results.every((result) => result.failures.every((failure) => !failure.startsWith("button-name"))),
          canonicalRetained: results.every((result) => result.canonical.startsWith(baseUrl)),
          formLabelRetained: results.every((result) => result.failures.every((failure) => !failure.startsWith("form-label"))),
          htmlLangRetained: results.every((result) => result.htmlLang === "en"),
          imageAltRetained: results.every((result) => result.imageAltFailureCount === 0),
          metaDescriptionRetained: results.every((result) => result.metaDescriptionLength >= 50),
          pageStatusRetained: results.every((result) => result.status === 200),
          singleH1Retained: results.every((result) => result.h1Count === 1),
          titleRetained: results.every((result) => result.titleLength >= 10),
        },
        evidenceType: "production-html-quality",
        fetchedAt: new Date().toISOString(),
        ok: true,
        pageCount: results.length,
        sampledFailures: failedPages.slice(0, 10),
        summary: {
          maxFailureCount: Math.max(0, ...results.map((result) => result.failureCount)),
          pagesWithCanonical: results.filter((result) => result.canonical.startsWith(baseUrl)).length,
          pagesWithHtmlLang: results.filter((result) => result.htmlLang === "en").length,
          pagesWithSingleH1: results.filter((result) => result.h1Count === 1).length,
          pagesWithValidMetaDescription: results.filter((result) => result.metaDescriptionLength >= 50).length,
          pagesWithValidTitle: results.filter((result) => result.titleLength >= 10).length,
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
        evidenceType: "production-html-quality",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
