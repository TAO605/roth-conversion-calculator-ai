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
});
