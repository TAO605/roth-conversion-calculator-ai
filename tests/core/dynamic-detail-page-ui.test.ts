import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const dynamicDetailPages = [
  "src/app/(keyword-pages)/[keyword]/page.tsx",
  "src/app/age-scenarios/[scenario]/page.tsx",
  "src/app/basis/[topic]/page.tsx",
  "src/app/examples/[example]/page.tsx",
  "src/app/filing-status/[status]/page.tsx",
  "src/app/glossary/[slug]/page.tsx",
  "src/app/multi-year-planning/[plan]/page.tsx",
  "src/app/states/[state]/page.tsx",
  "src/app/tax-brackets/2026/page.tsx",
  "src/app/tax-brackets/2026/[rate]/page.tsx",
  "src/app/tax-interactions/[interaction]/page.tsx",
  "src/app/tax-payment-methods/[method]/page.tsx",
];

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("dynamic detail page professional UI", () => {
  it("keeps non-blog dynamic detail pages on plain bordered review surfaces", () => {
    const source = dynamicDetailPages.map(readSource).join("\n");

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
    expect(source).toContain("rounded-md");
  });
});
