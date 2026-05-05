import { beforeEach, describe, expect, it } from "vitest";
import {
  applyThemePreference,
  getStoredThemePreference,
  THEME_STORAGE_KEY,
  toggleThemePreference,
} from "@/common/storage/theme-preference";

describe("theme preference", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("stores and applies an explicit dark theme preference", () => {
    applyThemePreference("dark");

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(getStoredThemePreference()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("stores and applies an explicit light theme preference", () => {
    document.documentElement.classList.add("dark");

    applyThemePreference("light");

    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(getStoredThemePreference()).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles from light to dark and back", () => {
    expect(toggleThemePreference()).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    expect(toggleThemePreference()).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
