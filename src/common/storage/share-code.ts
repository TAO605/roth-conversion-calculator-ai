import type { RothConversionInput } from "@/core/calculator/types";

export function encodeShareCode(input: RothConversionInput): string {
  return Buffer.from(JSON.stringify(input), "utf8").toString("base64url");
}

export function decodeShareCode(code: string): Partial<RothConversionInput> {
  try {
    return JSON.parse(Buffer.from(code, "base64url").toString("utf8")) as Partial<RothConversionInput>;
  } catch {
    return {};
  }
}
