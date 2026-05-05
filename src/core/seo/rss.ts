import type { BlogPost } from "@/content/blog";
import { siteConfig } from "@/core/seo/site-config";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pubDate(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

export function buildRssFeedXml(posts: BlogPost[]): string {
  const items = posts
    .map((post) => {
      const url = `${siteConfig.siteUrl}/blog/${post.slug}`;

      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid>${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${pubDate(post.publishedAt)}</pubDate>`,
        `      <category>${post.tags.map(escapeXml).join("</category><category>")}</category>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(siteConfig.siteName)}</title>`,
    `    <link>${siteConfig.siteUrl}/blog</link>`,
    `    <atom:link href="${siteConfig.siteUrl}/feed.xml" rel="self" type="application/rss+xml" />`,
    "    <description>Educational Roth conversion guides and calculator updates.</description>",
    "    <language>en-US</language>",
    `    <lastBuildDate>${pubDate(posts[0]?.lastUpdated ?? "2026-05-01")}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");
}
