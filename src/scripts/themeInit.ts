import { getThemePreference, applyTheme } from "./themeUtils.ts";

(function () {
  const initialTheme = getThemePreference();
  applyTheme(initialTheme, false);
})();
