import fs from "node:fs";
import { pathToFileURL } from "node:url";

const DEFAULT_REVIEW_PATH = "blog-review-result.json";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readJson(filePath) {
  const bytes = fs.readFileSync(filePath);
  const hasUtf16Bom = bytes[0] === 0xff && bytes[1] === 0xfe;
  const hasUtf16Nulls = bytes.length > 5 && bytes[3] === 0 && bytes[5] === 0;
  const raw = bytes.toString(hasUtf16Bom || hasUtf16Nulls ? "utf16le" : "utf8").replace(/^\uFEFF/, "").trim();

  assert(raw.startsWith("{") && raw.endsWith("}"), `${filePath} must contain a single JSON object`);

  return JSON.parse(raw);
}

function findCheck(checks, id) {
  return checks.find((check) => check.id === id);
}

function validateChecks(review) {
  assert(Array.isArray(review.hardChecks), "blog review hardChecks must be an array");
  assert(Array.isArray(review.manualReview), "blog review manualReview must be an array");

  for (const id of [
    "keyword_first_100_words",
    "keyword_final_100_words",
    "minimum_word_count",
    "single_h1",
    "heading_hierarchy",
    "h1_contains_keyword",
    "h2_contains_keyword",
    "image_alt_text",
  ]) {
    const check = findCheck(review.hardChecks, id);
    assert(check, `blog review hard check missing ${id}`);
    assert(check.passed === true, `blog review hard check failed: ${id}`);
  }

  for (const id of [
    "preferred_blog_word_count",
    "keyword_density_review",
    "h2_outline_review",
    "paragraph_text_structure",
    "strong_emphasis_review",
  ]) {
    const check = findCheck(review.manualReview, id);
    assert(check, `blog review manual check missing ${id}`);
  }
}

export function validateBlogReviewEvidence(review) {
  assert(review.ok === true, "blog review evidence must have ok: true");
  assert(typeof review.keyword === "string" && review.keyword.length > 0, "blog review keyword is missing");
  assert(Number.isFinite(review.wordCount) && review.wordCount >= 800, "blog review wordCount must be at least 800");
  assert(Number.isFinite(review.keywordOccurrences) && review.keywordOccurrences > 0, "blog review keywordOccurrences must be positive");
  assert(Number.isFinite(review.keywordDensity), "blog review keywordDensity must be numeric");
  assert(review.emptyAltImageCount === 0, "blog review must not have empty image alt text");
  assert(review.headingCounts?.h1 === 1, "blog review must have exactly one H1");
  assert(review.headingCounts?.h2 >= 1, "blog review must have at least one H2");
  assert(review.semanticSummary?.validHeadingHierarchy === true, "blog review semanticSummary must confirm heading hierarchy");
  assert(review.semanticSummary?.paragraphCount > 0, "blog review semanticSummary must include paragraph evidence");

  validateChecks(review);
}

function run() {
  const reviewPath = process.argv[2] || DEFAULT_REVIEW_PATH;
  const review = readJson(reviewPath);

  validateBlogReviewEvidence(review);

  console.log(
    JSON.stringify(
      {
        blogReviewFile: reviewPath,
        hardCheckCount: review.hardChecks.length,
        keyword: review.keyword,
        manualReviewCount: review.manualReview.length,
        ok: true,
        preferredReady: review.preferredReady === true,
        semanticSummary: review.semanticSummary,
        wordCount: review.wordCount,
      },
      null,
      2,
    ),
  );
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
