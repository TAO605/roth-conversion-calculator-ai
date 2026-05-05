import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  buildFilingStatusCalculatorHref,
  filingStatusPages,
  getFilingStatusPageBySlug,
} from "@/content/filing-status-pages";
import sitemap from "@/app/sitemap";

describe("filing status SEO pages", () => {
  it("defines four unique filing status pages with substantive content", () => {
    const slugs = new Set(filingStatusPages.map((page) => page.slug));

    expect(filingStatusPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(filingStatusPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
  });

  it("builds calculator prefill links with the selected filing status", () => {
    const page = getFilingStatusPageBySlug("married-filing-jointly");

    expect(page).toBeDefined();

    const href = buildFilingStatusCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      filingStatus: "married_joint",
      taxYear: 2026,
    });
  });

  it("adds filing status pages to sitemap and renders a dynamic route", () => {
    const urls = sitemap().map((entry) => entry.url);
    const pageFile = fs.readFileSync(path.join(process.cwd(), "src/app/filing-status/[status]/page.tsx"), "utf8");

    for (const page of filingStatusPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/filing-status/${page.slug}`);
    }

    expect(pageFile).toContain("generateStaticParams");
    expect(pageFile).toContain("buildFilingStatusCalculatorHref");
    expect(pageFile).toContain("Open the calculator");
  });

  it("adds a filing status hub page with crawl paths to every status detail page", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/filing-status/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/filing-status");
    expect(hubFile).toContain("Roth Conversion Calculator by Filing Status");
    expect(hubFile).toContain("filingStatusPages.map");

    expect(hubFile).toContain('href={`/filing-status/${page.slug}`}');

    expect(homePage).toContain('href="/filing-status"');
  });
});
