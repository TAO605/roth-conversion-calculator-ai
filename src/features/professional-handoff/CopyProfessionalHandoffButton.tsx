"use client";

import { ClipboardList } from "lucide-react";
import { useState } from "react";
import { Button } from "@/common/ui/button";
import type { RothConversionInput, RothConversionResult } from "@/core/calculator/types";
import { buildProfessionalHandoffText } from "@/features/professional-handoff/professional-handoff-text";

export function CopyProfessionalHandoffButton({
  input,
  result,
}: {
  input: RothConversionInput;
  result: RothConversionResult;
}) {
  const [label, setLabel] = useState("Copy CPA packet");

  const copyPacket = async () => {
    await navigator.clipboard.writeText(buildProfessionalHandoffText(input, result));
    setLabel("Copied");
    window.setTimeout(() => setLabel("Copy CPA packet"), 1600);
  };

  return (
    <Button onClick={copyPacket} type="button" variant="secondary">
      <ClipboardList aria-hidden="true" size={16} />
      {label}
    </Button>
  );
}
