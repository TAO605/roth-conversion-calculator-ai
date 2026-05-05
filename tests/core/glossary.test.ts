import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { glossaryTerms, getGlossaryTermBySlug } from "@/content/glossary";
import { definedTermSetJsonLd } from "@/core/seo/json-ld";
import sitemap from "@/app/sitemap";

describe("glossary content hub", () => {
  it("defines a substantive unique glossary library", () => {
    const slugs = new Set(glossaryTerms.map((term) => term.slug));

    expect(glossaryTerms.length).toBeGreaterThanOrEqual(12);
    expect(slugs.size).toBe(glossaryTerms.length);
    expect(glossaryTerms.every((term) => term.definition.length > 80 && term.relatedSlugs.length >= 2)).toBe(true);
  });

  it("looks up terms by slug", () => {
    expect(getGlossaryTermBySlug("after-tax-basis")?.title).toBe("After-Tax Basis");
    expect(getGlossaryTermBySlug("missing-term")).toBeUndefined();
  });

  it("adds glossary URLs to the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/glossary");
    for (const term of glossaryTerms) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/glossary/${term.slug}`);
    }
  });

  it("builds DefinedTermSet structured data", () => {
    const jsonLd = definedTermSetJsonLd(glossaryTerms);

    expect(jsonLd["@type"]).toBe("DefinedTermSet");
    expect(jsonLd.hasDefinedTerm).toHaveLength(glossaryTerms.length);
    expect(jsonLd.hasDefinedTerm[0]).toMatchObject({
      "@type": "DefinedTerm",
      name: glossaryTerms[0].title,
    });
  });

  it("mounts glossary routes and links from the homepage", () => {
    const indexPage = fs.readFileSync(path.join(process.cwd(), "src/app/glossary/page.tsx"), "utf8");
    const termPage = fs.readFileSync(path.join(process.cwd(), "src/app/glossary/[slug]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(indexPage).toContain("definedTermSetJsonLd");
    expect(termPage).toContain("generateStaticParams");
    expect(termPage).toContain("Related terms");
    expect(homePage).toContain('href="/glossary"');
  });
});
