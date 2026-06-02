import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldShellProps {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ label, description, error, children }: FieldShellProps) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{label}</span>
      {children}
      {description ? <span className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{description}</span> : null}
      {error ? <span className="text-xs font-medium text-systemRed">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "min-h-12 w-full min-w-0 rounded border border-neutral-200 bg-white px-3 text-base text-neutral-950 outline-none transition-colors focus:border-[#0A2463] focus:ring-1 focus:ring-[#0A2463] dark:border-white/15 dark:bg-neutral-950 dark:text-white";

export function TextField({
  label,
  description,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string; error?: string }) {
  return (
    <FieldShell label={label} description={description} error={error}>
      <input className={inputClass} {...props} />
    </FieldShell>
  );
}

export function SelectField({
  label,
  description,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <FieldShell label={label} description={description} error={error}>
      <select className={inputClass} {...props}>
        {children}
      </select>
    </FieldShell>
  );
}
