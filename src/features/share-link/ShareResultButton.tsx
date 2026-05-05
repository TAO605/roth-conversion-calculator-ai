"use client";

import { Link } from "lucide-react";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import { buildShareUrl } from "@/common/storage/calculator-persistence";
import type { RothConversionInput } from "@/core/calculator/types";

export function ShareResultButton({ input }: { input: RothConversionInput }) {
  const [status, setStatus] = useState("Share result");

  const copyLink = async () => {
    const url = buildShareUrl(`${window.location.origin}${window.location.pathname}`, input);
    await navigator.clipboard.writeText(url);
    setStatus("Copied");
    window.setTimeout(() => setStatus("Share result"), 1600);
  };

  return (
    <Button onClick={copyLink} type="button" variant="secondary">
      <Link aria-hidden="true" size={16} />
      {status}
    </Button>
  );
}
