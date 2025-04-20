import daisyui from "npm:daisyui@latest";
import typography from "npm:@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,md,mdx,js,jsx,ts,tsx}"],
  darkMode: "class",
  plugins: [daisyui, typography],
  daisyui: {
    themes: ["retro", "dim"],
  },
  safelist: [],
  theme: {
    extend: {
      typography: (_theme) => ({
        DEFAULT: {
          css: {
            color: "oklch(var(--bc))",
            a: {
              textDecorationLine: "underline",
              textDecorationOffset: "0.25em",
              textDecorationColor: "oklch(var(--s))",
              "&:hover": {
                color: "oklch(var(--s))",
                textDecorationThickness: "0.125em",
                transition: "all .3s ease-in-out",
              },
            },
          },
        },
      }),
    },
  },
};
