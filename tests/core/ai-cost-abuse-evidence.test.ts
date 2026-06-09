import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("AI cost abuse evidence command", () => {
  it("adds a repeatable production evidence command without storing secrets", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const scriptSource = fs.readFileSync(path.join(process.cwd(), "scripts/ai-cost-abuse-evidence.mjs"), "utf8");

    expect(packageJson.scripts["ops:ai-cost-abuse-evidence"]).toBe("node scripts/ai-cost-abuse-evidence.mjs");
    expect(scriptSource).toContain("/api/ai/explain");
    expect(scriptSource).toContain("X-AI-Provider".toLowerCase());
    expect(scriptSource).toContain("manualAccountEvidenceRequired");
    expect(scriptSource).toContain("OpenAI and Anthropic usage consoles");
    expect(scriptSource).toContain("raw IP addresses");
    expect(scriptSource).not.toMatch(/sk-[A-Za-z0-9_-]+/);
    expect(scriptSource).not.toContain("OPENAI_API_KEY=");
    expect(scriptSource).not.toContain("ANTHROPIC_API_KEY=");
  });

  it("keeps account-spend proof separate from Vercel request evidence", () => {
    const scriptSource = fs.readFileSync(path.join(process.cwd(), "scripts/ai-cost-abuse-evidence.mjs"), "utf8");

    expect(scriptSource).toContain("only provider usage consoles can prove historical paid-token spend");
    expect(scriptSource).toContain("sameOriginFallbackOnly");
    expect(scriptSource).toContain("crossOriginBlocked");
    expect(scriptSource).toContain("selfProbeRequestCount: 2");
  });

  it("adds a CI-safe AI security evidence command without Vercel log access", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const scriptSource = fs.readFileSync(path.join(process.cwd(), "scripts/ai-security-evidence.mjs"), "utf8");

    expect(packageJson.scripts["ops:ai-security-evidence"]).toBe("node scripts/ai-security-evidence.mjs");
    expect(scriptSource).toContain("ai-security-evidence");
    expect(scriptSource).toContain("crossOriginProbeBlocked");
    expect(scriptSource).toContain("homepageCspBlocksBrowserOpenAi");
    expect(scriptSource).toContain("paidModelFuseRetained");
    expect(scriptSource).toContain("responseVerifierRetained");
    expect(scriptSource).toContain("sameOriginFallbackVerifierRetained");
    expect(scriptSource).toContain("Provider billing or usage consoles remain the source of truth");
    expect(scriptSource).not.toContain("vercel logs");
    expect(scriptSource).not.toMatch(/sk-[A-Za-z0-9_-]+/);
  });

  it("adds a deterministic AI verifier regression evidence command without provider calls", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const scriptSource = fs.readFileSync(
      path.join(process.cwd(), "scripts/ai-verifier-regression-evidence.mjs"),
      "utf8",
    );

    expect(packageJson.scripts["ops:ai-verifier-regression"]).toBe(
      "node scripts/ai-verifier-regression-evidence.mjs",
    );
    expect(scriptSource).toContain("ai-verifier-regression-evidence");
    expect(scriptSource).toContain("safe-calculator-output-with-required-disclaimer");
    expect(scriptSource).toContain("personalized-advice-language");
    expect(scriptSource).toContain("unsupported-dollar-output");
    expect(scriptSource).toContain("production-default-paid-model-disabled");
    expect(scriptSource).toContain("routeFailsClosedToFallback");
    expect(scriptSource).toContain("sameOriginFallbackProbeRetained");
    expect(scriptSource).toContain("statsPanel");
    expect(scriptSource).toContain("deterministicCoverage");
    expect(scriptSource).toContain("totalFixtures");
    expect(scriptSource).toContain("excludes API keys, cookies, account identifiers");
    expect(scriptSource).not.toMatch(/sk-[A-Za-z0-9_-]+/);
    expect(scriptSource).not.toContain("OPENAI_API_KEY=");
    expect(scriptSource).not.toContain("ANTHROPIC_API_KEY=");
    expect(scriptSource).not.toContain("fetch(");
  });
});
