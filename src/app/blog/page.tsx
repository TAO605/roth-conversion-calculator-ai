import Link from "next/link";
import { blogPosts, getBlogTopicGroups } from "@/content/blog";

export const metadata = {
  title: "Roth Conversion Guides",
  description: "Educational Roth conversion guides covering taxes, 5-year rules, penalties, and backdoor Roth basics.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const topicGroups = getBlogTopicGroups();

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Educational guides</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">Roth Conversion Guides</h1>
        <p className="mt-4 max-w-2xl leading-7 text-neutral-600 dark:text-neutral-300">
          Plain-English articles that explain Roth conversion concepts without replacing professional tax advice.
        </p>
      </div>
      <section className="grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Topics</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {topicGroups.map((group) => (
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-neutral-900" key={group.tag}>
              <h3 className="font-semibold text-neutral-950 dark:text-white">{group.label}</h3>
              <div className="mt-3 grid gap-2">
                {group.posts.map((post) => (
                  <Link className="text-sm leading-6 text-systemBlue hover:underline" href={`/blog/${post.slug}`} key={post.slug}>
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-systemBlue/40 hover:bg-neutral-50 dark:border-white/10 dark:bg-neutral-950 dark:hover:border-systemBlue/50 dark:hover:bg-neutral-900"
            href={`/blog/${post.slug}`}
            key={post.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{post.lastUpdated}</p>
            <h2 className="mt-3 text-xl font-bold text-neutral-950 dark:text-white">{post.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{post.description}</p>
            <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">{post.reviewer}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
