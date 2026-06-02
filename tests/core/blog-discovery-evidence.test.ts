import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { blogPosts } from "@/content/blog";

describe("blog discovery evidence command", () => {
  it("registers a production blog discovery evidence command", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/blog-discovery-evidence.mjs"), "utf8");

    expect(packageJson.scripts["seo:blog-discovery"]).toBe("node scripts/blog-discovery-evidence.mjs");
    expect(script).toContain("src/content/blog.ts");
    expect(script).toContain("fileURLToPath(import.meta.url)");
    expect(script).toContain("/sitemap.xml");
    expect(script).toContain("/feed.xml");
    expect(script).toContain("/llms.txt");
    expect(script).toContain("/blog");
    expect(script).toContain("expectedLlmsMinimum");
    expect(script).toContain("BLOG_DISCOVERY_EVIDENCE_BASE_URL");
  });

  it("keeps the command source-driven by the current blog library", () => {
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/blog-discovery-evidence.mjs"), "utf8");

    expect(blogPosts.length).toBeGreaterThanOrEqual(13);
    expect(script).toContain("readBlogSlugs");
    expect(script).toContain('`/blog/${slug}`');
    expect(script).toContain('`${baseUrl}/blog/${slug}`');
  });
});
