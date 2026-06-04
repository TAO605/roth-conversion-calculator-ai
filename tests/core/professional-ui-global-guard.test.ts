import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const scannedRoots = ["src/app", "src/features"];

const forbiddenSurfaceClasses = [
  "backdrop-blur-xl",
  "shadow-material",
  "hover:-translate-y",
  "rounded-[22px]",
  "rounded-[20px]",
  "rounded-[18px]",
  "rounded-[16px]",
  "rounded-[14px]",
  "bg-white/75",
  "bg-white/70",
  "bg-white/65",
  "bg-white/60",
  "bg-white/55",
];

function collectSourceFiles(root: string): string[] {
  const absoluteRoot = path.join(process.cwd(), root);
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const relativePath = path.join(root, entry.name);
    const absolutePath = path.join(process.cwd(), relativePath);

    if (entry.isDirectory()) {
      return collectSourceFiles(relativePath);
    }

    return entry.isFile() && /\.(tsx|ts)$/.test(entry.name) ? [absolutePath] : [];
  });
}

describe("global professional UI guard", () => {
  it("keeps app and feature source free of old glass-template surface classes", () => {
    const violations = scannedRoots
      .flatMap(collectSourceFiles)
      .flatMap((filePath) => {
        const source = fs.readFileSync(filePath, "utf8");

        return forbiddenSurfaceClasses
          .filter((className) => source.includes(className))
          .map((className) => `${path.relative(process.cwd(), filePath)} -> ${className}`);
      });

    expect(violations).toEqual([]);
  });
});
