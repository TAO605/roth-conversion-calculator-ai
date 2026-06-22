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

function pushIf(condition, findings, code, detail) {
  if (condition) findings.push({ code, detail });
}

function buildPseoBatchQualityGate(projectRoot = process.cwd()) {
  const contentText = readText(projectRoot, CONTENT_PATH);
  const templateText = readText(projectRoot, TEMPLATE_PATH);
  const sitemapText = readText(projectRoot, SITEMAP_PATH);
  const findings = [];

  const slugs = extractStringValues(contentText, "slug");
  const keywords = extractStringValues(contentText, "keyword");
  const titles = extractStringValues(contentText, "title");
  const descriptions = extractStringValues(contentText, "description");
  const intents = extractStringValues(contentText, "intent");
  const resultFocus = extractStringValues(contentText, "resultFocus");
  const disclaimers = extractStringValues(contentText, "disclaimer");

  const slugCount = slugs.length;
  const paragraphBlockCount = countMatches(contentText, /paragraphs:\s*\[/g);
  const sampleScenarioCount = countMatches(contentText, /^\s{4}sampleScenario:\s*{/gm);
  const sampleAssumptionCount = countMatches(contentText, /^\s{8}"[^"]+",$/gm);

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
      !templateText.includes("slice(0, 3)"),
    findings,
    "missing_three_related_internal_links",
    "Each page should render at least three related internal calculator links.",
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
    visibleResultPreview: templateText.includes("Sample result preview") && templateText.includes("calculateRothConversion"),
    atLeastThreeInternalLinks:
      templateText.includes("Related Roth conversion calculators") &&
      templateText.includes("relatedCalculatorPages.map") &&
      templateText.includes("slice(0, 3)"),
    sitemapCoverage: sitemapText.includes("keywordLandingPages.map"),
    noFakeTrustSignals: !/reviewRating|aggregateRating|ratingValue|reviewedBy/.test(contentText + templateText),
    ymylBoundary: !/best conversion amount|optimal conversion amount|guaranteed|100% accurate/i.test(
      contentText + templateText,
    ),
    externalLinksSafe: externalLinksMissingRel.length === 0,
    faqSchemaVisibleConsistency: !(templateText.includes("FAQPage") && !templateText.match(/Frequently Asked Questions|faq/i)),
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
      intentCount: intents.length,
      keywordCount: keywords.length,
      paragraphBlockCount,
      resultFocusCount: resultFocus.length,
      sampleAssumptionCount,
      sampleScenarioCount,
      slugCount,
      titleCount: titles.length,
    },
    findings,
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
