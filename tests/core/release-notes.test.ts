import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { releaseNotes } from "@/content/release-notes";

describe("release notes", () => {
  it("tracks public-facing small-version changes newest first", () => {
    expect(releaseNotes.length).toBeGreaterThanOrEqual(4);
    expect(releaseNotes[0]).toMatchObject({
      version: "1.0.225",
      type: "patch",
      title: "Browser voice input assist",
    });
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("browser-only voice input");
    expect(`${releaseNotes[0].summary} ${releaseNotes[0].affectedArea}`).toContain("sends no audio to the site");
    expect(releaseNotes.every((note) => note.rollbackPath.length > 0)).toBe(true);
  });

  it("surfaces the feature registry on the release notes page", () => {
    const releaseNotesPage = fs.readFileSync(path.join(process.cwd(), "src/app/release-notes/page.tsx"), "utf8");

    expect(releaseNotesPage).toContain("featureRegistry");
    expect(releaseNotesPage).toContain("Modular Rollback Map");
  });
});
