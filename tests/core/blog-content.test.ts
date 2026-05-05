import { describe, expect, it } from "vitest";
import { blogPosts, getBlogTopicGroups, getRelatedBlogPosts } from "@/content/blog";
import sitemap from "@/app/sitemap";

describe("blog content matrix", () => {
  it("contains a broader long-tail SEO library with unique slugs", () => {
    const slugs = new Set(blogPosts.map((post) => post.slug));

    expect(blogPosts.length).toBeGreaterThanOrEqual(12);
    expect(slugs.size).toBe(blogPosts.length);
  });

  it("keeps each guide substantive and dated for maintenance", () => {
    expect(
      blogPosts.every(
        (post) =>
          post.publishedAt.match(/^\d{4}-\d{2}-\d{2}$/) &&
          post.lastUpdated.match(/^\d{4}-\d{2}-\d{2}$/) &&
          post.body.length >= 3,
      ),
    ).toBe(true);
  });

  it("includes every guide URL in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    for (const post of blogPosts) {
      expect(urls).toContain(`https://www.roth-conversion-calculator-ai.shop/blog/${post.slug}`);
    }
  });

  it("defines tags and related posts for internal linking", () => {
    expect(blogPosts.every((post) => post.tags.length >= 2)).toBe(true);

    for (const post of blogPosts) {
      const related = getRelatedBlogPosts(post.slug, 3);

      expect(related).toHaveLength(3);
      expect(related.every((item) => item.slug !== post.slug)).toBe(true);
    }
  });

  it("builds topic groups for the blog hub", () => {
    const groups = getBlogTopicGroups();

    expect(groups.length).toBeGreaterThanOrEqual(4);
    expect(groups.every((group) => group.posts.length > 0)).toBe(true);
  });
});
