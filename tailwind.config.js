import daisyui from "npm:daisyui@latest";
import typography from "npm:@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,md,mdx,js,jsx,ts,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dim"]'],
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
              textDecorationOffset: "4px",
              "&:hover": {
                color: "oklch(var(--s))",
                textDecorationThickness: "2px",
                transition: "all .2s ease-in-out",
              },
            },
          },
        },
      }),
    },
  },
};
