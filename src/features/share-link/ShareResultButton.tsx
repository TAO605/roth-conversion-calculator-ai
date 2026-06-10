"use client";

import { Link } from "lucide-react";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import { buildShareUrl } from "@/common/storage/calculator-persistence";
import type { RothConversionInput } from "@/core/calculator/types";

export function buildSharePayload(url: string): ShareData {
  return {
    title: "Roth Conversion Calculator 2026",
    text: "Review this educational Roth conversion calculator scenario.",
    url,
  };
}

export function ShareResultButton({ input }: { input: RothConversionInput }) {
  const [status, setStatus] = useState("Share result");

  const shareOrCopyLink = async () => {
    const url = buildShareUrl(`${window.location.origin}${window.location.pathname}`, input);
    const payload = buildSharePayload(url);

    if (navigator.share) {
      try {
        await navigator.share(payload);
        setStatus("Shared");
        window.setTimeout(() => setStatus("Share result"), 1600);
        return;
      } catch {
        // Fall back to clipboard when native sharing is unavailable, cancelled, or blocked.
      }
    }

    await navigator.clipboard.writeText(url);
    setStatus("Copied link");
    window.setTimeout(() => setStatus("Share result"), 1600);
  };

  return (
    <Button onClick={shareOrCopyLink} type="button" variant="secondary">
      <Link aria-hidden="true" size={16} />
      {status}
    </Button>
  );
}
