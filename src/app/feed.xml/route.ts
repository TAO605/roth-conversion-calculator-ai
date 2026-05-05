import { blogPosts } from "@/content/blog";
import { buildRssFeedXml } from "@/core/seo/rss";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRssFeedXml(blogPosts), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
