export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "roth-conversion-calculator:theme:v1";

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "light" || value === "dark";
}

export function getStoredThemePreference(): ThemePreference | null {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  return isThemePreference(stored) ? stored : null;
}

export function applyThemePreference(preference: ThemePreference): ThemePreference {
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  document.documentElement.classList.toggle("dark", preference === "dark");

  return preference;
}

export function toggleThemePreference(): ThemePreference {
  const nextPreference = document.documentElement.classList.contains("dark") ? "light" : "dark";

  return applyThemePreference(nextPreference);
}
