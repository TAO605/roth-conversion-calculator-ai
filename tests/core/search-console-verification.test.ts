import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildGoogleSiteVerification, getGoogleSiteVerificationToken } from "@/core/seo/search-console";

describe("Google Search Console verification", () => {
  it("accepts safe verification tokens and rejects malformed values", () => {
    expect(getGoogleSiteVerificationToken({})).toBe("bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q");
    expect(getGoogleSiteVerificationToken({ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "abc_DEF-123456" })).toBe(
      "abc_DEF-123456",
    );
    expect(getGoogleSiteVerificationToken({ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "<script>alert(1)</script>" })).toBeNull();
    expect(getGoogleSiteVerificationToken({ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "" })).toBeNull();
  });

  it("builds Next metadata verification only when a token is configured", () => {
    expect(buildGoogleSiteVerification({})).toEqual({
      google: "bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q",
    });
    expect(buildGoogleSiteVerification({ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: "abc_DEF-123456" })).toEqual({
      google: "abc_DEF-123456",
    });
  });

  it("mounts Google verification metadata in the root layout", () => {
    const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");

    expect(layout).toContain("buildGoogleSiteVerification");
    expect(layout).toContain("verification:");
  });
});
