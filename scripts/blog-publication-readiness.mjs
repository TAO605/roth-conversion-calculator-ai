import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { reviewBlogDraft } from "./blog-seo-review.mjs";
import { validateBlogReviewEvidence } from "./validate-blog-publication-evidence.mjs";

const DEFAULT_MIN_WORDS = 800;
const DEFAULT_PREFERRED_WORDS = 1500;
const DEFAULT_DENSITY_MIN = 2;
const DEFAULT_DENSITY_MAX = 4;

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
    } else if (arg === "--output") {
      args.output = next;
      index += 1;
    }
  }

  if (!args.file || !args.keyword) {
    throw new Error("Usage: node scripts/blog-publication-readiness.mjs --file draft.md --keyword \"primary keyword\"");
  }

  return args;
}

export function buildBlogPublicationReadiness(source, options) {
  const review = reviewBlogDraft(source, options);
  validateBlogReviewEvidence(review);
  const manualReviewRequired = review.preferredReady !== true;

  return {
    evidenceType: "blog-publication-readiness",
    keyword: review.keyword,
    manualReviewRequired,
    ok: true,
    preferredReady: review.preferredReady,
    publicationStatus: manualReviewRequired ? "manual-review-required" : "ready-for-publication",
    review,
    validation: {
      hardCheckCount: review.hardChecks.length,
      manualReviewCount: review.manualReview.length,
      semanticSummary: review.semanticSummary,
      wordCount: review.wordCount,
    },
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = path.resolve(args.file);
  const source = fs.readFileSync(filePath, "utf8");
  const result = {
    ...buildBlogPublicationReadiness(source, args),
    ...(args.output ? { outputPath: path.resolve(args.output) } : {}),
  };

  if (args.output) {
    const outputPath = path.resolve(args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  }

  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    run();
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          error: error instanceof Error ? error.message : String(error),
          evidenceType: "blog-publication-readiness",
          ok: false,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}
