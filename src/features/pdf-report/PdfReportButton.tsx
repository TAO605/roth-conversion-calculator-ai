"use client";

import { Download } from "lucide-react";
import { Button } from "@/common/ui/button";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildReportHtml } from "@/features/pdf-report/report-html";

export function PdfReportButton({ input, result }: { input: RothConversionInput; result: RothConversionResult }) {
  const download = () => {
    const report = buildReportHtml(input, result);
    const blob = new Blob([report], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "roth-conversion-report.html";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} type="button" variant="secondary">
      <Download aria-hidden="true" size={16} />
      Download report
    </Button>
  );
}
