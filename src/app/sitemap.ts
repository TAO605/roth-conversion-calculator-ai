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

type StaticSitemapRoute = {
  path: string;
  lastModified: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: StaticSitemapRoute[] = [
    { path: "", lastModified: "2026-05-30" },
    { path: "/age-scenarios", lastModified: "2026-05-02" },
    { path: "/ai-compliance-audit", lastModified: "2026-05-03" },
    { path: "/basis", lastModified: "2026-05-03" },
    { path: "/blog", lastModified: "2026-05-02" },
    { path: "/calculator-assumptions-guide", lastModified: "2026-05-04" },
    { path: "/calculators", lastModified: "2026-05-03" },
    { path: "/content-operations", lastModified: "2026-05-03" },
    { path: "/cpa-review-checklist", lastModified: "2026-05-03" },
    { path: "/examples", lastModified: "2026-05-02" },
    { path: "/feedback-roadmap", lastModified: "2026-05-03" },
    { path: "/filing-status", lastModified: "2026-05-02" },
    { path: "/glossary", lastModified: "2026-05-02" },
    { path: "/multi-year-planning", lastModified: "2026-05-03" },
    { path: "/states", lastModified: "2026-05-01" },
    { path: "/tax-brackets/2026", lastModified: "2026-05-30" },
    { path: "/tax-data-update", lastModified: "2026-05-30" },
    { path: "/tax-interactions", lastModified: "2026-05-03" },
    { path: "/tax-payment-methods", lastModified: "2026-05-03" },
    { path: "/privacy", lastModified: "2026-05-01" },
    { path: "/terms", lastModified: "2026-05-01" },
    { path: "/disclaimer", lastModified: "2026-05-01" },
    { path: "/about", lastModified: "2026-05-01" },
    { path: "/accessibility-audit", lastModified: "2026-05-03" },
    { path: "/methodology", lastModified: "2026-05-30" },
    { path: "/performance-audit", lastModified: "2026-05-03" },
    { path: "/production-launch", lastModified: "2026-05-03" },
    { path: "/privacy-data-flow", lastModified: "2026-05-03" },
    { path: "/editorial-policy", lastModified: "2026-05-01" },
    { path: "/launch-readiness", lastModified: "2026-05-02" },
    { path: "/release-notes", lastModified: "2026-05-30" },
    { path: "/roth-conversion-estimated-tax-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-capital-gains-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-aca-premium-tax-credit-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-irmaa-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-niit-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-5-year-rules", lastModified: "2026-05-03" },
    { path: "/roth-conversion-custodian-process", lastModified: "2026-05-04" },
    { path: "/roth-conversion-cpa-questions", lastModified: "2026-05-04" },
    { path: "/roth-conversion-mistakes", lastModified: "2026-05-04" },
    { path: "/roth-conversion-planning-checklist", lastModified: "2026-05-04" },
    { path: "/roth-conversion-qcd-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-recharacterization-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-rmd-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-social-security-tax-guide", lastModified: "2026-05-04" },
    { path: "/roth-conversion-tax-forms", lastModified: "2026-05-04" },
    { path: "/roth-conversion-timeline", lastModified: "2026-05-04" },
    { path: "/seo-monitoring", lastModified: "2026-05-30" },
    { path: "/site-index", lastModified: "2026-05-03" },
  ];
  return [
    ...staticRoutes.map((route) => {
      const isHome = route.path === "";
      const isCalculatorHub = route.path === "/calculators";
      const isCoreReference = ["/tax-brackets/2026", "/filing-status", "/age-scenarios", "/examples"].includes(
        route.path,
      );

      return {
        url: `${siteConfig.siteUrl}${route.path}`,
        lastModified: new Date(route.lastModified),
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
