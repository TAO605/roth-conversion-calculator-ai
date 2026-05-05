import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("homepage performance boundaries", () => {
  it("lazy-loads non-critical homepage modules instead of statically bundling them", () => {
    const homePage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8");

    expect(homePage).toContain('from "next/dynamic"');
    expect(homePage).toContain("LazyPanelFallback");
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/charts\/ProjectionChart"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/ai-assistant\/AiExplainer"\)/);
    expect(homePage).toMatch(/dynamic<[\s\S]+import\("@\/features\/pdf-report\/PdfReportButton"\)/);

    expect(homePage).not.toContain('import { ProjectionChart } from "@/features/charts/ProjectionChart"');
    expect(homePage).not.toContain('import { AiExplainer } from "@/features/ai-assistant/AiExplainer"');
    expect(homePage).not.toContain('import { PdfReportButton } from "@/features/pdf-report/PdfReportButton"');
  });
});
