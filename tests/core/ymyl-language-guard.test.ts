import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const scannedRoots = ["src/app", "src/content", "src/features"];

const bannedUserFacingPatterns = [
  {
    label: "direct should-convert advice",
    pattern: /\byou should convert\b/i,
  },
  {
    label: "strong recommendation language",
    pattern: /\bstrongly recommend\b/i,
  },
  {
    label: "personal optimal conversion claim",
    pattern: /\boptimal conversion amount\b/i,
  },
  {
    label: "100 percent accuracy claim",
    pattern: /\b100%\s+accurate\b/i,
  },
  {
    label: "perfect accuracy claim",
    pattern: /\bperfectly accurate\b/i,
  },
  {
    label: "zero-error claim",
    pattern: /\bzero[-\s]?error\b/i,
  },
  {
    label: "accuracy guarantee",
    pattern: /\bguarantee(?:d|s)?\s+(?:the\s+)?accuracy\b/i,
  },
];

const allowedExtensions = new Set([".ts", ".tsx", ".md", ".mdx"]);

function collectFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }

    return allowedExtensions.has(path.extname(entry.name)) ? [fullPath] : [];
  });
}

describe("YMYL user-facing language guard", () => {
  it("keeps source content free of direct tax advice and absolute accuracy claims", () => {
    const files = scannedRoots.flatMap((root) => collectFiles(path.join(projectRoot, root)));
    const findings = files.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      const normalizedContent = content.replace(/\s+/g, " ");

      return bannedUserFacingPatterns.flatMap(({ label, pattern }) => {
        const matches = normalizedContent.match(pattern) ?? [];

        return matches.map((match) => `${path.relative(projectRoot, file)}: ${label}: "${match}"`);
      });
    });

    expect(findings).toEqual([]);
  });
});
