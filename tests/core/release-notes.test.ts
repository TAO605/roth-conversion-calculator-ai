import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { releaseNotes } from "@/content/release-notes";

describe("release notes", () => {
  it("tracks public-facing small-version changes newest first", () => {
    expect(releaseNotes.length).toBeGreaterThanOrEqual(4);
    expect(releaseNotes[0]).toMatchObject({
      version: "1.0.82",
      type: "patch",
      title: "Self-describing SEO evidence manifest",
    });
    expect(releaseNotes.every((note) => note.rollbackPath.length > 0)).toBe(true);
  });

  it("surfaces the feature registry on the release notes page", () => {
    const releaseNotesPage = fs.readFileSync(path.join(process.cwd(), "src/app/release-notes/page.tsx"), "utf8");

    expect(releaseNotesPage).toContain("featureRegistry");
    expect(releaseNotesPage).toContain("Modular Rollback Map");
  });
});
