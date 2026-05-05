import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { blogPosts } from "@/content/blog";
import robots from "@/app/robots";
import { buildLlmsText } from "@/core/seo/llms";

describe("llms.txt", () => {
  it("builds a machine-readable site index with core calculator and compliance context", () => {
    const text = buildLlmsText(blogPosts);

    expect(text).toContain("# Roth Conversion Calculator");
    expect(text).toContain("Educational and illustrative purposes only");
    expect(text).toContain("https://www.roth-conversion-calculator-ai.shop/#calculator");
    expect(text).toContain("https://www.roth-conversion-calculator-ai.shop/methodology");
    expect(text).toContain("https://www.roth-conversion-calculator-ai.shop/disclaimer");
    expect(text).toContain("https://www.roth-conversion-calculator-ai.shop/calculators");
    expect(text).toContain("https://www.roth-conversion-calculator-ai.shop/tax-brackets/2026");
    expect(text).toContain(`https://www.roth-conversion-calculator-ai.shop/blog/${blogPosts[0].slug}`);
  });

  it("exposes llms.txt from an app route and robots metadata", () => {
    const route = fs.readFileSync(path.join(process.cwd(), "src/app/llms.txt/route.ts"), "utf8");
    const robotsConfig = robots();

    expect(route).toContain("buildLlmsText");
    expect(route).toContain("text/plain");
    expect(JSON.stringify(robotsConfig)).toContain("https://www.roth-conversion-calculator-ai.shop/llms.txt");
  });
});
