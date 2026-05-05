import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-systemBlue text-white shadow-sm hover:bg-blue-600 active:scale-[0.98]",
  secondary:
    "border border-blue-500/35 bg-white/70 text-systemBlue hover:bg-blue-50 active:scale-[0.98] dark:bg-white/10 dark:hover:bg-white/15",
  ghost: "text-systemBlue hover:bg-blue-50 active:scale-[0.98] dark:hover:bg-white/10",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-systemBlue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-neutral-950 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
