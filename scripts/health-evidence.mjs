const DEFAULT_HEALTH_URL = "https://www.roth-conversion-calculator-ai.shop/api/health";
const healthUrl = process.env.HEALTH_EVIDENCE_URL || DEFAULT_HEALTH_URL;
const SECRET_PATTERNS = [/OPENAI/i, /API[_-]?KEY/i, /SECRET/i, /TOKEN/i];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchHealthPayload() {
  const response = await fetch(healthUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "roth-conversion-calculator-health-evidence/1.0",
    },
    redirect: "manual",
  });
  const text = await response.text();

  return {
    cacheControl: response.headers.get("cache-control") || "",
    contentType: response.headers.get("content-type") || "",
    payload: JSON.parse(text),
    status: response.status,
  };
}

function containsSecretLikeKey(value) {
  if (Array.isArray(value)) {
    return value.some(containsSecretLikeKey);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).some(([key, nestedValue]) => {
      return SECRET_PATTERNS.some((pattern) => pattern.test(key)) || containsSecretLikeKey(nestedValue);
    });
  }

  return false;
}

function validatePayload(result) {
  const { payload } = result;

  assert(result.status === 200, "Health endpoint must return HTTP 200");
  assert(result.contentType.includes("application/json"), "Health endpoint must return JSON");
  assert(result.cacheControl.includes("no-store"), "Health endpoint must retain no-store cache control");
  assert(payload.status === "ok", "Health payload status must be ok");
  assert(payload.app === "roth-conversion-calculator", "Health payload app changed unexpectedly");
  assert(typeof payload.version === "string" && payload.version.length > 0, "Health payload version is missing");
  assert(typeof payload.checkedAt === "string" && !Number.isNaN(Date.parse(payload.checkedAt)), "Health payload checkedAt is invalid");
  assert(payload.taxYear === 2026, "Health payload taxYear must remain 2026 for the current production tax data");
  assert(typeof payload.taxData?.lastUpdated === "string" && payload.taxData.lastUpdated.length > 0, "Health taxData.lastUpdated is missing");
  assert(
    typeof payload.taxData?.professionalReviewStatus === "string" &&
      payload.taxData.professionalReviewStatus.toLowerCase().includes("pending"),
    "Health professionalReviewStatus must retain pending review language",
  );
  assert(payload.content?.blogPosts >= 13, "Health payload blogPosts count is below expected production coverage");
  assert(payload.content?.glossaryTerms >= 12, "Health payload glossaryTerms count is below expected production coverage");
  assert(payload.features?.enabled > 10, "Health payload enabled feature count is unexpectedly low");
  assert(
    payload.reviewStatus?.aiModelCrossCheck === "complete",
    "Health payload must retain complete AI model cross-check status",
  );
  assert(
    typeof payload.reviewStatus?.aiModelCrossCheckBoundary === "string" &&
      payload.reviewStatus.aiModelCrossCheckBoundary.includes("do not replace"),
    "Health payload must retain AI cross-check non-replacement boundary",
  );
  assert(
    payload.reviewStatus?.qualifiedProfessionalReview === "pending",
    "Health payload must retain pending qualified professional review status",
  );
  assert(
    typeof payload.reviewStatus?.qualifiedProfessionalReviewBoundary === "string" &&
      payload.reviewStatus.qualifiedProfessionalReviewBoundary.includes("ops:cpa-review-evidence-validate"),
    "Health payload must retain CPA review evidence validator boundary",
  );
  assert(!containsSecretLikeKey(payload), "Health payload must not expose secret-like keys");

  return {
    appRetained: payload.app === "roth-conversion-calculator",
    blogCoverageRetained: payload.content.blogPosts >= 13,
    cacheNoStoreRetained: result.cacheControl.includes("no-store"),
    checkedAtRetained: typeof payload.checkedAt === "string" && !Number.isNaN(Date.parse(payload.checkedAt)),
    enabledFeatureCoverageRetained: payload.features.enabled > 10,
    glossaryCoverageRetained: payload.content.glossaryTerms >= 12,
    healthEndpointOk: true,
    aiModelCrossCheckComplete: payload.reviewStatus.aiModelCrossCheck === "complete",
    aiCrossCheckBoundaryRetained: payload.reviewStatus.aiModelCrossCheckBoundary.includes("do not replace"),
    noSecretLikeKeys: !containsSecretLikeKey(payload),
    professionalReviewPending: payload.taxData.professionalReviewStatus.toLowerCase().includes("pending"),
    qualifiedProfessionalReviewPending: payload.reviewStatus.qualifiedProfessionalReview === "pending",
    qualifiedProfessionalReviewValidatorRetained:
      payload.reviewStatus.qualifiedProfessionalReviewBoundary.includes("ops:cpa-review-evidence-validate"),
    statusOk: payload.status === "ok",
    taxDataLastUpdatedRetained: typeof payload.taxData.lastUpdated === "string" && payload.taxData.lastUpdated.length > 0,
    taxYearRetained: payload.taxYear === 2026,
  };
}

async function run() {
  const result = await fetchHealthPayload();
  const checks = validatePayload(result);

  console.log(
    JSON.stringify(
      {
        app: result.payload.app,
        cacheControl: result.cacheControl,
        checks,
        content: result.payload.content,
        checkedAt: new Date().toISOString(),
        evidenceType: "production-health-endpoint",
        features: result.payload.features,
        ok: true,
        reviewStatus: result.payload.reviewStatus,
        status: result.status,
        taxData: result.payload.taxData,
        taxYear: result.payload.taxYear,
        url: healthUrl,
        version: result.payload.version,
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
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "production-health-endpoint",
        ok: false,
        url: healthUrl,
      },
      null,
      2,
    ),
  );
  process.exit(1);
});
