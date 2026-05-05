import { formatCurrency } from "@/common/format/currency";
import type { ProjectionPoint } from "@/core/calculator/types";

interface ProjectionChartProps {
  projection: ProjectionPoint[];
}

export function ProjectionChart({ projection }: ProjectionChartProps) {
  const maxValue = Math.max(...projection.map((point) => Math.max(point.rothValue, point.traditionalAfterTaxValue)), 1);
  const sampled = projection.filter((_, index) => index % Math.max(1, Math.ceil(projection.length / 8)) === 0);

  return (
    <div>
      <div className="flex h-56 items-end gap-2 rounded-[16px] bg-white/60 p-4 dark:bg-white/10" aria-hidden="true">
        {sampled.map((point) => (
          <div className="flex flex-1 items-end gap-1" key={point.year}>
            <div
              className="w-full rounded-t bg-systemBlue"
              style={{ height: `${Math.max(4, (point.rothValue / maxValue) * 100)}%` }}
              title={`Year ${point.year} Roth ${formatCurrency(point.rothValue)}`}
            />
            <div
              className="w-full rounded-t bg-systemGreen"
              style={{ height: `${Math.max(4, (point.traditionalAfterTaxValue / maxValue) * 100)}%` }}
              title={`Year ${point.year} traditional ${formatCurrency(point.traditionalAfterTaxValue)}`}
            />
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
        Blue bars show projected Roth value. Green bars show projected traditional IRA after-tax value.
      </p>
    </div>
  );
}
