import { blogPosts } from "@/content/blog";
import { glossaryTerms } from "@/content/glossary";
import { statePages } from "@/content/state-pages";
import { featureRegistry, getEnabledFeatureIds } from "@/core/features/feature-registry";
import { TAX_DATA_FRESHNESS } from "@/core/tax-data/freshness";

export interface BuildHealthPayloadOptions {
  packageVersion: string;
  now?: Date;
}

export function buildHealthPayload({ packageVersion, now = new Date() }: BuildHealthPayloadOptions) {
  const enabledFeatureIds = getEnabledFeatureIds();

  return {
    status: "ok",
    app: "roth-conversion-calculator",
    version: packageVersion,
    checkedAt: now.toISOString(),
    taxYear: TAX_DATA_FRESHNESS.taxYear,
    taxData: {
      reviewedMonth: TAX_DATA_FRESHNESS.reviewedMonth,
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
  };
}
