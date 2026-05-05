import packageJson from "../../../../package.json";
import { buildHealthPayload } from "@/core/ops/health";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(buildHealthPayload({ packageVersion: packageJson.version }), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
