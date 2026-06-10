import { blogPosts } from "@/content/blog";
import { glossaryTerms } from "@/content/glossary";
import { statePages } from "@/content/state-pages";
import { featureRegistry, getEnabledFeatureIds } from "@/core/features/feature-registry";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";
import { buildLaunchReadinessGroups } from "@/content/launch-readiness";

export interface BuildHealthPayloadOptions {
  packageVersion: string;
  now?: Date;
}

export function buildHealthPayload({ packageVersion, now = new Date() }: BuildHealthPayloadOptions) {
  const enabledFeatureIds = getEnabledFeatureIds();
  const launchReadinessItems = buildLaunchReadinessGroups().flatMap((group) => group.items);
  const aiCrossCheck = launchReadinessItems.find((item) => item.label === "AI model cross-check");
  const professionalReview = launchReadinessItems.find((item) => item.label === "CPA review");

  return {
    status: "ok",
    app: "roth-conversion-calculator",
    version: packageVersion,
    checkedAt: now.toISOString(),
    taxYear: TAX_DATA_FRESHNESS.taxYear,
    taxData: {
      lastUpdated: TAX_DATA_FRESHNESS.lastUpdated,
      reviewedMonth: TAX_DATA_FRESHNESS.reviewedMonth,
      professionalReviewStatus: TAX_DATA_FRESHNESS.professionalReviewStatus,
      updateWindow: TAX_DATA_FRESHNESS.updateWindow,
    },
    content: {
      blogPosts: blogPosts.length,
      glossaryTerms: glossaryTerms.length,
      statePages: statePages.length,
    },
    features: {
      total: featureRegistry.length,
      enabled: enabledFeatureIds.length,
    },
    reviewStatus: {
      aiModelCrossCheck: aiCrossCheck?.status ?? "pending",
      aiModelCrossCheckBoundary:
        "AI-assisted cross-checks and deterministic verifier evidence support review preparation but do not replace qualified tax professional review.",
      qualifiedProfessionalReview: professionalReview?.status ?? "pending",
      qualifiedProfessionalReviewBoundary:
        "Qualified CPA, EA, or tax attorney review remains pending until a redacted human review record passes ops:cpa-review-evidence-validate.",
    },
  };
}
