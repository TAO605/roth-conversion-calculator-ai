import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  getTaxInteractionPageBySlug,
  taxInteractionPages,
} from "@/content/tax-interaction-pages";
import sitemap from "@/app/sitemap";

describe("tax interaction SEO pages", () => {
  it("defines educational pages for important interactions with clear modeling boundaries", () => {
    const slugs = new Set(taxInteractionPages.map((page) => page.slug));
    const irmaaPage = getTaxInteractionPageBySlug("irmaa");

    expect(taxInteractionPages).toHaveLength(4);
    expect(slugs.size).toBe(4);
    expect(taxInteractionPages.map((page) => page.slug)).toEqual(["irmaa", "aca-premium-tax-credit", "niit", "rmds"]);
    expect(taxInteractionPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(taxInteractionPages.every((page) => page.modelingStatus.match(/bounded|preview/i))).toBe(true);
    expect(irmaaPage?.modelingStatus).toContain("bounded 2026 Part B and Part D IRMAA proxy previews");
    expect(irmaaPage?.modelingStatus).toContain("final IRMAA billing");
    expect(getTaxInteractionPageBySlug("aca-premium-tax-credit")?.modelingStatus).toContain("bounded APTC at-stake preview");
    expect(getTaxInteractionPageBySlug("niit")?.modelingStatus).toContain("bounded 3.8% NIIT preview");
    expect(getTaxInteractionPageBySlug("rmds")?.modelingStatus).toContain("bounded Uniform Lifetime Table RMD preview");
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
