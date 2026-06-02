import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section
      className={`w-full min-w-0 max-w-full rounded border border-neutral-200 bg-white p-6 shadow-none dark:border-white/10 dark:bg-neutral-950 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
