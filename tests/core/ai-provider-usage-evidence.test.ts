import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { validateAiProviderUsageEvidence } from "../../scripts/validate-ai-provider-usage-evidence.mjs";

function readTemplate() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "docs/ai-provider-usage-evidence-template.json"), "utf8"));
}

describe("AI provider usage evidence", () => {
  it("ships package commands for sanitized provider usage validation and readiness", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));

    expect(packageJson.scripts["ops:ai-provider-usage-validate"]).toBe(
      "node scripts/validate-ai-provider-usage-evidence.mjs",
    );
    expect(packageJson.scripts["ops:ai-provider-usage-ready"]).toBe(
      "node scripts/ai-provider-usage-readiness.mjs",
    );
  });

  it("keeps the provider usage template valid without requiring account data", () => {
    const result = validateAiProviderUsageEvidence(readTemplate());

    expect(result).toMatchObject({
      evidenceType: "ai-provider-usage-evidence-validation",
      ok: true,
      recordStatus: "template",
    });
    expect(result.reviewBoundary).toContain("does not fetch OpenAI or Anthropic account data");
  });

  it("accepts a recorded sanitized OpenAI usage record", () => {
    const record = {
      ...readTemplate(),
      recordStatus: "recorded",
      provider: {
        name: "openai",
        accountLabel: "owner-reviewed account",
        sourceType: "usage_console",
        observedDateRange: { start: "2026-06-01", end: "2026-06-08" },
      },
      usage: {
        totalRequests: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCostUsd: 0,
        largestDailyCostUsd: 0,
        largestDailyRequestCount: 0,
      },
      models: [],
      evidence: {
        screenshotOrExportPath: "docs/evidence/openai-usage-2026-06-08-redacted.png",
        capturedBy: "site owner",
        capturedAt: "2026-06-08T01:40:00.000Z",
        openAiUsageUrl: "https://platform.openai.com/usage",
        anthropicUsageUrl: "https://console.anthropic.com/settings/usage",
      },
      decision: {
        status: "normal",
        nextAction: "Keep paid AI disabled and continue monitoring.",
        owner: "site owner",
        nextReviewDate: "2026-06-15",
      },
    };

    expect(validateAiProviderUsageEvidence(record)).toMatchObject({
      ok: true,
      providerName: "openai",
      totalCostUsd: 0,
      totalRequests: 0,
    });
  });

  it("blocks secrets, bearer tokens, and payment data from evidence records", () => {
    const record = {
      ...readTemplate(),
      provider: { ...readTemplate().provider, name: "openai" },
      evidence: {
        ...readTemplate().evidence,
        screenshotOrExportPath: "sk-test-secret-should-not-appear",
      },
    };

    const result = validateAiProviderUsageEvidence(record);

    expect(result.ok).toBe(false);
    expect(result.failures.map((failure) => failure.field)).toContain("privacyBoundary");
  });

  it("documents the provider-console boundary in source", () => {
    const validator = fs.readFileSync(path.join(process.cwd(), "scripts/validate-ai-provider-usage-evidence.mjs"), "utf8");
    const readiness = fs.readFileSync(path.join(process.cwd(), "scripts/ai-provider-usage-readiness.mjs"), "utf8");

    expect(validator).toContain("does not fetch OpenAI or Anthropic account data");
    expect(readiness).toContain("does not fetch account data, change billing, rotate keys, or ask for secrets");
    expect(validator).not.toContain("OPENAI_API_KEY=");
    expect(validator).not.toContain("ANTHROPIC_API_KEY=");
  });
});
