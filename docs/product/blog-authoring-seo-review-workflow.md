# Blog Authoring SEO Review Workflow

This workflow governs future blog posts for the Roth Conversion Calculator site.

The user owns blog article writing. AI may help with outline research, draft review, compliance checks, formatting, and engineering publication, but AI should not publish generated tax/YMYL article copy without user review.

## Ownership Boundary

- User writes or approves the article body.
- AI may use the user's writing tool to help produce a draft only when the user explicitly asks for that article.
- AI performs SEO, semantic HTML, accessibility, YMYL compliance, and engineering review before publication.
- AI must not add unsupported tax advice, personalized recommendations, fake review/rating claims, or guaranteed outcomes.

## Required Inputs Per Article

- Primary keyword.
- Target search intent.
- Draft article body or explicit permission to create a draft in the user's writing tool.
- Any images to upload, including desired image placement.
- Source links or official references if the article discusses tax rules, IRS forms, Medicare, ACA, or other YMYL-sensitive topics.

## Outline Research

Before drafting or restructuring a new article, AI may research the current Google top results for the primary keyword and related queries.

The outline should summarize common coverage patterns from the top results, then improve the page by adding:

- Clear calculator-specific context.
- Tax/YMYL boundaries.
- Source-backed assumptions.
- Internal links to relevant calculator, guide, methodology, tax-data, and professional-review pages.

## On-Page SEO Checklist

Each blog page should pass these checks before publication:

- The primary keyword appears once within the first 100 words.
- The primary keyword appears once within the final 100 words.
- The page has at least 800 words; 1,500+ words is preferred for blog articles when the topic supports it.
- H1 contains the primary keyword.
- Exactly one H1 appears on the page.
- At least one H2 contains the primary keyword when it reads naturally.
- H2 elements form the article outline.
- H3 and H4 elements are used for supporting subsections when needed.
- Normal body text uses paragraph text, not heading tags.
- Important terms or high-value phrases may be bolded when useful for scanning.
- Every uploaded image has a descriptive `alt` attribute.
- Internal links point to the calculator and relevant supporting guides.
- External links point to official or reputable sources when tax, Medicare, ACA, or legal/financial context is discussed.

## Keyword Density Review

The requested target density is 2% to 4% for the primary keyword across body text.

Because this is a YMYL tax site, density should be treated as an editorial review signal, not a license to stuff keywords. If exact-match density makes the article sound repetitive, prefer semantic variants and natural language. The final review should balance:

- Primary keyword presence.
- Natural readability.
- Related terms and entities.
- Search intent coverage.
- No keyword stuffing.

## Semantic HTML Requirements

AI should preserve semantic structure when publishing:

- One `h1` only.
- `h2` for main sections.
- `h3` and `h4` for nested subsections.
- `p` for paragraphs.
- `strong` for important emphasis.
- `ul` or `ol` for real lists.
- `figure`, `figcaption`, and image `alt` text when images are included.
- Article pages should include Article and Breadcrumb JSON-LD only when metadata is real and source-aligned.

## YMYL Compliance Review

Before publication, AI must check that the article avoids:

- Personalized tax recommendations.
- Claims that a Roth conversion is best, optimal, guaranteed, or risk-free.
- Promises of 100% accuracy.
- Unsupported IRS, Medicare, ACA, or state-tax claims.
- Fake ratings, fake reviews, or unverified authority signals.
- Overstated AI capability claims.

The article should use safe language such as:

- Educational estimate.
- Assumption-based.
- Review with a qualified tax professional.
- The calculator does not model every tax interaction.
- Verify against current official guidance.

## Publication Engineering Checklist

After user approval, AI handles:

- Route/content registration.
- Metadata title and description.
- Canonical URL.
- Article JSON-LD and Breadcrumb JSON-LD.
- Sitemap inclusion.
- RSS inclusion when appropriate.
- `llms.txt` inclusion when appropriate.
- Internal links from relevant hubs or related pages.
- Tests for metadata, structured data, YMYL language, and discovery paths.
- Production build.
- Production SEO smoke.
- Production structured-data evidence.
- GitHub/Vercel deployment and artifact verification when publication is approved.

## Manual Review Pass

Before deployment, manually confirm:

- First 100 words contain the primary keyword.
- Final 100 words contain the primary keyword.
- Word count meets the target.
- H1 count is exactly one.
- H1 and at least one H2 include the primary keyword naturally.
- Image alt text is complete.
- Keyword use feels natural and not stuffed.
- Claims are source-aligned.
- The page clearly separates educational information from tax advice.

## Draft Review Command

Use the local draft review command before engineering publication:

```bash
npm run seo:blog-review -- --file path/to/draft.md --keyword "primary keyword"
```

The command reads a Markdown or HTML draft and returns JSON evidence for:

- Primary keyword in the first 100 words.
- Primary keyword in the final 100 words.
- Minimum word count.
- Preferred blog word count.
- Single H1.
- H1 keyword inclusion.
- H2 keyword inclusion.
- Uploaded image alt text.
- Keyword-density review.

Hard failures should be fixed before publication. Keyword density is still a manual editorial review signal; do not force exact-match repetition if it harms clarity or YMYL trust.
