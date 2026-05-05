import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  getTaxInteractionPageBySlug,
  taxInteractionPages,
} from "@/content/tax-interaction-pages";
import sitemap from "@/app/sitemap";

describe("tax interaction SEO pages", () => {
  it("defines educational pages for important interactions not modeled by the calculator", () => {
    const slugs = new Set(taxInteractionPages.map((page) => page.slug));

    expect(taxInteractionPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(taxInteractionPages.map((page) => page.slug)).toEqual(["irmaa", "aca-premium-tax-credit", "niit", "rmds"]);
    expect(taxInteractionPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(taxInteractionPages.every((page) => page.modelingStatus.includes("not modeled"))).toBe(true);
    expect(taxInteractionPages.every((page) => page.officialSourceUrl.startsWith("https://"))).toBe(true);
  });

  it("resolves pages by slug", () => {
    expect(getTaxInteractionPageBySlug("irmaa")?.title).toContain("IRMAA");
    expect(getTaxInteractionPageBySlug("missing")).toBeUndefined();
  });

  it("adds a tax interactions hub and detail pages to sitemap with homepage discovery", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/tax-interactions/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(path.join(process.cwd(), "src/app/tax-interactions/[interaction]/page.tsx"), "utf8");
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/tax-interactions");

    for (const page of taxInteractionPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/tax-interactions/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Tax Interactions");
    expect(hubFile).toContain("taxInteractionPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("officialSourceUrl");
    expect(homePage).toContain('href="/tax-interactions"');
  });
});
