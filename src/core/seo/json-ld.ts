import { siteConfig } from "@/core/seo/site-config";
import type { GlossaryTerm } from "@/content/glossary";

function absoluteUrl(path: string): string {
  if (path === "/") {
    return siteConfig.siteUrl;
  }

  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${siteConfig.siteUrl}/#application`,
    name: "Roth Conversion Calculator",
    url: siteConfig.siteUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "Educational Roth conversion calculator for estimating taxes, potential penalties, break-even years, and after-tax retirement value.",
    isAccessibleForFree: true,
    featureList: [
      "Federal tax estimate",
      "State tax assumption input",
      "Tax payment method comparison",
      "Tax interaction warnings",
      "Professional review packet",
    ],
    provider: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    inLanguage: "en-US",
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
  };
}

export function homepageWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.siteUrl}/#webpage`,
    url: siteConfig.siteUrl,
    name: "Roth Conversion Calculator 2026",
    description:
      "Educational Roth conversion calculator for modeling tax cost, break-even years, tax payment assumptions, and review items for professional discussion.",
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    mainEntity: {
      "@id": `${siteConfig.siteUrl}/#application`,
    },
    about: [
      "Roth conversion tax estimates",
      "Traditional IRA to Roth IRA conversion assumptions",
      "Federal tax brackets",
      "Professional tax review preparation",
    ],
  };
}

export interface ContentWebPageJsonLdInput {
  path: string;
  name: string;
  description: string;
  about: string[];
}

export function contentWebPageJsonLd(input: ContentWebPageJsonLdInput) {
  const url = absoluteUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${siteConfig.siteUrl}/#website`,
    },
    publisher: {
      "@id": `${siteConfig.siteUrl}/#organization`,
    },
    about: input.about,
  };
}

export function calculatorHowToJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use the Roth Conversion Calculator",
    description:
      "Educational steps for entering assumptions, reviewing tax-cost estimates, comparing projected values, and saving results for professional review.",
    totalTime: "PT3M",
    tool: [
      {
        "@type": "HowToTool",
        name: "Roth Conversion Calculator",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Enter conversion and account assumptions",
        text: "Enter the planned conversion amount, traditional IRA balance, after-tax basis, filing status, current taxable income, and state tax assumption.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Set age and tax payment assumptions",
        text: "Enter current age, retirement age, expected return, retirement marginal tax rate, and how conversion taxes may be paid.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review educational results",
        text: "Review estimated federal tax, state tax, modeled penalty, total upfront cost, break-even years, and projected after-tax value.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Save or share for professional review",
        text: "Copy, share, or download the educational output and review it with a licensed CPA, financial advisor, or tax professional before making decisions.",
      },
    ],
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ArticleJsonLdInput {
  slug: string;
  title: string;
  description: string;
  author: string;
  reviewer: string;
  datePublished: string;
  dateModified: string;
}

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(`/blog/${input.slug}`),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      "@type": "Organization",
      name: input.author,
    },
    reviewedBy: {
      "@type": "Organization",
      name: input.reviewer,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function definedTermSetJsonLd(terms: GlossaryTerm[]) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Roth Conversion Glossary",
    url: absoluteUrl("/glossary"),
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.title,
      description: term.shortDefinition,
      url: absoluteUrl(`/glossary/${term.slug}`),
    })),
  };
}
