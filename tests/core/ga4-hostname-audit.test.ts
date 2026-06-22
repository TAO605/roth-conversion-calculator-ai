import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildGa4HostnameAudit, parseHostnameExport } from "../../scripts/ga4-hostname-audit.mjs";

const pollutedExport = `# GA4 hostname export
Hostname,Active users
www.roth-conversion-calculator-ai.shop,727
heshengxin.example,42
roth-conversion-calculator-ai.shop,4
`;

const cleanExport = `Hostname,Active users
www.roth-conversion-calculator-ai.shop,727
roth-conversion-calculator-ai.shop,4
`;

const pageLocationExport = `# GA4 page location export
,Device category,mobile,desktop,Total
City,Page location,Active users,Active users,Active users
(not set),https://www.roth-conversion-calculator-ai.shop/,157,38,195
Chicago,https://www.roth-conversion-calculator-ai.shop/,111,0,111
(not set),http://127.0.0.1/,5,8,13
Almaty,https://bobo-poolrobot.com/?utm_source=chatgpt.com,2,0,2
(not set),https://bobo-poolrobot.com/automatic-pool-cleaner-robot/,0,1,1
`;

const cityExport = `设备类别,mobile,desktop,合计
城市,活跃用户,活跃用户,活跃用户
Flint Hill,182,0,182
Chicago,111,0,111
Shanghai,43,4,47
`;

describe("GA4 hostname audit", () => {
  it("exposes a local hostname audit command and documents the workflow", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    const script = fs.readFileSync(path.join(process.cwd(), "scripts/ga4-hostname-audit.mjs"), "utf8");
    const addendum = fs.readFileSync(
      path.join(process.cwd(), "docs/product/v1.3-ai-pseo-machine-learning-seo-addendum.md"),
      "utf8",
    );

    expect(packageJson.scripts["seo:ga4-hostname-audit"]).toBe("node scripts/ga4-hostname-audit.mjs");
    expect(script).toContain("foreign_hostnames_detected");
    expect(script).toContain("www.roth-conversion-calculator-ai.shop");
    expect(script).toContain("roth-conversion-calculator-ai.shop");
    expect(addendum).toContain("npm run seo:ga4-hostname-audit");
  });

  it("flags foreign hostnames as polluted", () => {
    const audit = buildGa4HostnameAudit(parseHostnameExport(pollutedExport), "hostname.csv");

    expect(audit.ok).toBe(false);
    expect(audit.dataQualityStatus).toBe("polluted");
    expect(audit.allowedUsersOrSessions).toBe(731);
    expect(audit.foreignUsersOrSessions).toBe(42);
    expect(audit.foreignRows[0].hostname).toBe("heshengxin.example");
    expect(audit.warnings).toContain("foreign_hostnames_detected");
  });

  it("accepts exports that contain only Roth Calculator hostnames", () => {
    const audit = buildGa4HostnameAudit(parseHostnameExport(cleanExport), "hostname.csv");

    expect(audit.ok).toBe(true);
    expect(audit.dataQualityStatus).toBe("usable");
    expect(audit.foreignRows).toHaveLength(0);
    expect(audit.totalUsersOrSessions).toBe(731);
  });

  it("does not misclassify city/device reports as hostname pollution", () => {
    const audit = buildGa4HostnameAudit(parseHostnameExport(cityExport), "city.csv");

    expect(audit.ok).toBe(false);
    expect(audit.dataQualityStatus).toBe("polluted");
    expect(audit.rowCount).toBe(0);
    expect(audit.foreignRows).toHaveLength(0);
    expect(audit.warnings).toContain("no_hostname_rows");
    expect(audit.recommendedActions[0]).toContain("not City or Device category");
  });

  it("extracts hostnames from GA4 Page location exports", () => {
    const audit = buildGa4HostnameAudit(parseHostnameExport(pageLocationExport), "page-location.csv");

    expect(audit.ok).toBe(false);
    expect(audit.dataQualityStatus).toBe("polluted");
    expect(audit.allowedUsersOrSessions).toBe(306);
    expect(audit.localDevUsersOrSessions).toBe(13);
    expect(audit.foreignUsersOrSessions).toBe(3);
    expect(audit.foreignRows.map((row) => row.hostname)).toEqual(["bobo-poolrobot.com", "bobo-poolrobot.com"]);
    expect(audit.warnings).toContain("foreign_hostnames_detected");
    expect(audit.warnings).toContain("local_dev_hostnames_detected");
    expect(audit.hostnameSummary[0].hostname).toBe("www.roth-conversion-calculator-ai.shop");
  });
});
