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
  const bodyElement = document.body;

  if (animate && bodyElement) {
    bodyElement.classList.add("theme-transition");
    setTimeout(() => {
      bodyElement.classList.remove("theme-transition");
    }, 200);
  }

  if (theme === "dark") {
    rootElement.setAttribute("data-theme", "sunset");
  } else {
    rootElement.setAttribute("data-theme", "retro");
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("theme", theme);
  }
}
