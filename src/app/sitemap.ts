import type { MetadataRoute } from "next";
import { ageScenarioPages } from "@/content/age-scenario-pages";
import { basisPlanningPages } from "@/content/basis-planning-pages";
import { blogPosts } from "@/content/blog";
import { exampleScenarioPages } from "@/content/example-scenario-pages";
import { filingStatusPages } from "@/content/filing-status-pages";
import { glossaryTerms } from "@/content/glossary";
import { keywordLandingPages } from "@/content/keyword-landing-pages";
import { multiYearPlanningPages } from "@/content/multi-year-planning-pages";
import { statePages } from "@/content/state-pages";
import { taxBracketRatePages } from "@/content/tax-bracket-rate-pages";
import { taxInteractionPages } from "@/content/tax-interaction-pages";
import { taxPaymentMethodPages } from "@/content/tax-payment-method-pages";
import { siteConfig } from "@/core/seo/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/age-scenarios",
    "/ai-compliance-audit",
    "/basis",
    "/blog",
    "/calculator-assumptions-guide",
    "/calculators",
    "/content-operations",
    "/cpa-review-checklist",
    "/examples",
    "/feedback-roadmap",
    "/filing-status",
    "/glossary",
    "/multi-year-planning",
    "/states",
    "/tax-brackets/2026",
    "/tax-data-update",
    "/tax-interactions",
    "/tax-payment-methods",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/about",
    "/accessibility-audit",
    "/methodology",
    "/performance-audit",
    "/production-launch",
    "/privacy-data-flow",
    "/editorial-policy",
    "/launch-readiness",
    "/release-notes",
    "/roth-conversion-estimated-tax-guide",
    "/roth-conversion-capital-gains-guide",
    "/roth-conversion-aca-premium-tax-credit-guide",
    "/roth-conversion-irmaa-guide",
    "/roth-conversion-niit-guide",
    "/roth-conversion-5-year-rules",
    "/roth-conversion-custodian-process",
    "/roth-conversion-cpa-questions",
    "/roth-conversion-mistakes",
    "/roth-conversion-planning-checklist",
    "/roth-conversion-qcd-guide",
    "/roth-conversion-recharacterization-guide",
    "/roth-conversion-rmd-guide",
    "/roth-conversion-social-security-tax-guide",
    "/roth-conversion-tax-forms",
    "/roth-conversion-timeline",
    "/seo-monitoring",
    "/site-index",
  ];
  return [
    ...staticRoutes.map((route) => {
      const isHome = route === "";
      const isCalculatorHub = route === "/calculators";
      const isCoreReference = ["/tax-brackets/2026", "/filing-status", "/age-scenarios", "/examples"].includes(route);

      return {
        url: `${siteConfig.siteUrl}${route}`,
        lastModified: new Date("2026-05-01"),
        changeFrequency: "weekly" as const,
        priority: isHome ? 1 : isCalculatorHub ? 0.9 : isCoreReference ? 0.85 : 0.7,
      };
    }),
    ...blogPosts.map((post) => ({
      url: `${siteConfig.siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.lastUpdated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...glossaryTerms.map((term) => ({
      url: `${siteConfig.siteUrl}/glossary/${term.slug}`,
      lastModified: new Date("2026-05-02"),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...filingStatusPages.map((page) => ({
      url: `${siteConfig.siteUrl}/filing-status/${page.slug}`,
      lastModified: new Date("2026-05-02"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...ageScenarioPages.map((page) => ({
      url: `${siteConfig.siteUrl}/age-scenarios/${page.slug}`,
      lastModified: new Date("2026-05-02"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...basisPlanningPages.map((page) => ({
      url: `${siteConfig.siteUrl}/basis/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...exampleScenarioPages.map((page) => ({
      url: `${siteConfig.siteUrl}/examples/${page.slug}`,
      lastModified: new Date("2026-05-02"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...keywordLandingPages.map((page) => ({
      url: `${siteConfig.siteUrl}/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...multiYearPlanningPages.map((page) => ({
      url: `${siteConfig.siteUrl}/multi-year-planning/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...taxBracketRatePages.map((page) => ({
      url: `${siteConfig.siteUrl}/tax-brackets/2026/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
    ...taxInteractionPages.map((page) => ({
      url: `${siteConfig.siteUrl}/tax-interactions/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...taxPaymentMethodPages.map((page) => ({
      url: `${siteConfig.siteUrl}/tax-payment-methods/${page.slug}`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...statePages.map((page) => ({
      url: `${siteConfig.siteUrl}/states/${page.slug}`,
      lastModified: new Date("2026-05-01"),
      changeFrequency: "monthly" as const,
      priority: 0.72,
    })),
  ];
}
