import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Search Console verification evidence", () => {
  it("retains public DNS and HTML verification checks without asserting private GSC UI ownership", () => {
    const script = fs.readFileSync(
      path.join(process.cwd(), "scripts/search-console-verification-evidence.mjs"),
      "utf8",
    );
    const layout = fs.readFileSync(path.join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const searchConsole = fs.readFileSync(path.join(process.cwd(), "src/core/seo/search-console.ts"), "utf8");

    expect(script).toContain("search-console-verification");
    expect(script).toContain("SEARCH_CONSOLE_VERIFICATION_EVIDENCE_BASE_URL");
    expect(script).toContain("SEARCH_CONSOLE_VERIFICATION_DOMAIN");
    expect(script).toContain("SEARCH_CONSOLE_VERIFICATION_TOKEN");
    expect(script).toContain("google-site-verification=");
    expect(script).toContain("domainTxtVerified");
    expect(script).toContain("spfRecordRetained");
    expect(script).toContain("htmlMetaVerified");
    expect(script).toContain("canonicalHostRetained");
    expect(script).toContain("expectedCanonicalUrls");
    expect(script).toContain("gscUiOwnershipNotAsserted");
    expect(script).toContain("Site-side verification evidence only");
    expect(script).toContain("does not assert the current Google Search Console UI ownership state");
    expect(script).toContain("publicResolver.setServers");
    expect(script).toContain("resolveTxtEvidence");
    expect(script).toContain("resolverEvidence");
    expect(script).toContain("1.1.1.1");
    expect(script).toContain("8.8.8.8");
    expect(layout).toContain("verification: buildGoogleSiteVerification()");
    expect(searchConsole).toContain("bGl0K-Jm1Fck2gNqxkHlFPNWJjZDIGG5SeRvrmp1d4Q");
  });
});
