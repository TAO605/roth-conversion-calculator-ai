export interface ReleaseNote {
  version: string;
  date: string;
  type: "minor" | "patch";
  title: string;
  summary: string;
  affectedArea: string;
  rollbackPath: string;
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: "1.0.106",
    date: "2026-06-02",
    type: "patch",
    title: "Blog publication manifest validator",
    summary:
      "Added a manifest validator for retained blog publication packages so archived readiness, final validation, SEO smoke, structured-data, and blog discovery evidence can be checked for required roles, Article/Breadcrumb coverage, byte counts, and SHA-256 hash integrity.",
    affectedArea:
      "Blog publication evidence retention, manifest integrity checks, reviewer handoff validation, release auditability, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/validate-blog-publication-manifest.mjs, the seo:blog-publication-manifest-validate package script, manifest validator references from content operations and blog workflow documentation, and the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.105",
    date: "2026-06-02",
    type: "patch",
    title: "Blog publication evidence manifest",
    summary:
      "Added a blog publication manifest command so each user-approved article release can retain a single inventory of readiness, final validation, production SEO smoke, structured-data, and blog discovery evidence with file sizes and SHA-256 hashes.",
    affectedArea:
      "Blog publication evidence retention, reviewer handoff packages, release auditability, content operations documentation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/generate-blog-publication-manifest.mjs, the seo:blog-publication-manifest package script, manifest references from content operations and blog workflow documentation, and the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.104",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final validation evidence output",
    summary:
      "Added --output support to the final blog publication package validator so approved article release packages can retain blog-final-publication-result.json alongside readiness, structured-data, discovery, and SEO smoke evidence.",
    affectedArea:
      "Blog final publication validation, retained release evidence, reviewer handoff artifacts, content operations documentation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove --output handling from scripts/validate-blog-final-publication.mjs, remove blog-final-publication-result.json references from content operations and blog workflow documentation, and revert the related tests, release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.103",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final publication package validator",
    summary:
      "Added a final blog publication package validator so approved article releases can verify readiness evidence, manual-review acceptance, production SEO smoke, Article structured data, and blog discovery evidence before being treated as publishable.",
    affectedArea:
      "Blog publication QA automation, retained evidence validation, manual-review stop conditions, structured-data release checks, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove scripts/validate-blog-final-publication.mjs, the seo:blog-final-validate package script, its tests, the command references from content operations and blog workflow documentation, and the related release note, task, progress, and feature version update.",
  },
  {
    version: "1.0.102",
    date: "2026-06-02",
    type: "patch",
    title: "Blog final publication review gate",
    summary:
      "Added a visible final publication review gate to the Content Operations Playbook so user-owned blog drafts must retain readiness evidence, resolve manual-review stops, and pass post-deploy discovery and structured-data evidence before AI publishes them.",
    affectedArea:
      "Blog publishing operations, user-owned article approval, YMYL stop conditions, retained readiness evidence, discovery evidence, and release governance",
    rollbackPath:
      "Remove getBlogFinalPublicationReview, the Final publication review section from /content-operations, and the related tests, release note, documentation, task, progress, and content-operations feature version update.",
  },
  {
    version: "1.0.101",
    date: "2026-06-02",
    type: "patch",
    title: "Blog discovery evidence artifact",
    summary:
      "Added a production blog discovery evidence command and retained artifact file that verify every current blog post is discoverable from the blog hub, sitemap, and RSS feed while confirming llms.txt includes the expected recent-guide coverage.",
    affectedArea:
      "Blog publishing discovery, sitemap coverage, RSS coverage, llms.txt evidence, SEO Smoke artifacts, and source-driven content governance",
    rollbackPath:
      "Remove scripts/blog-discovery-evidence.mjs, the seo:blog-discovery package script, the workflow step, blog-discovery-evidence-result.json from the artifact manifest and validator, and the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.100",
    date: "2026-06-02",
    type: "patch",
    title: "Dynamic blog structured-data evidence",
    summary:
      "Changed production structured-data evidence from a hand-maintained blog path list to a source-driven blog slug reader so future blog posts are automatically required to expose Article and BreadcrumbList JSON-LD in retained SEO evidence.",
    affectedArea:
      "Blog Article schema monitoring, production structured-data evidence, SEO artifact validation, future blog publishing automation, and source-driven release governance",
    rollbackPath:
      "Restore the explicit blog path list in scripts/structured-data-evidence.mjs, remove the blog slug reader from the structured-data evidence validator, and revert the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.99",
    date: "2026-06-02",
    type: "patch",
    title: "Blog Article structured-data evidence",
    summary:
      "Expanded the production structured-data evidence command and retained SEO artifact validator to cover existing blog Article pages, requiring Article and BreadcrumbList JSON-LD across the current blog library while preserving the user-owned article writing boundary.",
    affectedArea:
      "Production structured-data evidence, blog Article JSON-LD monitoring, SEO Smoke artifacts, schema validation, and YMYL-safe publishing governance",
    rollbackPath:
      "Remove the blog paths from scripts/structured-data-evidence.mjs, lower the structured-data artifact pageCount requirement, remove the blog Article validator branch, and revert the related tests, documentation, release note, and feature registry version.",
  },
  {
    version: "1.0.98",
    date: "2026-06-02",
    type: "patch",
    title: "Blog link evidence publication guard",
    summary:
      "Added internal-link and official-source-link hard checks to the blog review, readiness, and publication evidence validation commands so user-written drafts must include both site discovery support and source-aligned YMYL trust evidence before publication.",
    affectedArea:
      "Blog draft QA automation, internal linking workflow, official source review, publication evidence validation, and YMYL-safe article release gates",
    rollbackPath:
      "Remove internal_link_presence, official_source_link_presence, linkSummary output, validator requirements, and the related tests, documentation, release note, and content operations copy.",
  },
  {
    version: "1.0.97",
    date: "2026-06-01",
    type: "patch",
    title: "Blog YMYL language publication guard",
    summary:
      "Added a hard YMYL language check to the blog review and readiness commands so drafts are blocked before publication when they contain personalized recommendations, best/optimal claims, guarantees, fake ratings, risk-free claims, or 100% accuracy claims.",
    affectedArea:
      "Blog draft QA automation, user-owned article review, publication evidence validation, content operations workflow, and YMYL-safe article release gates",
    rollbackPath:
      "Remove the no_high_risk_ymyl_language check, ymylRiskMatches output, validator requirement, and related documentation, tests, release note, and content operations copy.",
  },
  {
    version: "1.0.96",
    date: "2026-06-01",
    type: "patch",
    title: "Blog readiness evidence output file",
    summary:
      "Added an --output option to the one-step blog readiness command so publication readiness JSON can be saved directly without shell redirection while still printing the same evidence payload.",
    affectedArea:
      "Blog readiness automation, publication evidence retention, reviewer handoff workflow, content operations playbook, and YMYL-safe article release gates",
    rollbackPath:
      "Remove --output handling from scripts/blog-publication-readiness.mjs and revert the related tests, documentation, release note, and content operations command copy.",
  },
  {
    version: "1.0.95",
    date: "2026-06-01",
    type: "patch",
    title: "Blog readiness publication status",
    summary:
      "Added explicit publicationStatus and manualReviewRequired fields to the one-step blog readiness output so drafts with passing hard checks still pause for editorial review when preferred/manual SEO signals need attention.",
    affectedArea:
      "Blog readiness automation, editorial handoff evidence, content operations workflow, semantic SEO review, and YMYL-safe article publication gates",
    rollbackPath:
      "Remove publicationStatus and manualReviewRequired from scripts/blog-publication-readiness.mjs and revert the matching tests, documentation, release note, and content operations copy.",
  },
  {
    version: "1.0.94",
    date: "2026-06-01",
    type: "patch",
    title: "One-step blog publication readiness check",
    summary:
      "Added a one-step blog readiness command that runs draft SEO review and publication evidence validation together, returning a single JSON payload for quick pre-publication checks without manual redirection.",
    affectedArea:
      "Blog publication QA automation, content operations workflow, user-owned article review, semantic SEO evidence, and YMYL-safe release checks",
    rollbackPath:
      "Remove scripts/blog-publication-readiness.mjs, the seo:blog-ready package script, its tests, and the readiness command references from the blog workflow documentation and content operations page.",
  },
  {
    version: "1.0.93",
    date: "2026-06-01",
    type: "patch",
    title: "Blog publication evidence validator",
    summary:
      "Added a blog publication evidence validator so retained seo:blog-review JSON output can be checked for passing hard checks, semanticSummary evidence, word count, heading structure, and image alt readiness before article release.",
    affectedArea:
      "Blog publication QA automation, retained review evidence, content operations workflow, user-owned article publishing, and YMYL-safe release gates",
    rollbackPath:
      "Remove scripts/validate-blog-publication-evidence.mjs, the seo:blog-evidence-validate package script, its tests, and the evidence validation command from the blog workflow documentation and content operations page.",
  },
  {
    version: "1.0.92",
    date: "2026-06-01",
    type: "patch",
    title: "Semantic blog draft review evidence",
    summary:
      "Expanded the blog draft SEO review command to report heading hierarchy, paragraph structure, H2 outline readiness, and strong-emphasis usage so user-written drafts can be checked against semantic HTML expectations before publication.",
    affectedArea:
      "Blog draft QA automation, semantic HTML review, content operations playbook, user-owned article publishing workflow, and YMYL-safe SEO release checks",
    rollbackPath:
      "Remove the heading_hierarchy hard check, semanticSummary output, paragraph/strong/manual review checks, and matching documentation updates from the blog draft review workflow.",
  },
  {
    version: "1.0.91",
    date: "2026-06-01",
    type: "patch",
    title: "Visible blog review operations workflow",
    summary:
      "Added the user-owned blog draft SEO review gate to the Content Operations Playbook so article drafts have visible hard checks, manual review signals, and AI publication duties before release.",
    affectedArea:
      "Content operations page, blog publishing workflow, SEO review guardrails, YMYL-safe article publication, and release governance",
    rollbackPath:
      "Remove getBlogDraftReviewWorkflow and the Blog Draft SEO Review section from /content-operations, then return the content-operations feature registry version to the previous release.",
  },
  {
    version: "1.0.90",
    date: "2026-06-01",
    type: "patch",
    title: "Blog draft SEO review command",
    summary:
      "Added a local blog draft review command so user-written drafts can be checked for primary keyword placement, word count, heading structure, image alt text, and keyword-density review before engineering publication.",
    affectedArea:
      "User-owned blog writing workflow, SEO review operations, content QA automation, and YMYL-safe publication guardrails",
    rollbackPath:
      "Remove scripts/blog-seo-review.mjs, the seo:blog-review package script, the blog SEO review tests, and the draft command section from the blog authoring SEO review workflow.",
  },
  {
    version: "1.0.89",
    date: "2026-06-01",
    type: "patch",
    title: "Complete guide structured data evidence",
    summary:
      "Completed WebPage and BreadcrumbList structured-data coverage across the existing guide library without changing user-written blog content, then expanded the production evidence check so retained artifacts verify all monitored guide pages.",
    affectedArea:
      "Existing guide pages, structured-data monitoring, production SEO evidence artifacts, release guardrails, and V1.3 semantic SEO implementation",
    rollbackPath:
      "Remove contentWebPageJsonLd from the remaining guide pages, then remove those paths from scripts/structured-data-evidence.mjs and the SEO evidence validator if the evidence scope needs to return to the smaller monitored set.",
  },
  {
    version: "1.0.88",
    date: "2026-06-01",
    type: "patch",
    title: "Expanded guide structured data evidence",
    summary:
      "Expanded priority structured-data evidence to additional YMYL-sensitive guide pages covering NIIT, RMDs, Social Security taxable benefits, and estimated tax review, using source-aligned WebPage and BreadcrumbList schema without adding unsupported recommendation or review markup.",
    affectedArea:
      "Long-tail educational SEO pages, structured-data monitoring, retained production evidence artifacts, and V1.3 semantic SEO guardrails",
    rollbackPath:
      "Remove contentWebPageJsonLd from the NIIT, RMD, Social Security tax, and estimated tax guides, then remove those paths from scripts/structured-data-evidence.mjs and the SEO evidence validator.",
  },
  {
    version: "1.0.87",
    date: "2026-06-01",
    type: "patch",
    title: "Priority page structured data evidence",
    summary:
      "Extended structured-data monitoring beyond the homepage by adding source-aligned WebPage and BreadcrumbList JSON-LD to priority educational pages and requiring those pages in the retained production evidence artifact.",
    affectedArea:
      "Priority SEO pages, IRMAA and ACA education guides, 2026 federal tax brackets page, structured-data evidence automation, and V1.3 semantic SEO guardrails",
    rollbackPath:
      "Remove contentWebPageJsonLd from priority pages, remove the tax-brackets breadcrumb JSON-LD, and return scripts/structured-data-evidence.mjs plus the evidence validator to homepage-only checks.",
  },
  {
    version: "1.0.86",
    date: "2026-06-01",
    type: "patch",
    title: "Structured data evidence artifact",
    summary:
      "Added a production structured-data evidence command and wired it into the SEO Smoke workflow so the retained proof package now checks homepage JSON-LD types, canonical host consistency, fake review fields, unsupported feature claims, and unsafe YMYL phrases before artifact upload.",
    affectedArea:
      "Production SEO evidence automation, homepage structured-data monitoring, GitHub Actions artifacts, and V1.3 semantic structured-data SEO implementation",
    rollbackPath:
      "Remove scripts/structured-data-evidence.mjs, the seo:structured-data package script, the structured data workflow step, and structured-data-evidence-result.json from the evidence validator, manifest, and uploaded artifact.",
  },
  {
    version: "1.0.85",
    date: "2026-06-01",
    type: "patch",
    title: "Homepage semantic landmark audit",
    summary:
      "Added explicit semantic labels and heading associations to the homepage primary navigation, calculator region, input section, results article, and footer while preserving existing layout and calculator behavior.",
    affectedArea: "Homepage semantic HTML, accessibility landmarks, crawler-readable structure, and V1.3 semantic SEO implementation",
    rollbackPath:
      "Remove the added aria-label and aria-labelledby attributes and the homepage semantic landmark test if the page should return to its previous landmark annotations.",
  },
  {
    version: "1.0.84",
    date: "2026-06-01",
    type: "patch",
    title: "Safe homepage structured data graph",
    summary:
      "Added source-aligned WebSite and WebPage JSON-LD to the homepage, strengthened the WebApplication node with canonical IDs and visible feature references, and added structured-data guard tests that block fake ratings, unsupported voice features, non-canonical URLs, and unsafe YMYL phrases.",
    affectedArea: "Homepage structured data, semantic SEO guardrails, JSON-LD test coverage, and V1.3 structured-data implementation",
    rollbackPath:
      "Remove websiteJsonLd, homepageWebPageJsonLd, the added homepage JSON-LD scripts, and the structured-data guard test if the homepage should return to the previous WebApplication/HowTo/Organization-only schema set.",
  },
  {
    version: "1.0.83",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence artifact review checklist",
    summary:
      "Added a visible artifact review checklist to the SEO monitoring playbook so downloaded production-seo-evidence packages are checked for smoke status, GSC priority URL evidence, validator summary, and manifest traceability before Search Console or incident work.",
    affectedArea: "SEO monitoring page, Search Console retry operations, production evidence artifacts, and incident review workflow",
    rollbackPath:
      "Remove buildSeoEvidenceArtifactReview and the SEO evidence artifact review section from /seo-monitoring if downloaded artifact review should return to documentation-only handling.",
  },
  {
    version: "1.0.82",
    date: "2026-05-30",
    type: "patch",
    title: "Self-describing SEO evidence manifest",
    summary:
      "Updated the SEO evidence manifest so the artifact inventory lists all retained files, including the manifest itself as a self-describing generated file, while preserving byte counts for the three source evidence JSON files.",
    affectedArea: "SEO evidence artifact traceability, GitHub Actions proof-package auditability, Search Console retry records, and incident review records",
    rollbackPath:
      "Remove seo-evidence-manifest.json from the manifest file list in scripts/generate-seo-evidence-manifest.mjs if the manifest should only inventory source evidence files.",
  },
  {
    version: "1.0.81",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence manifest",
    summary:
      "Added a machine-readable manifest to the production SEO evidence artifact so each proof package records run metadata, commit identity, event type, retained files, file sizes, production host, and retention window.",
    affectedArea: "GitHub Actions SEO artifact traceability, Search Console evidence packages, incident review, and post-launch audit records",
    rollbackPath:
      "Remove scripts/generate-seo-evidence-manifest.mjs, the seo:evidence-manifest package script, the Generate SEO evidence manifest workflow step, and seo-evidence-manifest.json from the artifact upload path.",
  },
  {
    version: "1.0.80",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence validation summary artifact",
    summary:
      "Added the validator's JSON summary to the production SEO evidence artifact so downloaded proof packages include the smoke output, GSC priority URL evidence, and the machine-readable validation result together.",
    affectedArea: "GitHub Actions artifact contents, Search Console retry evidence, incident review records, and SEO proof-package completeness",
    rollbackPath:
      "Remove seo-evidence-validation-result.json from the SEO Smoke workflow and artifact upload path if the validation summary should no longer be retained.",
  },
  {
    version: "1.0.79",
    date: "2026-05-30",
    type: "patch",
    title: "SEO evidence artifact validation",
    summary:
      "Added a local and CI validator for production SEO evidence artifacts so uploaded smoke and GSC JSON files are checked for parseability, expected host, priority URL coverage, sitemap inclusion, noindex absence, and fresh lastmod evidence before retention.",
    affectedArea: "GitHub Actions SEO evidence artifacts, Search Console proof packages, CI guardrails, and post-launch operations records",
    rollbackPath:
      "Remove scripts/validate-seo-evidence.mjs, the seo:evidence-validate package script, and the Validate SEO evidence artifact workflow step if artifact validation needs to be disabled.",
  },
  {
    version: "1.0.78",
    date: "2026-05-30",
    type: "patch",
    title: "Sitemap freshness operations playbook",
    summary:
      "Added a visible sitemap freshness evidence section to the SEO monitoring playbook so freshness-critical priority URLs, minimum lastmod dates, GSC evidence output, and CI artifact records are documented for Search Console operations.",
    affectedArea: "SEO monitoring page, V1.3 engineering documentation, Search Console retry workflow, and sitemap freshness evidence",
    rollbackPath:
      "Remove buildSitemapFreshnessEvidence, the sitemap freshness evidence section on /seo-monitoring, and the V1.3 sitemap freshness addendum if this operations documentation needs to be rolled back.",
  },
  {
    version: "1.0.77",
    date: "2026-05-30",
    type: "patch",
    title: "GSC sitemap freshness evidence",
    summary:
      "Extended the GSC priority URL evidence command to parse sitemap entries and fail when recently updated operational, methodology, tax-data, bracket, or homepage URLs lose fresh lastmod coverage.",
    affectedArea: "Search Console evidence automation, sitemap regression detection, priority URL crawl freshness, and production SEO artifacts",
    rollbackPath:
      "Remove the lastmod parsing and freshness assertions from scripts/gsc-evidence.mjs if the evidence check needs to return to sitemap-inclusion-only validation.",
  },
  {
    version: "1.0.76",
    date: "2026-05-30",
    type: "patch",
    title: "Sitemap lastmod freshness",
    summary:
      "Changed static sitemap entries from a single default lastmod date to per-page freshness metadata so recently updated SEO operations, methodology, tax-data, and release-note pages send accurate change signals.",
    affectedArea: "XML sitemap freshness, Search Console discovery signals, static SEO pages, and post-launch crawl evidence",
    rollbackPath:
      "Restore the previous static route array in src/app/sitemap.ts if per-page lastmod metadata needs to be rolled back.",
  },
  {
    version: "1.0.75",
    date: "2026-05-30",
    type: "patch",
    title: "Native Node 24 GitHub Actions",
    summary:
      "Upgraded the production SEO Smoke workflow to native Node 24 GitHub Actions versions for checkout, setup-node, and upload-artifact, removing the temporary forced Node 24 compatibility flag.",
    affectedArea: "GitHub Actions SEO automation, scheduled production evidence checks, dependency installation, and artifact upload runtime compatibility",
    rollbackPath:
      "Restore the previous action versions in .github/workflows/seo-smoke.yml and re-enable the forced Node 24 compatibility flag if a newer action regression appears.",
  },
  {
    version: "1.0.74",
    date: "2026-05-30",
    type: "patch",
    title: "Node 24 SEO workflow readiness",
    summary:
      "Moved the production SEO Smoke workflow to Node 24 and opted GitHub JavaScript actions into the Node 24 runtime so scheduled SEO evidence checks stay stable before GitHub's Node 20 action runtime removal window.",
    affectedArea: "GitHub Actions SEO automation, scheduled production evidence checks, artifact upload, and CI runtime compatibility",
    rollbackPath:
      "Restore the workflow node-version and remove FORCE_JAVASCRIPT_ACTIONS_TO_NODE24 from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.73",
    date: "2026-05-30",
    type: "patch",
    title: "Search Console indexing retry protocol",
    summary:
      "Added a Search Console retry protocol that requires production SEO evidence before URL Inspection retries, limits repeated Request indexing attempts after Google backend errors, and records when failures are Search Console-side rather than site-side.",
    affectedArea: "SEO monitoring playbook, Search Console retry operations, indexing evidence records, and post-launch incident routing",
    rollbackPath:
      "Remove the indexing retry protocol section and buildSearchConsoleRetryProtocol helper from the SEO monitoring playbook.",
  },
  {
    version: "1.0.72",
    date: "2026-05-30",
    type: "patch",
    title: "Downloadable SEO evidence artifacts",
    summary:
      "Updated the production SEO Smoke workflow to save SEO smoke and GSC priority URL evidence JSON outputs as a downloadable GitHub Actions artifact for post-launch records and Search Console retry support.",
    affectedArea: "GitHub Actions evidence retention, Search Console operations, SEO monitoring audit trail, and post-launch proof records",
    rollbackPath:
      "Remove the tee output files and actions/upload-artifact step from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.71",
    date: "2026-05-30",
    type: "patch",
    title: "Automated GSC evidence checks",
    summary:
      "Extended the production SEO Smoke GitHub Actions workflow to run the GSC priority URL evidence command after the regular smoke check, covering status, canonical, sitemap inclusion, and noindex signals on every main push and scheduled run.",
    affectedArea: "GitHub Actions SEO automation, Search Console retry readiness, canonical regression detection, and production monitoring",
    rollbackPath:
      "Remove the GSC_EVIDENCE_BASE_URL environment variable and npm run seo:gsc-evidence step from .github/workflows/seo-smoke.yml.",
  },
  {
    version: "1.0.70",
    date: "2026-05-30",
    type: "patch",
    title: "GSC priority URL evidence command",
    summary:
      "Added a repeatable GSC evidence command that checks priority URL status, canonical tags, sitemap inclusion, and noindex signals before Search Console URL Inspection retries; also fixed the methodology page canonical.",
    affectedArea: "Search Console retry evidence, canonical metadata, sitemap verification, and SEO operations guardrails",
    rollbackPath:
      "Remove scripts/gsc-evidence.mjs, the seo:gsc-evidence package command, and the methodology canonical patch if the evidence workflow needs to be rolled back.",
  },
  {
    version: "1.0.69",
    date: "2026-05-30",
    type: "patch",
    title: "Search Console exception queue",
    summary:
      "Added a Search Console exception queue that records domain verification, sitemap submission, and URL Inspection request-indexing outcomes so transient Google workflow issues are separated from actual site crawlability problems.",
    affectedArea: "Search Console operations, indexing evidence, DNS verification routing, and SEO monitoring governance",
    rollbackPath:
      "Remove the exception queue from src/content/seo-monitoring and src/app/seo-monitoring while keeping the submission loop and query opportunity matrix.",
  },
  {
    version: "1.0.68",
    date: "2026-05-30",
    type: "minor",
    title: "Search Console query opportunity matrix",
    summary:
      "Enhanced the SEO monitoring playbook with a Search Console query opportunity matrix that maps calculator, bracket-room, hidden-tax, payment-method, state, filing-status, forms, and CPA handoff queries into safe content actions with compliance or professional review gates.",
    affectedArea: "Post-launch SEO operations, content prioritization, YMYL review routing, and Search Console growth loops",
    rollbackPath:
      "Revert the query opportunity matrix from src/content/seo-monitoring and src/app/seo-monitoring while keeping the base SEO monitoring playbook available.",
  },
  {
    version: "1.0.67",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion QCD guide",
    summary:
      "Added an educational QCD guide covering qualified charitable distribution basics, RMD coordination, why QCDs are not Roth conversions, taxable income assumption review, Form 1099-R and charity acknowledgment records, tax software classification, and calculator boundaries.",
    affectedArea: "Retiree charitable distribution education, RMD coordination, calculator input quality, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-qcd-guide in the feature registry and remove the QCD guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.66",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion recharacterization guide",
    summary:
      "Added an educational recharacterization guide covering the post-2017 Roth conversion recharacterization limit, the difference between conversion and contribution recharacterization, backdoor Roth transaction mapping, Form 8606 and basis records, custodian error review, tax form reconciliation, and calculator boundaries.",
    affectedArea: "Transaction correction education, pre-submission review quality, basis and backdoor Roth recordkeeping, calculator boundary language, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-recharacterization-guide in the feature registry and remove the recharacterization guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.65",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion estimated tax guide",
    summary:
      "Added an educational estimated tax guide covering Form 1040-ES payment review, Roth conversion income payment needs, IRA withholding versus estimated payments, state estimated tax questions, Form 2210 underpayment review, annualized income considerations, and calculator limits.",
    affectedArea: "Tax payment education, withholding and estimated payment review, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-estimated-tax-guide in the feature registry and remove the estimated tax guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.64",
    date: "2026-05-04",
    type: "minor",
    title: "Roth conversion capital gains guide",
    summary:
      "Added an educational capital gains guide covering long-term capital gains, qualified dividends, ordinary-income stacking from Roth conversion income, Qualified Dividends and Capital Gain Tax Worksheet review, Schedule D records, portfolio events, NIIT overlap, and calculator limits.",
    affectedArea: "Investment-income education, taxable income assumption quality, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-capital-gains-guide in the feature registry and remove the capital gains guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.63",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion NIIT guide",
    summary:
      "Added an educational NIIT guide covering net investment income tax basics, the distinction between Roth conversion income and net investment income, MAGI threshold review, investment income classification, Form 8960 review, and calculator limits.",
    affectedArea: "Investment-income tax education, MAGI assumption quality, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-niit-guide in the feature registry and remove the NIIT guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.62",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion ACA premium tax credit guide",
    summary:
      "Added an educational ACA premium tax credit guide covering Marketplace income estimates, Roth conversion income effects, advance premium tax credit reconciliation, Form 1095-A and Form 8962 records, household and coverage details, and calculator limits.",
    affectedArea: "Marketplace coverage education, subsidy-sensitive income review, calculator boundary language, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-aca-premium-tax-credit-guide in the feature registry and remove the ACA premium tax credit guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.61",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion IRMAA guide",
    summary:
      "Added an educational IRMAA guide covering Medicare income-related monthly adjustment amount basics, Roth conversion income and MAGI review, lookback-year timing, life-changing event review, Part B and Part D premium context, retiree cash-flow boundaries, and calculator limits.",
    affectedArea: "Medicare premium education, retiree income review, calculator boundary language, professional review preparation, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-irmaa-guide in the feature registry and remove the IRMAA guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.60",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion Social Security tax guide",
    summary:
      "Added an educational Social Security tax guide covering taxable benefit basics, Roth conversion income interactions, IRS Publication 915 worksheet review, retiree scenario review, RMD and IRMAA context, and calculator boundaries for users whose taxable income assumptions may need benefit-tax review.",
    affectedArea: "Retiree education, taxable income assumption quality, calculator boundary language, professional review preparation, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-social-security-tax-guide in the feature registry and remove the Social Security tax guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.59",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion RMD guide",
    summary:
      "Added an educational RMD guide covering required minimum distribution basics, conversion sequencing, the distinction between RMD amounts and eligible conversion amounts, Roth IRA owner lifetime RMD treatment, inherited account review, taxable income assumption updates, and calculator boundaries.",
    affectedArea: "RMD education, conversion sequence review, taxable income assumption quality, professional handoff records, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-rmd-guide in the feature registry and remove the RMD guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.58",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion 5-year rules guide",
    summary:
      "Added an educational Roth conversion 5-year rules guide covering qualified distribution clocks, separate conversion-specific 5-year periods, Roth IRA ordering rules, age 59 1/2 and exception review, records to save, and calculator boundaries for later withdrawal treatment.",
    affectedArea: "Roth IRA rule education, withdrawal-treatment boundary language, professional review preparation, recordkeeping guidance, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-five-year-rules-guide in the feature registry and remove the 5-year rules route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.57",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion CPA questions guide",
    summary:
      "Added an educational CPA questions guide covering taxable income verification, after-tax basis and Form 8606 records, IRA aggregation, withholding and estimated tax payment review, state tax assumptions, IRMAA/ACA/NIIT/RMD interaction questions, filing records, and post-filing comparison.",
    affectedArea: "Professional review preparation, compliance boundary reinforcement, calculator assumption quality, tax record handoff, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-cpa-questions-guide in the feature registry and remove the CPA questions route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.56",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion custodian process guide",
    summary:
      "Added an educational custodian process guide covering account eligibility notes, conversion request submission records, outside-funds versus withholding assumptions, confirmation review, 1099-R/5498/8606 reconciliation, CPA handoff packets, and post-process calculator updates.",
    affectedArea: "Operational user education, custodian processing records, tax form reconciliation, privacy-safe workflow guidance, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-custodian-process-guide in the feature registry and remove the custodian process guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.55",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion timeline guide",
    summary:
      "Added an educational Roth conversion timeline guide covering pre-year-end taxable income estimates, custodian processing deadlines, conversion confirmations, estimated tax payment review, 1099-R/5498/8606 reconciliation, CPA review packages, and post-filing comparison.",
    affectedArea: "User planning sequence, year-end deadline education, tax form reconciliation, CPA handoff, and long-tail SEO",
    rollbackPath:
      "Disable roth-conversion-timeline-guide in the feature registry and remove the timeline guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.54",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion tax forms guide",
    summary:
      "Added an educational tax forms guide covering Form 1099-R, Form 5498, Form 8606, prior-year tax returns, nondeductible IRA contribution records, IRA statements, withholding confirmations, calculator PDFs, CPA question lists, and decision records.",
    affectedArea: "Tax-record education, basis review, CPA handoff preparation, long-tail SEO, and calculator assumption validation",
    rollbackPath:
      "Disable roth-conversion-tax-forms-guide in the feature registry and remove the tax forms guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.53",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion mistakes guide",
    summary:
      "Added an educational guide to common Roth conversion modeling mistakes covering gross income vs taxable income, filing status, state tax assumptions, after-tax basis, IRA balance aggregation, IRMAA/ACA/NIIT/RMD limits, IRA withholding, penalty assumptions, single-scenario decisions, and treating calculator output as advice.",
    affectedArea: "User education, SEO mistake-intent coverage, calculator input quality, compliance boundaries, and CPA review routing",
    rollbackPath:
      "Disable roth-conversion-mistakes-guide in the feature registry and remove the mistakes guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.52",
    date: "2026-05-03",
    type: "minor",
    title: "Calculator assumptions guide",
    summary:
      "Added a plain-English assumptions guide covering filing status, taxable income, state rate, conversion amount, traditional IRA balance, after-tax basis, age, tax payment method, withholding, expected return, retirement age, retirement tax rate, and inflation assumptions.",
    affectedArea: "Calculator onboarding, input comprehension, SEO educational intent, professional review notes, and user completion quality",
    rollbackPath:
      "Disable calculator-assumptions-guide in the feature registry and remove the assumptions guide route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.51",
    date: "2026-05-03",
    type: "minor",
    title: "Roth conversion planning checklist",
    summary:
      "Added a pre-calculator Roth conversion planning checklist covering filing status, taxable income, age, state tax assumptions, IRA balance, after-tax basis, conversion amount, tax payment method, return assumptions, model limits, saved scenarios, and professional review planning.",
    affectedArea: "User onboarding, calculator input preparation, SEO checklist intent, professional review flow, and compliance framing",
    rollbackPath:
      "Disable roth-conversion-planning-checklist in the feature registry and remove the planning checklist route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.50",
    date: "2026-05-03",
    type: "minor",
    title: "Privacy data flow playbook",
    summary:
      "Added a privacy and data-flow audit playbook covering local calculator execution, browser storage, share-link hashes, PDF exports, copy summaries, privacy-safe GA4 events, health endpoint payloads, AI request boundaries, sensitive-data blocking, and fallback privacy.",
    affectedArea: "Privacy architecture, browser-local calculation, analytics data minimization, AI API boundaries, and compliance evidence",
    rollbackPath:
      "Disable privacy-data-flow-playbook in the feature registry and remove the privacy-data-flow route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.49",
    date: "2026-05-03",
    type: "minor",
    title: "Feedback roadmap playbook",
    summary:
      "Added a small-version feedback roadmap playbook covering feedback capture, workflow tagging, compliance-risk classification, priority scoring, small-version boundaries, acceptance tests, feature registry rollout, release notes, and follow-up monitoring.",
    affectedArea: "User feedback operations, small-version planning, compliance triage, feature registry releases, and roadmap governance",
    rollbackPath:
      "Disable feedback-roadmap-playbook in the feature registry and remove the feedback-roadmap route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.48",
    date: "2026-05-03",
    type: "minor",
    title: "CPA review checklist",
    summary:
      "Added a professional review handoff checklist for calculator users covering result summaries, scenario assumptions, IRA basis records, tax documents, state assumptions, IRMAA/ACA/model-limit questions, written advisor recommendations, and post-filing recordkeeping.",
    affectedArea: "User handoff workflow, compliance boundary reinforcement, CPA/advisor review preparation, and calculator result usability",
    rollbackPath:
      "Disable cpa-review-checklist in the feature registry and remove the cpa-review-checklist route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.47",
    date: "2026-05-03",
    type: "minor",
    title: "Content operations playbook",
    summary:
      "Added an editorial operations playbook covering GSC query research, keyword-intent mapping, educational drafting, calculator internal links, compliance copy review, disclaimer checks, sitemap coverage, release notes, and refresh/pruning workflows.",
    affectedArea: "SEO content operations, editorial governance, compliance review, internal linking, and content refresh process",
    rollbackPath:
      "Disable content-operations-playbook in the feature registry and remove the content-operations route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.46",
    date: "2026-05-03",
    type: "minor",
    title: "AI compliance audit playbook",
    summary:
      "Added an AI compliance audit playbook covering no-advice prompt boundaries, personalized decision refusals, required disclaimer enforcement, sensitive data blocking, model upgrade regression prompts, static fallback responses, feature shutdown, and unsafe-output incident evidence.",
    affectedArea: "AI assistant compliance governance, model upgrade review, sensitive-data protection, fallback operations, and audit trails",
    rollbackPath:
      "Disable ai-compliance-audit-playbook in the feature registry and remove the ai-compliance-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.45",
    date: "2026-05-03",
    type: "minor",
    title: "Tax data update playbook",
    summary:
      "Added an annual IRS tax-data update playbook covering source review, federal bracket table updates, tax-year freshness messaging, AI knowledge boundaries, calculation regression tests, CPA review evidence, release notes, sitemap submission, and rollback preparation.",
    affectedArea: "Annual tax-data governance, calculator accuracy review, compliance review, SEO freshness, and release rollback",
    rollbackPath:
      "Disable tax-data-update-playbook in the feature registry and remove the tax-data-update route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.44",
    date: "2026-05-03",
    type: "minor",
    title: "Accessibility audit playbook",
    summary:
      "Added a WCAG-focused accessibility audit playbook covering keyboard navigation, visible focus states, screen reader labels, heading hierarchy, chart alternatives, light and dark contrast, reduced motion, mobile input labels, touch targets, and disclaimer readability.",
    affectedArea: "Accessibility QA, Apple-style VoiceOver readiness, mobile form usability, and WCAG 2.1 AA review",
    rollbackPath:
      "Disable accessibility-audit-playbook in the feature registry and remove the accessibility-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.43",
    date: "2026-05-03",
    type: "minor",
    title: "Performance audit playbook",
    summary:
      "Added a Core Web Vitals and Lighthouse audit playbook covering homepage LCP, calculator interaction responsiveness, CLS, SEO landing pages, mobile input ergonomics, navigation wrapping, bundle-size comparison, and static route generation.",
    affectedArea: "Performance operations, Core Web Vitals review, Lighthouse checks, mobile usability, and release regression gates",
    rollbackPath:
      "Disable performance-audit-playbook in the feature registry and remove the performance-audit route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.42",
    date: "2026-05-03",
    type: "minor",
    title: "SEO monitoring playbook",
    summary:
      "Added a post-launch SEO monitoring playbook covering Google Search Console coverage, query impressions and CTR, GA4 privacy-safe events, Core Web Vitals, sitemap coverage, content refresh cadence, and incident rollback review.",
    affectedArea: "Post-launch SEO operations, Google monitoring, content cadence, and rollback governance",
    rollbackPath:
      "Disable seo-monitoring-playbook in the feature registry and remove the seo-monitoring route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.41",
    date: "2026-05-03",
    type: "minor",
    title: "Production launch guide",
    summary:
      "Added a production launch guide covering domain connection, Vercel environment variables, Google Search Console, GA4, sitemap submission, launch verification, health checks, and rollback evidence.",
    affectedArea: "Production deployment, Google launch workflow, operational handoff, and crawl readiness",
    rollbackPath:
      "Disable production-launch-guide in the feature registry and remove the production-launch route, sitemap entry, homepage link, site-index link, and llms.txt link.",
  },
  {
    version: "1.0.40",
    date: "2026-05-03",
    type: "minor",
    title: "Site index",
    summary:
      "Added a crawlable human-readable site index covering calculator entry points, education pages, reference pages, compliance pages, operations resources, and machine-readable feeds.",
    affectedArea: "Internal linking, launch review, AI discovery, and Google crawl coverage",
    rollbackPath:
      "Disable site-index in the feature registry and remove the site-index route, sitemap entry, homepage link, and llms.txt link.",
  },
  {
    version: "1.0.39",
    date: "2026-05-03",
    type: "minor",
    title: "Launch readiness checklist",
    summary:
      "Added a production handoff checklist covering domain setup, Google Search Console, analytics, SEO discovery, compliance review, testing evidence, health checks, and rollback readiness.",
    affectedArea: "Launch operations, production handoff, and post-development delivery tracking",
    rollbackPath:
      "Disable launch-readiness-checklist in the feature registry and remove the launch-readiness route, sitemap entry, and homepage link.",
  },
  {
    version: "1.0.38",
    date: "2026-05-03",
    type: "minor",
    title: "Tax interaction SEO pages",
    summary:
      "Added a tax interaction hub and four crawlable pages explaining IRMAA, ACA premium tax credits, NIIT, and RMD limits that the calculator does not model.",
    affectedArea: "Calculator model limits, compliance transparency, and long-tail SEO",
    rollbackPath: "Disable tax-interaction-pages in the feature registry and remove tax-interactions routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.37",
    date: "2026-05-03",
    type: "minor",
    title: "Multi-year planning SEO pages",
    summary:
      "Added a multi-year planning hub and four crawlable educational pages for lump-sum, 2-year, 3-year, and 5-year Roth conversion schedule examples.",
    affectedArea: "Multi-year conversion education, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable multi-year-planning-pages in the feature registry and remove multi-year planning routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.36",
    date: "2026-05-03",
    type: "minor",
    title: "Social preview image",
    summary:
      "Added a local SVG social preview image and wired OpenGraph/Twitter metadata to use a large branded card when links are shared.",
    affectedArea: "Social sharing metadata, OpenGraph previews, and brand consistency",
    rollbackPath: "Disable social-preview-image in the feature registry and remove social image metadata plus the local SVG asset.",
  },
  {
    version: "1.0.35",
    date: "2026-05-03",
    type: "minor",
    title: "LLM text index",
    summary:
      "Added a machine-readable llms.txt index that summarizes the calculator, compliance pages, content hubs, and recent guides for AI search and answer engines.",
    affectedArea: "AI discoverability, content indexing, and machine-readable site navigation",
    rollbackPath: "Disable llms-text-index in the feature registry and remove the llms.txt route plus robots metadata entry.",
  },
  {
    version: "1.0.34",
    date: "2026-05-03",
    type: "minor",
    title: "Basis planning SEO pages",
    summary:
      "Added a basis hub and three crawlable pages for after-tax basis, the pro-rata rule, and Form 8606 concepts with calculator prefill links.",
    affectedArea: "Basis education, pro-rata modeling, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable basis-planning-pages in the feature registry and remove basis routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.33",
    date: "2026-05-03",
    type: "minor",
    title: "Tax payment method SEO pages",
    summary:
      "Added a tax payment method hub and three crawlable pages explaining outside-funds, IRA withholding, and not-sure calculator assumptions with prefilled calculator links.",
    affectedArea: "Penalty-assumption education, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable tax-payment-method-pages in the feature registry and remove tax-payment-method routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.32",
    date: "2026-05-03",
    type: "minor",
    title: "Sitemap priority hints",
    summary:
      "Added sitemap changeFrequency and priority hints so homepage, calculator hubs, keyword pages, and educational content expose clearer crawl importance signals.",
    affectedArea: "Sitemap generation and crawl discovery",
    rollbackPath: "Disable sitemap-priority-hints in the feature registry and remove priority/changeFrequency fields from sitemap entries.",
  },
  {
    version: "1.0.31",
    date: "2026-05-03",
    type: "minor",
    title: "Tax bracket rate SEO pages",
    summary:
      "Added seven crawlable 2026 federal tax-bracket rate pages that show income ranges by filing status and link back to the Roth conversion calculator.",
    affectedArea: "Tax bracket SEO, internal links, and calculator discovery paths",
    rollbackPath: "Disable tax-bracket-rate-pages in the feature registry and remove rate routes, sitemap entries, and bracket-index links.",
  },
  {
    version: "1.0.30",
    date: "2026-05-03",
    type: "minor",
    title: "Social preview metadata",
    summary:
      "Added root Twitter/X summary card metadata so shared links have a consistent title and description preview.",
    affectedArea: "Root SEO metadata and social sharing previews",
    rollbackPath: "Disable social-preview-metadata in the feature registry and remove twitter metadata from the root layout.",
  },
  {
    version: "1.0.29",
    date: "2026-05-03",
    type: "minor",
    title: "Core keyword landing pages",
    summary:
      "Added a calculator landing hub and four root-level keyword pages for Roth IRA conversion, conversion tax, break-even, and 2026 search intents.",
    affectedArea: "High-intent SEO entry points and calculator discovery paths",
    rollbackPath: "Disable keyword-landing-pages in the feature registry and remove calculator keyword routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.28",
    date: "2026-05-02",
    type: "minor",
    title: "PWA install icons",
    summary:
      "Added local SVG app icons and manifest icon entries so the calculator has a stable branded icon when installed or saved to a device home screen.",
    affectedArea: "PWA manifest, Apple home-screen readiness, and install experience",
    rollbackPath: "Disable pwa-install-icons in the feature registry and remove manifest icon entries plus the local SVG assets.",
  },
  {
    version: "1.0.27",
    date: "2026-05-02",
    type: "minor",
    title: "Homepage HowTo structured data",
    summary:
      "Added homepage HowTo and Organization JSON-LD so search engines can better understand calculator usage steps and the publishing entity.",
    affectedArea: "Homepage structured data and technical SEO",
    rollbackPath: "Disable homepage-howto-structured-data in the feature registry or remove the HowTo and Organization JSON-LD scripts from the homepage.",
  },
  {
    version: "1.0.26",
    date: "2026-05-02",
    type: "minor",
    title: "Example scenario SEO pages",
    summary:
      "Added a crawlable examples hub and three prefilled calculator scenario pages for young professional, near-retirement, and estate-planning educational examples.",
    affectedArea: "Scenario presets, long-tail SEO, and calculator onboarding paths",
    rollbackPath: "Disable example-scenario-seo-pages in the feature registry and remove examples routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.25",
    date: "2026-05-02",
    type: "minor",
    title: "Age scenario SEO pages",
    summary:
      "Added a crawlable age-scenario hub and four age-specific Roth conversion calculator pages with calculator prefill links for under 59 1/2, after 59 1/2, near-retirement, and retired scenarios.",
    affectedArea: "Long-tail SEO, age-based calculator entry paths, and educational penalty context",
    rollbackPath: "Disable age-scenario-seo-pages in the feature registry and remove age-scenarios routes, sitemap entries, and homepage links.",
  },
  {
    version: "1.0.24",
    date: "2026-05-02",
    type: "minor",
    title: "Filing status SEO hub",
    summary:
      "Added a crawlable filing status hub page that links to all four Roth conversion filing-status calculators and exposed it from sitemap and homepage navigation.",
    affectedArea: "Filing status SEO architecture and homepage internal links",
    rollbackPath: "Disable filing-status-hub in the feature registry and remove the /filing-status route, sitemap entry, and homepage links.",
  },
  {
    version: "1.0.23",
    date: "2026-05-02",
    type: "minor",
    title: "Filing status SEO pages",
    summary:
      "Added four crawlable Roth conversion calculator pages for Single, Married Filing Jointly, Married Filing Separately, and Head of Household scenarios with calculator prefill links.",
    affectedArea: "Long-tail SEO and calculator entry paths",
    rollbackPath: "Disable filing-status-seo-pages in the feature registry and remove filing-status routes, content, and sitemap entries.",
  },
  {
    version: "1.0.22",
    date: "2026-05-02",
    type: "minor",
    title: "2026 federal tax brackets page",
    summary:
      "Added a crawlable 2026 federal tax brackets reference page with tables for all filing statuses and calculator CTAs.",
    affectedArea: "Tax data transparency and long-tail SEO",
    rollbackPath: "Disable federal-tax-brackets-page in the feature registry and remove the route, sitemap entry, and homepage links.",
  },
  {
    version: "1.0.21",
    date: "2026-05-02",
    type: "minor",
    title: "Operational health check endpoint",
    summary:
      "Added /api/health with public operational status, tax-year metadata, content counts, and feature counts for uptime monitoring.",
    affectedArea: "Production monitoring and operations",
    rollbackPath: "Disable health-check-endpoint in the feature registry and remove the api/health route and payload builder.",
  },
  {
    version: "1.0.20",
    date: "2026-05-02",
    type: "minor",
    title: "Roth conversion glossary hub",
    summary:
      "Added a glossary index, 16 educational term pages, DefinedTermSet structured data, related-term links, calculator CTAs, and sitemap coverage.",
    affectedArea: "Educational content SEO and user onboarding",
    rollbackPath: "Disable glossary-hub in the feature registry and remove glossary routes, sitemap entries, and homepage glossary links.",
  },
  {
    version: "1.0.19",
    date: "2026-05-02",
    type: "minor",
    title: "Homepage lazy loading",
    summary:
      "Moved non-critical homepage modules such as the projection chart, PDF report button, AI explainer, and analysis tables behind dynamic imports to reduce initial bundle pressure.",
    affectedArea: "Homepage performance and Core Web Vitals readiness",
    rollbackPath: "Disable homepage-lazy-loading in the feature registry and restore the previous static homepage imports.",
  },
  {
    version: "1.0.18",
    date: "2026-05-02",
    type: "minor",
    title: "Blog RSS feed",
    summary:
      "Added a static feed.xml route for blog content distribution and exposed the feed from robots metadata alongside the sitemap.",
    affectedArea: "Content distribution and crawl discovery",
    rollbackPath: "Disable rss-feed in the feature registry and remove the feed.xml route and robots feed entry.",
  },
  {
    version: "1.0.17",
    date: "2026-05-02",
    type: "minor",
    title: "Google Search Console verification",
    summary:
      "Added validated Google site-verification metadata support through NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION for production domain verification.",
    affectedArea: "Root metadata and launch SEO configuration",
    rollbackPath: "Disable search-console-verification in the feature registry and remove metadata.verification from the root layout.",
  },
  {
    version: "1.0.16",
    date: "2026-05-02",
    type: "minor",
    title: "Blog internal linking system",
    summary:
      "Added blog topic groups, related guide links, and calculator CTAs to strengthen crawl paths and user movement from content to the calculator.",
    affectedArea: "Blog hub, blog article pages, internal SEO links",
    rollbackPath: "Disable blog-internal-linking in the feature registry and remove topic groups, related guide links, and calculator CTAs.",
  },
  {
    version: "1.0.15",
    date: "2026-05-02",
    type: "minor",
    title: "Privacy-safe analytics",
    summary:
      "Added optional GA4 loading and calculator-result event tracking that uses financial ranges instead of exact user-entered amounts.",
    affectedArea: "Analytics foundation and homepage calculator telemetry",
    rollbackPath: "Disable privacy-safe-analytics in the feature registry and remove the GA scripts and calculator analytics beacon.",
  },
  {
    version: "1.0.14",
    date: "2026-05-02",
    type: "minor",
    title: "Production readiness checks",
    summary:
      "Added global browser security headers and Playwright operational-readiness coverage for calculator workflows, mobile usability, AI fallback behavior, and SEO pages.",
    affectedArea: "Production deployment configuration and E2E test suite",
    rollbackPath: "Disable production-readiness in the feature registry, remove the global headers, and remove the operational-readiness Playwright spec.",
  },
  {
    version: "1.0.13",
    date: "2026-05-02",
    type: "minor",
    title: "SEO structured content matrix",
    summary:
      "Added Article and Breadcrumb structured data for content pages and expanded the Roth conversion guide library to 12 long-tail educational pages.",
    affectedArea: "Blog SEO, state page SEO, sitemap content depth",
    rollbackPath: "Disable seo-structured-content in the feature registry, remove the JSON-LD scripts, and revert the added blog entries.",
  },
  {
    version: "1.0.12",
    date: "2026-05-02",
    type: "minor",
    title: "AI compliance gateway",
    summary:
      "Added centralized AI request validation, sensitive-data prompt blocking, unsafe-output fallback, API rate limiting, and frontend failure recovery.",
    affectedArea: "AI explainer API and user interface",
    rollbackPath: "Disable the ai-compliance-gateway registry item and route AI requests through the previous guardrails-only flow.",
  },
  {
    version: "1.0.11",
    date: "2026-05-02",
    type: "minor",
    title: "Multi-year conversion schedule",
    summary:
      "Added an educational equal-split schedule table comparing lump-sum, 2-year, 3-year, and 5-year Roth conversion tax-cost timing.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable multi-year-schedule in the feature registry or remove MultiYearScheduleTable from the homepage.",
  },
  {
    version: "1.0.10",
    date: "2026-05-02",
    type: "minor",
    title: "Federal bracket capacity table",
    summary:
      "Added an educational table showing remaining taxable income room and gross conversion capacity for each 2026 federal bracket.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable bracket-capacity in the feature registry or remove FederalBracketCapacityTable from the homepage.",
  },
  {
    version: "1.0.9",
    date: "2026-05-01",
    type: "minor",
    title: "Conversion sensitivity table",
    summary:
      "Added an educational table comparing nearby conversion amounts, upfront cost, break-even estimate, after-tax difference, and federal bracket impact.",
    affectedArea: "Homepage results analysis",
    rollbackPath: "Disable conversion-sensitivity in the feature registry or remove ConversionSensitivityTable from the homepage.",
  },
  {
    version: "1.0.8",
    date: "2026-05-01",
    type: "minor",
    title: "Tax data freshness card",
    summary: "Added visible tax-year, source-scope, and update-window messaging on the homepage and methodology page.",
    affectedArea: "SEO trust content and methodology disclosure",
    rollbackPath: "Remove the TaxDataFreshnessCard mount points and keep the core calculator unchanged.",
  },
  {
    version: "1.0.7",
    date: "2026-05-01",
    type: "minor",
    title: "State-rate calculator prefill links",
    summary: "State SEO pages can now send visitors back to the calculator with the example state tax rate prefilled.",
    affectedArea: "State landing pages and calculator hash restore flow",
    rollbackPath: "Change the state CTA href back to /#calculator.",
  },
  {
    version: "1.0.6",
    date: "2026-05-01",
    type: "minor",
    title: "FAQPage structured data",
    summary: "Homepage FAQ content now powers matching FAQPage JSON-LD for search engine understanding.",
    affectedArea: "Homepage SEO metadata",
    rollbackPath: "Remove the faqJsonLd script from the homepage.",
  },
  {
    version: "1.0.5",
    date: "2026-05-01",
    type: "minor",
    title: "Copy summary",
    summary: "Users can copy an educational result summary with the required disclaimer for CPA review.",
    affectedArea: "Results action toolbar",
    rollbackPath: "Remove CopyResultButton from the results actions.",
  },
];
