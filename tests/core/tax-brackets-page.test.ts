import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { FEDERAL_TAX_BRACKETS_2026 } from "@/core/tax-data/2026";
import sitemap from "@/app/sitemap";

describe("2026 federal tax brackets page", () => {
  it("keeps complete 2026 federal bracket data for all filing statuses", () => {
    expect(Object.keys(FEDERAL_TAX_BRACKETS_2026)).toHaveLength(4);
    expect(Object.values(FEDERAL_TAX_BRACKETS_2026).every((brackets) => brackets.length === 7)).toBe(true);
  });

  it("exposes the tax bracket page in sitemap and homepage navigation", () => {
    const urls = sitemap().map((entry) => entry.url);
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(urls).toContain("https://www.roth-conversion-calculator-ai.shop/tax-brackets/2026");
    expect(homePage).toContain('href="/site-index"');
  });

  it("renders an educational table page with calculator CTA and disclaimer", () => {
    const page = fs.readFileSync(path.join(process.cwd(), "src/app/tax-brackets/2026/page.tsx"), "utf8");

    expect(page).toContain("2026 Federal Tax Brackets");
    expect(page).toContain("FEDERAL_TAX_BRACKETS_2026");
    expect(page).toContain("Single");
    expect(page).toContain("Married filing jointly");
    expect(page).toContain("Open the calculator");
    expect(page).toContain("REQUIRED_DISCLAIMER");
  });
});
