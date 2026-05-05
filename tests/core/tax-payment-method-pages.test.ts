import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { decodeShareCode } from "@/common/storage/share-code";
import {
  buildTaxPaymentMethodCalculatorHref,
  getTaxPaymentMethodPageBySlug,
  taxPaymentMethodPages,
} from "@/content/tax-payment-method-pages";
import sitemap from "@/app/sitemap";

describe("tax payment method SEO pages", () => {
  it("defines three educational pages for calculator tax-payment methods", () => {
    const slugs = new Set(taxPaymentMethodPages.map((page) => page.slug));

    expect(taxPaymentMethodPages).toHaveLength(3);
    expect(slugs.size).toBe(3);
    expect(taxPaymentMethodPages.map((page) => page.taxPaymentMethod)).toEqual([
      "outside_funds",
      "withhold_from_ira",
      "not_sure",
    ]);
    expect(taxPaymentMethodPages.every((page) => page.paragraphs.length >= 3)).toBe(true);
    expect(taxPaymentMethodPages.every((page) => page.complianceNote.includes("educational"))).toBe(true);
  });

  it("builds calculator prefill links with the selected payment method", () => {
    const page = getTaxPaymentMethodPageBySlug("withhold-from-ira");

    expect(page).toBeDefined();

    const href = buildTaxPaymentMethodCalculatorHref(page!);
    const hash = href.split("#")[1];

    expect(href.startsWith("/#")).toBe(true);
    expect(decodeShareCode(hash)).toMatchObject({
      taxPaymentMethod: "withhold_from_ira",
      withheldForTaxes: 5000,
      age: 45,
      taxYear: 2026,
    });
  });

  it("adds a tax payment hub and detail pages to sitemap with static routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    const hubFile = fs.readFileSync(path.join(process.cwd(), "src/app/tax-payment-methods/page.tsx"), "utf8");
    const detailFile = fs.readFileSync(
      path.join(process.cwd(), "src/app/tax-payment-methods/[method]/page.tsx"),
      "utf8",
    );
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/tax-payment-methods");

    for (const page of taxPaymentMethodPages) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/tax-payment-methods/${page.slug}`);
    }

    expect(hubFile).toContain("Roth Conversion Tax Payment Methods");
    expect(hubFile).toContain("taxPaymentMethodPages.map");
    expect(detailFile).toContain("generateStaticParams");
    expect(detailFile).toContain("buildTaxPaymentMethodCalculatorHref");
    expect(homePage).toContain('href="/tax-payment-methods"');
  });
});
