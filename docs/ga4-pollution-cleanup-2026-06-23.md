# GA4 Pollution Cleanup Follow-Up - 2026-06-23

## Scope

This report records the user-provided GA4 and GSC exports from 2026-06-23 and the safe next action for the AI+pSEO loop.

It does not change GA4 settings, Google account permissions, DNS, Search Console ownership, or production analytics configuration.

## Evidence Reviewed

- GA4 overview export: `C:/Users/86189/Downloads/报告概况 (3).csv`
- GSC query export folder: `C:/Users/86189/Downloads/https___www.roth-conversion-calculator-ai.shop_-Performance-on-Search-2026-06-23/`
- Local GA4 audit output: `docs/ga4-report-audit-2026-06-23.json`
- GSC query opportunity record: `docs/gsc-query-opportunities/2026-06-23/search-console-query-opportunity-01-best-free-roth-conversion-tax-calculator.json`

## GA4 Audit Result

Status: `polluted`

Observed aggregate signals:

- Active users: `898`
- New users: `895`
- Average engagement seconds per active user: about `1.92`
- Direct traffic share: about `99.33%`
- Google organic users or sessions: `2`
- Foreign page title rows: `12`
- Foreign page title views: `47`

Foreign page titles still include Heshengxin / pool robot pages. Because unrelated page titles remain in the export, GA4 engagement metrics must not be used for SEO scoring, page-quality conclusions, or pSEO publication decisions yet.

## Source Check

Local source and live-output check result:

- The current bobo production plugin source file checked at `D:/bobo-poolrobot-seo-fix/bobo-pseo-phase1-fixes.php` has `GA4_MEASUREMENT_ID = ''`, so that plugin no longer intentionally emits the Roth Measurement ID.
- Live checks for `https://bobo-poolrobot.com/automatic-pool-cleaner-robot/` and `https://bobo-poolrobot.com/wireless-pool-cleaning-robot/` returned `G-2YJ3V38RGJ` count `0`.
- Those same bobo live pages still include the bobo Google tag marker `GT-MB6TNCFH`, which is expected for the bobo site and is not the Roth Measurement ID.
- The bobo homepage request returned HTTP `403` to the local audit user agent, so this round could not confirm the homepage HTML through that method.
- Historical reports, cached HTML snapshots, and old plugin editor captures under `D:/bobo-poolrobot-seo-fix/reports` and `D:/bobo-poolrobot-seo-fix/scripts` still contain `G-2YJ3V38RGJ`. Those files are evidence of the prior pollution source, not proof that current production still emits the Roth ID.

Interpretation:

- The most likely current state is: the bobo production output checked here no longer emits the Roth ID on the two reachable product URLs, but GA4 may still show historic or delayed polluted rows.
- A fresh Roth GA4 Hostname or Page location export is still required before treating cleanup as confirmed.

## Wrong-Property Export Found

On 2026-06-23, a newer downloaded file named `C:/Users/86189/Downloads/报告概况 (4).csv` was reviewed after the owner reported the issue was not fixed.

That file is not a Roth Calculator GA4 export. Its header identifies:

```text
Account: aipregnancycaloriecalculator.online
Property: aipregnancycaloriecalculator.online
```

Therefore, `报告概况 (4).csv` cannot be used to decide whether the Roth Calculator GA4 pollution is fixed. The GA4 report audit now includes a wrong-property guard so exports from other GA4 properties are classified as `wrong-property` before they can affect Roth SEO or pSEO decisions.

## GSC Query Evidence

Observed query:

```text
best free roth conversion tax calculator
```

Metrics:

- Clicks: `0`
- Impressions: `1`
- CTR: `0`
- Average position: `95`

Decision:

- Record as observation evidence only.
- Do not create new pages from this single-impression query.
- Do not rewrite primary calculator copy solely from this sample.
- Review again after the next GSC export, currently scheduled in the query record for `2026-07-07`.

## Current Decision

The next SEO execution step is not new page generation. The correct next step is data-quality confirmation:

1. Export GA4 with `Hostname` or `Page location` after the cleanup window.
2. Run:

```bash
npm run seo:ga4-hostname-audit -- "C:\path\to\fresh-ga4-hostname-or-page-location.csv"
```

3. Use GA4 for AI+pSEO scoring only if the audit returns `dataQualityStatus: usable`.
4. Keep GSC query work in observation mode until query/page samples repeat with meaningful impressions or clicks.

## Guardrail

Until a fresh hostname or page-location audit is clean:

- Do not use GA4 engagement time as proof that users dislike the calculator.
- Do not use GA4 bounce rate as a ranking or page-quality decision signal.
- Do not trigger new pSEO pages from polluted GA4 behavior data.
- Use GSC exports, local SEO smoke, content quality gates, and production evidence as the safer decision sources.
