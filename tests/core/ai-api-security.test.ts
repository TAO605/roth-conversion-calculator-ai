import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("AI API security and cost guard", () => {
  it("keeps paid OpenAI calls behind an explicit opt-in fuse", () => {
    const routeSource = fs.readFileSync(
      path.join(process.cwd(), "src/app/api/ai/explain/route.ts"),
      "utf8",
    );

    expect(routeSource).toContain("AI_EXPLAINER_PAID_MODEL_ENABLED");
    expect(routeSource).toContain('process.env.AI_EXPLAINER_PAID_MODEL_ENABLED === "true"');
    expect(routeSource).toContain("paidModelEnabled && apiKey");
    expect(routeSource).toContain("isAllowedAiRequestOrigin");
    expect(routeSource).toContain("origin_blocked");
    expect(routeSource).toContain("X-AI-Provider");
  });

  it("does not grant browser connect-src access to the OpenAI API", () => {
    const nextConfigSource = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");

    expect(nextConfigSource).toContain("connect-src 'self'");
    expect(nextConfigSource).not.toContain("https://api.openai.com");
  });

  it("documents fallback-only defaults without exposing secret values", () => {
    const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");

    expect(envExample).toContain("AI_EXPLAINER_PAID_MODEL_ENABLED=false");
    expect(envExample).toContain("AI_EXPLAINER_MAX_REQUESTS_PER_HOUR=5");
    expect(envExample).toContain("OPENAI_MODEL=gpt-5");
    expect(envExample).not.toContain("OPENAI_API_KEY=");
    expect(envExample).not.toMatch(/sk-[A-Za-z0-9_-]+/);
  });
});
