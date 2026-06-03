import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const blogShellPages = ["src/app/blog/page.tsx", "src/app/blog/[slug]/page.tsx"];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("blog shell professional UI", () => {
  it("keeps blog index and article shell surfaces plain and bordered", () => {
    const source = blogShellPages.map(readSource).join("\n");

    expect(source).not.toContain("backdrop-blur-xl");
    expect(source).not.toContain("shadow-material");
    expect(source).not.toContain("hover:-translate-y");
    expect(source).not.toContain("rounded-[22px]");
    expect(source).not.toContain("rounded-[20px]");
    expect(source).not.toContain("rounded-[18px]");
    expect(source).not.toContain("rounded-[16px]");
    expect(source).not.toContain("rounded-[14px]");
    expect(source).not.toContain("bg-white/75");
    expect(source).not.toContain("bg-white/70");
    expect(source).not.toContain("bg-white/60");
    expect(source).toContain("rounded-lg border border-neutral-200 bg-white");
  });
});
