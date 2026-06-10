import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { releaseNotes } from "@/content/release-notes";

describe("release notes", () => {
  it("tracks public-facing small-version changes newest first", () => {
    expect(releaseNotes.length).toBeGreaterThanOrEqual(4);
    expect(releaseNotes[0]).toMatchObject({
      version: "1.0.215",
      type: "patch",
      title: "Professional review packet preview boundaries",
    });
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("IRMAA");
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("ACA");
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("NIIT");
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("RMD");
    expect(releaseNotes.every((note) => note.rollbackPath.length > 0)).toBe(true);
  });

  it("surfaces the feature registry on the release notes page", () => {
    const releaseNotesPage = fs.readFileSync(path.join(process.cwd(), "src/app/release-notes/page.tsx"), "utf8");

    expect(releaseNotesPage).toContain("featureRegistry");
    expect(releaseNotesPage).toContain("Modular Rollback Map");
  });
});
