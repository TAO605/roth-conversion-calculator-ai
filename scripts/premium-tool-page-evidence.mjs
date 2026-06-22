import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EVIDENCE_TYPE = "premium-tool-page-evidence";
const CONTENT_PATH = "src/content/keyword-landing-pages.ts";
const TEMPLATE_PATH = "src/app/(keyword-pages)/[keyword]/page.tsx";

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

function buildEvidence(projectRoot = process.cwd()) {
  const contentText = readText(path.join(projectRoot, CONTENT_PATH));
  const templateText = readText(path.join(projectRoot, TEMPLATE_PATH));
  const slugCount = countMatches(contentText, /slug:\s*"/g);
  const sampleScenarioCount = countMatches(contentText, /^\s{4}sampleScenario:\s*{/gm);
  const resultFocusCount = countMatches(contentText, /resultFocus:\s*"/g);
  const disclaimerCount = countMatches(contentText, /disclaimer:\s*"/g);
  const paragraphCount = countMatches(contentText, /paragraphs:\s*\[/g);
  const findings = [];

  if (slugCount === 0) findings.push("no_keyword_pages_found");
  if (sampleScenarioCount !== slugCount) findings.push("sample_scenario_count_mismatch");
  if (resultFocusCount !== slugCount) findings.push("result_focus_count_mismatch");
  if (disclaimerCount !== slugCount) findings.push("disclaimer_count_mismatch");
  if (paragraphCount !== slugCount) findings.push("paragraph_count_mismatch");
  if (!templateText.includes("Sample result preview")) findings.push("template_missing_sample_result_preview");
  if (!templateText.includes("calculateRothConversion")) findings.push("template_missing_calculated_sample_result");
  if (!templateText.includes("not stored user data")) findings.push("template_missing_private-data_boundary");
  if (!templateText.includes("not a recommended conversion amount")) findings.push("template_missing_recommendation_boundary");

  return {
    checkedAt: new Date().toISOString(),
    counts: {
      disclaimerCount,
      paragraphCount,
      resultFocusCount,
      sampleScenarioCount,
      slugCount,
    },
    decisionBoundary:
      "This evidence checks local keyword landing-page source and template readiness. It does not publish new pages.",
    evidenceType: EVIDENCE_TYPE,
    findings,
    ok: findings.length === 0,
    sourceFiles: [CONTENT_PATH, TEMPLATE_PATH],
  };
}

function main() {
  const outIndex = process.argv.indexOf("--out");
  const outPath = outIndex >= 0 ? process.argv[outIndex + 1] : "";
  const evidence = buildEvidence();
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

export { buildEvidence as buildPremiumToolPageEvidence };
