import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import nextConfig from "../../next.config";

describe("production domain configuration", () => {
  it("redirects the apex production domain to the canonical www host", async () => {
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toContainEqual({
      source: "/:path*",
      has: [
        {
          type: "host",
          value: "roth-conversion-calculator-ai.shop",
        },
      ],
      destination: "https://www.roth-conversion-calculator-ai.shop/:path*",
      permanent: true,
    });
  });

  it("documents production environment variables without storing credentials", () => {
    const envExamplePath = path.join(process.cwd(), ".env.example");
    const content = fs.readFileSync(envExamplePath, "utf8");

    expect(content).toContain("NEXT_PUBLIC_SITE_URL=https://www.roth-conversion-calculator-ai.shop");
    expect(content).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID=G-2YJ3V38RGJ");
    expect(content).toContain("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=HRbRO-Uc1Qg324AW4DLI681t-BqvwgwJxfTt3w9VXqk");
    expect(content).not.toMatch(/password|密码|secret|token=/i);
  });
});
