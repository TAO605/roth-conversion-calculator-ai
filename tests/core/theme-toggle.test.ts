import React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { THEME_STORAGE_KEY } from "@/common/storage/theme-preference";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("applies stored dark preference on mount", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(React.createElement(ThemeToggle));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeTruthy();
  });

  it("toggles between light and dark modes", () => {
    render(React.createElement(ThemeToggle));

    fireEvent.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
