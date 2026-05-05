import { blogPosts } from "@/content/blog";
import { buildLlmsText } from "@/core/seo/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsText(blogPosts), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
