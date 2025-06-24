const getTheme = (isDarkMode: boolean) => {
  if (isDarkMode) return "sunset";
  return "retro";
};

// Apply theme instantly to prevent FOUC
const applyThemeImmediately = (): void => {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = globalThis.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const isDarkMode = storedTheme === "sunset" || (!storedTheme && prefersDark);
  const theme = getTheme(isDarkMode);

  document.documentElement.setAttribute("data-theme", theme);
};

// Apply theme immediately before page load
applyThemeImmediately();

const updateTheme = (isDarkMode: boolean): void => {
  const theme = getTheme(isDarkMode);
  document.documentElement.setAttribute("data-theme", theme);

  const sun = document.getElementById("sun-icon");
  const moon = document.getElementById("moon-icon");

  sun.classList.toggle("hidden");
  moon.classList.toggle("hidden");
};

const toggleTheme = (): void => {
  const toggleButton = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement;
  const isDarkMode = toggleButton.checked;

  updateTheme(isDarkMode);

  const toDarkAudio = document.querySelector(
    "#sun-icon audio"
  ) as HTMLAudioElement;
  const toLightAudio = document.querySelector(
    "#moon-icon audio"
  ) as HTMLAudioElement;

  const audioToPlay = ((isDarkMode: boolean) => {
    if (isDarkMode) return toDarkAudio;
    return toLightAudio;
  })(isDarkMode);
  audioToPlay.play();

  localStorage.setItem("theme", getTheme(isDarkMode));

  document.documentElement.classList.add("theme-transition");
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, 200);
};

const initializeTheme = (): void => {
  const toggleButton = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = globalThis.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const isDarkMode = storedTheme === "sunset" || (!storedTheme && prefersDark);

  toggleButton.checked = isDarkMode;
  updateTheme(isDarkMode);
};

const initialize = (): void => {
  const toggleButton = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement;
  toggleButton.addEventListener("change", toggleTheme);
  initializeTheme();

  globalThis
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", initializeTheme);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}
