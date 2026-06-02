import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  calculatorHowToJsonLd,
  contentWebPageJsonLd,
  homepageWebPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/core/seo/json-ld";
import { siteConfig } from "@/core/seo/site-config";
import { blogPosts } from "@/content/blog";

function walkJson(value: unknown): Array<{ key: string; value: unknown }> {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => walkJson(item));
  }

  return Object.entries(value).flatMap(([key, item]) => [{ key, value: item }, ...walkJson(item)]);
}

describe("structured data", () => {
  it("builds Article JSON-LD with authorship, dates, canonical URL, and publisher", () => {
    const jsonLd = articleJsonLd({
      slug: "roth-conversion-5-year-rule",
      title: "How the 5-Year Rule Works for Roth Conversions",
      description: "Learn why Roth conversion timing matters.",
      author: "Roth Conversion Calculator Editorial Team",
      reviewer: "Editorial review pending",
      datePublished: "2026-05-01",
      dateModified: "2026-05-02",
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "How the 5-Year Rule Works for Roth Conversions",
      datePublished: "2026-05-01",
      dateModified: "2026-05-02",
      author: {
        "@type": "Organization",
        name: "Roth Conversion Calculator Editorial Team",
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.siteName,
      },
    });
    expect(jsonLd.mainEntityOfPage).toBe(
      "https://www.roth-conversion-calculator-ai.shop/blog/roth-conversion-5-year-rule",
    );
  });

  it("builds BreadcrumbList JSON-LD with absolute item URLs", () => {
    const jsonLd = breadcrumbJsonLd([
      { name: "Calculator", path: "/" },
      { name: "Guides", path: "/blog" },
      { name: "5-Year Rule", path: "/blog/roth-conversion-5-year-rule" },
    ]);

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement).toHaveLength(3);
    expect(jsonLd.itemListElement[1]).toMatchObject({
      "@type": "ListItem",
      position: 2,
      name: "Guides",
      item: "https://www.roth-conversion-calculator-ai.shop/blog",
    });
  });

  it("builds content WebPage JSON-LD for priority educational pages", () => {
    const jsonLd = contentWebPageJsonLd({
      path: "/roth-conversion-irmaa-guide",
      name: "Roth Conversion IRMAA Guide",
      description: "Educational Roth conversion IRMAA guide.",
      about: ["Roth conversion income", "Medicare IRMAA review"],
    });

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://www.roth-conversion-calculator-ai.shop/roth-conversion-irmaa-guide#webpage",
      url: "https://www.roth-conversion-calculator-ai.shop/roth-conversion-irmaa-guide",
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    });
    expect(jsonLd.about).toContain("Medicare IRMAA review");
  });

  it("builds calculator HowTo and Organization JSON-LD for homepage SEO", () => {
    const howTo = calculatorHowToJsonLd();
    const organization = organizationJsonLd();
    const website = websiteJsonLd();
    const webPage = homepageWebPageJsonLd();
    const application = webApplicationJsonLd();

    expect(howTo).toMatchObject({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to use the Roth Conversion Calculator",
    });
    expect(howTo.step).toHaveLength(4);
    expect(howTo.step[0]).toMatchObject({
      "@type": "HowToStep",
      position: 1,
    });
    expect(organization).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
    });
    expect(website).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.siteUrl}/#website`,
      url: siteConfig.siteUrl,
      publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    });
    expect(webPage).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/#webpage`,
      url: siteConfig.siteUrl,
      isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      mainEntity: { "@id": `${siteConfig.siteUrl}/#application` },
    });
    expect(application).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${siteConfig.siteUrl}/#application`,
      url: siteConfig.siteUrl,
      provider: { "@id": `${siteConfig.siteUrl}/#organization` },
    });
  });

  it("keeps homepage structured data source-aligned and free of unsafe SEO shortcuts", () => {
    const nodes = [
      webApplicationJsonLd(),
      websiteJsonLd(),
      homepageWebPageJsonLd(),
      organizationJsonLd(),
      calculatorHowToJsonLd(),
    ];
    const serialized = JSON.stringify(nodes);
    const allEntries = nodes.flatMap((node) => walkJson(node));
    const allKeys = allEntries.map((entry) => entry.key);
    const allUrls = allEntries
      .filter(
        (entry) =>
          typeof entry.value === "string" &&
          /^https?:\/\//.test(entry.value) &&
          ["@id", "url", "item", "mainEntityOfPage"].includes(entry.key),
      )
      .map((entry) => entry.value as string);

    expect(allKeys).not.toContain("aggregateRating");
    expect(allKeys).not.toContain("review");
    expect(serialized).not.toMatch(/optimal conversion amount|hidden fees|guaranteed|100%\s+accurate/i);
    expect(serialized).not.toMatch(/voiceInput|voiceOutput|reviewCount|ratingValue/i);
    expect(allUrls.every((url) => url.startsWith(siteConfig.siteUrl))).toBe(true);
  });

  it("mounts Article and Breadcrumb structured data on dynamic content pages", () => {
    const blogPage = fs.readFileSync(path.join(process.cwd(), "src/app/blog/[slug]/page.tsx"), "utf8");
    const blogIndex = fs.readFileSync(path.join(process.cwd(), "src/app/blog/page.tsx"), "utf8");
    const statePage = fs.readFileSync(path.join(process.cwd(), "src/app/states/[state]/page.tsx"), "utf8");
    const structuredDataEvidenceScript = fs.readFileSync(
      path.join(process.cwd(), "scripts/structured-data-evidence.mjs"),
      "utf8",
    );

    expect(blogPage).toContain("articleJsonLd");
    expect(blogPage).toContain("breadcrumbJsonLd");
    expect(blogPage).toContain("Related guides");
    expect(blogPage).toContain("Open the calculator");
    expect(blogIndex).toContain("Topics");
    expect(statePage).toContain("breadcrumbJsonLd");
    expect(blogPosts.length).toBeGreaterThanOrEqual(13);
    expect(structuredDataEvidenceScript).toContain("src/content/blog.ts");
    expect(structuredDataEvidenceScript).toContain("fileURLToPath(import.meta.url)");
    expect(structuredDataEvidenceScript).toContain("readBlogArticlePages");
    expect(structuredDataEvidenceScript).toContain('path: `/blog/${slug}`');
    expect(structuredDataEvidenceScript).toContain('requiredTypes: ["Article", "BreadcrumbList"]');
  });

  it("mounts WebPage and Breadcrumb structured data on priority educational pages", () => {
    const appDir = path.join(process.cwd(), "src/app");
    const guidePagePaths = fs
      .readdirSync(appDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => name.startsWith("roth-conversion-") || ["calculator-assumptions-guide", "cpa-review-checklist"].includes(name))
      .map((name) => path.join(appDir, name, "page.tsx"))
      .filter((pagePath) => fs.existsSync(pagePath));
    const priorityPagePaths = [...guidePagePaths, path.join(appDir, "tax-brackets/2026/page.tsx")];

    expect(priorityPagePaths.length).toBeGreaterThanOrEqual(19);

    for (const pagePath of priorityPagePaths) {
      const page = fs.readFileSync(pagePath, "utf8");

      expect(page).toContain("breadcrumbJsonLd");
      expect(page).toContain("contentWebPageJsonLd");
      expect(page).toContain('type="application/ld+json"');
    }
  });

  it("mounts HowTo and Organization structured data on the homepage", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).toContain("calculatorHowToJsonLd");
    expect(homePage).toContain("organizationJsonLd");
    expect(homePage).toContain("websiteJsonLd");
    expect(homePage).toContain("homepageWebPageJsonLd");
  });
});
