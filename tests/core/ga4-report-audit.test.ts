import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildGa4ReportAudit, parseGa4OverviewExport } from "../../scripts/ga4-report-audit.mjs";

const sampleExport = `# Report overview
# Property: roth-conversion-calculator-ai.shop
# Date range
Active users,New users,Average engagement time per active user,Event count
876,873,1.8869863013698631,3897

# Date range
Page title and screen class,Views,Active users,Event count,Bounce rate
Roth Conversion Calculator 2026 | Estimate Taxes & Break-Even,737,727,3112,0.9877049180327869
Certified Cordless Pool Robot Manufacturer | Heshengxin,36,9,80,0.4782608695652174
2026年罗斯IRA转换计算器 | 估算税负和盈亏平衡点,4,1,11,0
Lösungen -,1,1,3,1
R&D Capability -,1,1,4,1
SEO Monitoring Playbook | Roth Conversion Calculator,1,1,3,0

# Date range
First user source / medium,Active users
(direct) / (none),869
google / organic,2
chatgpt.com / (not set),2

# Date range
Session source / medium,Sessions
(direct) / (none),893
google / organic,2
chatgpt.com / (not set),2

# Date range
City,Active users
Flint Hill,182
Chicago,111
`;

const wrongPropertyExport = `# Report overview
# Account: aipregnancycaloriecalculator.online
# Property: aipregnancycaloriecalculator.online
# Date range
Active users,New users,Average engagement time per active user,Event count
86,87,5.883720930232558,379

# Date range
Page title and screen class,Views,Active users,Event count,Bounce rate
Pregnancy Calorie Calculator | Evidence-Based Trimester Tool,85,74,260,0.8860759493670886
About the Pregnancy Calorie Calculator | Evidence-Based Nutrition Tool,12,10,36,0.7272727272727273

# Date range
First user source / medium,Active users
(direct) / (none),82
aisearchindex.space / referral,4
`;

describe("GA4 report audit", () => {
  it("exposes a local audit command for GA4 CSV exports", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/ga4-report-audit.mjs"), "utf8");
    const addendum = fs.readFileSync(
      path.join(process.cwd(), "docs/product/v1.3-ai-pseo-machine-learning-seo-addendum.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:ga4-report-audit"]).toBe("node scripts/ga4-report-audit.mjs");
    expect(script).toContain("foreign_page_titles_detected");
    expect(script).toContain("Hostname");
    expect(script).toContain("heshengxin");
    expect(script).toContain("hostnameReviewRequired");
    expect(script).toContain("low_google_organic_sample");
    expect(addendum).toContain("GA4 CSV Data Quality Gate");
    expect(addendum).toContain("npm run seo:ga4-report-audit");
  });

  it("flags foreign page titles and low-sample organic search before pSEO scoring", () => {
    const parsed = parseGa4OverviewExport(sampleExport);
    const audit = buildGa4ReportAudit(parsed, "ga4-export.csv");

    expect(audit.ok).toBe(false);
    expect(audit.dataQualityStatus).toBe("polluted");
    expect(audit.overview.activeUsers).toBe(876);
    expect(audit.overview.averageEngagementSecondsPerActiveUser).toBeLessThan(5);
    expect(audit.pageSummary.foreignPageRowCount).toBe(3);
    expect(audit.pageSummary.unknownPageRowCount).toBe(0);
    expect(audit.pageSummary.foreignRows[0].title).toContain("Heshengxin");
    expect(audit.acquisitionSummary.googleOrganicUsersOrSessions).toBe(2);
    expect(audit.acquisitionSummary.directUsersOrSessions).toBe(869);
    expect(audit.acquisitionSummary.acquisitionSectionCount).toBe(2);
    expect(audit.hostnameReviewRequired).toBe(true);
    expect(audit.warnings).toEqual(
      expect.arrayContaining([
        "direct_traffic_dominates",
        "foreign_page_titles_detected",
        "low_google_organic_sample",
        "very_low_average_engagement_time",
      ]),
    );
    expect(audit.decisionBoundary).toContain("does not change GA4 settings");
  });

  it("rejects GA4 overview exports from the wrong property before Roth pSEO decisions", () => {
    const parsed = parseGa4OverviewExport(wrongPropertyExport);
    const audit = buildGa4ReportAudit(parsed, "pregnancy-ga4-export.csv");

    expect(audit.ok).toBe(false);
    expect(audit.dataQualityStatus).toBe("wrong-property");
    expect(audit.warnings).toContain("wrong_ga4_property_export");
    expect(audit.sourcePropertyHints.join(" ")).toContain("aipregnancycaloriecalculator.online");
    expect(audit.recommendedActions[0]).toContain("Roth Calculator property");
  });
});
