import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section
      className={`w-full min-w-0 max-w-full rounded-[20px] border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-none dark:border-white/10 dark:bg-white/10 sm:shadow-material sm:backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
