import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";
import { homepageWebPageJsonLd, organizationJsonLd, websiteJsonLd } from "@/core/seo/json-ld";
import { siteConfig } from "@/core/seo/site-config";

describe("no-AI SEO metadata branding", () => {
  it("uses the professional calculator brand in global metadata", () => {
    expect(siteConfig.siteName).toBe("Roth Conversion Calculator");
    expect(metadata.title).toMatchObject({
      default: "Roth Conversion Calculator 2026 | Estimate Taxes & Break-Even",
    });
    expect(metadata.description).toContain("Free Roth conversion calculator for 2026");
    expect(metadata.description).not.toMatch(/\bAI Roth|Free AI\b/i);
    expect(metadata.openGraph).toMatchObject({
      title: "Roth Conversion Calculator 2026",
      siteName: "Roth Conversion Calculator",
    });
    expect(metadata.twitter).toMatchObject({
      title: "Roth Conversion Calculator 2026",
    });
  });

  it("keeps homepage structured data aligned with the no-AI brand", () => {
    const homepage = homepageWebPageJsonLd();
    const website = websiteJsonLd();
    const organization = organizationJsonLd();
    const serialized = JSON.stringify([homepage, website, organization]);

    expect(homepage.name).toBe("Roth Conversion Calculator 2026");
    expect(website.name).toBe("Roth Conversion Calculator");
    expect(organization.name).toBe("Roth Conversion Calculator");
    expect(serialized).not.toContain("AI Roth Conversion Calculator");
  });
});
