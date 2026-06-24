import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EVIDENCE_TYPE = "pseo-batch-quality-gate";
const CONTENT_PATH = "src/content/keyword-landing-pages.ts";
const TEMPLATE_PATH = "src/app/(keyword-pages)/[keyword]/page.tsx";
const SITEMAP_PATH = "src/app/sitemap.ts";

function readText(projectRoot, filePath) {
  return fs.readFileSync(path.join(projectRoot, filePath), "utf8").replace(/^\uFEFF/, "");
}

function extractStringValues(source, fieldName) {
  const pattern = new RegExp(`${fieldName}:\\s*"([^"]+)"`, "g");
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function countMatches(source, pattern) {
  return (source.match(pattern) || []).length;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return [...duplicates];
}

function countUniqueNonEmpty(values) {
  return new Set(values.filter((value) => String(value || "").trim().length > 0)).size;
}

function pushIf(condition, findings, code, detail) {
  if (condition) findings.push({ code, detail });
}

function buildPseoBatchQualityGate(projectRoot = process.cwd()) {
  const contentText = readText(projectRoot, CONTENT_PATH);
  const templateText = readText(projectRoot, TEMPLATE_PATH);
  const sitemapText = readText(projectRoot, SITEMAP_PATH);
  const findings = [];
  const warnings = [];

  const slugs = extractStringValues(contentText, "slug");
  const keywords = extractStringValues(contentText, "keyword");
  const titles = extractStringValues(contentText, "title");
  const descriptions = extractStringValues(contentText, "description");
  const intents = extractStringValues(contentText, "intent");
  const resultFocus = extractStringValues(contentText, "resultFocus");
  const disclaimers = extractStringValues(contentText, "disclaimer");
  const faqQuestions = extractStringValues(contentText, "question");
  const faqAnswers = extractStringValues(contentText, "answer");

  const slugCount = slugs.length;
  const paragraphBlockCount = countMatches(contentText, /paragraphs:\s*\[/g);
  const sampleScenarioCount = countMatches(contentText, /^\s{4}sampleScenario:\s*{/gm);
  const sampleAssumptionCount = countMatches(contentText, /^\s{8}"[^"]+",$/gm);
  const faqBlockCount = countMatches(contentText, /faqs:\s*\[/g);
  const minimumVariableCountPerPage = 15;
  const estimatedVariableSlotCount =
    8 +
    Math.floor(sampleAssumptionCount / Math.max(slugCount, 1)) +
    Math.floor(faqQuestions.length / Math.max(slugCount, 1)) * 2;

  pushIf(slugCount === 0, findings, "no_pages_found", "No keyword landing pages were found.");
  pushIf(findDuplicates(slugs).length > 0, findings, "duplicate_slugs", findDuplicates(slugs).join(", "));
  pushIf(findDuplicates(keywords).length > 0, findings, "duplicate_keywords", findDuplicates(keywords).join(", "));
  pushIf(findDuplicates(titles).length > 0, findings, "duplicate_titles", findDuplicates(titles).join(", "));
  pushIf(
    findDuplicates(descriptions).length > 0,
    findings,
    "duplicate_descriptions",
    findDuplicates(descriptions).join(", "),
  );
  pushIf(keywords.length !== slugCount, findings, "keyword_count_mismatch", `${keywords.length}/${slugCount}`);
  pushIf(titles.length !== slugCount, findings, "title_count_mismatch", `${titles.length}/${slugCount}`);
  pushIf(descriptions.length !== slugCount, findings, "description_count_mismatch", `${descriptions.length}/${slugCount}`);
  pushIf(intents.length !== slugCount, findings, "intent_count_mismatch", `${intents.length}/${slugCount}`);
  pushIf(resultFocus.length !== slugCount, findings, "result_focus_count_mismatch", `${resultFocus.length}/${slugCount}`);
  pushIf(disclaimers.length !== slugCount, findings, "disclaimer_count_mismatch", `${disclaimers.length}/${slugCount}`);
  pushIf(
    titles.some((title) => `${title} | Roth Conversion Calculator`.length < 50 || `${title} | Roth Conversion Calculator`.length > 70),
    warnings,
    "title_formula_length_outside_preferred_range",
    "Title formula should target 50-60 characters when natural; long-tail YMYL titles may exceed that to preserve clarity, but should stay under 70 where practical.",
  );
  pushIf(
    descriptions.some((description) => description.length < 120 || description.length > 160),
    findings,
    "description_length_outside_safe_range",
    "Meta descriptions should stay within a practical 120-160 character range, with 150-160 preferred when natural.",
  );
  pushIf(
    paragraphBlockCount !== slugCount,
    findings,
    "paragraph_block_count_mismatch",
    `${paragraphBlockCount}/${slugCount}`,
  );
  pushIf(
    sampleScenarioCount !== slugCount,
    findings,
    "sample_scenario_count_mismatch",
    `${sampleScenarioCount}/${slugCount}`,
  );
  pushIf(
    sampleAssumptionCount < slugCount * 3,
    findings,
    "sample_assumption_count_too_low",
    `${sampleAssumptionCount} assumptions for ${slugCount} pages`,
  );
  pushIf(
    estimatedVariableSlotCount < minimumVariableCountPerPage,
    findings,
    "variable_slot_count_too_low",
    `Estimated variable slots per page: ${estimatedVariableSlotCount}; minimum is ${minimumVariableCountPerPage}.`,
  );
  pushIf(faqBlockCount !== slugCount, findings, "faq_block_count_mismatch", `${faqBlockCount}/${slugCount}`);
  pushIf(
    faqQuestions.length < slugCount * 3 || faqQuestions.length > slugCount * 5,
    findings,
    "faq_question_count_outside_3_5_per_page",
    `${faqQuestions.length} FAQ questions for ${slugCount} pages`,
  );
  pushIf(
    faqAnswers.length !== faqQuestions.length,
    findings,
    "faq_answer_count_mismatch",
    `${faqAnswers.length}/${faqQuestions.length}`,
  );
  pushIf(
    countUniqueNonEmpty(faqQuestions) !== faqQuestions.length,
    findings,
    "duplicate_faq_questions",
    "FAQ questions must be unique across keyword landing pages.",
  );
  pushIf(
    faqAnswers.some((answer) => answer.split(/\s+/).filter(Boolean).length < 20),
    findings,
    "faq_answer_too_short",
    "FAQ answers should be substantive enough to answer the long-tail question.",
  );

  pushIf(
    !templateText.includes("alternates: { canonical: `/${page.slug}` }"),
    findings,
    "canonical_not_bound_to_slug",
    "Keyword page metadata should use each slug as the canonical path.",
  );
  pushIf(
    !sitemapText.includes("keywordLandingPages.map"),
    findings,
    "keyword_pages_not_in_sitemap",
    "Sitemap must include keyword landing pages.",
  );
  pushIf(
    !templateText.includes("Related Roth conversion calculators") ||
      !templateText.includes("relatedCalculatorPages.map") ||
      !templateText.includes("slice(0, 4)"),
    findings,
    "missing_four_related_internal_links",
    "Each page should render four to six related internal calculator links.",
  );
  pushIf(
    !templateText.includes("Sample result preview") || !templateText.includes("calculateRothConversion"),
    findings,
    "missing_visible_result_preview",
    "Each page should include a calculated sample result preview.",
  );
  pushIf(
    !templateText.includes("not stored user data") || !templateText.includes("not a recommended conversion amount"),
    findings,
    "missing_result_boundary_copy",
    "Sample result boundary copy must prevent personalized recommendation framing.",
  );
  pushIf(
    templateText.includes("FAQPage") && !templateText.match(/Frequently Asked Questions|faq/i),
    findings,
    "faq_schema_without_visible_faq",
    "FAQ structured data must not appear without visible FAQ content.",
  );
  pushIf(
    !templateText.includes("faqJsonLd(page.faqs)") || !templateText.includes("page.faqs.map"),
    findings,
    "missing_visible_faq_and_schema_binding",
    "Keyword pages should render visible FAQ content and matching FAQ structured data from the same source.",
  );
  pushIf(
    /reviewRating|aggregateRating|ratingValue|reviewedBy/.test(contentText + templateText),
    findings,
    "unsupported_trust_schema_or_rating",
    "Keyword landing pages must not include fake review, rating, or reviewer claims.",
  );
  pushIf(
    /best conversion amount|optimal conversion amount|guaranteed|100% accurate/i.test(contentText + templateText),
    findings,
    "ymyl_overclaim",
    "YMYL pages must avoid personalized recommendations, guarantees, and final-accuracy claims.",
  );

  const externalHrefMatches = [...templateText.matchAll(/<a\b[^>]*href=["']https?:\/\/[^"']+["'][^>]*>/gi)].map(
    (match) => match[0],
  );
  const externalLinksMissingRel = externalHrefMatches.filter(
    (anchor) => !/rel=["'][^"']*nofollow[^"']*noopener[^"']*noreferrer[^"']*["']/i.test(anchor),
  );
  pushIf(
    externalLinksMissingRel.length > 0,
    findings,
    "external_links_missing_nofollow",
    `${externalLinksMissingRel.length} external links are missing nofollow noopener noreferrer.`,
  );

  const gates = {
    uniqueTitles: findDuplicates(titles).length === 0 && titles.length === slugCount,
    uniqueDescriptions: findDuplicates(descriptions).length === 0 && descriptions.length === slugCount,
    uniqueCanonicals: findDuplicates(slugs).length === 0 && slugCount > 0,
    differentiatedToolInputs: sampleScenarioCount === slugCount && sampleAssumptionCount >= slugCount * 3,
    minimumVariableSlots: estimatedVariableSlotCount >= minimumVariableCountPerPage,
    faqPerPage: faqBlockCount === slugCount && faqQuestions.length >= slugCount * 3 && faqQuestions.length <= slugCount * 5,
    visibleResultPreview: templateText.includes("Sample result preview") && templateText.includes("calculateRothConversion"),
    fourToSixInternalRecommendations:
      templateText.includes("Related Roth conversion calculators") &&
      templateText.includes("relatedCalculatorPages.map") &&
      templateText.includes("slice(0, 4)"),
    sitemapCoverage: sitemapText.includes("keywordLandingPages.map"),
    noFakeTrustSignals: !/reviewRating|aggregateRating|ratingValue|reviewedBy/.test(contentText + templateText),
    ymylBoundary: !/best conversion amount|optimal conversion amount|guaranteed|100% accurate/i.test(
      contentText + templateText,
    ),
    externalLinksSafe: externalLinksMissingRel.length === 0,
    faqSchemaVisibleConsistency:
      templateText.includes("faqJsonLd(page.faqs)") &&
      templateText.includes("page.faqs.map") &&
      !(templateText.includes("FAQPage") && !templateText.match(/Frequently Asked Questions|faq/i)),
  };

  return {
    checkedAt: new Date().toISOString(),
    decisionBoundary:
      "This gate checks local pSEO page source and template readiness. It does not generate pages, publish content, or deploy production.",
    evidenceType: EVIDENCE_TYPE,
    files: [CONTENT_PATH, TEMPLATE_PATH, SITEMAP_PATH],
    gates,
    counts: {
      descriptionCount: descriptions.length,
      disclaimerCount: disclaimers.length,
      externalLinkCount: externalHrefMatches.length,
      faqAnswerCount: faqAnswers.length,
      faqBlockCount,
      faqQuestionCount: faqQuestions.length,
      intentCount: intents.length,
      keywordCount: keywords.length,
      paragraphBlockCount,
      resultFocusCount: resultFocus.length,
      sampleAssumptionCount,
      sampleScenarioCount,
      slugCount,
      titleCount: titles.length,
      estimatedVariableSlotCount,
    },
    findings,
    warnings,
    ok: findings.length === 0 && Object.values(gates).every(Boolean),
  };
}

function main() {
  const outIndex = process.argv.indexOf("--out");
  const outPath = outIndex >= 0 ? process.argv[outIndex + 1] : "";
  const evidence = buildPseoBatchQualityGate();
  const json = `${JSON.stringify(evidence, null, 2)}\n`;

  if (outPath) {
    fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
    fs.writeFileSync(outPath, json);
  }

  process.stdout.write(json);

  if (!evidence.ok) {
    process.exit(2);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
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
  }
}

export { buildPseoBatchQualityGate };
