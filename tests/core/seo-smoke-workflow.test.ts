import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO smoke workflow", () => {
  it("runs the production SEO smoke command after deploy-oriented triggers", () => {
    const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/seo-smoke.yml"), "utf8");

    expect(workflow).toContain("name: SEO Smoke");
    expect(workflow).toContain("workflow_dispatch:");
    expect(workflow).toContain("push:");
    expect(workflow).toContain("- main");
    expect(workflow).toContain("schedule:");
    expect(workflow).toContain('cron: "17 9 * * *"');
    expect(workflow).toContain("SEO_SMOKE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("GSC_EVIDENCE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("SEARCH_CONSOLE_VERIFICATION_EVIDENCE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("SEARCH_CONSOLE_VERIFICATION_DOMAIN: roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("SEARCH_CONSOLE_VERIFICATION_TOKEN: bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q");
    expect(workflow).toContain("PERFORMANCE_EVIDENCE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("STRUCTURED_DATA_EVIDENCE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("BLOG_DISCOVERY_EVIDENCE_BASE_URL: https://www.roth-conversion-calculator-ai.shop");
    expect(workflow).toContain("uses: actions/checkout@v6");
    expect(workflow).toContain("uses: actions/setup-node@v6");
    expect(workflow).toContain("node-version: 24");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("sleep 90");
    expect(workflow).toContain("set -o pipefail");
    expect(workflow).toContain("node scripts/seo-smoke.mjs | tee seo-smoke-result.json");
    expect(workflow).toContain("node scripts/gsc-evidence.mjs | tee gsc-evidence-result.json");
    expect(workflow).toContain("Run Search Console verification evidence check");
    expect(workflow).toContain(
      "node scripts/search-console-verification-evidence.mjs | tee search-console-verification-evidence-result.json",
    );
    expect(workflow).toContain("Run mobile performance evidence check");
    expect(workflow).toContain("Run professional review packet evidence check");
    expect(workflow).toContain(
      "node scripts/professional-review-packet-evidence.mjs | tee professional-review-packet-evidence-result.json",
    );
    expect(workflow).toContain("node scripts/performance-evidence.mjs | tee performance-evidence-result.json");
    expect(workflow).toContain("Run structured data evidence check");
    expect(workflow).toContain("node scripts/structured-data-evidence.mjs | tee structured-data-evidence-result.json");
    expect(workflow).toContain("Run blog discovery evidence check");
    expect(workflow).toContain("node scripts/blog-discovery-evidence.mjs | tee blog-discovery-evidence-result.json");
    expect(workflow).toContain("Run private evidence boundary check");
    expect(workflow).toContain("GH_TOKEN: ${{ github.token }}");
    expect(workflow).toContain("node scripts/privacy-evidence-boundary.mjs | tee privacy-evidence-boundary-result.json");
    expect(workflow).toContain("Run AI security evidence check");
    expect(workflow).toContain("node scripts/ai-security-evidence.mjs | tee ai-security-evidence-result.json");
    expect(workflow).toContain("Validate SEO evidence artifact");
    expect(workflow).toContain("node scripts/validate-seo-evidence.mjs | tee seo-evidence-validation-result.json");
    expect(workflow).toContain("Generate SEO evidence manifest");
    expect(workflow).toContain("node scripts/generate-seo-evidence-manifest.mjs | tee seo-evidence-manifest.json");
    expect(workflow).toContain("node scripts/validate-seo-evidence-manifest.mjs | tee seo-evidence-manifest-validation-result.json");
    expect(workflow).toContain("uses: actions/upload-artifact@v7");
    expect(workflow).not.toContain("FORCE_JAVASCRIPT_ACTIONS_TO_NODE24");
    expect(workflow).not.toContain("actions/checkout@v4");
    expect(workflow).not.toContain("actions/setup-node@v4");
    expect(workflow).not.toContain("actions/upload-artifact@v4");
    expect(workflow).toContain("name: production-seo-evidence");
    expect(workflow).toContain("seo-smoke-result.json");
    expect(workflow).toContain("gsc-evidence-result.json");
    expect(workflow).toContain("search-console-verification-evidence-result.json");
    expect(workflow).toContain("performance-evidence-result.json");
    expect(workflow).toContain("professional-review-packet-evidence-result.json");
    expect(workflow).toContain("structured-data-evidence-result.json");
    expect(workflow).toContain("blog-discovery-evidence-result.json");
    expect(workflow).toContain("privacy-evidence-boundary-result.json");
    expect(workflow).toContain("ai-security-evidence-result.json");
    expect(workflow).toContain("seo-evidence-validation-result.json");
    expect(workflow).toContain("seo-evidence-manifest.json");
    expect(workflow).toContain("seo-evidence-manifest-validation-result.json");
    expect(workflow).toContain("retention-days: 30");
  });
});
