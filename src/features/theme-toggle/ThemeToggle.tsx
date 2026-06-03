"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  applyThemePreference,
  getStoredThemePreference,
  toggleThemePreference,
  type ThemePreference,
} from "@/common/storage/theme-preference";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("light");

  useEffect(() => {
    const stored = getStoredThemePreference();

    if (stored) {
      setTheme(applyThemePreference(stored));
    } else if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const nextModeLabel = theme === "dark" ? "light" : "dark";

  return (
    <button
      aria-label={`Switch to ${nextModeLabel} mode`}
      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-systemBlue focus:outline-none focus:ring-2 focus:ring-systemBlue focus:ring-offset-2 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-systemBlue dark:focus:ring-offset-neutral-950"
      onClick={() => setTheme(toggleThemePreference())}
      type="button"
    >
      {theme === "dark" ? <Sun aria-hidden="true" size={17} /> : <Moon aria-hidden="true" size={17} />}
    </button>
  );
}
