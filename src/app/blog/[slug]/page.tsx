import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getRelatedBlogPosts } from "@/content/blog";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { articleJsonLd, breadcrumbJsonLd } from "@/core/seo/json-ld";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(post.slug, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              slug: post.slug,
              title: post.title,
              description: post.description,
              author: post.author,
              reviewer: post.reviewer,
              datePublished: post.publishedAt,
              dateModified: post.lastUpdated,
            }),
          ),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Guides", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <p className="text-sm font-semibold text-systemBlue">Last updated {post.lastUpdated}</p>
      <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{post.title}</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-300">{post.description}</p>
      <div className="mt-6 rounded-[16px] bg-white/70 p-4 text-sm dark:bg-white/10">
        Author: {post.author}. Reviewer: {post.reviewer}.
      </div>
      <article className="mt-8 grid gap-5 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="mt-10 rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Open the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Use the Roth Conversion Calculator to model the concepts in this guide with your own educational assumptions.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[14px] bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href="/#calculator"
        >
          Open the calculator
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Related guides</h2>
        <div className="mt-4 grid gap-3">
          {relatedPosts.map((relatedPost) => (
            <Link
              className="rounded-[16px] bg-white/70 p-4 transition hover:-translate-y-0.5 hover:shadow-material dark:bg-white/10"
              href={`/blog/${relatedPost.slug}`}
              key={relatedPost.slug}
            >
              <h3 className="font-semibold text-neutral-950 dark:text-white">{relatedPost.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {relatedPost.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <p className="mt-8 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
