import { describe, expect, it } from "vitest";
import { normalizeSiteUrl } from "@/core/seo/site-config";

describe("site config", () => {
  it("normalizes the production site URL before sitemap and metadata use", async () => {
    expect(normalizeSiteUrl("https://www.roth-conversion-calculator-ai.shop/\n")).toBe(
      "https://www.roth-conversion-calculator-ai.shop",
    );
    expect(normalizeSiteUrl("")).toBe("https://www.roth-conversion-calculator-ai.shop");
    expect(normalizeSiteUrl(undefined)).toBe("https://www.roth-conversion-calculator-ai.shop");
  });
});
