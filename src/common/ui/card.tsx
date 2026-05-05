import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <section
      className={`rounded-[20px] border border-white/60 bg-white/75 p-5 shadow-material backdrop-blur-xl dark:border-white/10 dark:bg-white/10 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
