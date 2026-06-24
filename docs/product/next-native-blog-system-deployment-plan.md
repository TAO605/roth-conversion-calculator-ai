# Next-Native Blog System Deployment Plan

Date: 2026-06-23

## 1. Environment Assessment

- Frontend stack: Next.js 15, React 19, TypeScript, Tailwind CSS.
- Deployment platform: Vercel project connected to `https://www.roth-conversion-calculator-ai.shop`.
- Domain structure: canonical host is `www.roth-conversion-calculator-ai.shop`; bare domain redirects to `www`.
- Blog route: `/blog` and `/blog/[slug]` already exist under the main Next.js app.
- Backend/database: no database is required for the current blog workflow; posts are source-controlled content in `src/content/blog.ts`.
- Integration boundary: keep the blog in the main app and main domain subdirectory. Do not introduce a separate CMS, subdomain, proxy, or second build pipeline unless the editorial workflow later requires it.

## 2. Selected Blog Architecture

Selected solution: Next-native static blog under `/blog`.

Reason:

- Hugo, Astro, and Ghost all satisfy the 20k+ GitHub-star maturity requirement, but this project already runs on Next.js and already owns the `/blog` route.
- Hugo would add a second static-site build and asset-sync boundary.
- Astro would duplicate the current Node/static-rendering workflow without enough benefit for this site.
- Ghost would require a separate service, database, admin hardening, updates, backups, and reverse proxy maintenance.
- The selected solution preserves the same canonical host, Vercel deployment, sitemap, RSS, structured data, internal links, and SEO evidence pipeline with the least operational risk.

## 3. `/blog` Subdirectory Integration

The blog is mounted directly by Next routes:

```text
src/app/blog/page.tsx
src/app/blog/[slug]/page.tsx
src/content/blog.ts
```

No Nginx, Cloudflare Worker, or reverse proxy is required.

Canonical URL pattern:

```text
https://www.roth-conversion-calculator-ai.shop/blog
https://www.roth-conversion-calculator-ai.shop/blog/{slug}
```

Vercel build command:

```bash
npm run build
```

Local preview:

```bash
npm run dev
```

Production static generation evidence should show `/blog` and every `/blog/[slug]` route in the Next build output.

## 4. Google SEO Configuration

Implemented SEO surfaces:

- Blog hub metadata with canonical, Open Graph, and Twitter Card.
- Article metadata with canonical, Open Graph article fields, Twitter Card, published/modified dates, author, and tags.
- Article JSON-LD generated from the visible source fields.
- `reviewedBy` is omitted unless a real professional reviewer is recorded.
- Breadcrumb JSON-LD on article pages.
- `/sitemap.xml` includes every blog URL.
- `/robots.txt` exposes sitemap, RSS, and `llms.txt`.
- `/feed.xml` includes every blog post.
- `/llms.txt` includes recent priority blog posts.
- Related guides and calculator CTA keep users and crawlers inside the main domain.

Authoring fields:

```ts
{
  slug,
  title,
  description,
  seoTitle?,
  seoDescription?,
  primaryKeyword?,
  ogImage?,
  ogImageAlt?,
  publishedAt,
  lastUpdated,
  author,
  reviewer,
  reviewStatus?,
  professionalReviewer?,
  tags,
  body
}
```

YMYL review rule:

- `reviewStatus: "pending"` or missing status may appear visibly as editorial status.
- `reviewStatus: "professional-reviewed"` requires a real `professionalReviewer`.
- AI/model cross-checks must not be represented as CPA, EA, tax attorney, or professional reviewer schema.

## 5. Deployment Flow

Local checks:

```bash
npm test -- --run tests/core/blog-content.test.ts tests/core/structured-data.test.ts tests/core/blog-discovery-evidence.test.ts tests/core/rss-feed.test.ts
npm run build
```

Production evidence after deploy:

```bash
npm run seo:blog-discovery
npm run seo:structured-data
npm run seo:smoke
```

GitHub/Vercel release flow:

```bash
git status --short
git add src/content/blog.ts src/app/blog/page.tsx "src/app/blog/[slug]/page.tsx" src/core/seo/json-ld.ts tests/core/structured-data.test.ts docs/product/next-native-blog-system-deployment-plan.md TASKS.md
git commit -m "Upgrade blog SEO system"
git push
```

Vercel will build the main app and keep `/blog` under the same domain.

Rollback:

```bash
git revert HEAD
git push
```

## 6. Pre-Launch Checklist

- `/blog` returns HTTP 200.
- Every `/blog/{slug}` returns HTTP 200.
- Every article has exactly one H1.
- Every article has a unique title, description, slug, and canonical URL.
- Blog hub and articles render Open Graph metadata.
- Blog hub and articles render Twitter Card metadata.
- Article JSON-LD is present and matches visible content.
- `reviewedBy` is absent unless a real professional reviewer is recorded.
- `/sitemap.xml` contains every blog URL.
- `/feed.xml` contains every blog URL.
- `/robots.txt` references sitemap and feed.
- `/llms.txt` includes priority blog entries.
- Blog hub links to every article.
- Article pages link to related guides and the calculator.
- Mobile layout has no horizontal overflow.
- Draft articles pass `npm run seo:blog-ready` before publication.
- YMYL language avoids guarantees, personal advice, fake ratings, or unsupported professional claims.
