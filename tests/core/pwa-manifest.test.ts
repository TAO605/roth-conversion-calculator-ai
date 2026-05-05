import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import manifest from "@/app/manifest";

describe("pwa manifest", () => {
  it("defines installable app metadata with maskable icons", () => {
    const data = manifest();

    expect(data.name).toBe("Roth Conversion Calculator");
    expect(data.display).toBe("standalone");
    expect(data.start_url).toBe("/");
    expect(data.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "maskable",
        }),
        expect.objectContaining({
          src: "/icon.svg",
          type: "image/svg+xml",
          purpose: "any",
        }),
        expect.objectContaining({
          src: "/apple-icon.svg",
          type: "image/svg+xml",
        }),
      ]),
    );
  });

  it("ships local svg icon assets referenced by the manifest", () => {
    const icon = fs.readFileSync(path.join(process.cwd(), "src/app/icon.svg"), "utf8");
    const appleIcon = fs.readFileSync(path.join(process.cwd(), "src/app/apple-icon.svg"), "utf8");

    expect(icon).toContain("<svg");
    expect(icon).toContain("R");
    expect(appleIcon).toContain("<svg");
    expect(appleIcon).toContain("R");
  });
});
