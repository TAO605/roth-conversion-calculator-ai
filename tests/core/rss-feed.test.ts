import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { blogPosts } from "@/content/blog";
import robots from "@/app/robots";
import { buildRssFeedXml } from "@/core/seo/rss";

describe("RSS feed", () => {
  it("builds a valid RSS feed with every blog post", () => {
    const xml = buildRssFeedXml(blogPosts);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).toContain("<title>Roth Conversion Calculator</title>");
    expect(xml).toContain("<link>https://www.roth-conversion-calculator-ai.shop/blog</link>");

    for (const post of blogPosts) {
      expect(xml).toContain(`<guid>https://www.roth-conversion-calculator-ai.shop/blog/${post.slug}</guid>`);
      expect(xml).toContain(`<link>https://www.roth-conversion-calculator-ai.shop/blog/${post.slug}</link>`);
    }
  });

  it("escapes XML-sensitive characters in feed fields", () => {
    const xml = buildRssFeedXml([
      {
        ...blogPosts[0],
        title: "Roth & Taxes <Guide>",
        description: "A guide for Roth conversions & tax brackets.",
      },
    ]);

    expect(xml).toContain("Roth &amp; Taxes &lt;Guide&gt;");
    expect(xml).toContain("Roth conversions &amp; tax brackets");
  });

  it("exposes feed.xml from the app route and robots metadata", () => {
    const route = fs.readFileSync(path.join(process.cwd(), "src/app/feed.xml/route.ts"), "utf8");
    const robotsConfig = robots();

    expect(route).toContain("buildRssFeedXml");
    expect(JSON.stringify(robotsConfig)).toContain("https://www.roth-conversion-calculator-ai.shop/feed.xml");
  });
});
