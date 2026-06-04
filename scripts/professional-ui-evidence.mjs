import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const SCANNED_ROOTS = ["src/app", "src/features"];
const FORBIDDEN_SURFACE_CLASSES = [
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

function collectSourceFiles(root) {
  const absoluteRoot = path.join(PROJECT_ROOT, root);
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const relativePath = path.join(root, entry.name);
    const absolutePath = path.join(PROJECT_ROOT, relativePath);

    if (entry.isDirectory()) {
      return collectSourceFiles(relativePath);
    }

    return entry.isFile() && /\.(tsx|ts)$/.test(entry.name) ? [absolutePath] : [];
  });
}

function run() {
  const files = SCANNED_ROOTS.flatMap(collectSourceFiles);
  const violations = files.flatMap((filePath) => {
    const source = fs.readFileSync(filePath, "utf8");

    return FORBIDDEN_SURFACE_CLASSES.filter((className) => source.includes(className)).map((className) => ({
      className,
      path: path.relative(PROJECT_ROOT, filePath).replaceAll("\\", "/"),
    }));
  });

  const result = {
    evidenceType: "professional-ui-source-guard",
    forbiddenClassCount: FORBIDDEN_SURFACE_CLASSES.length,
    forbiddenClasses: FORBIDDEN_SURFACE_CLASSES,
    generatedAt: new Date().toISOString(),
    ok: violations.length === 0,
    scannedFileCount: files.length,
    scannedRoots: SCANNED_ROOTS,
    violationCount: violations.length,
    violations,
  };

  console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    process.exit(1);
  }
}

try {
  run();
} catch (error) {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        evidenceType: "professional-ui-source-guard",
        ok: false,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
