import { getThemePreference, applyTheme, type Theme } from "./themeUtils.ts";

export function updateThemeIcon(): void {
  if (!document.documentElement) {
    return;
  }
  const isDark = document.documentElement.classList.contains("dark");

  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  const themeToggle = document.getElementById("theme-toggle");

  if (sunIcon && moonIcon) {
    if (isDark) {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      moonIcon.classList.add("hidden");
      sunIcon.classList.remove("hidden");
    }
  }

  if (themeToggle) {
    if (isDark) {
      themeToggle.setAttribute("aria-label", "ライトモードに切替");
    } else {
      themeToggle.setAttribute("aria-label", "ダークモードに切替");
    }
  }
}

const toggleTheme = () => {
  const currentTheme = getThemePreference();
  let newTheme: Theme;
  if (currentTheme === "dark") {
    newTheme = "light";
  } else {
    newTheme = "dark";
  }
  applyTheme(newTheme, true);
  updateThemeIcon();
};

export const initTheme = () => {
  updateThemeIcon();

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }
};

export const watchSystemTheme = () => {
  if (typeof globalThis.matchMedia === "undefined") {
    return;
  }

  const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) => {
    if (localStorage.getItem("theme") === null) {
      let newTheme: Theme;
      if (e.matches) {
        newTheme = "dark";
      } else {
        newTheme = "light";
      }

      applyTheme(newTheme, true);
      updateThemeIcon();
    }
  };

  mediaQuery.addEventListener("change", handleChange);
};

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  watchSystemTheme();
});
