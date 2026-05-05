import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { metadata } from "@/app/layout";

describe("social preview image", () => {
  it("wires OpenGraph and Twitter metadata to a local social preview image", () => {
    expect(metadata.openGraph?.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "/social-preview.svg",
          width: 1200,
          height: 630,
        }),
      ]),
    );
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["/social-preview.svg"],
    });
  });

  it("ships a local SVG social preview asset", () => {
    const image = fs.readFileSync(path.join(process.cwd(), "src/app/social-preview.svg"), "utf8");

    expect(image).toContain("<svg");
    expect(image).toContain("Roth Conversion Calculator");
    expect(image).toContain("2026");
  });
});
