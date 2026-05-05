import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { articleJsonLd, breadcrumbJsonLd, calculatorHowToJsonLd, organizationJsonLd } from "@/core/seo/json-ld";
import { siteConfig } from "@/core/seo/site-config";

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

  it("builds calculator HowTo and Organization JSON-LD for homepage SEO", () => {
    const howTo = calculatorHowToJsonLd();
    const organization = organizationJsonLd();

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
  });

  it("mounts Article and Breadcrumb structured data on dynamic content pages", () => {
    const blogPage = fs.readFileSync(path.join(process.cwd(), "src/app/blog/[slug]/page.tsx"), "utf8");
    const blogIndex = fs.readFileSync(path.join(process.cwd(), "src/app/blog/page.tsx"), "utf8");
    const statePage = fs.readFileSync(path.join(process.cwd(), "src/app/states/[state]/page.tsx"), "utf8");

    expect(blogPage).toContain("articleJsonLd");
    expect(blogPage).toContain("breadcrumbJsonLd");
    expect(blogPage).toContain("Related guides");
    expect(blogPage).toContain("Open the calculator");
    expect(blogIndex).toContain("Topics");
    expect(statePage).toContain("breadcrumbJsonLd");
  });

  it("mounts HowTo and Organization structured data on the homepage", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).toContain("calculatorHowToJsonLd");
    expect(homePage).toContain("organizationJsonLd");
  });
});
