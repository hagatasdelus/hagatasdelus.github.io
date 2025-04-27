export type Theme = "dark" | "light";

export function getThemePreference(): Theme {
  if (typeof localStorage !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      return "dark";
    }
    if (storedTheme === "light") {
      return "light";
    }
  }

  if (
    typeof globalThis.matchMedia !== "undefined" &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function applyTheme(theme: Theme, animate = false) {
  const rootElement = document.documentElement;

  if (animate) {
    rootElement.classList.add("theme-transition");
    setTimeout(() => {
      rootElement.classList.remove("theme-transition");
    }, 200);
  } else {
    rootElement.classList.remove("theme-transition");
  }

  if (theme === "dark") {
    rootElement.classList.add("dark");
    rootElement.setAttribute("data-theme", "dim");
    rootElement.style.colorScheme = "dark";
  } else {
    rootElement.classList.remove("dark");
    rootElement.setAttribute("data-theme", "retro");
    rootElement.style.colorScheme = "light";
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", theme);
  }
}
