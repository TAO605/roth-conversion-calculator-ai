import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_MIN_WORDS = 800;
const DEFAULT_PREFERRED_WORDS = 1500;
const DEFAULT_DENSITY_MIN = 2;
const DEFAULT_DENSITY_MAX = 4;
const YMYL_RISK_PATTERNS = [
  { label: "direct should-convert advice", pattern: /\byou should convert\b/gi },
  { label: "strong recommendation language", pattern: /\bstrongly recommend\b/gi },
  { label: "personal optimal conversion claim", pattern: /\boptimal conversion amount\b/gi },
  { label: "best amount claim", pattern: /\bbest amount\b/gi },
  { label: "best move claim", pattern: /\bbest move\b/gi },
  { label: "100 percent accuracy claim", pattern: /\b100%\s+accurate\b/gi },
  { label: "perfect accuracy claim", pattern: /\bperfectly accurate\b/gi },
  { label: "zero-error claim", pattern: /\bzero[-\s]?error\b/gi },
  { label: "accuracy guarantee", pattern: /\bguarantee(?:d|s)?\s+(?:the\s+)?accuracy\b/gi },
  { label: "risk-free claim", pattern: /\brisk[-\s]?free\b/gi },
  { label: "fake rating claim", pattern: /\b(?:5-star|five-star)\s+(?:rated|rating)\b/gi },
];
const SITE_HOSTS = new Set(["roth-conversion-calculator-ai.shop", "www.roth-conversion-calculator-ai.shop"]);
const OFFICIAL_SOURCE_HOSTS = [
  "irs.gov",
  "medicare.gov",
  "healthcare.gov",
  "ssa.gov",
  "treasury.gov",
  "taxpayeradvocate.irs.gov",
];

function parseArgs(argv) {
  const args = {
    densityMax: DEFAULT_DENSITY_MAX,
    densityMin: DEFAULT_DENSITY_MIN,
    minWords: DEFAULT_MIN_WORDS,
    preferredWords: DEFAULT_PREFERRED_WORDS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--file") {
      args.file = next;
      index += 1;
    } else if (arg === "--keyword") {
      args.keyword = next;
      index += 1;
    } else if (arg === "--min-words") {
      args.minWords = Number(next);
      index += 1;
    } else if (arg === "--preferred-words") {
      args.preferredWords = Number(next);
      index += 1;
    } else if (arg === "--density-min") {
      args.densityMin = Number(next);
      index += 1;
    } else if (arg === "--density-max") {
      args.densityMax = Number(next);
      index += 1;
    }
  }

  if (!args.file || !args.keyword) {
    throw new Error("Usage: node scripts/blog-seo-review.mjs --file draft.md --keyword \"primary keyword\"");
  }

  return args;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function extractHeadings(source) {
  const markdownHeadings = [...source.matchAll(/^(#{1,6})\s+(.+)$/gm)].map((match) => ({
    level: match[1].length,
    text: normalizeWhitespace(match[2].replace(/[#*`_]/g, "")),
  }));
  const htmlHeadings = [...source.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: normalizeWhitespace(stripMarkup(match[2])),
  }));

  return [...markdownHeadings, ...htmlHeadings];
}

function extractImages(source) {
  const markdownImages = [...source.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((match) => ({
    alt: normalizeWhitespace(match[1]),
    src: normalizeWhitespace(match[2]),
  }));
  const htmlImages = [...source.matchAll(/<img\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    const altMatch = tag.match(/\balt=["']([^"']*)["']/i);
    const srcMatch = tag.match(/\bsrc=["']([^"']*)["']/i);

    return {
      alt: altMatch ? normalizeWhitespace(altMatch[1]) : "",
      src: srcMatch ? normalizeWhitespace(srcMatch[1]) : "",
    };
  });

  return [...markdownImages, ...htmlImages];
}

function extractLinks(source) {
  const markdownLinks = [...source.matchAll(/(?<!!)\[([^\]]+)\]\(([^)]+)\)/g)].map((match) => ({
    href: normalizeWhitespace(match[2]),
    text: normalizeWhitespace(stripMarkup(match[1])),
  }));
  const htmlLinks = [...source.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: normalizeWhitespace(match[1]),
    text: normalizeWhitespace(stripMarkup(match[2])),
  }));

  return [...markdownLinks, ...htmlLinks].filter((link) => link.href.length > 0);
}

function extractParagraphs(source) {
  const htmlParagraphs = [...source.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => normalizeWhitespace(stripMarkup(match[1])))
    .filter((text) => text.length > 0);
  const markdownParagraphs = source
    .replace(/---[\s\S]*?---/, " ")
    .split(/\n{2,}/)
    .map((block) => normalizeWhitespace(block))
    .filter((block) => {
      if (block.length === 0) return false;
      if (/^#{1,6}\s+/.test(block)) return false;
      if (/^!\[[^\]]*\]\([^)]+\)$/.test(block)) return false;
      if (/^```/.test(block)) return false;
      if (/^[-*+]\s+/.test(block)) return false;
      if (/^\d+\.\s+/.test(block)) return false;
      if (/^<\/?[a-z][\s\S]*>$/i.test(block)) return false;

      return true;
    });

  return [...htmlParagraphs, ...markdownParagraphs];
}

function extractStrong(source) {
  const htmlStrong = [...source.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi)].map((match) =>
    normalizeWhitespace(stripMarkup(match[1])),
  );
  const markdownStrong = [...source.matchAll(/\*\*([^*]+)\*\*/g)].map((match) => normalizeWhitespace(match[1]));

  return [...htmlStrong, ...markdownStrong].filter((text) => text.length > 0);
}

function stripMarkup(source) {
  return source
    .replace(/---[\s\S]*?---/, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/[*_`>#-]/g, " ");
}

function getWords(text) {
  return normalizeWhitespace(text).match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? [];
}

function keywordPattern(keyword) {
  return new RegExp(`\\b${escapeRegExp(normalizeWhitespace(keyword)).replace(/\\ /g, "\\s+")}\\b`, "gi");
}

function countKeyword(text, keyword) {
  return text.match(keywordPattern(keyword))?.length ?? 0;
}

function makeCheck(id, passed, detail) {
  return { detail, id, passed };
}

function collectYMYLRiskMatches(text) {
  return YMYL_RISK_PATTERNS.flatMap(({ label, pattern }) => {
    pattern.lastIndex = 0;
    const matches = text.match(pattern) ?? [];

    return matches.map((match) => ({ label, match: normalizeWhitespace(match) }));
  });
}

function getHostname(href) {
  try {
    return new URL(href, "https://www.roth-conversion-calculator-ai.shop").hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isInternalLink(href) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return true;
  }

  return SITE_HOSTS.has(getHostname(href));
}

function isOfficialSourceLink(href) {
  const hostname = getHostname(href);

  return OFFICIAL_SOURCE_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

function hasValidHeadingHierarchy(headings) {
  return headings.every((heading, index) => {
    if (index === 0) return heading.level === 1;

    return heading.level <= headings[index - 1].level + 1;
  });
}

export function reviewBlogDraft(source, options) {
  source = source.replace(/^\uFEFF/, "");
  const keyword = normalizeWhitespace(options.keyword);
  const plainText = normalizeWhitespace(stripMarkup(source));
  const words = getWords(plainText);
  const first100 = words.slice(0, 100).join(" ");
  const final100 = words.slice(-100).join(" ");
  const headings = extractHeadings(source);
  const h1s = headings.filter((heading) => heading.level === 1);
  const h2s = headings.filter((heading) => heading.level === 2);
  const images = extractImages(source);
  const links = extractLinks(source);
  const internalLinks = links.filter((link) => isInternalLink(link.href));
  const officialSourceLinks = links.filter((link) => isOfficialSourceLink(link.href));
  const paragraphs = extractParagraphs(source);
  const strongPhrases = extractStrong(source);
  const emptyAltImages = images.filter((image) => image.alt.length === 0);
  const keywordOccurrences = countKeyword(plainText, keyword);
  const keywordWordCount = getWords(keyword).length || 1;
  const keywordDensity = words.length > 0 ? (keywordOccurrences * keywordWordCount * 100) / words.length : 0;
  const ymylRiskMatches = collectYMYLRiskMatches(plainText);

  const hardChecks = [
    makeCheck(
      "keyword_first_100_words",
      countKeyword(first100, keyword) > 0,
      "Primary keyword should appear once within the first 100 words.",
    ),
    makeCheck(
      "keyword_final_100_words",
      countKeyword(final100, keyword) > 0,
      "Primary keyword should appear once within the final 100 words.",
    ),
    makeCheck("minimum_word_count", words.length >= options.minWords, `Draft should have at least ${options.minWords} words.`),
    makeCheck("single_h1", h1s.length === 1, "Draft should contain exactly one H1."),
    makeCheck(
      "heading_hierarchy",
      hasValidHeadingHierarchy(headings),
      "Headings should not skip levels; use H2 for main sections, then H3 and H4 for nested subsections.",
    ),
    makeCheck("h1_contains_keyword", h1s.some((heading) => countKeyword(heading.text, keyword) > 0), "H1 should contain the primary keyword."),
    makeCheck(
      "h2_contains_keyword",
      h2s.some((heading) => countKeyword(heading.text, keyword) > 0),
      "At least one H2 should contain the primary keyword naturally.",
    ),
    makeCheck("image_alt_text", emptyAltImages.length === 0, "Every uploaded image should have descriptive alt text."),
    makeCheck(
      "no_high_risk_ymyl_language",
      ymylRiskMatches.length === 0,
      "Draft should avoid personalized recommendations, best/optimal claims, guarantees, fake ratings, risk-free claims, and 100% accuracy claims.",
    ),
    makeCheck(
      "internal_link_presence",
      internalLinks.length > 0,
      "Draft should include at least one internal link to the calculator or a relevant supporting guide.",
    ),
    makeCheck(
      "official_source_link_presence",
      officialSourceLinks.length > 0,
      "Draft should include at least one official source link for tax, Medicare, ACA, Social Security, or government rule context.",
    ),
  ];
  const manualReview = [
    makeCheck(
      "preferred_blog_word_count",
      words.length >= options.preferredWords,
      `Blog posts are preferably ${options.preferredWords}+ words when the topic supports it.`,
    ),
    makeCheck(
      "keyword_density_review",
      keywordDensity >= options.densityMin && keywordDensity <= options.densityMax,
      `Primary keyword density review target is ${options.densityMin}%-${options.densityMax}% without keyword stuffing.`,
    ),
    makeCheck(
      "h2_outline_review",
      h2s.length >= 2,
      "H2 elements should form the article outline; add enough main sections for the search intent.",
    ),
    makeCheck(
      "paragraph_text_structure",
      paragraphs.length > 0,
      "Normal body text should use paragraphs, not heading tags.",
    ),
    makeCheck(
      "strong_emphasis_review",
      strongPhrases.length > 0,
      "Use strong emphasis only for important terms or high-value phrases when it improves scanning.",
    ),
  ];

  return {
    emptyAltImageCount: emptyAltImages.length,
    hardChecks,
    headingCounts: {
      h1: h1s.length,
      h2: h2s.length,
    },
    keyword,
    keywordDensity: Number(keywordDensity.toFixed(2)),
    keywordOccurrences,
    manualReview,
    ok: hardChecks.every((check) => check.passed),
    preferredReady: manualReview.every((check) => check.passed),
    linkSummary: {
      internalLinkCount: internalLinks.length,
      officialSourceLinkCount: officialSourceLinks.length,
      totalLinkCount: links.length,
    },
    semanticSummary: {
      paragraphCount: paragraphs.length,
      strongPhraseCount: strongPhrases.length,
      validHeadingHierarchy: hasValidHeadingHierarchy(headings),
    },
    wordCount: words.length,
    ymylRiskMatches,
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = path.resolve(args.file);
  const source = fs.readFileSync(filePath, "utf8");
  const result = reviewBlogDraft(source, args);

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
